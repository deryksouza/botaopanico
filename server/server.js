const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('panicAlert', (data) => {
    console.log('Alerta recebido:', data);
    io.emit('newAlert', data);
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});