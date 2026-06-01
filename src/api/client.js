import axios from 'axios';

// In-memory access token (never stored in localStorage for XSS safety)
let accessToken = null;

// Socket reconnection callback (set by socket.js)
let onTokenRefresh = null;
export const setTokenRefreshCallback = (cb) => {
  onTokenRefresh = cb;
};
let isRefreshing = false;
let failedQueue = [];

// ✅ FIXED: Hardcoded base URL ki jagah environment variable use kiya hai, fallback ke sath
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zifra-blog-backend.hf.space/api/v1';

const client = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true, // send HttpOnly refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Token management ──────────────────────────────────────────

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const getAccessToken = () => accessToken;

// ─── Request interceptor ───────────────────────────────────────

client.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor (token refresh) ──────────────────────

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints themselves
    if (
      originalRequest.url === '/auth/refresh' ||
      originalRequest.url === '/auth/login' ||
      originalRequest.url === '/auth/register'
    ) {
      return Promise.reject(error);
    }

    // If 401 and not already retried, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ FIXED: Yahan pehle '/api/v1/auth/refresh' relative URL tha, jo frontend URL par request bhej raha tha.
        // Ab yeh exact live Hugging Face URL par hi refresh hit karega.
        const { data } = await axios.post(
          `${BACKEND_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        // Reconnect socket with new token
        if (onTokenRefresh) {
          onTokenRefresh();
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // Redirect to login on refresh failure
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
