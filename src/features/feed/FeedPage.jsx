import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPersonalizedFeed, fetchTrendingFeed, clearFeed, addNewPostFromSocket } from './feedSlice.js';
import { fetchSuggestedUsers } from '../user/userSlice.js';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { getSocket } from '../../api/socket.js';
import FeedPostCard from '../../components/feed/FeedPostCard.jsx';
import SuggestedUsers from '../../components/feed/SuggestedUsers.jsx';
import TrendingSidebar from '../../components/feed/TrendingSidebar.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import "../../styles/globals.css";

const FeedPage = () => {
  useDocumentTitle('Feed');
  const dispatch = useDispatch();

  const { posts, nextCursor, hasMore, loading, error, trending, trendingLoading } =
    useSelector((state) => state.feed);
  const { suggested, suggestedLoading } = useSelector((state) => state.user);
  
  // Auth slice se authLoading state bhi nikalein taaki temporary 409 crash state sync ho sake
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);

  // 1. Fetch Feed Data Fix (Strict Dependency Handling)
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Auth verified successfully! Fetching home feed posts...");
      dispatch(fetchPersonalizedFeed({}));
      dispatch(fetchTrendingFeed({ limit: 5 }));
      dispatch(fetchSuggestedUsers(5));
    }
    return () => {
      dispatch(clearFeed());
    };
  }, [dispatch, isAuthenticated]); // Jaise hi isAuthenticated baad me retry hokar true hoga, API chal padegi!

  // 2. Real-time updates via Socket.IO
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewPost = (data) => {
      console.log('Received new post via Socket.IO:', data.post);
      dispatch(addNewPostFromSocket(data.post));
    };

    socket.on('post:new', handleNewPost);

    return () => {
      socket.off('post:new', handleNewPost);
    };
  }, [dispatch, isAuthenticated]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading && nextCursor) {
      dispatch(fetchPersonalizedFeed({ cursor: nextCursor }));
    }
  }, [dispatch, hasMore, loading, nextCursor]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  // ─── 0. LOADING SCREEN (Jab tak cookie structure pure tarike se verify na ho jaye) ───
  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // ─── 1. NOT AUTHENTICATED (LOGGED OUT HERO VIEW) ───────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="logged-out-wrapper" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="logged-out-hero-panel">
          <div className="logged-out-hero-inner">
            <h1 className="logged-out-main-headline">Stay curious.</h1>
            <p className="logged-out-sub-description">
              Discover stories, thinking, and expertise from writers on any topic. Share your ideas with the world.
            </p>
            <div className="logged-out-cta-actions-group">
              <Link to="/register" className="cta-button-primary">
                Start writing
              </Link>
              <Link to="/explore" className="cta-button-secondary">
                Explore
              </Link>
            </div>
          </div>
        </div>

        <div className="logged-out-trending-section">
          <h2 className="logged-out-trending-title">Trending on DevBlog</h2>
          <TrendingSidebar posts={trending} loading={trendingLoading} />
        </div>
      </div>
    );
  }

  // ─── 2. AUTHENTICATED VIEW (MAIN TIMELINE) ─────────────────────
  return (
    <div className="feed-page-container">
      <div className="feed-layout-grid">
        
        {/* ─── Left Sidebar Section ─── */}
        <aside className="feed-sidebar-left">
          <div className="feed-sticky-wrapper">
            
            {/* Miniature Profile Metadata Card */}
            <div className="user-profile-sidebar-card">
              {user?.coverImage?.url ? (
                <div 
                  className="user-card-cover-image" 
                  style={{ backgroundImage: `url(${user.coverImage.url})` }}
                >
                  <div className="user-card-cover-overlay" />
                </div>
              ) : (
                <div className="user-card-cover-gradient">
                  <div className="user-card-cover-overlay" />
                </div>
              )}
              
              {/* Overlapping Avatar Area */}
              <div className="user-card-avatar-wrapper">
                <Avatar user={user} size="lg" linkTo={`/profile/${user?.username}`} />
              </div>

              <div className="user-card-meta-info">
                <Link to={`/profile/${user?.username}`} className="user-sidebar-name-link">
                  {user?.name}
                </Link>
                {user?.headline && (
                  <p className="user-sidebar-headline">{user.headline}</p>
                )}
              </div>
              
              <div className="user-card-stats-list">
                <Link to={`/profile/${user?.username}`} className="user-stat-row-item">
                  <span>Followers</span>
                  <span className="user-stat-number-value">{user?.followerCount || 0}</span>
                </Link>
                <Link to={`/profile/${user?.username}`} className="user-stat-row-item">
                  <span>Following</span>
                  <span className="user-stat-number-value">{user?.followingCount || 0}</span>
                </Link>
              </div>
            </div>

            {/* Quick Feature Redirect Navigation Box */}
            <div className="quick-navigation-box">
              <Link to="/my/stories" className="quick-link-item">
                <svg className="quick-link-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                My Stories
              </Link>
              <Link to="/saved" className="quick-link-item">
                <svg className="quick-link-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Saved Posts
              </Link>
              <Link to="/notifications" className="quick-link-item">
                <svg className="quick-link-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </Link>
              <Link to="/blog/new" className="quick-link-item write-story-trigger">
                <svg className="quick-link-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Write a story
              </Link>
            </div>
            
          </div>
        </aside>

        {/* ─── Center Feed Timeline Section ─── */}
        <main className="feed-main-content">
          
          {/* Create Post/Story Input Trigger Panel */}
          <div className="create-post-prompt-box">
            <Avatar user={user} size="md" />
            <Link to="/blog/new" className="fake-input-placeholder-btn">
              Share your thoughts...
            </Link>
          </div>

          {error && <div className="feed-error-status-alert">{error}</div>}

          {loading && posts.length === 0 && <LoadingSpinner className="py-12" />}

          {!loading && (!posts || posts.length === 0) && (
            <EmptyState
              icon={
                <svg style={{ width: '32px', height: '32px', color: '#8899a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              }
              title="Your feed is empty"
              description="Follow writers or explore trending posts to fill your feed."
              action={
                <Link to="/explore" className="cta-button-primary" style={{ fontSize: '13px', padding: '8px 20px' }}>
                  Explore posts
                </Link>
              }
            />
          )}

          {posts && posts.length > 0 && (
            <div className="feed-posts-stack-vertical">
              {posts.map((post) => (
                <FeedPostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {hasMore && <div ref={sentinelRef} className="feed-infinite-scroll-sentinel" />}

          {loading && posts.length > 0 && <LoadingSpinner className="py-8" />}

          {!hasMore && posts && posts.length > 0 && (
            <div className="feed-reached-end-caption">
              You&apos;ve reached the end of your feed
            </div>
          )}
        </main>

        {/* ─── Right Sidebar Section ─── */}
        <aside className="feed-sidebar-right">
          <div className="feed-sticky-wrapper">
            <SuggestedUsers users={suggested} loading={suggestedLoading} />
            <TrendingSidebar posts={trending} loading={trendingLoading} />

            <div className="feed-mini-footer-meta">
              <div className="footer-links-inline-row">
                <span>About</span>
                <span>Help</span>
                <span>Privacy</span>
                <span>Terms</span>
              </div>
              <p style={{ margin: '4px 0 0 0' }}>DevBlog &copy; 2026</p>
            </div>
          </div>
        </aside>
        
      </div>
    </div>
  );
};

export default FeedPage;