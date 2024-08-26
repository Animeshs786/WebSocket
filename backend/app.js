const express = require("express");
const app = express();
const http = require("http");
const socket = require("socket.io");

app.get("/", (req, res) => {
  res.send("hellow world");
});

const server = http.createServer(app);
const io = new socket.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User conneted ${socket.id}`);

  socket.on("disconnect", (socket) => {
    console.log("user disconnected");
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.id).emit("recive-message", data.message);
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
