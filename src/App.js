import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PanicButton from './components/PanicButton';
import MonitorPage from './components/MonitorPage';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<PanicButton />} />
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
