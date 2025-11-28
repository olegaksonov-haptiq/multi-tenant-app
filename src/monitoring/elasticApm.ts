import { init as initApm } from '@elastic/apm-rum';
import type { ApmBase } from '@elastic/apm-rum';

import { resolveApmConfig } from '../config/apm';
import type { ApmResolvedOptions } from '../types/apm';
import type { TenantConfig } from '../types/tenant';

let apmInstance: ApmBase | null = null;
let lastConfigKey: string | null = null;

const clampSampleRate = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const toRumConfig = ({ transactionSampleRate, ...config }: ApmResolvedOptions) => {
  const rumConfig = {
    ...config,
  };

  const clampedSampleRate = clampSampleRate(transactionSampleRate);
  if (clampedSampleRate !== undefined) {
    Object.assign(rumConfig, { transactionSampleRate: clampedSampleRate });
  }

  return rumConfig;
};

const shouldReconfigure = (config: ApmResolvedOptions) => {
  const configKey = JSON.stringify(config);
  if (configKey === lastConfigKey) {
    return false;
  }
  lastConfigKey = configKey;
  return true;
};

const deactivate = () => {
  if (apmInstance) {
    apmInstance.config({ active: false });
  }
};

export const setupElasticApm = (tenant?: TenantConfig) => {
  const resolved = resolveApmConfig(tenant);

  if (!resolved.active || !resolved.serverUrl) {
    deactivate();
    return null;
  }

  if (!shouldReconfigure(resolved)) {
    return apmInstance;
  }

  const rumConfig = toRumConfig(resolved);

  if (apmInstance) {
    apmInstance.config(rumConfig);
    return apmInstance;
  }

  apmInstance = initApm(rumConfig);
  return apmInstance;
};

export const getElasticApm = () => apmInstance;
