import axios from "axios";

const BASE_URL = "https://biteback.pl/api";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});
