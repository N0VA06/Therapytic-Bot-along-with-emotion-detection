// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const emotionToggleBtn = document.getElementById('emotionToggleBtn');
    const emotionStats = document.getElementById('emotionStats');
    const currentEmotion = document.getElementById('currentEmotion');
    const confidenceScore = document.getElementById('confidenceScore');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatWindow = document.getElementById('chatWindow');
    
    // Chart setup
    const ctx = document.getElementById('emotionChart').getContext('2d');
    const emotionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Confidence',
                data: [],
                borderColor: '#4d94ff',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Emotion Detection Toggle
    let emotionInterval;
    emotionToggleBtn.addEventListener('click', () => {
        const isDetecting = emotionToggleBtn.textContent.includes('Start');
        
        if (isDetecting) {
            // Start detection
            emotionToggleBtn.textContent = 'Stop Emotion Detection';
            emotionToggleBtn.style.backgroundColor = '#dc3545';
            emotionStats.classList.remove('hidden');
            
            // Simulate emotion detection
            emotionInterval = setInterval(updateEmotionData, 2000);
        } else {
            // Stop detection
            emotionToggleBtn.textContent = 'Start Emotion Detection';
            emotionToggleBtn.style.backgroundColor = '';
            clearInterval(emotionInterval);
        }
    });

    // Simulate emotion detection updates
    function updateEmotionData() {
        const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised'];
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        const confidence = (Math.random() * 30 + 70).toFixed(2);
        
        currentEmotion.textContent = emotion;
        confidenceScore.textContent = `${confidence}%`;
        
        // Update chart
        const time = new Date().toLocaleTimeString();
        emotionChart.data.labels.push(time);
        emotionChart.data.datasets[0].data.push(parseFloat(confidence));
        
        // Keep only last 10 data points
        if (emotionChart.data.labels.length > 10) {
            emotionChart.data.labels.shift();
            emotionChart.data.datasets[0].data.shift();
        }
        
        emotionChart.update();
    }

    // Chat functionality
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        messageDiv.textContent = text;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function handleSendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, true);
            messageInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                addMessage("This is a simulated AI response.", false);
            }, 1000);
        }
    }

    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});