// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendUrl } from '../../utils/api';

// Helpers: read/write token to localStorage
const ACCESS_TOKEN_KEY = 'access_token';
// const BASE_URL = "https://backend-ainotes-production.up.railway.app";
const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || null;
const setStoredToken = (t) => { if (t) localStorage.setItem(ACCESS_TOKEN_KEY, t); else localStorage.removeItem(ACCESS_TOKEN_KEY); };

// Async thunks

// login with email/password: backend sets refresh_token cookie; returns accessToken
export const login = createAsyncThunk(
  'auth/login',
  // eslint-disable-next-line no-unused-vars
  async ({ email, password }, thunkAPI) => {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // important to accept the refresh_token cookie
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Login failed');
    }
    const data = await res.json(); // { accessToken, expiresIn }
    return data;
  }
);

// refresh access token using refresh token cookie
export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  // eslint-disable-next-line no-unused-vars
  async (_, thunkAPI) => {
    const res = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include' // send cookie
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Refresh failed');
    }
    const data = await res.json(); // { accessToken, expiresIn }
    return data;
  }
);

// fetch profile using access token
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.accessToken;
    const res = await fetch(`${backendUrl}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    });
    if (res.status === 401) {
      // try refresh once
      // eslint-disable-next-line no-useless-catch
      try {
        await thunkAPI.dispatch(refreshAccessToken());
        const newToken = thunkAPI.getState().auth.accessToken;
        const retry = await fetch(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${newToken}` },
          credentials: 'include'
        });
        if (!retry.ok) throw new Error('Unauthorized');
        return await retry.json();
      } catch (err) {
        throw err;
      }
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to fetch profile');
    }
    return await res.json();
  }
);

// logout
// eslint-disable-next-line no-unused-vars
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  await fetch(`${backendUrl}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  }).catch(() => {});
  return {};
});

const initialState = {
  accessToken: getStoredToken(),
  status: 'idle',
  profile: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      setStoredToken(action.payload);
    },
    clearAuthState(state) {
      state.accessToken = null;
      state.profile = null;
      setStoredToken(null);
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.accessToken = a.payload.accessToken;
        setStoredToken(a.payload.accessToken);
      })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })

      // refresh
      .addCase(refreshAccessToken.fulfilled, (s, a) => {
        s.accessToken = a.payload.accessToken;
        setStoredToken(a.payload.accessToken);
      })
      .addCase(refreshAccessToken.rejected, (s) => {
        s.accessToken = null;
        setStoredToken(null);
        s.profile = null;
      })

      // fetchProfile
      .addCase(fetchProfile.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.status = 'succeeded'; s.profile = a.payload; })
      .addCase(fetchProfile.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })

      // logout
      .addCase(logout.fulfilled, (s) => {
        s.accessToken = null;
        s.profile = null;
        setStoredToken(null);
      });
  }
});

export const { setAccessToken, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
