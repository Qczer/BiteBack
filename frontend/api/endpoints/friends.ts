import { axiosClient } from "@/api/axiosClient";
import { AxiosError } from "axios";
import {getUserID} from "@/api/endpoints/user";

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

export const sendFriendRequest = async (recipientName: string, token: string) => {
  try {
    const res = await getUserID(recipientName);

    if (!res.success)
      return;

    const recipientID = res.data;
    const { data } = await axiosClient.post(`/friends/request/${recipientID}`, {}, { headers: { "Authorization": `Bearer ${token}` },});

    console.log(data);
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

export const acceptFriendRequest = async (requesterName: string, token: string) => {
  try {
    const res = await getUserID(requesterName);

    if (!res.success)
      return;

    const recipientID = res.data;
    const { data } = await axiosClient.post(`/friends/accept/${recipientID}`, {}, { headers: { "Authorization": `Bearer ${token}` },});

    console.log(data);
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

export const rejectFriendRequest = async (requesterName: string, token: string) => {
  try {
    const res = await getUserID(requesterName);

    if (!res.success)
      return;

    const recipientID = res.data;
    const { data } = await axiosClient.post(`/friends/reject/${recipientID}`, {}, { headers: { "Authorization": `Bearer ${token}` },});

    console.log(data);
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