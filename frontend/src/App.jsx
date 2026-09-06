import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import NetworkProfilesPage from './pages/NetworkProfilesPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-root">
        <NavBar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<HistoryDetailPage />} />
            <Route path="/profiles" element={<NetworkProfilesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
