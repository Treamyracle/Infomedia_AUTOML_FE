import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Pastikan Backend jalan di port ini
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  uploadFile(file) {
    let formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  trainModel(payload) {
    return apiClient.post('/train', payload);
  }
};