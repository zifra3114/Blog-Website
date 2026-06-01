import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchAll, setQuery, clearResults } from './searchSlice.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import BlogCard from '../../components/ui/BlogCard.jsx';
import UserCard from '../../components/ui/UserCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import "../../styles/globals.css"; // Global css asset connect kiya

const SearchPage = () => {
  useDocumentTitle('Search');
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { results, loading, error, query } = useSelector(
    (state) => state.search
  );

  const currentUrlQuery = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(currentUrlQuery);
  const debouncedQuery = useDebounce(localQuery, 500);

  // 1. Sync URL changes to Local input safely
  useEffect(() => {
    setLocalQuery(currentUrlQuery);
    if (currentUrlQuery) {
      dispatch(setQuery(currentUrlQuery));
      dispatch(searchAll({ query: currentUrlQuery, page: 1, limit: 20 }));
    }
    
    return () => {
      dispatch(clearResults());
    };
  }, [currentUrlQuery, dispatch]);

  // 2. Trigger Search only when user stops typing
  useEffect(() => {
    if (debouncedQuery && debouncedQuery !== currentUrlQuery) {
      setSearchParams({ q: debouncedQuery });
    }
  }, [debouncedQuery, currentUrlQuery, setSearchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = localQuery.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    }
  };

  return (
    <div className="search-page-wrapper">
      <h1 className="search-page-title">Search</h1>

      {/* Search Input Box Form */}
      <form onSubmit={handleSubmit} className="page-search-form">
        <div className="page-search-box">
          <div className="page-input-container">
            <svg
              className="page-search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search posts and people..."
              className="page-input-field"
              autoFocus
            />
          </div>
          <button type="submit" className="page-search-submit-btn">
            Search
          </button>
        </div>
      </form>

      {/* Error handling component state */}
      {error && (
        <div className="search-error-banner">
          {error}
        </div>
      )}

      {/* Loader UI */}
      {loading && <LoadingSpinner className="py-12" />}

      {/* Empty State Default */}
      {!loading && !results && !query && (
        <EmptyState
          icon={
            <svg style={{ width: '32px', height: '32px', color: 'var(--insta-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          title="Search for posts and people"
          description="Type a query above to get started."
        />
      )}

      {/* Search Results Processing Layout */}
      {!loading && results && (
        <div className="results-container">
          
          {/* Section: People */}
          {results.users?.items?.length > 0 && (
            <section>
              <h2 className="section-heading">
                People ({results.users.total})
              </h2>
              <div className="users-results-list">
                {results.users.items.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            </section>
          )}

          {/* Section: Posts */}
          {results.posts?.items?.length > 0 && (
            <section>
              <h2 className="section-heading">
                Posts ({results.posts.total})
              </h2>
              <div className="posts-results-grid">
                {results.posts.items.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Fallback Condition: Not found matching terms */}
          {results.users?.items?.length === 0 &&
            results.posts?.items?.length === 0 && (
              <EmptyState
                title="No results found"
                description={`No posts or people match "${query}". Try a different search term.`}
              />
            )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;