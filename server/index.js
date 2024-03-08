const express = require('express');
const { userJoin, userLeave, getUsers, getUser } = require('./utils/users');
const app = express();

const server = require('http').createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);


app.get('/', (req, res) => {
    res.send('This is realtime whiteboard app');
});

let globalRoomId, globalImageUrl;
io.on('connection', (socket) => {
    console.log("user connected");
    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data;
        socket.join(roomId);
        globalRoomId = roomId
        const user = userJoin(name, userId, roomId, host, presenter, socket.id);
        console.log('This is user=> ', user);
        socket.emit("userIsJoined", { success: true, user });
        socket.broadcast.to(roomId).emit("broadcastMessageUserJoin", name);
        socket.broadcast.to(roomId).emit("allUsers", { user });
        socket.broadcast.to(roomId).emit("whiteboardDataResponse", {
            imgURL: globalImageUrl
        });
    })
    socket.on("disconnect", () => {
        const user = getUser(socket.id);
        userLeave(socket.id);
        const allUser = getUsers(globalRoomId);
        console.log('all users are ', allUser);
        socket.broadcast.to(globalRoomId).emit("userLeaveBroadcastMessage", user.name);
        socket.broadcast.to(globalRoomId).emit("allUserAfterLeave", allUser);
    })
    socket.on("whiteboardData", (data) => {
        globalImageUrl = data;
        socket.broadcast.to(globalRoomId).emit("whiteboardDataResponse", {
            imgURL: data
        })
    })
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log('server is running at port ', port));