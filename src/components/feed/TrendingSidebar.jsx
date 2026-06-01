import { Link } from 'react-router-dom';
import "../../styles/globals.css";
const TrendingSidebar = ({ posts = [], loading = false }) => {
  if (loading) {
    return (
      <div className="trending-sidebar-card" style={{ padding: '16px' }}>
        <div className="skeleton-pulse" style={{ height: '16px', width: '96px', marginBottom: '16px' }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ padding: '12px 0' }}>
            <div className="skeleton-pulse" style={{ height: '14px', width: '100%', marginBottom: '6px' }} />
            <div className="skeleton-pulse" style={{ height: '10px', width: '80px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="trending-sidebar-card">
      <div className="trending-header">
        <h3 className="trending-title">Trending</h3>
        <svg style={{ width: '16px', height: '16px', color: '#0095F6' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
      
      <div className="trending-list">
        {posts.slice(0, 5).map((post, index) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="trending-item-link"
          >
            <div className="trending-item-content">
              <span className="trending-rank">
                {index + 1}
              </span>
              
              <div className="trending-details">
                <p className="trending-post-title">
                  {post.title}
                </p>
                <div className="trending-meta">
                  <span>{post.author?.name}</span>
                  <span>&middot;</span>
                  <span className="trending-stat-icon">
                    <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likeCount}
                  </span>
                  <span className="trending-stat-icon">
                    <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.viewCount}
                  </span>
                </div>
              </div>
              
              {post.coverImage?.url && (
                <img
                  src={post.coverImage.url}
                  alt=""
                  className="trending-cover-img"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
      
      <Link
        to="/explore?sort=trending"
        className="trending-see-all"
      >
        See all trending
      </Link>
    </div>
  );
};

export default TrendingSidebar;