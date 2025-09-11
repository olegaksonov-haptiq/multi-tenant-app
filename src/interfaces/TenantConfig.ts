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
