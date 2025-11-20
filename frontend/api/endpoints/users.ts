import User from '@/types/User';
import { axiosClient } from '../axiosClient';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axiosClient.get<User[]>('/users');
  return data;
};

export const getUser = async () => {
  const { data } = await axiosClient.get<User>('/auth/me');
  console.log(data)
  return data;
};