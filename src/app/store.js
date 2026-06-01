import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import blogReducer from '../features/blog/blogSlice.js';
import userReducer from '../features/user/userSlice.js';
import commentReducer from '../features/comment/commentSlice.js';
import notificationReducer from '../features/notification/notificationSlice.js';
import feedReducer from '../features/feed/feedSlice.js';
import searchReducer from '../features/search/searchSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    user: userReducer,
    comment: commentReducer,
    notification: notificationReducer,
    feed: feedReducer,
    search: searchReducer,
  },
});
