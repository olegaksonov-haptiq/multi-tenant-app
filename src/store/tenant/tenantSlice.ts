import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ApiError, api } from '../../services/api';
import type { TenantConfig, TenantState } from '../../types/tenant';
import { getTenantIdFromHost } from '../../utils/tenant/identify';

const FALLBACK_TENANT: TenantConfig = {
  id: 'default',
  displayName: 'Default Tenant',
  theme: { primary: '#19345E', secondary: '#FFFFFF' },
  features: { advancedReports: false, reportCharts: false },
  apm: {
    active: false,
    environment: 'prod',
    logLevel: 'error',
  },
};

const fetchTenantConfig = async (tenantId: string): Promise<TenantConfig> => {
  const rawConfig = await api.get<string>(`/tenants/${tenantId}.json`, {
    baseURL: window.location.origin,
    responseType: 'text',
    transformResponse: [(data) => data as string],
    headers: { Accept: 'application/json' },
  });

  try {
    return JSON.parse(rawConfig) as TenantConfig;
  } catch (error) {
    console.warn(`Invalid JSON for tenant "${tenantId}".`, error);
    throw error instanceof Error ? error : new Error('Invalid tenant configuration');
  }
};

export const loadTenant = createAsyncThunk<TenantConfig, void, { rejectValue: string }>(
  'tenant/loadTenant',
  async (_, { rejectWithValue }) => {
    const tenantId = getTenantIdFromHost();

    const attemptLoad = async (id: string) => {
      try {
        return await fetchTenantConfig(id);
      } catch (err) {
        if (err instanceof ApiError) {
          console.warn(`API error loading tenant "${id}": ${err.message}.`);
        } else {
          console.warn(`Error loading tenant "${id}".`, err);
        }
        throw err;
      }
    };

    try {
      return await attemptLoad(tenantId);
    } catch {
      try {
        return await attemptLoad('default');
      } catch (fallbackError) {
        console.error('Failed to load default tenant config.', fallbackError);
        return rejectWithValue(
          fallbackError instanceof Error ? fallbackError.message : 'Failed to load tenant configuration',
        );
      }
    }
  },
);

const initialState: TenantState = {
  tenant: undefined,
  loading: true,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action) {
      state.tenant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTenant.fulfilled, (state, action) => {
        state.tenant = action.payload;
        state.loading = false;
      })
      .addCase(loadTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Failed to load tenant';
        state.tenant = FALLBACK_TENANT;
      });
  },
});

export const { setTenant } = tenantSlice.actions;
export const tenantReducer = tenantSlice.reducer;
export const fallbackTenant = FALLBACK_TENANT;
