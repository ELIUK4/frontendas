import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: (username, password) =>
    axiosInstance.post('/auth/signin', { username, password }),
  register: (username, email, password) =>
    axiosInstance.post('/auth/signup', { 
      username, 
      email, 
      password,
      role: ["user"] // Add default role
    }),
};

// Images API
export const imageApi = {
  search: (query, params = {}) =>
    axiosInstance.get('/images/search', { params: { query, ...params } }),
  getComments: (imageId) => axiosInstance.get(`/comments/${imageId}`),
  addComment: (imageId, content) => axiosInstance.post(`/comments/${imageId}`, { content }),
  deleteComment: (commentId) => axiosInstance.delete(`/comments/${commentId}`),
};

// Categories API
export const categoryApi = {
  getAll: () => axiosInstance.get('/categories'),
};

// Search History API
export const searchHistoryApi = {
  getHistory: () => axiosInstance.get('/search-history'),
  clearHistory: () => axiosInstance.delete('/search-history'),
};

// Favorites API
export const favoriteApi = {
  addToFavorites: (pixabayId, { params }) => 
    axiosInstance.post(`/favorites/${pixabayId}?url=${encodeURIComponent(params.url)}&tags=${encodeURIComponent(params.tags)}&user=${encodeURIComponent(params.user)}`),
  removeFromFavorites: (pixabayId) =>
    axiosInstance.delete(`/favorites/${pixabayId}`),
  checkFavorite: (pixabayId) =>
    axiosInstance.get(`/favorites/check/${pixabayId}`),
  getUserFavorites: (page = 0, size = 20) =>
    axiosInstance.get(`/favorites?page=${page}&size=${size}`)
};
