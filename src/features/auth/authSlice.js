import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi.js';
import { setAccessToken, clearAccessToken } from '../../api/client.js';
import { updateProfile } from '../user/userSlice.js';

// ─── Async thunks ──────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authApi.register(data);
      setAccessToken(result.accessToken);
      return result.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authApi.login(data);
      setAccessToken(result.accessToken);
      return result.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      clearAccessToken();
    } catch (err) {
      clearAccessToken();
      return rejectWithValue(
        err.response?.data?.error?.message || 'Logout failed'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // First, try to refresh the access token from the refresh token cookie
      // This is critical for page refreshes where the in-memory access token is lost
      try {
        const refreshResult = await authApi.refresh();
        if (refreshResult?.accessToken) {
          setAccessToken(refreshResult.accessToken);
        }
      } catch (refreshError) {
        // If refresh fails, user is not logged in - this is expected
        console.log('No valid session found');
        return rejectWithValue('Not authenticated');
      }

      // Now fetch the current user with the refreshed token
      const result = await authApi.getMe();
      return result.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to fetch user'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const result = await authApi.forgotPassword(email);
      return result.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to send reset email'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const result = await authApi.resetPassword(token, password);
      return result.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to reset password'
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const result = await authApi.verifyEmail(token);
      return result.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to verify email'
      );
    }
  }
);

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const result = await authApi.resendVerification(email);
      return result.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to resend verification'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null, // for success messages (e.g., "check your email")
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Register ──
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Login ──
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Logout ──
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // ── Fetch current user ──
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // ── Forgot password ──
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Reset password ──
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Verify email ──
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        // Update user's verification status if logged in
        if (state.user) {
          state.user.isEmailVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Resend verification ──
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update profile (sync auth state) ──
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Update current user in auth state when profile is updated
        if (state.user && state.user._id === action.payload._id) {
          // Merge the updated data to ensure all fields are updated
          state.user = {
            ...state.user,
            ...action.payload,
          };
        }
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
