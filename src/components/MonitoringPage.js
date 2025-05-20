import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Paper, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

// Rename this to avoid conflict with react-leaflet's MapContainer
const MapWrapper = styled('div')({
  height: '400px',
  width: '100%',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
  },
});

function MonitoringPage() {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [center, setCenter] = useState({
    lat: -3.7319,
    lng: -38.5267
  });

  useEffect(() => {
    const serverUrl = 'https://botaopanico-backend.onrender.com';
    console.log('Monitor conectando ao servidor:', serverUrl);
    
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    newSocket.on('connect', () => {
      console.log('Monitor conectado - ID:', newSocket.id);
    });

    newSocket.on('newAlert', (data) => {
      console.log('Novo alerta recebido no monitor:', data);
      setAlerts(prevAlerts => [...prevAlerts, data]);
      if (data.location) {
        setCenter({
          lat: data.location.latitude,
          lng: data.location.longitude
        });
      }
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Erro na conexão do monitor:', error.message);
    });
    
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const [center, setCenter] = useState({
    lat: -3.7319, // Coordenadas de Fortaleza
    lng: -38.5267
  });

  useEffect(() => {
    const socket = io('http://localhost:3001');  // Atualizando para o servidor local

    socket.on('newAlert', (data) => {
      setAlerts(prevAlerts => [...prevAlerts, data]);
      if (data.location) {
        setCenter({
          lat: data.location.latitude,
          lng: data.location.longitude
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Central de Monitoramento
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Alertas Recebidos
            </Typography>
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
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Localização dos Alertas
            </Typography>
            <MapWrapper>
              <MapContainer 
                center={[center.lat, center.lng]} 
                zoom={15}  // Aumentado o zoom para melhor visualização
                key={`${center.lat}-${center.lng}`} // Força atualização quando o centro muda
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {alerts.map((alert, index) => (
                  alert.location && (
                    <Marker
                      key={index}
                      position={[alert.location.latitude, alert.location.longitude]}
                    >
                      <Popup>
                        Alerta de {alert.userName}<br />
                        {new Date(alert.timestamp).toLocaleString()}
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </MapWrapper>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default MonitoringPage;