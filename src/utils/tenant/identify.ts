/**
 * Gets the tenant ID from the current window location.
 *
 * Rules:
 * - For production/dev/stage subdomains: tenant is derived from the subdomain, stripping environment suffix (-dev, -stage).
 * - For localhost:
 *   - If path contains a tenant (e.g., http://localhost:5173/drf), use that.
 *   - Otherwise, fallback to 'dafault'.
 * - For local subdomains ending with 'local' (e.g., drflocal.drf.com), remove 'local' suffix.
 *
 * @example
 * // On https://drf-dev.haptiq.com → returns "drf"
 * // On https://drf-stage.haptiq.com → returns "drf"
 * // On https://drf.haptiq.com → returns "drf"
 * // On http://tenantlocal.drf.com:8080 → returns "drf"
 * // On http://tenantlocal.gemini.com:8080 → returns "gemini"
 * // On http://localhost:5173/drf → returns "drf"
 * // On http://localhost:5173 → returns "dafault"
 *
 * @returns {string} Tenant ID
 */
export const getTenantIdFromHost = (): string => {
  const host = window.location.hostname;

  // Localhost
  if (host === 'localhost') {
    return 'default';
  }

  // Tenant-local subdomains: tenantlocal.drf.com → drf
  if (host.startsWith('tenantlocal.')) {
    return host.split('.')[1] || 'default'; // e.g., tenantlocal.drf.com → drf
  }

  // Normal subdomains
  const subdomain = host.split('.')[0]; // e.g., gemini-dev
  const cleanedSubdomain = subdomain.replace(/-(dev|stage)$/i, ''); // remove environment suffix
  return cleanedSubdomain;
};
