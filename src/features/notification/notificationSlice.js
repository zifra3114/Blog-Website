import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationApi from '../../api/notificationApi.js';

// ─── Async thunks ──────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await notificationApi.getNotifications(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to load notifications'
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const result = await notificationApi.getUnreadCount();
      return result.count;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to load unread count'
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      return await notificationApi.markAsRead(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to mark as read'
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead();
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Failed to mark all as read'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  notifications: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
    addRealtimeNotification: (state, action) => {
      // Add to top of list, avoid duplicates
      const exists = state.notifications.find(
        (n) => n._id === action.payload._id
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.meta = action.payload.meta;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.notifications.findIndex((n) => n._id === updated._id);
        if (idx !== -1 && !state.notifications[idx].isRead) {
          state.notifications[idx].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      });
  },
});

export const { clearNotifications, addRealtimeNotification, setUnreadCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;
