import { useEffect, useState, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../features/auth/authSlice.js';
import { fetchUnreadCount } from '../features/notification/notificationSlice.js';
import { useSocket } from '../hooks/useSocket.js';
import NotificationToast from '../components/ui/NotificationToast.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ChatBot from '../components/ui/ChatBot.jsx';
import router from './routes.jsx';

const MIN_LOADER_TIME = 1800; // ms — "BLOG APP" (8 letters * 120ms = 960ms) + buffer

const AppContent = () => {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasLoadedOnce = useRef(false); // Use ref to persist across renders

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isUserLoggedIn = isAuthenticated || !!user;

  useSocket(isUserLoggedIn);

  // Auth check
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
      })
      .finally(() => {
        console.log('Auth check complete');
        setIsCheckingAuth(false);
      });
  }, [dispatch]);

  // Minimum loader display time — taake typing animation poori chale
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
      hasLoadedOnce.current = true; // Mark that first load is complete
    }, MIN_LOADER_TIME);
    return () => clearTimeout(timer);
  }, []);

  // Jab tak dono (auth check + min time) complete na ho, loader dikhayein
  const isLoading = isCheckingAuth || !minTimeElapsed;

  // Sirf pehli baar loader dikhao
  if (isLoading && !hasLoadedOnce.current) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* No Suspense fallback after first load */}
      <RouterProvider router={router} />
      <NotificationToast />
      <ChatBot />
    </>
  );
};

const App = () => <AppContent />;

export default App;