import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, toggleSavePost } from '../../features/blog/blogSlice.js';
import { toggleFollow } from '../../features/user/userSlice.js';
import { toggleRepost as toggleRepostApi } from '../../api/postApi.js';
import Avatar from '../ui/Avatar.jsx';
import CommentSection from '../blog/CommentSection.jsx';
import ShareModal from './ShareModal.jsx';
import '../../styles/globals.css';

const FeedPostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [saved, setSaved] = useState(post.isBookmarked || false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  // Local state for real-time counts
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount || 0);
  const [localCommentCount, setLocalCommentCount] = useState(post.commentCount || 0);
  const [localRepostCount, setLocalRepostCount] = useState(post.repostCount || 0);
  const [localIsLiked, setLocalIsLiked] = useState(post.isLiked || false);
  const [localIsReposted, setLocalIsReposted] = useState(post.isReposted || false);

  const {
    _id,
    slug,
    title,
    excerpt,
    content,
    coverImage,
    tags,
    readTime,
    viewCount,
    publishedAt,
    author,
  } = post;

  // Sync with post prop changes (e.g., after page refresh)
  useEffect(() => {
    setLocalLikeCount(post.likeCount || 0);
    setLocalCommentCount(post.commentCount || 0);
    setLocalRepostCount(post.repostCount || 0);
    setLocalIsLiked(post.isLiked || false);
    setLocalIsReposted(post.isReposted || false);
    setSaved(post.isBookmarked || false);
  }, [post.likeCount, post.commentCount, post.repostCount, post.isLiked, post.isReposted, post.isBookmarked]);

  const isAuthor = user?._id === author?._id;
  const cleanContent = excerpt || content?.replace(/<[^>]*>/g, '');
  const contentPreview = cleanContent?.slice(0, 200);
  const needsReadMore = cleanContent && cleanContent.length > 200;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    const newIsLiked = !localIsLiked;
    const newLikeCount = newIsLiked ? localLikeCount + 1 : localLikeCount - 1;

    setLocalIsLiked(newIsLiked);
    setLocalLikeCount(newLikeCount);

    // Dispatch to Redux (will update global state)
    dispatch(toggleLike(_id));
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    if (savingInProgress) return;

    setSavingInProgress(true);
    const newSavedState = !saved;
    setSaved(newSavedState);

    try {
      // Dispatch Redux action to update global state
      await dispatch(toggleSavePost(_id)).unwrap();
    } catch (error) {
      // Revert on error
      setSaved(!newSavedState);
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setSavingInProgress(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShare(true);
  };

  const handleRepost = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    const newIsReposted = !localIsReposted;
    const newRepostCount = newIsReposted ? localRepostCount + 1 : localRepostCount - 1;

    setLocalIsReposted(newIsReposted);
    setLocalRepostCount(newRepostCount);

    try {
      await toggleRepostApi(_id);
    } catch (error) {
      // Revert on error
      setLocalIsReposted(!newIsReposted);
      setLocalRepostCount(newIsReposted ? localRepostCount - 1 : localRepostCount + 1);
      console.error('Failed to toggle repost:', error);
    }
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleFollow(author._id));
  };

  const handleCommentAdded = () => {
    // Update local comment count when a new comment is added
    setLocalCommentCount(prev => prev + 1);
  };

  return (
    <>
      <article className="insta-post-card-master">
        
        {/* Author Header */}
        <div className="insta-post-header-row">
          <div className="insta-post-author-meta">
            <Avatar
              user={author}
              size="md"
              linkTo={`/profile/${author?.username}`}
            />
            <div className="insta-author-text-details">
              <div className="insta-author-primary-row">
                <Link to={`/profile/${author?.username}`} className="insta-author-profile-link">
                  {author?.name}
                </Link>
                {author?.headline && (
                  <span className="insta-author-headline-bullet desktop-only">
                    &middot; {author.headline}
                  </span>
                )}
              </div>
              <p className="insta-post-sub-timestamp">
                {publishedAt && (
                  <span>
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
                <span className="insta-meta-dot">&middot;</span>
                <span>{readTime} min read</span>
              </p>
            </div>
          </div>

          {/* Follow Interaction Hub */}
          {!isAuthor && user && (
            <button onClick={handleFollow} className={`insta-post-follow-action-btn ${author?.isFollowing ? 'is-following-active' : ''}`}>
              {author?.isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Post Text Context Block */}
        <Link to={`/blog/${slug}`} className="insta-post-content-anchor">
          <h2 className="insta-post-title-text">
            {title}
          </h2>
          {contentPreview && (
            <p className="insta-post-excerpt-paragraph">
              {contentPreview}{needsReadMore && '...'}
              {needsReadMore && (
                <span style={{ color: 'var(--insta-accent-blue)', fontWeight: '600', marginLeft: '6px' }}>
                  Read More
                </span>
              )}
            </p>
          )}
        </Link>

        {/* Premium Full-bleed Post Cover Media Image */}
        {coverImage?.url && (
          <div className="insta-post-media-frame">
            <Link to={`/blog/${slug}`}>
              <img src={coverImage.url} alt={title} className="insta-post-fluid-img" />
            </Link>
          </div>
        )}

        {/* Dynamic Hash Tags Pill Element */}
        {tags?.length > 0 && (
          <div className="insta-post-tags-shelf">
            {tags.slice(0, 4).map((tag) => (
              <Link
                key={tag}
                to={`/explore?tag=${tag}`}
                onClick={(e) => e.stopPropagation()}
                className="insta-hashtag-pill-link"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Metric Engagement Counter Statistics */}
        <div className="insta-post-metrics-banner">
          <div className="insta-metric-left-cluster">
            {localLikeCount > 0 && (
              <span className="insta-metric-badge-item">
                <svg className="heart-filled-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {localLikeCount} {localLikeCount === 1 ? 'like' : 'likes'}
              </span>
            )}
            {localRepostCount > 0 && (
              <span className="insta-metric-badge-item" style={{ marginLeft: '12px' }}>
                <svg style={{ width: '14px', height: '14px', color: 'var(--insta-accent-cyan)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {localRepostCount} {localRepostCount === 1 ? 'repost' : 'reposts'}
              </span>
            )}
          </div>
          <div className="insta-metric-right-cluster">
            {localCommentCount > 0 && (
              <button onClick={() => setShowComments(!showComments)} className="insta-metric-btn-link">
                {localCommentCount} comment{localCommentCount !== 1 ? 's' : ''}
              </button>
            )}
            {viewCount > 0 && <span className="insta-views-counter-span">{viewCount} views</span>}
          </div>
        </div>

        {/* Action Controls Interactive Dock */}
        <div className="insta-post-action-dock-footer">
          {/* Action: Like Button Toggle */}
          <button onClick={handleLike} className={`insta-dock-action-trigger ${localIsLiked ? 'liked-state-neon' : ''}`} aria-label={localIsLiked ? 'Unlike' : 'Like'}>
            <svg fill={localIsLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{localIsLiked ? 'Liked' : 'Like'}</span>
          </button>

          {/* Action: Comment Expand Button */}
          <button onClick={() => setShowComments(!showComments)} className="insta-dock-action-trigger" aria-label="Comment">
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment</span>
          </button>

          {/* Action: Repost Button */}
          <button onClick={handleRepost} className={`insta-dock-action-trigger ${localIsReposted ? 'reposted-state-neon' : ''}`} aria-label={localIsReposted ? 'Unrepost' : 'Repost'}>
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{localIsReposted ? 'Reposted' : 'Repost'}</span>
          </button>

          {/* Action: Share Modal Launcher */}
          <button onClick={handleShare} className="insta-dock-action-trigger" aria-label="Share">
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>

          {/* Action: Save Bookmark Trigger */}
          <button
            onClick={handleSave}
            className={`insta-dock-action-trigger ${saved ? 'saved-state-neon' : ''}`}
            disabled={savingInProgress}
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <svg fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Inside Comments Container Block */}
        {showComments && (
          <div className="insta-post-inner-comments-tray">
            <CommentSection postId={_id} onCommentAdded={handleCommentAdded} />
          </div>
        )}

      </article>

      {/* Share system overlay component wrapper */}
      {showShare && (
        <ShareModal
          url={`${window.location.origin}/blog/${slug}`}
          title={title}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
};

export default FeedPostCard;