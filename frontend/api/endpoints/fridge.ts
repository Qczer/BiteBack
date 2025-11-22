import Food, { FoodCategory } from '@/types/Food';
import { axiosClient } from '../axiosClient';

export const addFoodToFridge = async (userId: string, foodList: Food[]) => {
  if (!userId)
    return;

  for (const food of foodList) {
    const payload = {
      name: food.name,
      amount: food.amount > 0 ? food.amount : 1, // Zabezpieczenie przed 0
      unit: food.unit || 'kg',
      category: 'other',
      iconUrl: food.iconUrl || "",
      expDate: new Date().toISOString()
    };

    try {
      await axiosClient.post(`/fridge/${userId}`, payload);
    }
    catch(e: any) {
      if (e.response) {
        console.error("Błąd serwera (dane):", e.response.data);
      }
      else
        console.error("Błąd sieci/inny:", e.message);
      return;
    }
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