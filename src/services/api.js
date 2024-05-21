import axios from 'axios'

const instanceAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
})

const endpoints = {
  getDevices(params) {
    return instanceAxios.get('/api/devices', { params })
  },
}

export default endpoints
