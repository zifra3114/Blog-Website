import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

const TOAST_DURATION = 5000;

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

const NotificationToast = () => {
  const { notifications } = useSelector((state) => state.notification);
  const [toasts, setToasts] = useState([]);
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    if (notifications.length > lastCount && lastCount > 0) {
      const newNotification = notifications[0];
      if (newNotification && !newNotification.isRead) {
        const toastId = Date.now();
        setToasts((prev) => [...prev, { id: toastId, notification: newNotification }]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, TOAST_DURATION);
      }
    }
    setLastCount(notifications.length);
  }, [notifications.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '16px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(({ id, notification }) => {
        const link = notification.post?.slug
          ? `/blog/${notification.post.slug}`
          : `/profile/${notification.sender?.username}`;

        return (
          <Link
            key={id}
            to={link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '320px',
              padding: '12px',
              backgroundColor: 'var(--insta-bg-secondary)',
              borderRadius: 'var(--insta-radius-lg)',
              boxShadow: 'var(--insta-shadow-lg)',
              border: '1px solid var(--insta-border-secondary)',
              pointerEvents: 'auto',
              textDecoration: 'none',
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar user={notification.sender} size="sm" />
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
                {typeIcons[notification.type] || typeIcons.like}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="insta-text-primary"
                style={{
                  fontSize: 'var(--insta-font-size-sm)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: 0,
                }}
              >
                <span style={{ fontWeight: 'var(--insta-font-weight-medium)' }}>
                  {notification.sender?.name}
                </span>{' '}
                {notification.message ||
                  (notification.type === 'follow'
                    ? 'started following you'
                    : notification.type === 'new_post'
                    ? 'published a new post'
                    : notification.type === 'like'
                    ? 'liked your post'
                    : notification.type === 'comment'
                    ? 'commented on your post'
                    : 'replied to your comment')}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setToasts((prev) => prev.filter((t) => t.id !== id));
              }}
              className="insta-text-tertiary"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--insta-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--insta-text-tertiary)'}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default NotificationToast;
