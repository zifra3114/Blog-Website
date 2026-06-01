import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// ─── Lazy-loaded pages ─────────────────────────────────────────

// Auth
const LoginPage = lazy(() => import('../features/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() =>
  import('../features/auth/ForgotPasswordPage.jsx')
);
const ResetPasswordPage = lazy(() =>
  import('../features/auth/ResetPasswordPage.jsx')
);
const VerifyEmailPage = lazy(() =>
  import('../features/auth/VerifyEmailPage.jsx')
);

// Feed & Blog
const FeedPage = lazy(() => import('../features/feed/FeedPage.jsx'));
const BlogListPage = lazy(() => import('../features/blog/BlogListPage.jsx'));
const BlogDetailPage = lazy(() =>
  import('../features/blog/BlogDetailPage.jsx')
);
const CreateBlogPage = lazy(() =>
  import('../features/blog/CreateBlogPage.jsx')
);
const EditBlogPage = lazy(() => import('../features/blog/EditBlogPage.jsx'));
const MyBlogsPage = lazy(() => import('../features/blog/MyBlogsPage.jsx'));

// User
const ProfilePage = lazy(() => import('../features/user/ProfilePage.jsx'));
const EditProfilePage = lazy(() =>
  import('../features/user/EditProfilePage.jsx')
);
const FollowersPage = lazy(() =>
  import('../features/user/FollowersPage.jsx')
);

// Features
const NotificationsPage = lazy(() =>
  import('../features/notification/NotificationsPage.jsx')
);
const SavedBlogsPage = lazy(() =>
  import('../features/bookmark/SavedBlogsPage.jsx')
);
const SearchPage = lazy(() => import('../features/search/SearchPage.jsx'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage.jsx'));
const AdminDashboardPage = lazy(() =>
  import('../features/admin/AdminDashboardPage.jsx')
);

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