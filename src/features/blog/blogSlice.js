import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postApi from '../../api/postApi.js';

// ─── Async thunks ──────────────────────────────────────────────

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (data, { rejectWithValue }) => {
    try {
      return await postApi.createPost(data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to create post'
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await postApi.updatePost(id, data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to update post'
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await postApi.deletePost(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to delete post'
      );
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      return await postApi.getPostBySlug(slug);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Post not found'
      );
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await postApi.listPosts(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to fetch posts'
      );
    }
  }
);

export const searchPosts = createAsyncThunk(
  'blog/searchPosts',
  async ({ query, page, limit }, { rejectWithValue }) => {
    try {
      return await postApi.searchPosts(query, page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Search failed'
      );
    }
  }
);

export const toggleLike = createAsyncThunk(
  'blog/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      const result = await postApi.toggleLike(postId);
      return { postId, ...result };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to toggle like'
      );
    }
  }
);

// NAYA THUNK: Saved/Bookmarked posts ko database se fetch karne ke liye
export const fetchSavedPosts = createAsyncThunk(
  'blog/fetchSavedPosts',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      return await postApi.getSavedPosts(page, limit); // Ensure your postApi has this method
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to fetch saved posts'
      );
    }
  }
);

// NAYA THUNK: Post ko bookmark/save toggle karne ke liye
export const toggleSavePost = createAsyncThunk(
  'blog/toggleSavePost',
  async (postId, { rejectWithValue }) => {
    try {
      const result = await postApi.toggleSave(postId); // Ensure your postApi has this method
      return { postId, ...result }; // Should return { postId, isSaved }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to save/bookmark post'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  // List view
  posts: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  listLoading: false,
  listError: null,

  // Detail view
  currentPost: null,
  detailLoading: false,
  detailError: null,

  // Mutations
  mutationLoading: false,
  mutationError: null,

  // Search
  searchResults: [],
  searchMeta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  searchLoading: false,
  searchError: null,

  // NAYI STATE: Saved/Bookmarked posts storage
  savedPosts: [],
  savedMeta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  savedLoading: false,
  savedError: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.detailError = null;
    },
    clearMutationError: (state) => {
      state.mutationError = null;
    },
    clearListError: (state) => {
      state.listError = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchMeta = { page: 1, limit: 20, total: 0, totalPages: 0 };
      state.searchError = null;
    },
    updateBlogCommentCount: (state, action) => {
      const { postId, commentCount } = action.payload;

      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.commentCount = commentCount;
      }

      if (state.currentPost?._id === postId) {
        state.currentPost.commentCount = commentCount;
      }

      const savedPost = state.savedPosts.find((p) => p._id === postId);
      if (savedPost) {
        savedPost.commentCount = commentCount;
      }
    },
    // Add new post from Socket.IO real-time event
    addNewPostFromSocket: (state, action) => {
      const newPost = action.payload;
      console.log('🔌 Socket.IO: Received new post in blog slice:', {
        postId: newPost._id,
        title: newPost.title,
        author: newPost.author?.username
      });

      // Check if post already exists to prevent duplicates
      const exists = state.posts.some((p) => p._id === newPost._id);
      if (!exists && newPost.status === 'published') {
        console.log('✅ Adding post from Socket.IO to blog state');
        state.posts.unshift(newPost);
      } else if (exists) {
        console.log('⚠️ Post already exists in blog state (from Socket.IO), skipping');
      } else {
        console.log('ℹ️ Post is not published (from Socket.IO), skipping');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Create post ──
      .addCase(createPost.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
        console.log('📝 Creating post...');
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.mutationLoading = false;
        console.log('✅ Post created successfully:', {
          postId: action.payload._id,
          title: action.payload.title,
          status: action.payload.status,
          slug: action.payload.slug
        });

        // Only add to posts list if it's published
        if (action.payload.status === 'published') {
          console.log('📌 Adding published post to blog state');
          state.posts.unshift(action.payload);
        } else {
          console.log('📋 Post is draft, not adding to blog state');
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload;
        console.error('❌ Post creation failed:', action.payload);
      })

      // ── Update post ──
      .addCase(updatePost.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.mutationLoading = false;
        const updated = action.payload;
        const idx = state.posts.findIndex((p) => p._id === updated._id);
        if (idx !== -1) state.posts[idx] = updated;
        if (state.currentPost?._id === updated._id) {
          state.currentPost = updated;
        }
        const sIdx = state.savedPosts.findIndex((p) => p._id === updated._id);
        if (sIdx !== -1) state.savedPosts[sIdx] = updated;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload;
      })

      // ── Delete post ──
      .addCase(deletePost.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.posts = state.posts.filter((p) => p._id !== action.payload);
        state.savedPosts = state.savedPosts.filter((p) => p._id !== action.payload);
        if (state.currentPost?._id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload;
      })

      // ── Fetch single post ──
      .addCase(fetchPostBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.currentPost = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })

      // ── Fetch posts list ──
      .addCase(fetchPosts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
        console.log('📡 Fetching posts list...');
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.posts = action.payload.posts;
        state.meta = action.payload.meta;
        console.log('✅ Posts list fetched:', {
          count: action.payload.posts.length,
          total: action.payload.meta.total,
          firstPost: action.payload.posts[0]?.title
        });
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
        console.error('❌ Posts list fetch failed:', action.payload);
      })

      // ── Search posts ──
      .addCase(searchPosts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.posts;
        state.searchMeta = action.payload.meta;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })

      // ── Toggle like ──
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likeCount = likeCount;
          post.isLiked = liked;
        }
        if (state.currentPost?._id === postId) {
          state.currentPost.likeCount = likeCount;
          state.currentPost.isLiked = liked;
        }
        const savedPost = state.savedPosts.find((p) => p._id === postId);
        if (savedPost) {
          savedPost.likeCount = likeCount;
          savedPost.isLiked = liked;
        }
      })

      // ── Fetch Saved Posts ──
      .addCase(fetchSavedPosts.pending, (state) => {
        state.savedLoading = true;
        state.savedError = null;
      })
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.savedLoading = false;
        state.savedPosts = action.payload.posts;
        state.savedMeta = action.payload.meta;
      })
      .addCase(fetchSavedPosts.rejected, (state, action) => {
        state.savedLoading = false;
        state.savedError = action.payload;
      })

      // ── Toggle Save/Bookmark Post ──
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, isSaved } = action.payload;
        
        // 1. Live stream posts arrays mein bookmark badge state sync karo
        const post = state.posts.find((p) => p._id === postId);
        if (post) post.isSaved = isSaved;

        if (state.currentPost?._id === postId) {
          state.currentPost.isSaved = isSaved;
        }

        // 2. Agar user ne unsave kiya hai toh bookmarks tab ki list se hata do instantly
        if (!isSaved) {
          state.savedPosts = state.savedPosts.filter((p) => p._id !== postId);
        } else {
          // Agar save kiya hai aur woh pehle se list mein nahi hai, toh add karo
          const exists = state.savedPosts.some((p) => p._id === postId);
          if (!exists && post) {
            state.savedPosts.unshift({ ...post, isSaved: true });
          }
        }
      });
  },
});

export const {
  clearCurrentPost,
  clearMutationError,
  clearListError,
  clearSearchResults,
  updateBlogCommentCount,
  addNewPostFromSocket,
} = blogSlice.actions;

export default blogSlice.reducer;