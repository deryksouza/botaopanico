const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, '../build')));

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

// Rota para todas as requisições
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});