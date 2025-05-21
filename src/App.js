import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PanicButton from './components/PanicButton';
import Monitor from './components/Monitor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PanicButton />} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
    </Router>
  );
}

export default App;
