import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Check if token exists and is valid on app load
const validateToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  }
  return false;
};

// Initialize auth state with token validation
if (!validateToken()) {
  initialState.token = null;
  initialState.isAuthenticated = false;
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await authApi.login(credentials.username, credentials.password);
    const token = response.headers?.authorization?.replace('Bearer ', '') || response.data.token;
    if (!token) {
      throw new Error('No token received');
    }
    localStorage.setItem('token', token);
    return { token };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      if (token) {
        const decoded = jwtDecode(token);
        state.user = {
          username: decoded.sub,
          roles: Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles],
        };
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { token } = action.payload;
        state.token = token;
        if (token) {
          const decoded = jwtDecode(token);
          state.user = {
            username: decoded.sub,
            roles: Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles],
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
