import { useQuery } from '@tanstack/react-query';
import { getUser, getUsers } from '@/api/endpoints/users';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
    retry: 1,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60,
  });
};