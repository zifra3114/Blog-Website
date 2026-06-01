import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

const typeIcons = {
  like: (
    <svg style={{ width: '16px', height: '16px', color: 'var(--insta-accent-red)' }} fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  comment: (
    <svg style={{ width: '16px', height: '16px', color: 'var(--insta-accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  follow: (
    <svg style={{ width: '16px', height: '16px', color: 'var(--insta-accent-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  reply: (
    <svg style={{ width: '16px', height: '16px', color: '#a855f7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  new_post: (
    <svg style={{ width: '16px', height: '16px', color: '#f97316' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const { _id, sender, type, message, post, isRead, createdAt } = notification;

  const link =
    post?.slug
      ? `/blog/${post.slug}`
      : sender?.username
      ? `/profile/${sender.username}`
      : '#';

  return (
    <Link
      to={link}
      onClick={() => !isRead && onMarkRead?.(_id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        transition: 'var(--insta-transition-fast)',
        backgroundColor: isRead ? 'transparent' : 'rgba(0, 149, 246, 0.05)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? 'var(--insta-bg-secondary)' : 'rgba(0, 149, 246, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isRead ? 'transparent' : 'rgba(0, 149, 246, 0.05)';
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar user={sender} size="sm" />
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            backgroundColor: 'var(--insta-bg-primary)',
            borderRadius: '50%',
            padding: '2px',
          }}
        >
          {typeIcons[type] || typeIcons.like}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 'var(--insta-font-size-sm)',
            fontWeight: isRead ? 400 : 500,
            color: isRead ? 'var(--insta-text-secondary)' : 'var(--insta-text-primary)',
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <p
          className="insta-text-tertiary"
          style={{ fontSize: 'var(--insta-font-size-xs)', marginTop: '4px' }}
        >
          {new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      {!isRead && (
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--insta-accent-blue)',
            borderRadius: '50%',
            flexShrink: 0,
            marginTop: '8px',
          }}
        />
      )}
    </Link>
  );
};

export default NotificationItem;
