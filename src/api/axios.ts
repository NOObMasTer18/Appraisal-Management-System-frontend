import axios from 'axios'

const api = axios.create({
  baseURL: 'https://gumdrop-showing-malt.ngrok-free.dev', // Backend is running on 3000
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('psi_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
