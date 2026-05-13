import axios from 'axios'

// Base URL backend — semua request otomatis pakai ini
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
})

// Interceptor — otomatis tambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor response — tangkap error 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api