import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for common error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle global error cases here (e.g., 401 Unauthorized)
    return Promise.reject(error);
  }
);

export default apiClient;
