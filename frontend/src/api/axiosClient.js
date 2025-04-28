// src/api/axiosClient.js  - include to  AddTutorial.jsx  -> import axiosClient from '../../api/axiosClient';
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
