import client from './client.js';

/**
 * Toggle bookmark on a post.
 */
export const toggleBookmark = async (postId, data = {}) => {
  const response = await client.post(`/bookmarks/${postId}`, data);
  return response.data.data;
};

/**
 * Get current user's bookmarks.
 */
export const getBookmarks = async (params = {}) => {
  const response = await client.get('/bookmarks', { params });
  return {
    bookmarks: response.data.data,
    meta: response.data.meta,
  };
};
