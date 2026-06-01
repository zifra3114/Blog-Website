import { useEffect, useState, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // 👈 useSelector add kiya
import { fetchCurrentUser } from '../features/auth/authSlice.js';
import { fetchUnreadCount } from '../features/notification/notificationSlice.js';
import { useSocket } from '../hooks/useSocket.js';
import NotificationToast from '../components/ui/NotificationToast.jsx';
import router from './routes.jsx';

const LoadingFallback = () => (
  <div className="app-loading-container">
    <div className="insta-spinner"></div>
  </div>
);

const AppContent = () => {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // 1. Apne authSlice se check karein ke user authenticated hai ya nahi
  // (Apne slice ke mutabik 'user' ya 'isAuthenticated' nikalen)
  const { user, isAuthenticated } = useSelector((state) => state.auth); 
  const isUserLoggedIn = isAuthenticated || !!user; 

  // 2. 🔀 Socket ko CONDITIONALLY call karein!
  // Jab tak user login nahi hoga, socket connection initiate nahi hoga.
  // Note: Agar useSocket internally useEffect use karta hai, toh hook ko conditional block me nahi daal sakte.
  // Iska behtar tareeqa ye hai ke useSocket ke andar aap 'isUserLoggedIn' ka check lagayein,
  // Ya phir useSocket ko tabhi trigger karein jab user available ho (Neeche dekhein agar useSocket error de).
  useSocket(isUserLoggedIn); 

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

  if (isCheckingAuth) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <NotificationToast />
    </>
  );
};

const App = () => <AppContent />;

export default App;