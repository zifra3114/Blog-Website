import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.js';
import * as searchApi from '../../api/searchApi.js';
import "../../styles/globals.css";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useOnClickOutside(ref, () => setFocused(false));

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults({ users: [], posts: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchApi.searchAll(query.trim(), 1, 5);
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
      setQuery('');
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    setFocused(false);
    setQuery('');
  };

  const handlePostClick = (slug) => {
    navigate(`/blog/${slug}`);
    setFocused(false);
    setQuery('');
  };

  const showDropdown = focused && query.trim().length >= 2;

  return (
    <form ref={ref} onSubmit={handleSubmit} className="search-form" style={{ position: 'relative' }}>
      <div className={`search-container ${focused ? 'focused' : ''}`}>

        {/* Search Icon */}
        <svg
          className="search-icon-svg"
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

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search posts and people..."
          className="search-input-field"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="search-clear-btn"
          >
            <svg className="clear-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div className="search-dropdown">
          {loading && (
            <div className="search-dropdown-loading">
              <div className="insta-spinner insta-spinner-sm"></div>
              <span>Searching...</span>
            </div>
          )}

          {!loading && results.users.length === 0 && results.posts.length === 0 && (
            <div className="search-dropdown-empty">
              No results found for "{query}"
            </div>
          )}

          {!loading && results.users.length > 0 && (
            <div className="search-dropdown-section">
              <div className="search-dropdown-header">People</div>
              {results.users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleUserClick(user.username)}
                  className="search-dropdown-item"
                >
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="search-item-avatar" />
                  ) : (
                    <div className="search-item-avatar-placeholder">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="search-item-content">
                    <div className="search-item-name">{user.name}</div>
                    <div className="search-item-meta">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && results.posts.length > 0 && (
            <div className="search-dropdown-section">
              <div className="search-dropdown-header">Posts</div>
              {results.posts.map((post) => (
                <button
                  key={post._id}
                  type="button"
                  onClick={() => handlePostClick(post.slug)}
                  className="search-dropdown-item"
                >
                  <svg className="search-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="search-item-content">
                    <div className="search-item-name">{post.title}</div>
                    <div className="search-item-meta">by {post.author?.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && (results.users.length > 0 || results.posts.length > 0) && (
            <button
              type="submit"
              className="search-dropdown-footer"
            >
              See all results for "{query}"
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;