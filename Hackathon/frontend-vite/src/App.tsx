import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/language-selection" element={<LanguageSelectionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 