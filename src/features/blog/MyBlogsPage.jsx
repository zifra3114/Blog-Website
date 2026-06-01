import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, deletePost, clearListError } from './blogSlice.js';
import Pagination from '../../components/ui/Pagination.jsx';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

const MyBlogsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, meta, listLoading, listError, mutationLoading } = useSelector(
    (state) => state.blog
  );
  const { user } = useSelector((state) => state.auth);

  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (!user) return;

    const params = {
      page,
      limit: 20,
      author: user._id,
      sort: 'newest',
    };

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    dispatch(fetchPosts(params));
  }, [dispatch, user, page, statusFilter]);

  useEffect(() => {
    return () => dispatch(clearListError());
  }, [dispatch]);

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setSearchParams((prev) => {
      if (status === 'all') {
        prev.delete('status');
      } else {
        prev.set('status', status);
      }
      prev.delete('page');
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set('page', newPage);
      return prev;
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await dispatch(deletePost(id));
  };

  return (
    <div className="insta-app-content-surface" style={{ maxWidth: '935px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="insta-visual-title" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'left' }}>My Stories</h1>
          <p className="insta-text-secondary">Manage your published and draft posts.</p>
        </div>
        <Link
          to="/blog/new"
          className="insta-nav-accent-solid-btn"
          style={{ padding: '10px 20px' }}
        >
          Write a story
        </Link>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--insta-bg-secondary)', borderRadius: '8px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            className="insta-btn"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '6px',
              backgroundColor: statusFilter === tab.value ? 'var(--insta-bg-tertiary)' : 'transparent',
              color: statusFilter === tab.value ? 'var(--insta-text-primary)' : 'var(--insta-text-secondary)',
              border: 'none',
              minWidth: 'auto'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {listError && (
        <div className="insta-error-banner-dark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{listError}</span>
        </div>
      )}

      {/* Loading */}
      {listLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div className="insta-spinner insta-spinner-lg"></div>
        </div>
      )}

      {/* Posts list */}
      {!listLoading && posts.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map((post) => (
              <div
                key={post._id}
                className="insta-card"
                style={{ padding: '20px', transition: 'background-color 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                  {/* Cover thumbnail */}
                  {post.coverImage?.url && (
                    <img
                      src={post.coverImage.url}
                      alt=""
                      style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span
                        className={`insta-badge ${post.status === 'published' ? 'insta-badge-success' : 'insta-badge-primary'}`}
                        style={{ fontSize: '11px', textTransform: 'capitalize' }}
                      >
                        {post.status}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--insta-text-tertiary)' }}>
                        {new Date(post.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="insta-author-profile-link"
                      style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}
                    >
                      {post.title}
                    </Link>

                    <p className="insta-text-secondary" style={{ fontSize: '14px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--insta-text-tertiary)' }}>
                      <span>{post.readTime} min read</span>
                      <span>{post.likeCount} likes</span>
                      <span>{post.commentCount} comments</span>
                      <span>{post.viewCount} views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <Link
                      to={`/blog/${post.slug}/edit`}
                      className="insta-btn insta-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '13px', minWidth: 'auto' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={mutationLoading}
                      className="insta-btn insta-btn-danger"
                      style={{ padding: '6px 12px', fontSize: '13px', minWidth: 'auto', opacity: mutationLoading ? 0.5 : 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </>
      )}

      {/* Empty state */}
      {!listLoading && posts.length === 0 && (
        <div className="insta-empty-state">
          <div className="insta-empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="insta-empty-title">
            No stories yet
          </h3>
          <p className="insta-empty-description">
            Start writing and share your ideas with the world.
          </p>
          <Link
            to="/blog/new"
            className="insta-nav-accent-solid-btn"
            style={{ padding: '10px 20px', textDecoration: 'none' }}
          >
            Write your first story
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
