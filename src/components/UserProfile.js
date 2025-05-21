import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

function UserProfile() {
  const [userData, setUserData] = useState({
    name: localStorage.getItem('username') || '',
    registration: localStorage.getItem('registration') || '',
    cpf: localStorage.getItem('cpf') || '',
    phone: localStorage.getItem('phone') || ''
  });

  const handleSave = () => {
    Object.entries(userData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    alert('Dados salvos com sucesso!');
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Dados do Usuário
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome"
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Matrícula"
            value={userData.registration}
            onChange={(e) => setUserData({...userData, registration: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="CPF"
            value={userData.cpf}
            onChange={(e) => setUserData({...userData, cpf: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Telefone"
            value={userData.phone}
            onChange={(e) => setUserData({...userData, phone: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            Salvar
          </Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
}

export default UserProfile;