import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PanicButton from './components/PanicButton';
import Monitor from './components/Monitor';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/panic" element={
          <PrivateRoute>
            <PanicButton />
          </PrivateRoute>
        } />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
    </Router>
  );
}

export default App;
