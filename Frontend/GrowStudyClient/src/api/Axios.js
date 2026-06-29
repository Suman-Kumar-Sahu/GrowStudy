import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKENDURL || "http://localhost:3000/api",
  withCredentials: true,
});

export default api;