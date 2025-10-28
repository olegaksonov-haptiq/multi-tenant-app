import React, { useEffect, useState, type ReactNode } from 'react';
import type { TenantConfig } from '../../types/tenant';
import { getTenantIdFromHost } from './identify';
import { TenantContext } from './tenantContext';

type TenantProviderProps = {
  children: ReactNode;
};

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getTenantIdFromHost();

    const loadTenant = async () => {
      try {
        const response = await fetch(`/tenants/${id}.json`);
        if (!response.ok) throw new Error('Not found');

        const text = await response.text();

        try {
          const cfg: TenantConfig = JSON.parse(text);
          setTenant(cfg);
        } catch {
          console.warn(`Invalid JSON for tenant "${id}", falling back to default.`);
          await loadDefaultTenant();
        }
      } catch {
        console.warn(`Error loading tenant "${id}", falling back to default.`);
        await loadDefaultTenant();
      } finally {
        setLoading(false);
      }
    };

    const loadDefaultTenant = async () => {
      try {
        const res = await fetch('/tenants/default.json');
        const cfg: TenantConfig = await res.json();
        setTenant(cfg);
      } catch {
        console.error('Failed to load default tenant config.');
        setTenant({
          id: 'default',
          displayName: 'Default Tenant',
          theme: { primary: '#19345E', secondary: '#FFFFFF' },
          features: { advancedReports: false, reportCharts: false },
        });
      }
    };

    loadTenant();
  }, []);

  return <TenantContext.Provider value={{ tenant, loading }}>{children}</TenantContext.Provider>;
};
