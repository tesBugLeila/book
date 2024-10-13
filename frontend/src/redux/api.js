import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// Интерсептор для добавления токена в каждый запрос
api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок ответа
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('token'); 
      window.location.href = '/login'; 
    }
    return Promise.reject(error); 
  }
);

export default api;
