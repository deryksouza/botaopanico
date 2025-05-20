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

  useEffect(() => {
    // Verificando a URL do servidor
    const serverUrl = 'https://botaopanico-backend.onrender.com';
    console.log('Conectando ao servidor:', serverUrl);
    
    const newSocket = io(serverUrl);
    
    // Adicionando listeners para debug
    newSocket.on('connect', () => {
      console.log('Socket conectado com sucesso');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Erro na conexão:', error);
    });
    
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const handleEmergency = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          if (socket) {
            socket.emit('panicAlert', {
              userName: localStorage.getItem('username') || 'Usuário',
              timestamp: new Date(),
              location: { latitude, longitude }
            });
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          if (socket) {
            socket.emit('panicAlert', {
              userName: localStorage.getItem('username') || 'Usuário',
              timestamp: new Date(),
            });
          }
        }
      );
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