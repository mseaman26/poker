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
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

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
    console.log('user disconnected')
  })
});


server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
