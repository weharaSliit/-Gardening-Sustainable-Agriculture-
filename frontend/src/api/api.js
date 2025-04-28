import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Backend base URL

export const register = async (formData) => {
  return axios.post(`${API_BASE_URL}/auth/register`, formData);
};

export const login = async (formData) => {
  return axios.post(`${API_BASE_URL}/auth/login`, formData);
};

export const getProfile = async (userId, token) => {
  return axios.get(`${API_BASE_URL}/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createProfile = async (userId, profileData, token) => {
  return axios.post(`${API_BASE_URL}/profile/create/${userId}`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllUsers = async (token) => {
  return axios.get(`${API_BASE_URL}/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getNotifications = async (token) => {
  return axios.get(`${API_BASE_URL}/garden-calendar/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};