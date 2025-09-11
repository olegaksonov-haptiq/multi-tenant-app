import { getTenantIdFromHost } from './tenant/identify';

export type EnvType = 'localhost' | 'dev' | 'stage' | 'prod';

/**
 * Figures out the environment based on hostname.
 */
export const getEnvFromHost = (): EnvType => {
  const host = window.location.hostname;

  if (host === 'localhost' || host.startsWith('tenantlocal')) {
    return 'localhost';
  }
  if (host.includes('-dev')) return 'dev';
  if (host.includes('-stage')) return 'stage';

  return 'prod'; // default
};

/**
 * Returns the correct API base URL
 */
export const getApiBaseUrl = (): string => {
  const tenant = getTenantIdFromHost();
  const env = getEnvFromHost();

  switch (env) {
    case 'localhost':
      // return `https://${tenant}-dev.haptiq.com`; // dev API we can use on local
      return `https://jsonplaceholder.typicode.com`; // TODO: remove after test
    case 'dev':
      return `https://${tenant}-dev.haptiq.com`;
    case 'stage':
      return `https://${tenant}-stage.haptiq.com`;
    case 'prod':
    default:
      return `https://${tenant}.haptiq.com`;
  }
};
