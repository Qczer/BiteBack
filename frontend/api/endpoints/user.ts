import { AxiosError } from 'axios';
import { axiosClient } from '../axiosClient';

type LoginResult =
| { success: true; data: string }
| { success: false; status: number | null; message?: string };

interface AuthResponse {
  message: string;
  userID: string;
}

type AuthResult =
| { success: true; data: AuthResponse }
| { success: false; status: number | null; message?: string };

export const getUser = async (userID: string, token: string) => {
  try {
    const { data } = await axiosClient.get(`/user/${userID}`, { headers: { Authorization: `Bearer ${token}` }});
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

export const getProfile = async (userName: string, token: string) => {
  try {
    const { data } = await axiosClient.get(`/profile/${userName}`, { headers: { Authorization: `Bearer ${token}` }});
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

export const auth = async (token: string): Promise<AuthResult> => {
  try {
    const { data } = await axiosClient.get('/user/auth', { headers: { Authorization: `Bearer ${token}` }});
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

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const body = {  email, password };

  try {
    const { data } = await axiosClient.post<string>('/user/login', body);

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

export const register = async (email: string, username: string, password: string) => {
  const body = {  email, username, password };

  try {
    const { data } = await axiosClient.post('/user/register', body);

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

export const changeAvatar = async (userID: string, token: string, avatarUri: string) => {
  try {
    const formData = new FormData();
    // W React Native trzeba dopisać typ pliku i nazwę
    const filename = avatarUri.split("/").pop() || "avatar.jpg";
    const file: any = {
      uri: avatarUri,
      type: "image/jpeg",
      name: filename,
    };

    formData.append("avatar", file);

    const res = await axiosClient.patch(`/user/avatar/${userID}`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }
  catch (error) {
    const e = error as AxiosError;
    console.error("Błąd zmiany avatara:", e.response?.data || e.message);
  }
};

export const changeLanguage = async (userID: string, token: string, newLanguage: string) => {
  try {
    const res = await axiosClient.patch(`/user/${userID}/lang`, { lang: newLanguage }, { headers: { Authorization: `Bearer ${token}` }});
    return res.data;
  }
  catch (error) {
    const e = error as AxiosError;
    console.error("Błąd zmiany języka:", e.response?.data || e.message);
  }
};

export const getNotifications = async (userID: string, token: string) => {
  try {
    const res = await axiosClient.get(`/user/${userID}/notifications`, { headers: { Authorization: `Bearer ${token}` }});
    return res.data;
  }
  catch (error) {
    const e = error as AxiosError;
    console.error("Błąd pobierania powiadomień:", e.response?.data || e.message);
  }
}

export const getUnreadNotifications = async (userID: string, token: string) => {
  try {
    const res = await axiosClient.get(`/user/${userID}/notifications/unread`, { headers: { Authorization: `Bearer ${token}` }});
    return res.data;
  }
  catch (error) {
    const e = error as AxiosError;
    console.error("Błąd pobierania nieprzeczytanych powiadomień:", e.response?.data || e.message);
  }
}

export const readNotification = async (userID: string, notificationID: string, token: string) => {
  try {
    const res = await axiosClient.patch(`/user/${userID}/notifications/${notificationID}/read`, {}, { headers: { Authorization: `Bearer ${token}` }});
    return res.data;
  }
  catch (error) {
    const e = error as AxiosError;
    console.error("Błąd nieprzeczytanych powiadomień:", e.response?.data || e.message);
  }
}