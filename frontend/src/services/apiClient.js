import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV == "dev"
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PROD_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
