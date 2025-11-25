import { AxiosError } from 'axios';
import { axiosClient } from '../axiosClient';

type LoginResult =
| { success: true; data: string }
| { success: false; status: number | null; message?: string };

interface AuthResponse {
  message: string;
  userID: string;
}

type AuthResult =
| { success: true; data: AuthResponse }
| { success: false; status: number | null; message?: string };

export const getUser = async (userID: string) => {
  try {
    const { data } = await axiosClient.get(`/user/${userID}`);
    return { success: true, data }
  }
  catch (error) {
    const err = error as AxiosError<any>; 

    return {
      success: false,
      status: err.response?.status ?? null,
      message: err.response?.data?.message
    }
  }
};

export const auth = async (token: string): Promise<AuthResult> => {
  try {
    const { data } = await axiosClient.get('/user/auth', { headers: { Authorization: `Bearer ${token}` }});
    return { success: true, data }
  }
  catch (error) {
    const err = error as AxiosError<any>; 

    return {
      success: false,
      status: err.response?.status ?? null,
      message: err.response?.data?.message
    }
  }
};

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const body = {  email, password };

  try {
    const { data } = await axiosClient.post<string>('/user/login', body);

    return { success: true, data };
  }
  catch(error) {
    const err = error as AxiosError<any>; 
    console.log(body)
    return {
      success: false,
      status: err.response?.status ?? null,
      message: err.response?.data?.message
    }
  }
};

export const register = async (email: string, username: string, password: string) => {
  const body = {  email, username, password };

  try {
    const { data } = await axiosClient.post('/user/register', body);

    return { success: true, data };
  }
  catch(error) {
    const err = error as AxiosError<any>; 
    
    return {
      success: false,
      status: err.response?.status ?? null,
      message: err.response?.data?.message
    }
  }
};

export const changeLanguage = async (userID: string, token: string, newLanguage: string) => {
  try {
    const res = await axiosClient.patch(`/user/lang/${userID}`, { lang: newLanguage }, { headers: { Authorization: `Bearer ${token}` }});
    return res.data;
  }
  catch (error) {
    const e = error as AxiosError;
    console.error("Błąd zmiany języka:", e.response?.data || e.message);
  }
};