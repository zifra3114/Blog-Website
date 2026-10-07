import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCurrentUser } from '../features/auth/authSlice.js';
import { fetchUnreadCount } from '../features/notification/notificationSlice.js';

import { useSocket } from '../hooks/useSocket.js';

import NotificationToast from '../components/ui/NotificationToast.jsx';
import ChatBot from '../components/ui/ChatBot.jsx';

import router from './routes.jsx';

const AppContent = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const isUserLoggedIn = isAuthenticated || !!user;

  useSocket(isUserLoggedIn);

  // Check existing authentication when app starts
  useEffect(() => {
    console.log('App initializing - checking authentication...');

    dispatch(fetchCurrentUser())
      .then((result) => {
        if (!result.error) {
          console.log('User authenticated:', result.payload);

          dispatch(fetchUnreadCount());
        } else {
          console.log('User not authenticated:', result.payload);
        }
      })
      .catch((error) => {
        console.error('Auth check failed:', error);
      });
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />

      <NotificationToast />

      <ChatBot />
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
