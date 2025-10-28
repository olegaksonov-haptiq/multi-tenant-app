import { createContext, useContext } from 'react';
import type { TenantConfig } from '../../types/tenant';

type TenantContextValue = { tenant?: TenantConfig; loading: boolean };

export const TenantContext = createContext<TenantContextValue>({ loading: true });

export const useTenant = () => useContext(TenantContext);
