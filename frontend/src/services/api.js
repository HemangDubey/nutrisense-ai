import axios from 'axios';

const API_URL = 'https://nutrisense-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

export const analyzeIngredients = async (text, profile) => {
  const response = await api.post('/analyze', { text, profile });
  return response.data;
};

export const analyzeImage = async (imageFile, profile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('profile', profile);

  const response = await api.post('/analyze-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const sendChat = async (question, context, profile) => {
  const response = await api.post('/chat', { question, context, profile });
  return response.data;
};