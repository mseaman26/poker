import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

app.use(cors());

const server = http.createServer(app);

const port = process.env.PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-app.com' : 'http://localhost:3000', // Update with your production app's URL
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

//map for keeping track of online uses
const activeUsers = new Map()

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('activate user', (data) => {
    console.log('data into server socket: ', data)
    if(!activeUsers.has(data.email)){
      activeUsers.set(socket.id, {email: data.email, username: data.username, socketId: socket.id})
    }
    console.log('array being sent to everyone after activating user: ', Array.from(activeUsers.values()))
    io.emit('active users', Array.from(activeUsers.values()))
  })
  socket.on('request active users', () => {
    console.log('sending array from server to everyone ', Array.from(activeUsers.values()))
    io.emit('active users', Array.from(activeUsers.values()))
  })
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on('broadcast message', (message) => {
    console.log('broadcast recieved: ',message)
    socket.broadcast.emit('broadcast message', message)
  })
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected: ',socket.id)
    activeUsers.delete(socket.id)
    io.emit('active users', Array.from(activeUsers.values()))
  })
});


server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
