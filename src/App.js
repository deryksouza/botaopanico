import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PanicButton from './components/PanicButton';
import MonitoringPage from './components/MonitoringPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PanicButton />} />
        <Route path="/monitor" element={<MonitoringPage />} />
      </Routes>
    </Router>
  );
}

export default App;
