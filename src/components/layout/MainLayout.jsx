import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice.js';
import SearchBar from '../ui/SearchBar.jsx';
import Avatar from '../ui/Avatar.jsx';
import '../../styles/globals.css'; 

const MainLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="insta-app-core-viewport">
      
      {/* NAVBAR: Premium Obsidian Sticky Header */}
      <nav className="insta-navbar-master">
        <div className="insta-nav-container-fluid">
          
          {/* Left Block: Logo Brand */}
          <Link to="/" className="insta-nav-logo-link">
            <span className="insta-nav-text-gradient">
              DevBlog
            </span>
          </Link>

          {/* Center Block: Search Field */}
          <div className="insta-nav-search-container">
            <SearchBar className="insta-custom-search-override" />
          </div>

          {/* Right Block: Dynamic Utility Navigation Controls */}
          <div className="insta-nav-actions-rack">
            {/* Home Icon */}
            <Link
              to="/"
              className="insta-nav-icon-btn"
              title="Home"
            >
              <svg className="insta-svg-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Write/Create Post */}
                <Link
                  to="/blog/new"
                  className="insta-nav-icon-btn"
                  title="Write a story"
                >
                  <svg className="insta-svg-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>

                {/* Notifications Engine with Neon Badge */}
                <Link
                  to="/notifications"
                  className="insta-nav-icon-btn position-relative"
                  title="Notifications"
                >
                  <svg className="insta-svg-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="insta-nav-neon-badge">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Bookmarks / Saved */}
                <Link
                  to="/saved"
                  className="insta-nav-icon-btn hide-on-mobile"
                  title="Saved"
                >
                  <svg className="insta-svg-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </Link>

                {/* Profile Interactive Dropdown Hub */}
                <div className="insta-profile-dropdown-wrapper">
                  <button className="insta-avatar-trigger-btn">
                    <Avatar user={user} size="sm" />
                  </button>
                  
                  {/* Luxury Dropdown Content Menu */}
                  <div className="insta-luxury-dropdown-menu">
                    <div className="insta-dropdown-profile-header">
                      <p className="profile-display-name">{user?.name}</p>
                      <p className="profile-handle-username">@{user?.username}</p>
                    </div>
                    
                    <Link to={`/profile/${user?.username}`} className="insta-dropdown-item-row">
                      <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </Link>
                    
                    <Link to="/my/stories" className="insta-dropdown-item-row">
                      <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <span>My Stories</span>
                    </Link>
                    
                    <Link to="/settings" className="insta-dropdown-item-row">
                      <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="insta-dropdown-item-row admin-glow-row">
                        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <div className="insta-dropdown-divider"></div>
                    
                    <button onClick={handleLogout} className="insta-dropdown-item-row logout-action-row">
                      <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="insta-nav-text-btn">
                  Sign in
                </Link>
                <Link to="/register" className="insta-nav-accent-solid-btn">
                  Get started
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* RENDER BODY MAIN CONTENT SURFACE */}
      <main className="insta-app-content-surface">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;