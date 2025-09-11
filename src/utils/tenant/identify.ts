export function getTenantIdFromLocation(): string {
  const host = window.location.hostname;
  const subdomain = host.split('.')[0];

  // Subdomain approach: drf.example.com
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    return subdomain;
  }

  // Path-based approach: example.com/drf/...
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  return pathParts[0] || 'default';
}
