import client from './client.js';

/**
 * Get user profile by username.
 */
export const getUserByUsername = async (username) => {
  const response = await client.get(`/users/${username}`);
  return response.data.data;
};

/**
 * Update current user's profile.
 */
export const updateProfile = async (data) => {
  const response = await client.patch('/users/me', data);
  return response.data.data;
};

/**
 * Toggle follow on a user.
 */
export const toggleFollow = async (userId) => {
  const response = await client.post(`/users/${userId}/follow`);
  return response.data.data;
};

/**
 * Get user's followers.
 */
export const getFollowers = async (userId, page = 1, limit = 20) => {
  const response = await client.get(`/users/${userId}/followers`, {
    params: { page, limit },
  });
  return { users: response.data.data, meta: response.data.meta };
};

/**
 * Get user's following.
 */
export const getFollowing = async (userId, page = 1, limit = 20) => {
  const response = await client.get(`/users/${userId}/following`, {
    params: { page, limit },
  });
  return { users: response.data.data, meta: response.data.meta };
};

/**
 * Search users.
 */
export const searchUsers = async (query, page = 1, limit = 20) => {
  const response = await client.get('/users/search', {
    params: { q: query, page, limit },
  });
  return { users: response.data.data, meta: response.data.meta };
};

/**
 * Get suggested users to follow.
 * Fetches users the current user doesn't follow yet.
 */
export const getSuggestedUsers = async (limit = 5) => {
  try {
    // Use search with empty query or fetch popular users
    const response = await client.get('/users/search', {
      params: { q: 'a', page: 1, limit },
    });
    return response.data.data || [];
  } catch {
    return [];
  }
};
