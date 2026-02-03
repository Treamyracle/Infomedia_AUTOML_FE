import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { suggestFeatures, applyFeatures, trainModel } from '../services/api';
import '../css/training.css';

const TrainingPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Sekarang variabel ini akan digunakan
  
  // Data dari halaman Upload
  const initialState = location.state || {};
  
  // State Management
  const [filename, setFilename] = useState(initialState.filename || '');
  const [columns, setColumns] = useState(initialState.columns || []);
  const [targetCol, setTargetCol] = useState(initialState.suggested_target || '');
  
  // State untuk AI Features
  const [aiLoading, setAiLoading] = useState(false);
  const [featurePlan, setFeaturePlan] = useState([]); 
  const [featuresApplied, setFeaturesApplied] = useState(false);

  // State untuk Training
  const [trainLoading, setTrainLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // --- FUNGSI NAVIGASI (SOLUSI ESLINT) ---
  const handleBack = () => {
    // Kembali ke halaman upload ('/')
    navigate('/');
  };

  // --- STEP 1: AI FEATURE ENGINEERING ---
  const handleAskAI = async () => {
    setAiLoading(true);
    setError('');
    try {
      const description = "Dataset ini digunakan untuk prediksi bisnis.";
      const res = await suggestFeatures(filename, description);
      setFeaturePlan(res.plan || []);
    } catch (err) {
      setError('Gagal meminta saran AI. Pastikan API Key diset.');
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyFeatures = async () => {
    setAiLoading(true);
    try {
      const res = await applyFeatures(filename, featurePlan);
      setFilename(res.new_filename);
      setColumns(res.new_columns);
      setFeaturesApplied(true);
      alert(res.message);
    } catch (err) {
      setError('Gagal menerapkan fitur.');
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // --- STEP 2: TRAINING ---
  const handleTrain = async () => {
    if (!targetCol) {
      setError('Harap pilih kolom Target terlebih dahulu!');
      return;
    }
    setTrainLoading(true);
    setResult(null);
    setError('');
    
    try {
      const data = await trainModel(filename, targetCol);
      setResult(data);
    } catch (err) {
      setError('Terjadi kesalahan saat training. Cek console.');
      console.error(err);
    } finally {
      setTrainLoading(false);
    }
  };

  return (
    <div className="training-container">
      {/* Header dengan Tombol Back */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>AutoML Dashboard 🚀</h1>
        <button onClick={handleBack} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
          ⬅ Upload Baru
        </button>
      </div>
      
      {/* Jika tidak ada file (User masuk langsung via URL), tampilkan peringatan */}
      {!filename && (
        <div className="error-msg" style={{ marginBottom: '20px' }}>
          ⚠️ Tidak ada file yang dipilih. Silakan kembali ke halaman upload.
        </div>
      )}

      {/* --- SETUP SECTION --- */}
      <div className="card">
        <h3>1. Konfigurasi Data</h3>
        <p>File Aktif: <strong>{filename || '-'}</strong></p>
        
        <div className="form-group">
          <label>Target Prediksi (Label):</label>
          <select 
            value={targetCol} 
            onChange={(e) => setTargetCol(e.target.value)}
            className="input-select"
            disabled={!filename}
          >
            <option value="">-- Pilih Target --</option>
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- AI SECTION --- */}
      <div className="card ai-section">
        <h3>2. AI Feature Engineering (Opsional)</h3>
        <p>Biarkan AI menganalisis data dan membuat fitur baru.</p>
        
        {!featuresApplied ? (
          <>
            <button 
              onClick={handleAskAI} 
              disabled={aiLoading || !filename} 
              className="btn btn-secondary"
            >
              {aiLoading ? 'Sedang Berpikir...' : '✨ Minta Saran AI'}
            </button>

            {featurePlan.length > 0 && (
              <div className="feature-list">
                <h4>Saran Fitur:</h4>
                <ul>
                  {featurePlan.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.name}</strong>: <code>{item.expression}</code>
                      <br/><small>{item.rationale}</small>
                    </li>
                  ))}
                </ul>
                <button onClick={handleApplyFeatures} disabled={aiLoading} className="btn btn-primary">
                  Terapkan Fitur Ini
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="success-banner">✅ Fitur AI berhasil diterapkan ke dataset!</div>
        )}
      </div>

      {/* --- TRAIN SECTION --- */}
      <div className="card">
        <h3>3. Training Model</h3>
        <button 
          onClick={handleTrain} 
          disabled={trainLoading || !filename} 
          className="btn btn-primary btn-large"
        >
          {trainLoading ? 'Sedang Melatih Model (Steps 1-7)...' : '🚀 Mulai Training'}
        </button>
        
        {error && <div className="error-msg">{error}</div>}
      </div>

      {/* --- RESULTS SECTION --- */}
      {result && (
        <div className="card result-card">
          <h2>🏆 Hasil Training</h2>
          <div className="metrics-grid">
            <div className="metric-box">
              <span>Task Type</span>
              <strong>{result.task_type.toUpperCase()}</strong>
            </div>
            <div className="metric-box">
              <span>Akurasi / R2</span>
              <strong>{result.accuracy_score.toFixed(4)}</strong>
            </div>
            <div className="metric-box">
              <span>Best Model</span>
              <strong>{result.best_model_name}</strong>
            </div>
          </div>

          <div className="detail-metrics">
            <h4>Detail Metrics:</h4>
            <pre>{JSON.stringify(result.metrics_detail, null, 2)}</pre>
          </div>

          {result.confusion_matrix && (
            <div className="cm-box">
              <h4>Confusion Matrix:</h4>
              <pre>{JSON.stringify(result.confusion_matrix)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingPage;