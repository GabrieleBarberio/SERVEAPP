import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClients';
import { User } from '@/types/User';

export const initialUserState: User = {
  email: "",
  username: "",
  token: "",
};
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as { auth: typeof initialUserState & { token: string } }).auth.token;
      const response = await apiClient.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as { auth: typeof initialUserState & { token: string } }).auth.token;
      await apiClient.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: initialUserState,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = initialUserState;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | null;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = initialUserState;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = initialUserState;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth, updateUserProfile } = authSlice.actions;

export const selectAuth = (state: { auth: any; }) => state.auth;
export const selectUser = (state: { auth: any; }) => state.auth.user;
export const selectToken = (state: { auth: any; }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: any; }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: any; }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: any; }) => state.auth.error;

export default authSlice.reducer;
