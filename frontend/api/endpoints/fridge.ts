import Food from "@/types/Food";
import axios, { AxiosError } from "axios";
import { axiosClient } from "../axiosClient";

export const addFoodToFridge = async (userID: string, foodList: Food[]) => {
  if (!userID) return;

  try {
    return await axiosClient.post(`/fridge/${userID}`, foodList);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const axiosError = e as AxiosError;

      console.error("------- DEBUG ERROR -------");
      console.error(
        "Pełny URL:",
        (axiosError.config?.baseURL || "") + (axiosError.config?.url || "")
      );
      console.error("Metoda:", axiosError.config?.method);
      console.error("Dane odpowiedzi:", axiosError.response?.data);
      console.error("Status:", axiosError.response?.status);
    } else console.error("Inny błąd:", e);
    throw e;
  }
};

export const getFridge = async (userID: string) => {
  if (!userID) return;

  try {
    return await axiosClient.get(`/fridge/${userID}`);
  } catch (e: any) {
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

export const editFood = async (
  userID: string,
  foodId: string,
  params: editFoodParams
) => {
  if (!userID || !foodId) return;

  try {
    return await axiosClient.patch(`/fridge/${userID}`, params);
  } catch (e: any) {
    console.error("Patch food error: ", e.message);
  }
};

export const deleteFood = async (userID: string, foodId: string) => {
  if (!userID || !foodId) return;

  try {
    return await axiosClient.delete(`/fridge/${userID}`, {
      data: { id: foodId },
    });
  } catch (e: any) {
    console.error("Patch food error: ", e.message);
  }
};
