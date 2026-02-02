import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/training.css';

const TrainingPage = () => {
  const [filename, setFilename] = useState('');
  const [columns, setColumns] = useState([]);
  const [targetCol, setTargetCol] = useState('');
  const [mode, setMode] = useState('auto'); // 'auto' atau 'manual'
  const [selectedModel, setSelectedModel] = useState('lr'); // Default model manual
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
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
      // Tentukan model_choice berdasarkan mode
      const modelChoice = mode === 'auto' ? 'auto' : selectedModel;

      const payload = {
        filename: filename,
        target_column: targetCol,
        task_type: "auto", 
        model_choice: modelChoice // <-- Kirim ke backend
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

        {/* Dropdown hanya muncul jika mode Manual */}
        {mode === 'manual' && (
          <div className="form-group" style={{marginTop: '15px'}}>
            <label>Pilih Algoritma:</label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              <option value="lr">Logistic Regression / Linear Regression</option>
              <option value="dt">Decision Tree</option>
              <option value="rf">Random Forest</option>
              <option value="gbc">Gradient Boosting</option>
              <option value="nb">Naive Bayes</option>
            </select>
          </div>
        )}

        <button onClick={handleTrain} disabled={loading} className="btn-train">
          {loading ? 'Sedang Melatih AI...' : 'Mulai Training 🚀'}
        </button>
      </div>

      {result && (
        <div className="card result-box">
          <h3>🎉 Training Selesai!</h3>
          <div style={{textAlign: 'center', margin: '20px 0'}}>
            <span style={{color: '#666'}}>Akurasi Model</span>
            <h1 style={{color: '#4CAF50', fontSize: '3rem', margin: '10px'}}>
              {(result.accuracy * 100).toFixed(2)}%
            </h1>
          </div>
          <p>Model: <b>{result.model_name}</b></p>
          <p>Lokasi: <code>{result.model_path}</code></p>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;