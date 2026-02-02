import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import TrainingPage from './pages/TrainingPage';
import './css/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/train" element={<TrainingPage />} />
      </Routes>
    </Router>
  );
}

export default App;