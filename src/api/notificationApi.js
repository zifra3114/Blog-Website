import client from './client.js';

/**
 * Get notifications.
 */
export const getNotifications = async (params = {}) => {
  const response = await client.get('/notifications', { params });
  return {
    notifications: response.data.data,
    meta: response.data.meta,
  };
};

/**
 * Get unread notification count.
 */
export const getUnreadCount = async () => {
  const response = await client.get('/notifications/unread-count');
  return response.data.data;
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (id) => {
  const response = await client.patch(`/notifications/${id}/read`);
  return response.data.data;
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = async () => {
  const response = await client.patch('/notifications/read-all');
  return response.data;
};
