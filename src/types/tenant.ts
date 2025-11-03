export interface TenantConfig {
  id: string;
  displayName: string;
  theme: Record<string, string>;
  branding?: { logo?: string };
  layout?: 'navbar' | 'sidebar' | 'both';
  features: {
    advancedReports: boolean;
    reportCharts: boolean;
  };
  footerText?: string;
}

export interface TenantState {
  tenant?: TenantConfig;
  loading: boolean;
  error: string | null;
}
