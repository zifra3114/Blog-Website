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
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPersonalizedFeed({}));
      dispatch(fetchTrendingFeed({ limit: 5 }));
      dispatch(fetchSuggestedUsers(5));
    }
    return () => {
      dispatch(clearFeed());
    };
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewPost = (data) => {
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

  if (!isAuthenticated) {
    return (
      <div className="logged-out-wrapper" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="logged-out-hero-panel">
          <div className="logged-out-hero-inner">
            <h1 className="logged-out-main-headline">Stay curious.</h1>
            <p className="logged-out-sub-description">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            <div className="logged-out-cta-actions-group">
              <Link to="/register" className="cta-button-primary">Start writing</Link>
              <Link to="/explore" className="cta-button-secondary">Explore</Link>
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

  return (
    <div className="feed-page-container">
      <div className="feed-layout-grid">

        {/* --- Left Sidebar (Fixed LinkedIn Size) --- */}
        <aside className="feed-sidebar-left">
          <div className="feed-sticky-wrapper">

            <div className="insta-sidebar-card">
              <div
                className="user-card-cover-wrapper"
                style={{
                  backgroundImage: user?.coverImage?.url ? `url(${user.coverImage.url})` : 'none'
                }}
              />
              <div className="user-card-body">
                <div className="user-card-avatar-pos">
                  <Avatar user={user} size="md" linkTo={`/profile/${user?.username}`} />
                </div>
                <Link to={`/profile/${user?.username}`} className="user-sidebar-name-link">
                  {user?.name}
                </Link>
                {user?.headline && (
                  <p className="user-sidebar-headline">{user.headline}</p>
                )}
              </div>
            </div>

            <div className="insta-sidebar-card">
              <div className="quick-nav-list">
                <Link to="/my/stories" className="quick-link-item">
                  <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>My Stories</span>
                </Link>

                <Link to="/saved" className="quick-link-item">
                  <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  <span>Saved Posts</span>
                </Link>

                <Link to="/notifications" className="quick-link-item">
                  <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  <span>Notifications</span>
                </Link>

                <Link to="/blog/new" className="quick-link-item" style={{ color: '#38bdf8' }}>
                  <svg className="quick-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Write a story</span>
                </Link>
              </div>
            </div>

          </div>
        </aside>

        {/* --- Center Main Feed (Fixed 560px Width) --- */}
        <main className="feed-main-content">
          <div className="insta-create-box">
            <Avatar user={user} size="sm" />
            <Link to="/blog/new" className="insta-create-input-btn">
              Start a post, {user?.name?.split(' ')[0]}...
            </Link>
          </div>

          {error && <div className="feed-error-status-alert">{error}</div>}
          {loading && posts.length === 0 && <LoadingSpinner className="py-12" />}

          {!loading && (!posts || posts.length === 0) && (
            <EmptyState
              title="Your feed is empty"
              description="Follow creators to fill your feed with stories."
              action={
                <Link to="/explore" className="cta-button-primary" style={{ fontSize: '13px', padding: '8px 20px' }}>
                  Explore Posts
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
              You've caught up on all posts
            </div>
          )}
        </main>

        {/* --- Right Sidebar (Fixed 315px Width) --- */}
        <aside className="feed-sidebar-right">
          <div className="feed-sticky-wrapper">
            <div className="insta-sidebar-card" style={{ padding: '16px' }}>
              <SuggestedUsers users={suggested} loading={suggestedLoading} />
            </div>

            <div className="insta-sidebar-card" style={{ padding: '16px' }}>
              <TrendingSidebar posts={trending} loading={trendingLoading} />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default FeedPage;
