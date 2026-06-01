import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchComments,
  createComment,
  deleteComment,
  toggleLikeComment,
  clearComments,
} from '../../features/comment/commentSlice.js';
import { updatePostCommentCount } from '../../features/feed/feedSlice.js';
import { updateBlogCommentCount } from '../../features/blog/blogSlice.js';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import Pagination from '../ui/Pagination.jsx';
import "../../styles/globals.css";

const CommentItem = ({ comment, currentUserId, onDelete, onLike }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const dispatch = useDispatch();
  const { sending } = useSelector((state) => state.comment);

  const isOwner = currentUserId === comment.author?._id;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await dispatch(
      createComment({
        postId: comment.post,
        data: { content: replyContent, parentComment: comment._id },
      })
    );
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <div className="comment-item">
      <Avatar user={comment.author} size="sm" linkTo={`/profile/${comment.author?.username}`} />
      <div className="comment-content-block">
        <div className="comment-header">
          <Link
            to={`/profile/${comment.author?.username}`}
            className="comment-author-name"
          >
            {comment.author?.name}
          </Link>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <p className="comment-text">{comment.content}</p>
        
        <div className="comment-actions">
          <button
            onClick={() => onLike(comment._id)}
            className={`action-btn btn-like ${comment.isLiked ? 'liked' : ''}`}
          >
            <svg style={{ width: '14px', height: '14px' }} fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {comment.likeCount > 0 && comment.likeCount}
          </button>
          
          {comment.depth < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="action-btn btn-reply"
            >
              Reply
            </button>
          )}
          
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="action-btn btn-delete"
            >
              Delete
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={handleReply} className="reply-form">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="comment-input"
            />
            <Button type="submit" loading={sending} style={{ width: 'auto', padding: '8px 12px', fontSize: 'var(--insta-font-size-xs)' }}>
              Reply
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ postId, onCommentAdded, onCommentDeleted }) => {
  const dispatch = useDispatch();
  const { comments, meta, loading, sending } = useSelector(
    (state) => state.comment
  );
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const page = meta.page;

  useEffect(() => {
    dispatch(fetchComments({ postId, page: 1, limit: 20 }));
    return () => dispatch(clearComments());
  }, [dispatch, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const result = await dispatch(createComment({ postId, data: { content } }));
    if (!result.error) {
      // Update post comment count in feed and blog slices
      dispatch(updatePostCommentCount({ postId, increment: 1 }));
      dispatch(updateBlogCommentCount({ postId, increment: 1 }));
      // Notify parent component
      if (onCommentAdded) onCommentAdded();
    }
    setContent('');
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      dispatch(deleteComment(commentId));
      // Update post comment count
      dispatch(updatePostCommentCount({ postId, increment: -1 }));
      dispatch(updateBlogCommentCount({ postId, increment: -1 }));
      // Notify parent component
      if (onCommentDeleted) onCommentDeleted();
    }
  };

  const handleLike = (commentId) => {
    dispatch(toggleLikeComment(commentId));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchComments({ postId, page: newPage, limit: 20 }));
  };

  return (
    <div className="comment-section-container">
      <h3 className="comment-section-title">
        Comments ({meta.total})
      </h3>

      {/* Comment form */}
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <Avatar user={user} size="sm" />
          <div className="comment-input-wrapper">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
            />
            <Button type="submit" loading={sending} style={{ width: 'auto', padding: '8px 16px', fontSize: 'var(--insta-font-size-sm)' }}>
              Post
            </Button>
          </div>
        </form>
      )}

      {/* Comments list */}
      {loading && (
        <div className="comment-spinner-container">
          <div className="insta-spinner"></div>
        </div>
      )}

      {!loading && comments.length === 0 && (
        <p className="no-comments-msg">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      {!loading && comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={handlePageChange} />
    </div>
  );
};

export default CommentSection;