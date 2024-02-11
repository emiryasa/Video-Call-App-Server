const express = require('express')
const http = require('http')
import { Server as SocketIOServer, Socket } from 'socket.io';
const app = express()
const { Server } = require("socket.io")
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket: Socket) => {

    socket.emit('me', socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
    socket.on('endCall', () => {
        // Broadcast the 'callEnded' event to all connected clients except the caller
        socket.broadcast.emit('callEnded' );
    });
});

server.listen(3001, () => {
    console.log('✔️ Server listening on port 3001')
})