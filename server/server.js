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
  console.log('Cliente conectado - ID:', socket.id);

  socket.on('panicAlert', (data) => {
    console.log('Alerta recebido:', {
      socketId: socket.id,
      userName: data.userName,
      timestamp: data.timestamp,
      location: data.location
    });
    io.emit('newAlert', data);
    console.log('Alerta enviado para todos os clientes');
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado - ID:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});