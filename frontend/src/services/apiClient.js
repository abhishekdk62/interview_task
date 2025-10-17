import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.VITE_NODE_ENV == "dev"
      ? process.env.VITE_DEV_API_URL
      : process.env.VITE_PROD_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
