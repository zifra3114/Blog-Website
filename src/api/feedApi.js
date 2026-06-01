import client from './client.js';

/**
 * Get personalized feed (cursor-based pagination).
 */
export const getPersonalizedFeed = async (cursor = null, limit = 20) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  const response = await client.get('/feed', { params });
  return response.data.data;
};

/**
 * Get trending feed.
 */
export const getTrendingFeed = async (page = 1, limit = 20) => {
  const response = await client.get('/feed/trending', {
    params: { page, limit },
  });
  return { posts: response.data.data, meta: response.data.meta };
};
