import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PanicButton from './components/PanicButton';
import MonitoringPage from './components/MonitoringPage';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <PanicButton />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/monitor" 
          element={
            <PrivateRoute>
              <MonitoringPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
