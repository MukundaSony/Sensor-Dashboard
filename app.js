const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // Serve the frontend

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});

// Simulate sensor data
setInterval(() => {
    const sensorData = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        value: (Math.random() * 100).toFixed(2), // Random value for testing
    }));

    sensorData.forEach((data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
}, 1000); // Send data every second

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
