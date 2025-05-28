import axios from 'axios';
import { store } from '../store';
import { clearAuth } from '../store/slices/authSlice';
import { URI } from '../config/URI';


const API_BASE_URL = URI.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    if (__DEV__) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor per gestire errori comuni
apiClient.interceptors.response.use(
  (response) => {
    // Log delle risposte in development
    if (__DEV__) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }

    return response;
  },
  (error) => {
    // Log degli errori in development
    if (__DEV__) {
      console.log(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);
    }

    // Gestione errori comuni
    if (error.response?.status === 401) {
      // Token scaduto o non valido
      store.dispatch(clearAuth());
      // Qui potresti anche navigare alla schermata di login
      // NavigationService.navigate('Login');
    }

    if (error.response?.status === 403) {
      // Accesso negato
      console.warn('Access denied');
    }

    if (error.response?.status >= 500) {
      // Errore del server
      console.error('Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

// Utility functions per chiamate API comuni
export const apiUtils = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file
  uploadFile: async (url, file, onUploadProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      };

      const response = await apiClient.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
