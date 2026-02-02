import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/upload.css'; // Import CSS terpisah

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const response = await api.uploadFile(file);
      // Simpan respons (nama file & kolom) ke localStorage agar bisa dibaca di halaman sebelah
      localStorage.setItem('uploadData', JSON.stringify(response.data));
      navigate('/train');
    } catch (error) {
      alert("Gagal upload: " + error.message);
    }
  };

  return (
    <div className="upload-container">
      <h1>No-Code ML Studio 🤖</h1>
      <p>Upload data CSV kamu untuk memulai</p>

      <div className="drop-zone">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="file-input"
        />
        {!file ? (
          <div className="placeholder">
            <span style={{fontSize: '2rem'}}>📂</span>
            <p>Drag & Drop atau Klik disini</p>
          </div>
        ) : (
          <div className="file-info">
            <span style={{fontSize: '2rem'}}>✅</span>
            <p>{file.name}</p>
          </div>
        )}
      </div>

      {file && (
        <button onClick={handleUpload} className="btn-primary">
          Lanjut ke Konfigurasi →
        </button>
      )}
    </div>
  );
};

export default UploadPage;