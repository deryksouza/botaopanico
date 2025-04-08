import React, { useEffect, useState } from 'react';
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

function MonitorPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('newAlert', (data) => {
      setAlerts(prev => [...prev, data]);
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
                primary={`Alerta de Emergência - ${new Date(alert.timestamp).toLocaleString()}`}
                secondary={`Localização: ${alert.location?.latitude}, ${alert.location?.longitude}`}
              />
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </StyledContainer>
  );
}

export default MonitorPage;