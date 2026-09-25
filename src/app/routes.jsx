import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// ─── Direct imports (NO lazy loading) ─────────────────────────────────────────

// Auth
import LoginPage from '../features/auth/LoginPage.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../features/auth/ResetPasswordPage.jsx';
import VerifyEmailPage from '../features/auth/VerifyEmailPage.jsx';

// Feed & Blog
import FeedPage from '../features/feed/FeedPage.jsx';
import BlogListPage from '../features/blog/BlogListPage.jsx';
import BlogDetailPage from '../features/blog/BlogDetailPage.jsx';
import CreateBlogPage from '../features/blog/CreateBlogPage.jsx';
import EditBlogPage from '../features/blog/EditBlogPage.jsx';
import MyBlogsPage from '../features/blog/MyBlogsPage.jsx';

// User
import ProfilePage from '../features/user/ProfilePage.jsx';
import EditProfilePage from '../features/user/EditProfilePage.jsx';
import FollowersPage from '../features/user/FollowersPage.jsx';

// Features
import NotificationsPage from '../features/notification/NotificationsPage.jsx';
import SavedBlogsPage from '../features/bookmark/SavedBlogsPage.jsx';
import SearchPage from '../features/search/SearchPage.jsx';
import SettingsPage from '../features/settings/SettingsPage.jsx';
import AdminDashboardPage from '../features/admin/AdminDashboardPage.jsx';

// ─── 404 ───────────────────────────────────────────────────────

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Page not found</p>
      <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
        Go to Login
      </a>
    </div>
  </div>
);

// ─── Router ────────────────────────────────────────────────────

const router = createBrowserRouter([
  // 1. Auth pages (Yeh bina login ke khulenge)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
    ],
  },

  // 2. Purely Public pages (Agar aap chahte hain yeh bina login ke bhi dikhein)
  {
    element: <MainLayout />,
    children: [
      { path: '/explore', element: <BlogListPage /> },
      { path: '/blog/:slug', element: <BlogDetailPage /> },
      { path: '/profile/:username', element: <ProfilePage /> },
      { path: '/profile/:username/followers', element: <FollowersPage /> },
      { path: '/profile/:username/following', element: <FollowersPage /> },
      { path: '/search', element: <SearchPage /> },
    ],
  },

  // 3. Protected pages (Bina login ke yahan koi nahi jaa sakta)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Ab '/' (Main Link) par click karte hi agar login nahi hoga, to ProtectedRoute isay block karke /login par bhej dega
          { path: '/', element: <FeedPage /> }, 
          { path: '/blog/new', element: <CreateBlogPage /> },
          { path: '/blog/:slug/edit', element: <EditBlogPage /> },
          { path: '/my/stories', element: <MyBlogsPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/saved', element: <SavedBlogsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/admin', element: <AdminDashboardPage /> },
        ],
      },
    ],
  },

  // Agar koi galat url dale, to seedha login ya 404 par bhejdo
  { path: '*', element: <NotFoundPage /> },
]);

export default router;