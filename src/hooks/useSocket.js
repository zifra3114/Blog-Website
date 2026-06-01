import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '../api/socket.js';
import {
  addRealtimeNotification,
  setUnreadCount,
} from '../features/notification/notificationSlice.js';

/**
 * Hook to manage Socket.io connection and real-time events.
 * Connects when authenticated, disconnects on logout.
 */
export const useSocket = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !connectedRef.current) {
      const socket = connectSocket();
      if (!socket) return;

      connectedRef.current = true;

      // Listen for new notifications
      socket.on('notification:new', (notification) => {
        dispatch(addRealtimeNotification(notification));
      });

      // Listen for unread count updates
      socket.on('notification:unread-count', ({ count }) => {
        dispatch(setUnreadCount(count));
      });

      socket.on('disconnect', () => {
        connectedRef.current = false;
      });
    }

    if (!isAuthenticated && connectedRef.current) {
      disconnectSocket();
      connectedRef.current = false;
    }

    return () => {
      // Don't disconnect on component unmount — keep connection alive
    };
  }, [isAuthenticated, dispatch]);
};
