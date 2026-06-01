import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  clearError,
  clearMessage,
} from '../features/auth/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, message } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    message,
    login: (data) => dispatch(loginUser(data)),
    register: (data) => dispatch(registerUser(data)),
    logout: () => dispatch(logoutUser()),
    forgotPassword: (email) => dispatch(forgotPassword(email)),
    resetPassword: (token, password) =>
      dispatch(resetPassword({ token, password })),
    verifyEmail: (token) => dispatch(verifyEmail(token)),
    resendVerification: (email) => dispatch(resendVerification(email)),
    clearError: () => dispatch(clearError()),
    clearMessage: () => dispatch(clearMessage()),
  };
};
