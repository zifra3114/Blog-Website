import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as commentApi from '../../api/commentApi.js';

// ─── Async thunks ──────────────────────────────────────────────

export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async ({ postId, page, limit }, { rejectWithValue }) => {
    try {
      return await commentApi.getComments(postId, page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to load comments'
      );
    }
  }
);

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({ postId, data }, { rejectWithValue }) => {
    try {
      return await commentApi.createComment(postId, data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to post comment'
      );
    }
  }
);

export const fetchReplies = createAsyncThunk(
  'comment/fetchReplies',
  async ({ commentId, page, limit }, { rejectWithValue }) => {
    try {
      return await commentApi.getReplies(commentId, page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to load replies'
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentApi.deleteComment(commentId);
      return commentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to delete comment'
      );
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  'comment/toggleLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const result = await commentApi.toggleLikeComment(commentId);
      return { commentId, ...result };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to like comment'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  comments: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  loading: false,
  error: null,
  sending: false,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.meta = { page: 1, limit: 20, total: 0, totalPages: 0 };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.meta = action.payload.meta;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.sending = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.sending = false;
        const comment = action.payload;
        if (comment.parentComment) {
          // It's a reply — don't add to top-level list
        } else {
          state.comments.unshift(comment);
          state.meta.total += 1;
        }
      })
      .addCase(createComment.rejected, (state) => {
        state.sending = false;
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c._id !== action.payload
        );
        state.meta.total = Math.max(0, state.meta.total - 1);
      })

      // Toggle like on comment
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { commentId, liked, likeCount } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.likeCount = likeCount;
          comment.isLiked = liked;
        }
      });
  },
});

export const { clearComments, clearError } = commentSlice.actions;
export default commentSlice.reducer;
