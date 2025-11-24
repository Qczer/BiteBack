import { axiosClient } from "@/api/axiosClient";
import { AxiosError } from "axios";

export const getFriends = async (userID: string, token: string) => {
  try {
    const { data } = await axiosClient.get(`/friends/${userID}`, { headers: { "Authorization": `Bearer ${token}` }});
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

export const getMutualFriends = async (userID: string, token: string) => {
  try {
    const { data } = await axiosClient.get(`/friends/mutual/${userID}`, { headers: { "Authorization": `Bearer ${token}` }});
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
    const { data } = await axiosClient.post(`/friends/request/${recipientName}`, {}, { headers: { "Authorization": `Bearer ${token}` }});
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

export const removeFriend = async (recipientName: string, token: string) => {
  try {
    const { data } = await axiosClient.delete(`/friends/${recipientName}`, { headers: { "Authorization": `Bearer ${token}` }});
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
    const { data } = await axiosClient.post(`/friends/accept/${requesterName}`, {}, { headers: { "Authorization": `Bearer ${token}` },});
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
    const { data } = await axiosClient.post(`/friends/reject/${requesterName}`, {}, { headers: { "Authorization": `Bearer ${token}` },});
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