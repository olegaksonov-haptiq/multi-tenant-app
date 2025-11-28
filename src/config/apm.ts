import { getEnvFromHost } from '../utils/env';
import type { EnvApmConfig, ApmLogLevel, ApmResolvedOptions } from '../types/apm';
import type { TenantConfig } from '../types/tenant';

const parseBoolean = (value?: string): boolean | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return undefined;
};

const parseNumber = (value?: string): number | undefined => {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseList = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const parts = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return parts.length > 0 ? parts : undefined;
};

const parseLogLevel = (value?: string): ApmLogLevel | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (['trace', 'debug', 'info', 'warn', 'error'].includes(normalized)) {
    return normalized as ApmLogLevel;
  }
  return undefined;
};

export const getEnvApmConfig = (): EnvApmConfig => {
  const env = import.meta.env;

  return {
    serverUrl: env.VITE_APM_SERVER_URL,
    serviceName: env.VITE_APM_SERVICE_NAME,
    environment: env.VITE_APM_ENV ?? getEnvFromHost(),
    serviceVersion: env.VITE_APM_SERVICE_VERSION,
    distributedTracingOrigins: parseList(env.VITE_APM_DISTRIBUTED_TRACING_ORIGINS),
    logLevel: parseLogLevel(env.VITE_APM_LOG_LEVEL),
    active: parseBoolean(env.VITE_APM_ACTIVE),
  };
};

const resolveBoolean = (tenantValue: boolean | undefined, envValue: boolean | undefined, fallback: boolean) =>
  tenantValue ?? envValue ?? fallback;

const resolveValue = <T>(tenantValue: T | undefined, envValue: T | undefined, fallback?: T) =>
  tenantValue ?? envValue ?? fallback;

const DEFAULT_SERVICE_NAME = 'multi-tenant-frontend';
const DEFAULT_LOG_LEVEL: ApmLogLevel = 'error';

export const resolveApmConfig = (tenant?: TenantConfig): ApmResolvedOptions => {
  const envConfig = getEnvApmConfig();
  const tenantConfig = tenant?.apm;
  const sampleRate = parseNumber(import.meta.env.VITE_APM_TRANSACTION_SAMPLE_RATE);

  const serviceName = resolveValue(tenantConfig?.serviceName, envConfig.serviceName, DEFAULT_SERVICE_NAME);
  const environment = resolveValue(tenantConfig?.environment, envConfig.environment, getEnvFromHost());
  const serverUrl = resolveValue(tenantConfig?.serverUrl, envConfig.serverUrl);
  const distributedTracingOrigins = resolveValue(
    tenantConfig?.distributedTracingOrigins,
    envConfig.distributedTracingOrigins,
  );
  const logLevel = resolveValue(tenantConfig?.logLevel, envConfig.logLevel, DEFAULT_LOG_LEVEL);

  const active = resolveBoolean(tenantConfig?.active, envConfig.active, Boolean(serverUrl && serviceName));

  return {
    active,
    serverUrl,
    serviceName,
    environment,
    serviceVersion: resolveValue(tenantConfig?.serviceVersion, envConfig.serviceVersion),
    distributedTracingOrigins,
    logLevel,
    transactionSampleRate: sampleRate,
  };
};
