import axios from 'axios';

const BASE_URL = 'http://192.168.0.107:3000';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});