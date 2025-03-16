import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CCTVCams from './components/CCTVCams';
import Reports from './components/Reports';
import CrimeMaps from './components/CrimeMpas';
import PossibleCrimeSpot from './components/PossibleCrimeSpot';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/cams" element={<CCTVCams />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/crime-maps" element={<CrimeMaps />} />
            <Route path="/possible-crime-spots" element={<PossibleCrimeSpot />} />
            <Route path="*" element={<Navigate to="/cams" />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;