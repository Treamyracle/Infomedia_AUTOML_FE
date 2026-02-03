import axios from 'axios';

// Pastikan port sesuai dengan backend Anda (biasanya 8000)
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDataset = async (formData) => {
  // Endpoint: /upload
  // Menggunakan headers 'multipart/form-data' khusus untuk upload file
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const suggestFeatures = async (filename, description) => {
  // Endpoint: /features/suggest
  // Body: { filename, description }
  const response = await api.post('/features/suggest', { filename, description });
  return response.data; // Mengembalikan { plan: [...] }
};

export const applyFeatures = async (filename, plan) => {
  // Endpoint: /features/apply
  // Body: { filename, plan }
  const response = await api.post('/features/apply', { filename, plan });
  return response.data; // Mengembalikan { new_filename, new_columns, message }
};

export const trainModel = async (filename, targetColumn) => {
  // Endpoint: /train
  // Body: { filename, target_column, ... }
  const response = await api.post('/train', {
    filename: filename,
    target_column: targetColumn,
    task_type: 'auto',   // Biarkan backend mendeteksi
    model_choice: 'auto' // Biarkan backend memilih model terbaik
  });
  return response.data;
};

export default api;