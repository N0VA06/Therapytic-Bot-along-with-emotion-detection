from flask import Flask, Response, jsonify, request, send_from_directory
from flask_cors import CORS
import cv2
from deepface import DeepFace
import numpy as np
import base64
import json
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/process-frame', methods=['POST'])
def process_frame():
    try:
        # Get the frame data from the request
        if not request.json or 'frame' not in request.json:
            return jsonify({
                'success': False,
                'error': 'No frame data received'
            }), 400

        frame_data = request.json['frame']
        
        try:
            frame_bytes = base64.b64decode(frame_data.split(',')[1])
            frame_arr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(frame_arr, cv2.IMREAD_COLOR)
        except Exception as e:
            logger.error(f"Error decoding frame: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'Invalid frame data'
            }), 400

        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        
        if isinstance(result, list) and len(result) > 0:
            emotion_data = result[0]['emotion']
            dominant_emotion = result[0]['dominant_emotion']
            
            logger.info(f"Detected emotion: {dominant_emotion}")
            return jsonify({
                'success': True,
                'emotions': emotion_data,
                'dominant_emotion': dominant_emotion
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No face detected'
            })

    except Exception as e:
        logger.error(f"Error processing frame: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting Emotion Detection Server...")
    app.run(debug=True, port=5000)