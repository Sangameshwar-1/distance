const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express
const app = express();

// Create an HTTP server and wrap it with Socket.io
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory (if needed)
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for signaling messages
    socket.on('signal', (data) => {
        console.log('Signal received:', data);
        // Broadcast the signal data to other connected clients
        socket.broadcast.emit('signal', data);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Define a port to run the server
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Signaling server is running on port ${PORT}`);
});
