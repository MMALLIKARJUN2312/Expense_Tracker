import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-backend-j9mz.onrender.com/api"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;
