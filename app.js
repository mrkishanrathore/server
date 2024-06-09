import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  // origin: "http://localhost:5173",
  cors: {
    origin: "https://multiplayergamesbykishan.netlify.app/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  console.log("id", socket.id);

  socket.on("sendMsg", (data) => {
    socket.to(data.room).emit("receiveMsg", data);
    console.log("msg : ", data.msg, " room : ", data.room);
  });

  socket.on("sendMove", (data) => {
    socket.to(data.room).emit("receiveMove", data);
    console.log("Room ", data.room, " player move ", data.move);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.to(room).emit("playerJoined","player Joined");
    console.log("user joined ", room);
  });
  socket.on("join-room-confirm", (room) => {
    socket.to(room).emit("playerJoinedConfirm","player Joined");
    console.log("user joined ", room);
  });

  socket.on("requestReset", (room) => {
    socket.to(room).emit("resetGameRequest","reset Request");
    console.log("Reset requested for room ", room);
  });

  socket.on("setOpponentMark",(data)=>{
    socket.to(data.room).emit("setTurn",data.turn);
  })

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
