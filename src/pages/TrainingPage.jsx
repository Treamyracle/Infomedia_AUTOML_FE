import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/training.css';

const TrainingPage = () => {
  const [filename, setFilename] = useState('');
  const [columns, setColumns] = useState([]);
  const [targetCol, setTargetCol] = useState('');
  const [mode, setMode] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Ambil data yang dikirim dari halaman Upload
    const data = JSON.parse(localStorage.getItem('uploadData'));
    if (data) {
      setFilename(data.filename);
      setColumns(data.columns);
      setTargetCol(data.suggested_target);
    }
  }, []);

  const handleTrain = async () => {
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        filename: filename,
        target_column: targetCol,
        task_type: "auto" // Backend akan mendeteksi otomatis
      };
      
      const response = await api.trainModel(payload);
      setResult(response.data);
    } catch (error) {
      alert("Training Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="training-container">
      {/* Kartu Konfigurasi */}
      <div className="card">
        <h2>Konfigurasi Model ⚙️</h2>
        
        <div className="form-group">
          <label>Kolom Target (Prediksi apa?)</label>
          <select value={targetCol} onChange={(e) => setTargetCol(e.target.value)}>
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mode Training</label>
          <div className="toggle-group">
            <button 
              className={mode === 'auto' ? 'active' : ''} 
              onClick={() => setMode('auto')}
            >
              Auto Pilot ✈️
            </button>
            <button 
              className={mode === 'manual' ? 'active' : ''} 
              onClick={() => setMode('manual')}
            >
              Manual 🛠️
            </button>
          </div>
        </div>

        <button onClick={handleTrain} disabled={loading} className="btn-train">
          {loading ? 'Sedang Melatih AI...' : 'Mulai Training 🚀'}
        </button>
      </div>

      {/* Kartu Hasil */}
      {result && (
        <div className="card result-box">
          <h3>🎉 Training Selesai!</h3>
          <div style={{textAlign: 'center', margin: '20px 0'}}>
            <span style={{color: '#666'}}>Akurasi Model</span>
            <h1 style={{color: '#4CAF50', fontSize: '3rem', margin: '10px'}}>
              {(result.accuracy * 100).toFixed(2)}%
            </h1>
          </div>
          <p>Model disimpan di: <code>{result.model_path}</code></p>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;