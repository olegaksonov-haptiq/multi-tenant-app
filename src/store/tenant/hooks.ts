import { useAppSelector } from '../hooks';
import type { TenantState } from '../../types/tenant';
import { selectTenantStateSlice } from './selectors';

export const useTenant = (): TenantState => useAppSelector(selectTenantStateSlice);
