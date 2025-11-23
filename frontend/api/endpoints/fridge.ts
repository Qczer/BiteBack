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

export interface editFoodProperty {
  name: string;
  value: string;
}

export interface editFoodParams {
  id: string;
  params: editFoodProperty[];
}

export const editFood = async (userId: string, foodId: string, params: editFoodParams) => {
  if (!userId || !foodId)
    return;

  try {
    return await axiosClient.patch(`/fridge/${userId}`, params);
  }
  catch(e: any) {
    console.error("Patch food error: ", e.message);
  }
}

export const deleteFood = async (userId: string, foodId: string) => {
  if (!userId || !foodId)
    return;

  try {
    return await axiosClient.delete(`/fridge/${userId}`, { data: { "id": foodId } });
  }
  catch(e: any) {
    console.error("Patch food error: ", e.message);
  }
}