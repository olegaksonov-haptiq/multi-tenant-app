import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../index';

const selectTenantState = (state: RootState) => state.tenant;

export const selectTenant = createSelector(selectTenantState, (state) => state.tenant);
export const selectTenantLoading = createSelector(selectTenantState, (state) => state.loading);
export const selectTenantError = createSelector(selectTenantState, (state) => state.error);

export const selectTenantStateSlice = selectTenantState;
