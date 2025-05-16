// src/api/axiosClient.js

import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Special handling for form data (file uploads)
axiosClient.interceptors.request.use(
  config => {
    // For multipart/form-data requests, let the browser set the content type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = undefined;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Better error handling
axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend server running at ' + API_BASE_URL + '?');
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;