import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import User from '@/types/User';

const getUser = async () => {
  const { data } = await axiosClient.get<User>('/auth/me');
  console.log(data)
  return data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
    retry: 1,
  });
};