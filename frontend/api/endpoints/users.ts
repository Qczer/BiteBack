import { axiosClient } from '../axiosClient';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await axiosClient.get<Post[]>('/posts');
  return data;
};

export const createPost = async (newPost: Omit<Post, 'id'>) => {
  const { data } = await axiosClient.post('/posts', newPost);
  return data;
};