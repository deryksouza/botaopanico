import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Paper, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';

function Monitor() {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [center, setCenter] = useState({
    lat: -3.7319,
    lng: -38.5267
  });

  useEffect(() => {
    const serverUrl = 'https://botaopanico-backend.onrender.com';
    console.log('Monitor conectando ao servidor:', serverUrl);
    
    const newSocket = io(serverUrl);
    
    newSocket.on('connect', () => {
      console.log('Monitor conectado - ID:', newSocket.id);
    });

    newSocket.on('newAlert', (data) => {
      console.log('Novo alerta recebido:', data);
      setAlerts(prevAlerts => [...prevAlerts, data]);
      if (data.location) {
        setCenter({
          lat: data.location.latitude,
          lng: data.location.longitude
        });
      }
    });
    
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);
}

export default Monitor;