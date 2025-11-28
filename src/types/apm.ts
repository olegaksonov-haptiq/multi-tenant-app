export type ApmLogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export interface BaseApmConfig {
  serviceName?: string;
  serverUrl?: string;
  environment?: string;
  serviceVersion?: string;
  distributedTracingOrigins?: string[];
  logLevel?: ApmLogLevel;
}

export interface ResolvedApmConfig extends BaseApmConfig {
  active: boolean;
}

export interface TenantApmConfig extends BaseApmConfig {
  active?: boolean;
}

export interface EnvApmConfig extends BaseApmConfig {
  active?: boolean;
}

export interface ApmResolvedOptions extends ResolvedApmConfig {
  transactionSampleRate?: number;
}
