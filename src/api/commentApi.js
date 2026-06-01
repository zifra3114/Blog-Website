import client from './client.js';

/**
 * Get comments for a post.
 */
export const getComments = async (postId, page = 1, limit = 20) => {
  const response = await client.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  });
  return { comments: response.data.data, meta: response.data.meta };
};

/**
 * Create a comment on a post.
 */
export const createComment = async (postId, data) => {
  const response = await client.post(`/posts/${postId}/comments`, data);
  return response.data.data;
};

/**
 * Get replies to a comment.
 */
export const getReplies = async (commentId, page = 1, limit = 20) => {
  const response = await client.get(`/comments/${commentId}/replies`, {
    params: { page, limit },
  });
  return { comments: response.data.data, meta: response.data.meta };
};

/**
 * Update a comment.
 */
export const updateComment = async (commentId, data) => {
  const response = await client.patch(`/comments/${commentId}`, data);
  return response.data.data;
};

/**
 * Delete a comment.
 */
export const deleteComment = async (commentId) => {
  const response = await client.delete(`/comments/${commentId}`);
  return response.data;
};

/**
 * Toggle like on a comment.
 */
export const toggleLikeComment = async (commentId) => {
  const response = await client.post(`/comments/${commentId}/like`);
  return response.data.data;
};
