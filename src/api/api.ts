import axios from "axios";

export const axiosBase = axios.create({
  baseURL: "https://alisherdev.up.railway.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});