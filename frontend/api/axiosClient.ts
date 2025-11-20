import axios from 'axios';

const BASE_URL = 'https://twoje-api.com/api';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});