import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import NetworkProfilesPage from './pages/NetworkProfilesPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-root">
        <NavBar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profiles" element={<NetworkProfilesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
