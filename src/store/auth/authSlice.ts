import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { AuthState as AuthStateType, LoginCredentials } from '../../types/auth';
import type { RootState } from '../index';
import { mockAuthApi } from '../../utils/auth/mockAuthApi';
import { sessionStorage } from '../../utils/auth/sessionStorage';

const initialState: AuthStateType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthThunkConfig = {
  state: RootState;
  rejectValue: string;
};

export const initializeAuth = createAsyncThunk<
  { token: string | null; user: AuthStateType['user'] },
  void,
  AuthThunkConfig
>('auth/initialize', async (_, { rejectWithValue }) => {
  const storedUser = sessionStorage.getUser();
  const token = storedUser?.token ?? null;

  if (!token) {
    return { token: null, user: null };
  }

  try {
    const { user, token: validatedToken } = await mockAuthApi.validate(token);
    return { user, token: validatedToken };
  } catch (error) {
    sessionStorage.clearToken();
    return rejectWithValue(error instanceof Error ? error.message : 'Token validation failed');
  }
});

export const login = createAsyncThunk<
  { token: string; user: NonNullable<AuthStateType['user']> },
  LoginCredentials,
  AuthThunkConfig
>('auth/login', async (credentials, { getState, rejectWithValue }) => {
  try {
    const {
      tenant: { tenant },
    } = getState();

    const tenantId = tenant?.id;
    const { user, token } = await mockAuthApi.login({ ...credentials, tenantId });

    sessionStorage.setToken(token, tenantId ?? '');

    return { user, token };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
  }
});

export const logout = createAsyncThunk<void, void, AuthThunkConfig>('auth/logout', async () => {
  sessionStorage.clearToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.user);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const authReducer = authSlice.reducer;
