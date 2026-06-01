import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostBySlug, clearCurrentPost, toggleLike, deletePost } from './blogSlice.js';
import CommentSection from '../../components/blog/CommentSection.jsx';
import BlogContent from '../../components/blog/BlogContent.jsx';
import Avatar from '../../components/ui/Avatar.jsx';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost: post, detailLoading, detailError, mutationLoading } = useSelector(
    (state) => state.blog
  );
  const { user } = useSelector((state) => state.auth);

  // Local state for real-time counts
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [localCommentCount, setLocalCommentCount] = useState(0);
  const [localIsLiked, setLocalIsLiked] = useState(false);

  useEffect(() => {
    dispatch(fetchPostBySlug(slug));
    return () => dispatch(clearCurrentPost());
  }, [dispatch, slug]);

  // Sync local state with post data
  useEffect(() => {
    if (post) {
      setLocalLikeCount(post.likeCount || 0);
      setLocalCommentCount(post.commentCount || 0);
      setLocalIsLiked(post.isLiked || false);
    }
  }, [post]);

  const isAuthor = user && post?.author?._id === user._id;

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    const newIsLiked = !localIsLiked;
    const newLikeCount = newIsLiked ? localLikeCount + 1 : localLikeCount - 1;

    setLocalIsLiked(newIsLiked);
    setLocalLikeCount(newLikeCount);

    dispatch(toggleLike(post._id));
  };

  const handleCommentAdded = () => {
    setLocalCommentCount(prev => prev + 1);
  };

  const handleCommentDeleted = () => {
    setLocalCommentCount(prev => Math.max(0, prev - 1));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const result = await dispatch(deletePost(post._id));
    if (!result.error) {
      navigate('/');
    }
  };

  if (detailLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div className="insta-spinner insta-spinner-lg"></div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="insta-app-content-surface" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 className="insta-visual-title" style={{ fontSize: '24px', marginBottom: '12px' }}>
          Post not found
        </h1>
        <p className="insta-text-secondary" style={{ marginBottom: '24px' }}>{detailError}</p>
        <Link to="/" className="insta-btn insta-btn-primary">
          Back to feed
        </Link>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Cover image */}
      {post.coverImage?.url && (
        <div style={{
          width: '100%',
          height: '400px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '32px',
          boxShadow: 'var(--insta-shadow-sm)'
        }}>
          <img
            src={post.coverImage.url}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Title */}
      <h1 style={{
        fontSize: '42px',
        fontWeight: '700',
        color: 'var(--insta-text-primary)',
        marginBottom: '24px',
        lineHeight: '1.2',
        letterSpacing: '-0.5px'
      }}>
        {post.title}
      </h1>

      {/* Author Meta Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '24px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--insta-border-secondary)'
      }}>
        <Link
          to={`/profile/${post.author?.username}`}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
        >
          <Avatar user={post.author} size="lg" />
          <div>
            <p style={{
              fontWeight: '600',
              fontSize: '16px',
              color: 'var(--insta-text-primary)',
              marginBottom: '4px'
            }}>
              {post.author?.name}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--insta-text-secondary)', margin: 0 }}>
              {post.readTime} min read &middot;{' '}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Draft'}
            </p>
          </div>
        </Link>

        {/* Author actions */}
        {isAuthor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to={`/blog/${post.slug}/edit`}
              className="insta-btn insta-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={mutationLoading}
              className="insta-btn insta-btn-danger"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/?tag=${tag}`}
              className="insta-badge"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <BlogContent content={post.content} />

      {/* Actions bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '24px 0',
        marginTop: '32px',
        borderTop: '1px solid var(--insta-border-secondary)',
        borderBottom: '1px solid var(--insta-border-secondary)'
      }}>
        <button
          onClick={handleLike}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            color: localIsLiked ? 'var(--insta-accent-red)' : 'var(--insta-text-secondary)',
            transition: 'color 0.2s'
          }}
        >
          <svg
            style={{ width: '24px', height: '24px' }}
            fill={localIsLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{localLikeCount}</span>
        </button>

        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--insta-text-secondary)', fontSize: '15px' }}>
          <svg style={{ width: '22px', height: '22px' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{post.viewCount} views</span>
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--insta-text-secondary)', fontSize: '15px' }}>
          <svg style={{ width: '22px', height: '22px' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{localCommentCount} comments</span>
        </span>
      </div>

      {/* Comments */}
      <CommentSection
        postId={post._id}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />
    </article>
  );
};

export default BlogDetailPage;
