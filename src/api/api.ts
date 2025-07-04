import axios from "axios";

export const axiosBase = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}}`
  }
});
