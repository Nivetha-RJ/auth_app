import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/auth", // Change if your backend is hosted elsewhere
  withCredentials: true, // Important for cookies!
});

export default api;
