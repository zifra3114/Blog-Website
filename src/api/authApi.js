import client from './client.js';

/**
 * Register a new user.
 */
export const register = async (data) => {
  const response = await client.post('/auth/register', data);
  return response.data.data;
};

/**
 * Login with email + password.
 */
export const login = async (data) => {
  const response = await client.post('/auth/login', data);
  return response.data.data;
};

/**
 * Logout current session.
 */
export const logout = async () => {
  const response = await client.post('/auth/logout');
  return response.data;
};

/**
 * Refresh access token using refresh token cookie.
 */
export const refresh = async () => {
  const response = await client.post('/auth/refresh');
  return response.data.data;
};

/**
 * Get current user (for session restoration).
 */
export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data.data;
};

/**
 * Request password reset email.
 */
export const forgotPassword = async (email) => {
  const response = await client.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password with token.
 */
export const resetPassword = async (token, password) => {
  const response = await client.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};

/**
 * Verify email with token.
 */
export const verifyEmail = async (token) => {
  const response = await client.post(`/auth/verify-email/${token}`);
  return response.data;
};

/**
 * Resend verification email.
 */
export const resendVerification = async (email) => {
  const response = await client.post('/auth/resend-verification', { email });
  return response.data;
};
