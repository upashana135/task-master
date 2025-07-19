import axios from 'axios';

const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Include cookies (useful for auth)
  headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Request interceptor (e.g., add auth token)
// api.interceptors.request.use(
//   (config) => {
//     // If using token-based auth, you can attach the token here
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Optional: Response interceptor
httpRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);

export default httpRequest;
