import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} from './notificationSlice.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import NotificationItem from '../../components/ui/NotificationItem.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';

const NotificationsPage = () => {
  useDocumentTitle('Notifications');
  const dispatch = useDispatch();
  const { notifications, meta, unreadCount, loading, error } = useSelector(
    (state) => state.notification
  );
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    const params = { page: 1, limit: 20 };
    if (filter === 'unread') params.unread = true;
    dispatch(fetchNotifications(params));
    return () => dispatch(clearNotifications());
  }, [dispatch, filter]);

  const handleMarkRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handlePageChange = (newPage) => {
    const params = { page: newPage, limit: 20 };
    if (filter === 'unread') params.unread = true;
    dispatch(fetchNotifications(params));
  };

  return (
    <div className="notifications-page-container">
      <div className="notifications-header">
        <div className="notifications-header-content">
          <h1>Notifications</h1>
          <p className="notifications-header-subtitle">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : '🎉 All caught up! You\'re up to date'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="notifications-mark-all-btn"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark all as read
          </button>
        )}
      </div>

      {/* Modern Filter tabs */}
      <div className="notifications-tabs">
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`notifications-tab ${filter === f ? 'active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="insta-error-banner-dark" style={{ marginBottom: '24px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && <LoadingSpinner className="py-12" />}

      {!loading && notifications.length === 0 && (
        <EmptyState
          icon={
            <svg style={{ width: '48px', height: '48px', color: 'var(--insta-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
          title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          description={
            filter === 'unread'
              ? 'You\'re all caught up! 🎉'
              : 'When someone interacts with your content, you\'ll see it here.'
          }
        />
      )}

      {!loading && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item-wrapper ${!notification.read ? 'unread' : ''}`}
            >
              <NotificationItem
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            </div>
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={handlePageChange} />
    </div>
  );
};

export default NotificationsPage;
