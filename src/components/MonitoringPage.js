import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import io from 'socket.io-client';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

function MonitoringPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io('https://botaopanico-backend.onrender.com');

    socket.on('newAlert', (data) => {
      setAlerts(prevAlerts => [...prevAlerts, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Central de Monitoramento
      </Typography>
      <StyledPaper>
        <List>
          {alerts.map((alert, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Alerta de ${alert.userName}`}
                secondary={`Horário: ${new Date(alert.timestamp).toLocaleString()}
                           Localização: Lat ${alert.location?.latitude}, Long ${alert.location?.longitude}`}
              />
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </StyledContainer>
  );
}

export default MonitoringPage;