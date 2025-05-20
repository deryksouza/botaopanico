import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Button, Container, Typography } from '@mui/material';
import io from 'socket.io-client';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(255, 0, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

const EmergencyButton = styled(Button)(({ theme }) => ({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  backgroundColor: '#ff0000',
  color: 'white',
  fontSize: '24px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#cc0000',
  },
  animation: `${pulse} 2s infinite`,
  boxShadow: '0 0 0 0 rgba(255, 0, 0, 1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    animation: `${pulse} 2s infinite`,
  }
}));

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
});

function PanicButton() {
  const [location, setLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverUrl = 'https://botaopanico-backend.onrender.com';
    console.log('Tentando conectar ao servidor:', serverUrl);
    
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    newSocket.on('connect', () => {
      console.log('Socket conectado com sucesso - ID:', newSocket.id);
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
      setIsConnected(false);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Erro na conexão:', error.message);
      setIsConnected(false);
    });
    
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const handleEmergency = () => {
    console.log('Botão pressionado');
    if (navigator.geolocation) {
      console.log('Geolocalização disponível, solicitando posição...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Posição obtida:', position.coords);
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          if (socket && socket.connected) {
            console.log('Socket conectado, enviando alerta com localização:', {
              latitude,
              longitude,
              socketId: socket.id
            });
            socket.emit('panicAlert', {
              userName: localStorage.getItem('username') || 'Usuário',
              timestamp: new Date().toISOString(),
              location: { latitude, longitude }
            });
          } else {
            console.error('Socket não está conectado!', {
              socketExists: !!socket,
              socketConnected: socket?.connected
            });
          }
        },
        (error) => {
          console.error('Erro na geolocalização:', {
            code: error.code,
            message: error.message
          });
          if (socket) {
            socket.emit('panicAlert', {
              userName: localStorage.getItem('username') || 'Usuário',
              timestamp: new Date(),
            });
          }
        }
      );
    } else {
      console.error('Geolocalização não suportada neste navegador');
    }
  };

  return (
    <CenteredContainer>
      <Typography variant="h4" gutterBottom>
        Botão de Emergência
      </Typography>
      <EmergencyButton
        variant="contained"
        onClick={handleEmergency}
      >
        EMERGÊNCIA
      </EmergencyButton>
    </CenteredContainer>
  );
}

export default PanicButton;