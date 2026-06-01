import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  const {
    slug,
    title,
    excerpt,
    coverImage,
    tags,
    readTime,
    likeCount,
    commentCount,
    viewCount,
    publishedAt,
    author,
  } = post;

  return (
    <article className="insta-card insta-card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Cover image */}
      {coverImage?.url && (
        <Link to={`/blog/${slug}`} style={{ display: 'block', width: '100%', height: '240px', overflow: 'hidden' }}>
          <img
            src={coverImage.url}
            alt={title}
            className="insta-post-fluid-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Link>
      )}

      <div style={{ padding: '20px' }}>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {author?.avatar?.url ? (
            <img
              src={author.avatar.url}
              alt={author.name}
              className="insta-avatar insta-avatar-sm"
            />
          ) : (
            <div
              className="insta-avatar insta-avatar-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--insta-bg-tertiary)',
                borderColor: 'var(--insta-border-tertiary)'
              }}
            >
              <span className="insta-text-primary" style={{ fontWeight: 600, fontSize: '12px' }}>
                {author?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <Link
              to={`/profile/${author?.username}`}
              className="insta-author-profile-link"
              style={{ fontSize: '14px' }}
            >
              {author?.name}
            </Link>
            <p className="insta-text-secondary" style={{ fontSize: '12px', margin: '2px 0 0 0' }}>
              {publishedAt
                ? new Date(publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Draft'}
            </p>
          </div>
        </div>

        {/* Title */}
        <Link to={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
          <h2 className="insta-post-title-text" style={{ fontSize: '18px', marginBottom: '8px' }}>
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="insta-text-secondary" style={{ fontSize: '14px', marginBottom: '16px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {excerpt}
        </p>

        {/* Tags */}
        {tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="insta-badge insta-badge-primary"
                style={{ textDecoration: 'none' }}
              >
                {tag}
              </Link>
            ))}
            {tags.length > 3 && (
              <span className="insta-badge">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--insta-text-secondary)', paddingTop: '12px', borderTop: '1px solid var(--insta-border-secondary)' }}>
          <span>{readTime} min read</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {commentCount}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {viewCount}
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
