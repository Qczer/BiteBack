import DotationPoint from '@/types/DotationPoint';
import axios, { AxiosError } from 'axios';
import { axiosClient } from '../axiosClient';

export const TomTomApiKey = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;

export const getPoints = async (search: string, cords: [number, number], distance: number) => {
  try {
    const res = await axiosClient.get("/dotationPoint/near", {
        params: {
            lng: cords[0],
            lat: cords[1],
            maxDistance: distance,
            name: search
        }
    });
    if (res.status == 204) {
        return null
    }
    return res.data.dotationPoints.map((item: any) => new DotationPoint(item));
  }
  catch(e: any) {
    if (axios.isAxiosError(e)) {
      const axiosError = e as AxiosError;
      console.log(axiosError.config?.baseURL);
    }
    console.error("Get points error: ", e);
  }
};


async function geocodeAddress(address: string) {
  const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TomTomApiKey}`;

  try {
    const res = await axios.get(url);
    if (res.data.results && res.data.results.length > 0) {
        console.log(res.data.results)
      const { lat, lon} = res.data.results[0].position;
      return { lng: lon, lat };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Błąd geokodowania:", err);
    return null;
  }
}

// // Przykład użycia
// geocodeAddress("Spółdzielcza 33a, Gliwice").then(console.log);

export const createNewPoint = async (name: string, description: string, zip: string, street: string, number: string, city: string) => {
  let body = { name, description, street, number, city, code: zip};
  let cords = await geocodeAddress(`${street} ${number}, ${city} ${zip}`)
  if (cords == null) {
    return { success: false, status: 0, message: "Sorry, We can't find that address"}
  }
  body = {...body, ...cords}
    console.log(body)
  try {
    const { data } = await axiosClient.post<string>('/dotationPoint/new', body);

    return { success: true, data };
  }
  catch(error) {
    const err = error as AxiosError<any>; 
    console.log(body)
    return {
      success: false,
      status: err.response?.status ?? null,
      message: err.response?.data?.message
    }
  }
};