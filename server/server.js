const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('Dispositivo conectado');

  socket.on('panicAlert', (data) => {
    console.log('Alerta recebido:', data);
    io.emit('newAlert', data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});