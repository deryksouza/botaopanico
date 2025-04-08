import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Container, Paper, Typography, Snackbar, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import io from 'socket.io-client';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%',
  fontSize: '1.5rem',
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

function PanicButton() {
  const [location, setLocation] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  const handlePanic = () => {
    const alert = {
      timestamp: new Date().toISOString(),
      location: location,
      userName: 'Usuário Teste',
    };

    const socket = io('https://seu-backend.onrender.com');
    socket.emit('panicAlert', alert);
    setOpenAlert(true);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Sistema de Emergência
      </Typography>
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={handlePanic}
        startIcon={<ErrorIcon />}
      >
        EMERGÊNCIA
      </StyledButton>
      <StyledPaper>
        <Typography variant="body1">
          Em caso de emergência, pressione o botão acima ou diga "EMERGÊNCIA"
        </Typography>
      </StyledPaper>

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
        <Alert severity="error" onClose={() => setOpenAlert(false)}>
          Alerta de emergência enviado! A equipe de segurança foi notificada.
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
}

export default PanicButton;