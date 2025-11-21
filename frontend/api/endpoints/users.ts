import User from '@/types/User';
import { axiosClient } from '../axiosClient';
import { AxiosError } from 'axios';

interface LoginResponse {
  token: string;
  expiresIn: string;
}

type LoginResult =
| { success: true; data: LoginResponse }
| { success: false; status: number | null; message?: string };

interface AuthResponse {
  message: string;
  userId: string;
}

type AuthResult =
| { success: true; data: AuthResponse }
| { success: false; status: number | null; message?: string };

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axiosClient.get<User[]>('/users');
  return data;
};

export const getUser = async () => {
  const { data } = await axiosClient.get<User>('/user');
  console.log(data)
  return data;
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
    const { data } = await axiosClient.post<LoginResponse>('/user/login', body);

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

export const register = async (email: string, nickname: string, password: string): Promise<LoginResult> => {
  const body = {  email, nickname, password };

  try {
    const { data } = await axiosClient.post<LoginResponse>('/user/login', body);

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