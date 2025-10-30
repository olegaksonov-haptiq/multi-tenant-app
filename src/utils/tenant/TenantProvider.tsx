import React, { useEffect, useState, type ReactNode } from 'react';
import type { TenantConfig } from '../../types/tenant';
import { getTenantIdFromHost } from './identify';
import { TenantContext } from './tenantContext';
import { ApiError, api } from '../../services/api';

type TenantProviderProps = {
  children: ReactNode;
};

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getTenantIdFromHost();

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

    const loadDefaultTenant = async () => {
      try {
        const cfg = await fetchTenantConfig('default');
        setTenant(cfg);
      } catch (error) {
        console.error('Failed to load default tenant config.', error);
        setTenant({
          id: 'default',
          displayName: 'Default Tenant',
          theme: { primary: '#19345E', secondary: '#FFFFFF' },
          features: { advancedReports: false, reportCharts: false },
        });
      }
    };

    const loadTenant = async () => {
      try {
        const cfg = await fetchTenantConfig(id);
        setTenant(cfg);
      } catch (error) {
        if (error instanceof ApiError) {
          console.warn(`API error loading tenant "${id}": ${error.message}. Falling back to default.`);
        } else {
          console.warn(`Error loading tenant "${id}", falling back to default.`, error);
        }
        await loadDefaultTenant();
      } finally {
        setLoading(false);
      }
    };

    loadTenant();
  }, []);

  return <TenantContext.Provider value={{ tenant, loading }}>{children}</TenantContext.Provider>;
};
