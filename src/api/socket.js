import { io } from 'socket.io-client';
import { getAccessToken, setTokenRefreshCallback } from './client.js';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3; // 5 se kam karke 3 kiya taake background block na ho

// Register socket reconnection on token refresh
setTokenRefreshCallback(() => {
  if (socket?.connected) {
    socket.auth.token = getAccessToken();
    socket.disconnect().connect();
  }
});

/**
 * Connect to Socket.io server with authentication.
 */
export const connectSocket = () => {
  const token = getAccessToken();
  if (!token) {
    console.warn('Cannot connect socket: no access token');
    return null;
  }

  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  // OPTIMIZED CONFIGURATION FOR HUGGING FACE SPACES
  socket = io(socketUrl, {
    auth: { token },
    withCredentials: true,
    transports: ['polling', 'websocket'], // Polling pehle, taake connection instant establish ho
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    timeout: 5000, // Timeout 20s se kam karke 5s kiya taake lag bilkul khatam ho jaye
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected successfully:', socket.id);
    reconnectAttempts = 0;
  });

  socket.on('connect_error', (err) => {
    reconnectAttempts++;
    console.warn(`Socket connection error (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`, err.message);

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached. Socket connection failed safely.');
      disconnectSocket();
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server disconnected, try to reconnect manually
      socket.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

/**
 * Disconnect from Socket.io server.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get the current socket instance.
 */
export const getSocket = () => socket;

/**
 * Reconnect with a new token (e.g., after token refresh).
 */
export const reconnectSocket = () => {
  disconnectSocket();
  return connectSocket();
};