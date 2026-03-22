const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve the mobile app files
app.use(express.static(path.join(__dirname, 'public')));

// Get local IP address for display
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

io.on('connection', (socket) => {
    console.log(`Device connected: ${socket.id}`);

    // Listen for devices joining a specific room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Device ${socket.id} joined room: ${roomId}`);

        // Notify others in the room
        socket.to(roomId).emit('peer-joined', socket.id);
    });

    // WebRTC signaling - only send to the specific room
    socket.on('offer', (data) => {
        console.log(`Offer received for room: ${data.room}`);
        socket.to(data.room).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
        console.log(`Answer received for room: ${data.room}`);
        socket.to(data.room).emit('answer', data.answer);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.room).emit('ice-candidate', data.candidate);
    });

    socket.on('disconnect', () => {
        console.log(`Device disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
const localIP = getLocalIP();

// Bind to 0.0.0.0 so it can be accessed from phone on the same network
server.listen(PORT, '0.0.0.0', () => {
    console.log('\n===========================================');
    console.log('   Remote Desktop Signaling Server');
    console.log('===========================================');
    console.log(`\nServer running on port ${PORT}`);
    console.log(`\nLocal access:    http://localhost:${PORT}`);
    console.log(`Network access:  http://${localIP}:${PORT}`);
    console.log('\n===========================================\n');
});

module.exports = { getLocalIP };
