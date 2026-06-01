import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as feedApi from '../../api/feedApi.js';

// ─── Async thunks ──────────────────────────────────────────────

export const fetchPersonalizedFeed = createAsyncThunk(
  'feed/fetchPersonalized',
  async ({ cursor, limit } = {}, { rejectWithValue }) => {
    try {
      return await feedApi.getPersonalizedFeed(cursor, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to load feed'
      );
    }
  }
);

export const fetchTrendingFeed = createAsyncThunk(
  'feed/fetchTrending',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      return await feedApi.getTrendingFeed(page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to load trending'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  posts: [],
  nextCursor: null,
  hasMore: true,
  loading: false,
  error: null,

  trending: [],
  trendingMeta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  trendingLoading: false,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.posts = [];
      state.nextCursor = null;
      state.hasMore = true;
      state.error = null;
    },
    updatePostCommentCount: (state, action) => {
      const { postId, increment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.commentCount = (post.commentCount || 0) + increment;
      }
    },
    updatePostSaveStatus: (state, action) => {
      const { postId, isSaved } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.isSaved = isSaved;
      }
    },
    // Add new post from Socket.IO real-time event
    addNewPostFromSocket: (state, action) => {
      const newPost = action.payload;
      console.log('🔌 Socket.IO: Received new post:', {
        postId: newPost._id,
        title: newPost.title,
        author: newPost.author?.username
      });

      // Check if post already exists to prevent duplicates
      const exists = state.posts.some((p) => p._id === newPost._id);
      if (!exists && newPost.status === 'published') {
        console.log('✅ Adding post from Socket.IO to feed');
        state.posts.unshift(newPost);
      } else if (exists) {
        console.log('⚠️ Post already exists in feed (from Socket.IO), skipping');
      } else {
        console.log('ℹ️ Post is not published (from Socket.IO), skipping');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Personalized feed
      .addCase(fetchPersonalizedFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('📡 Fetching personalized feed...');
      })
      .addCase(fetchPersonalizedFeed.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, nextCursor } = action.payload;
        console.log('✅ Feed fetched successfully:', {
          postsCount: posts.length,
          nextCursor,
          firstPost: posts[0]?.title,
          isCursorPagination: !!action.meta.arg?.cursor
        });

        if (action.meta.arg?.cursor) {
          // Append for infinite scroll
          console.log('📄 Appending posts for pagination');
          state.posts = [...state.posts, ...posts];
        } else {
          // Initial load
          console.log('🔄 Setting initial feed posts');
          state.posts = posts;
        }
        state.nextCursor = nextCursor;
        state.hasMore = !!nextCursor;

        console.log('📊 Feed state updated:', { totalPosts: state.posts.length, hasMore: state.hasMore });
      })
      .addCase(fetchPersonalizedFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Feed fetch failed:', action.payload);
      })

      // Trending feed
      .addCase(fetchTrendingFeed.pending, (state) => {
        state.trendingLoading = true;
      })
      .addCase(fetchTrendingFeed.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trending = action.payload.posts;
        state.trendingMeta = action.payload.meta;
      })
      .addCase(fetchTrendingFeed.rejected, (state) => {
        state.trendingLoading = false;
      })

      // ─── FIX: Sync New Post with Feed Instantly ───
      // Jab blogSlice se post create ho jaye, use feed list ke top par push karo
      .addCase('blog/createPost/fulfilled', (state, action) => {
        // Agar post draft nahi hai aur published hai, toh feed mein dikhao
        const newPost = action.payload;
        console.log('🆕 New post created:', {
          postId: newPost._id,
          title: newPost.title,
          status: newPost.status,
          author: newPost.author?.username
        });

        if (newPost && newPost.status === 'published') {
          // Check if post already exists to avoid duplicates
          const exists = state.posts.some((p) => p._id === newPost._id);
          if (!exists) {
            console.log('✅ Adding new post to feed (optimistic update)');
            state.posts.unshift(newPost);
          } else {
            console.log('⚠️ Post already exists in feed, skipping duplicate');
          }
        } else {
          console.log('ℹ️ Post is draft, not adding to feed');
        }
      })

      // ─── Sync toggleSavePost with feed posts ───
      .addCase('blog/toggleSavePost/fulfilled', (state, action) => {
        const { postId, isSaved } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isSaved = isSaved;
        }
      })

      // ─── Sync toggleLike with feed posts ───
      .addCase('blog/toggleLike/fulfilled', (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isLiked = liked;
          post.likeCount = likeCount;
        }
      });
  },
});

export const { clearFeed, updatePostCommentCount, updatePostLikeCount, updatePostSaveStatus, addNewPostFromSocket } = feedSlice.actions;
export default feedSlice.reducer;