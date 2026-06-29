import axios from "axios";
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const api = axios.create({
  baseURL: process.env.BACKENDURL || "http://localhost:3000/api",
  withCredentials: true,
});

export default api;