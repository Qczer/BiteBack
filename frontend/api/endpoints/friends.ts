import { axiosClient } from "@/api/axiosClient";
import { AxiosError } from "axios";

export const getFriends = async (userID: string) => {
  try {
    const { data } = await axiosClient.get(`/friends/${userID}`);
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

export const sendFriendRequest = async (recipientID: string, token: string) => {
  try {
    const { data } = await axiosClient.post(`/friends/request/${recipientID}`, { headers: { "Authorization": `Bearer ${token}` },});

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