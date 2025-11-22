import Food from '@/types/Food';
import { axiosClient } from '../axiosClient';

export const addFoodToFridge = async (userId: string, foodList: Food[]) => {
  if (!userId)
    return;

  try {
    await axiosClient.post(`/fridge/${userId}`, foodList);
  }
  catch(e) {
    console.error("Błąd podczas wysyłania jedzenia: ", e);
  }
};

export const getFridge = async (userId: string) => {
  if (!userId)
    return;

  try {
    return await axiosClient.get(`/fridge/${userId}`);
  }
  catch(e: any) {
    console.error("Get fridge error: ", e.message);
  }
};