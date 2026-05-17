import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const token = localStorage.getItem('fraudshield_token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
 
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000'