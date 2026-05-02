import axios from 'axios';

const api = axios.create({
  baseURL: baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send secure HttpOnly cookies alongside requests
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401 Unauthorized, we could globally trigger a redirect or toast notification here
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - Please login");
    }
    return Promise.reject(error);
  }
);

export default api;
