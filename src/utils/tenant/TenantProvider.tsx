import React, { createContext, useContext, useEffect, useState } from "react";
import { getTenantIdFromLocation } from "./identify";

export interface TenantConfig {
  id: string;
  displayName: string;
  theme: Record<string, string>;
  branding?: {
    logo?: string;
  };
  layout?: "navbar" | "sidebar" | "both";
  features: {
    advancedReports: boolean;
    liveOdds: boolean;
  };
  footerText?: string; // ✅ optional custom footer override
}


type TenantContextValue = { tenant?: TenantConfig; loading: boolean };

const TenantContext = createContext<TenantContextValue>({ loading: true });

export const useTenant = () => useContext(TenantContext);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tenant, setTenant] = useState<TenantConfig>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getTenantIdFromLocation();
    fetch(`/tenants/${id}.json`)
      .then((r) => (r.ok ? r.json() : fetch("/tenants/default.json").then((r) => r.json())))
      .then((cfg: TenantConfig) => setTenant(cfg))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};
