import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const token = localStorage.getItem('fraudshield_token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
 