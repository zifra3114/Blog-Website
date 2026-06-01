import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userApi from '../../api/userApi.js';

// ─── Async thunks ──────────────────────────────────────────────

export const fetchUserByUsername = createAsyncThunk(
  'user/fetchByUsername',
  async (username, { rejectWithValue }) => {
    try {
      return await userApi.getUserByUsername(username);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'User not found'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await userApi.updateProfile(data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to update profile'
      );
    }
  }
);

export const toggleFollow = createAsyncThunk(
  'user/toggleFollow',
  async (userId, { rejectWithValue }) => {
    try {
      return await userApi.toggleFollow(userId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to follow/unfollow'
      );
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  'user/fetchFollowers',
  async ({ userId, page, limit }, { rejectWithValue }) => {
    try {
      return await userApi.getFollowers(userId, page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to fetch followers'
      );
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  'user/fetchFollowing',
  async ({ userId, page, limit }, { rejectWithValue }) => {
    try {
      return await userApi.getFollowing(userId, page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to fetch following'
      );
    }
  }
);

export const fetchSuggestedUsers = createAsyncThunk(
  'user/fetchSuggested',
  async (limit = 5, { rejectWithValue }) => {
    try {
      return await userApi.getSuggestedUsers(limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to fetch suggestions'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  profile: null,
  profileLoading: false,
  profileError: null,

  followers: [],
  followersMeta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  following: [],
  followingMeta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  listLoading: false,

  suggested: [],
  suggestedLoading: false,

  mutationLoading: false,
  mutationError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.profileError = null;
    },
    clearMutationError: (state) => {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserByUsername.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload;
      })

      // Toggle follow
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { followed } = action.payload;
        if (state.profile) {
          state.profile.isFollowing = followed;
          state.profile.followerCount += followed ? 1 : -1;
        }
        const suggestedUser = state.suggested.find(
          (u) => u._id === action.meta.arg
        );
        if (suggestedUser) {
          suggestedUser.isFollowing = followed;
          suggestedUser.followerCount += followed ? 1 : -1;
        }
      })

      // Fetch suggested users
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.suggestedLoading = true;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedLoading = false;
        state.suggested = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state) => {
        state.suggestedLoading = false;
      })

      // Fetch followers
      .addCase(fetchFollowers.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.followers = action.payload.users;
        state.followersMeta = action.payload.meta;
      })
      .addCase(fetchFollowers.rejected, (state) => {
        state.listLoading = false;
      })

      // Fetch following
      .addCase(fetchFollowing.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.listLoading = false;
        state.following = action.payload.users;
        state.followingMeta = action.payload.meta;
      })
      .addCase(fetchFollowing.rejected, (state) => {
        state.listLoading = false;
      })

      // ─── FIX: Sync New Post with Profile View Instantly ───
      // Jab naya blog create ho, agar woh is active profile ka hai toh count aur posts array update karo
      .addCase('blog/createPost/fulfilled', (state, action) => {
        const newPost = action.payload;
        if (state.profile && newPost && newPost.status !== 'draft') {
          // Check if the current opened profile is the author of this post
          const isOwnProfile = state.profile._id === newPost.author || state.profile._id === newPost.author?._id;
          
          if (isOwnProfile) {
            // Increment total blogs count if it exists in your profile schema
            if (typeof state.profile.blogCount === 'number') {
              state.profile.blogCount += 1;
            }
            
            // Agar aapki profile object ke andar posts ka array embedded hai (e.g., state.profile.posts)
            if (state.profile.posts && Array.isArray(state.profile.posts)) {
              state.profile.posts.unshift(newPost);
            }
          }
        }
      });
  },
});

export const { clearProfile, clearMutationError } = userSlice.actions;
export default userSlice.reducer;