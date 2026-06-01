import client from './client.js';

/**
 * Create a new post.
 */
export const createPost = async (data) => {
  const response = await client.post('/posts', data);
  return response.data.data;
};

/**
 * Update a post.
 */
export const updatePost = async (id, data) => {
  const response = await client.patch(`/posts/${id}`, data);
  return response.data.data;
};

/**
 * Delete a post.
 */
export const deletePost = async (id) => {
  const response = await client.delete(`/posts/${id}`);
  return response.data;
};

/**
 * Get a single post by slug.
 */
export const getPostBySlug = async (slug) => {
  const response = await client.get(`/posts/${slug}`);
  return response.data.data;
};

/**
 * List posts with filtering, sorting, and pagination.
 */
export const listPosts = async (params = {}) => {
  const response = await client.get('/posts', { params });
  return {
    posts: response.data.data,
    meta: response.data.meta,
  };
};

/**
 * Search posts by text query.
 */
export const searchPosts = async (query, page = 1, limit = 20) => {
  const response = await client.get('/posts/search', {
    params: { q: query, page, limit },
  });
  return {
    posts: response.data.data,
    meta: response.data.meta,
  };
};

/**
 * Get posts by a specific user.
 */
export const getPostsByUser = async (username, page = 1, limit = 20) => {
  const response = await client.get(`/posts/user/${username}`, {
    params: { page, limit },
  });
  return {
    posts: response.data.data,
    meta: response.data.meta,
  };
};

/**
 * Toggle like on a post.
 */
export const toggleLike = async (id) => {
  const response = await client.post(`/posts/${id}/like`);
  return response.data.data;
};

/**
 * Toggle repost on a post.
 */
export const toggleRepost = async (id) => {
  const response = await client.post(`/posts/${id}/repost`);
  return response.data.data;
};

/**
 * Get saved/bookmarked posts.
 */
export const getSavedPosts = async (page = 1, limit = 20) => {
  const response = await client.get('/bookmarks', {
    params: { page, limit },
  });
  return {
    posts: response.data.data,
    meta: response.data.meta,
  };
};

/**
 * Toggle save/bookmark on a post.
 */
export const toggleSave = async (postId) => {
  const response = await client.post(`/bookmarks/${postId}`);
  return response.data.data;
};
