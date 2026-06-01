import client from './client.js';

/**
 * Unified search across posts and users.
 */
export const searchAll = async (query, page = 1, limit = 20) => {
  const response = await client.get('/search', {
    params: { q: query, page, limit },
  });
  return response.data.data;
};
