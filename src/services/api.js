import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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
  (response) => {
    // Check if response has a new token
    const token = response.headers?.authorization?.replace('Bearer ', '');
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and user info
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login only if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden error
      console.error('Access forbidden:', error.response?.data || error.message);
    }
    console.error('API Error:', error.response?.data || error.message);
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
      password
    }),
};

// Images API
export const imageApi = {
  search: (query) => {
    const apiKey = '48247705-1f17db8e4da96243d471ac295';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query || 'camera')}&image_type=photo&safesearch=true&per_page=20`;
    return axios.get(url);
  },
  saveExternal: (imageData) => {
    console.log('Saving external image:', imageData);
    return axiosInstance.post('/images/external', imageData)
      .then(response => {
        console.log('Save external image response:', response);
        return response;
      })
      .catch(error => {
        console.error('Save external image error:', error);
        if (error.response?.status === 400 && error.response?.data?.includes('already exists')) {
          // If image already exists, try to get it by webformatURL
          return axiosInstance.get('/images/by-url', { params: { url: imageData.webformatURL } });
        }
        throw error;
      });
  },
  likeImage: (imageId) =>
    axiosInstance.post(`/images/${imageId}/like`),
  addComment: (imageId, comment) =>
    axiosInstance.post(`/images/${imageId}/comments`, { comment }),
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
  addToFavorites: (imageId, imageData) => {
    console.log('Adding to favorites:', { imageId, imageData });
    return axiosInstance.post(`/favorites/${imageId}`, imageData)
      .then(response => {
        console.log('Add to favorites response:', response);
        return response;
      })
      .catch(error => {
        console.error('Add to favorites error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  removeFromFavorites: (imageId) => {
    console.log('Removing from favorites:', imageId);
    return axiosInstance.delete(`/favorites/${imageId}`)
      .then(response => {
        console.log('Remove from favorites response:', response);
        return response;
      })
      .catch(error => {
        console.error('Remove from favorites error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  checkFavorite: (imageId) => {
    console.log('Checking favorite:', imageId);
    return axiosInstance.get(`/favorites/${imageId}/check`)
      .then(response => {
        console.log('Check favorite response:', response);
        return response;
      })
      .catch(error => {
        console.error('Check favorite error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  getUserFavorites: (page = 0, size = 20) => {
    console.log('Getting user favorites:', { page, size });
    return axiosInstance.get('/favorites', { params: { page, size } })
      .then(response => {
        console.log('Get user favorites response:', response);
        return response;
      })
      .catch(error => {
        console.error('Get user favorites error:', error.response?.data || error.message);
        throw error;
      });
  }
};
