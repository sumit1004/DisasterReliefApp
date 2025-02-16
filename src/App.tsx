import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import EmergencyMap from './pages/EmergencyMap';
import VictimLogin from './pages/VictimLogin';
import VolunteerLogin from './pages/VolunteerLogin';
import VictimDashboard from './pages/VictimDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/emergency-map" element={<EmergencyMap />} />
          <Route path="/victim/login" element={<VictimLogin />} />
          <Route path="/volunteer/login" element={<VolunteerLogin />} />
          <Route path="/victim/dashboard" element={<VictimDashboard />} />
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;