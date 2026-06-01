import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, clearListError } from './blogSlice.js';
import BlogCard from '../../components/ui/BlogCard.jsx';
import Pagination from '../../components/ui/Pagination.jsx';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' },
];

const BlogListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, meta, listLoading, listError } = useSelector(
    (state) => state.blog
  );

  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [tag, setTag] = useState(searchParams.get('tag') || '');

  const page = parseInt(searchParams.get('page')) || 1;

  const loadPosts = useCallback(() => {
    const params = {
      page,
      limit: 20,
      sort,
      status: 'published',
    };
    if (tag) params.tag = tag;
    dispatch(fetchPosts(params));
  }, [dispatch, page, sort, tag]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    return () => dispatch(clearListError());
  }, [dispatch]);

  const handleSort = (newSort) => {
    setSort(newSort);
    setSearchParams((prev) => {
      prev.set('sort', newSort);
      prev.delete('page');
      return prev;
    });
  };

  const handleTagClear = () => {
    setTag('');
    setSearchParams((prev) => {
      prev.delete('tag');
      prev.delete('page');
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set('page', newPage);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="insta-app-content-surface" style={{ maxWidth: '935px' }}>
      {/* Header */}
      <div className="insta-header-section" style={{ marginBottom: '32px' }}>
        <h1 className="insta-visual-title" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'left' }}>Blog</h1>
        <p className="insta-text-secondary">
          Discover stories, thinking, and expertise from writers.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--insta-bg-secondary)', borderRadius: '8px', padding: '4px' }}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className="insta-btn"
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                borderRadius: '6px',
                backgroundColor: sort === opt.value ? 'var(--insta-bg-tertiary)' : 'transparent',
                color: sort === opt.value ? 'var(--insta-text-primary)' : 'var(--insta-text-secondary)',
                border: 'none',
                minWidth: 'auto'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Active tag filter */}
        {tag && (
          <div className="insta-badge insta-badge-primary" style={{ padding: '6px 12px', gap: '8px', fontSize: '13px' }}>
            <span>Tag: {tag}</span>
            <button
              onClick={handleTagClear}
              className="insta-text-secondary"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
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

      {/* Posts */}
      {!listLoading && posts.length > 0 && (
        <>
          <div style={{ display: 'grid', gap: '24px' }}>
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <div style={{ marginTop: '32px' }}>
            <Pagination meta={meta} onPageChange={handlePageChange} />
          </div>
        </>
      )}

      {/* Empty state */}
      {!listLoading && posts.length === 0 && (
        <div className="insta-empty-state">
          <div className="insta-empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="insta-empty-title">
            No posts found
          </h3>
          <p className="insta-empty-description">
            {tag
              ? `No posts tagged "${tag}". Try a different tag.`
              : 'Be the first to publish a story.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
