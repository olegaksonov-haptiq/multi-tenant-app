# Multi-Tenant App Developer Guide

## 1. Purpose & Audience

Developers onboarding to the multi-tenant application should start here before diving into the code. The document explains how tenancy-aware concerns thread through the stack so that feature work remains consistent and isolated per tenant. Readers are expected to understand modern React (hooks, suspense), Redux Toolkit async flows, and TypeScript-driven type definitions.

## 2. Platform Overview

- Built with Vite + React + TypeScript for rapid local development and optimized bundles.
- Redux Toolkit centralizes session and tenant state; React Router drives navigation.
- The tenancy system personalizes theme, layout, navigation, and feature availability without branching the codebase.
- Each browser session resolves a tenant, hydrates its configuration, syncs auth state, and paints tenant-specific styling before rendering routes.

## 3. Directory Map & Responsibilities

### 3.1 Top-Level Structure

- `/src`: React source plus tenant-aware state, routes, and utilities.
- `/public/tenants`: Static JSON descriptors and assets per tenant (mocked data), bundled directly into the Vite dev server and production build.
- `/dist`: Build output produced by `npm run build`; never edit by hand.

### 3.2 Key Source Directories

- `src/main.tsx`: Mounts `<App />` within the Redux `<Provider>` so slices can read tenant/auth state during boot.
- `src/App.tsx`: Dispatches `loadTenant()` and `initializeAuth()` once, applies tenant theming, and wraps the app with layout + router orchestration.
- `src/store`: Redux slices (tenant, auth) and typed hooks for consistent dispatch/select usage.
- `src/routes`: Route config, guard layer, and router wiring that injects tenant and auth policies before rendering screens.
- `src/components`: Reusable UI pieces (layout chrome, data widgets) that can consume tenant and auth hooks.
- `src/pages`: Routed pages that orchestrate components for specific URLs.
- `src/services`: API client, typed helpers, and tests for HTTP interactions.
- `src/utils`: Cross-cutting helpers, including tenant detection and auth persistence.
- `src/styles`: SCSS sources defining theme variables and component-level styling that respond to tenant overrides.

## 4. Multi-Tenancy Lifecycle

### 4.1 Tenant Identification

- `getTenantIdFromHost()` in `src/utils/tenant/identify.ts` inspects the hostname to extract the tenant slug, stripping environment suffixes such as `-dev` or `-stage`.
- Local fallback resolves to `default` so developers can run `npm run dev` without subdomain configuration.

### 4.2 Tenant Loading & State

- `loadTenant` thunk in `src/store/tenant/tenantSlice.ts` pulls the resolved ID and fetches `/tenants/<id>.json` from `window.location.origin`, falling back to `default` when the specific tenant manifest is missing or invalid.
- The slice persists tenant config, loading state, and errors; failure to load seeds a baked-in `FALLBACK_TENANT` to keep the UI functional even when configuration retrieval fails.

```39:88:src/store/tenant/tenantSlice.ts
    builder
      .addCase(loadTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTenant.fulfilled, (state, action) => {
        state.tenant = action.payload;
        state.loading = false;
      })
      .addCase(loadTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Failed to load tenant';
        state.tenant = FALLBACK_TENANT;
      });
```

### 4.3 Theming Application

- When `loadTenant` populates state, `src/App.tsx` calls `applyTheme(tenant.theme)` to convert config keys (for example `primary`, `accent`) into CSS custom properties on `document.documentElement`.
- SCSS sources like `src/styles/theme.scss` reference the same CSS variables, allowing per-tenant palettes, fonts, and layout tweaks without recompiling styles.

```1:7:src/utils/tenant/applyTheme.ts
export function applyTheme(theme: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => {
    root.style.setProperty(`--${k}`, v);
  });
}
```

### 4.4 Auth & Tenant Cohesion

- `initializeAuth` and `login` thunks in `src/store/auth/authSlice.ts` rely on the tenant slice to attach `tenantId` to session tokens; the shared `sessionStorage` wrapper in `src/utils/auth/sessionStorage.ts` persists `{ token, tenantId }` inside a cookie for SSR-safe access.
- Auth hooks (`src/store/auth/hooks.ts`) expose helpers like `hasFeature` that bridge auth state with tenant feature flags, ensuring UI affordances respect both security and configuration.

### 4.5 Route Protection

- `GuardedRoute` (`src/routes/guards/GuardedRoute.tsx`) composes layered policies: authentication, tenant matching, role/permission checks, and feature gating. Each policy returns a redirect or render override before the route's component mounts.
- Route definitions in `src/routes/routes.ts` declare requirements (`requiresAuth`, `roles`, `requiresFeature`), while navigation metadata reuses the same flags so menus stay in sync with guard outcomes.

## 5. API Layer Responsibilities

- `apiClient` (`src/services/apiClient.ts`) centralizes Axios configuration, setting `baseURL`, timeouts, and credentials. A request interceptor injects `Authorization` and `X-Tenant-Id` headers sourced from cookies or host-derived tenant IDs, guaranteeing server-side isolation.
- The response interceptor wraps failures in a custom `ApiError`, capturing HTTP status, normalized messages, and whether the fault is network-related so callers can differentiate UX responses.
- The `api` helper (`src/services/api.ts`) exposes `get`, `post`, `put`, `patch`, and `delete` methods that resolve with `response.data`, allowing components to remain agnostic of Axios response shapes.
- Vitest coverage in `src/services/__tests__/apiClient.test.ts` mocks the client to assert header injection and error normalization. Add similar tests when extending interceptors or introducing new HTTP behaviors.

## 6. Extension Playbooks

### 6.1 Adding a Mocked Tenant

- Duplicate an existing JSON manifest in `/public/tenants` and update `id`, `displayName`, `theme`, `features`, `layout`, and optional `branding.logo`. Keep filenames aligned with the tenant ID (for example `venu.json` → `venu`).
- Place logos or tenant-specific media under `/public/tenants/assets`. Use relative paths in the manifest so the Vite dev server and production build resolve the assets (`/tenants/assets/<file>.svg`).
- Start the dev server and visit `http://<tenant>.localhost:5173` or `http://localhost:5173/<tenant>` depending on your DNS setup. Check the browser console for warnings from `loadTenant` if the manifest is malformed.

### 6.2 Adding Features or Flags

- Extend the `TenantConfig.features` type in `src/types/tenant.ts` with the new flag. Update all tenant JSON manifests to include the field (even when `false`) so the schema stays consistent.
- Use `hasFeature` from `src/store/auth/hooks.ts` or read `tenant.features` via `useTenant()` to toggle UI. For routing concerns, set `requiresFeature` inside `src/routes/routes.ts` so `GuardedRoute` enforces the constraint.
- If the flag influences API behavior, include it in requests or headers explicitly; the backend does not implicitly know about front-end feature toggles.

### 6.3 Adding Routes & Navigation

- Define a new route object in `src/routes/routes.ts` and import the target page component from `src/pages`. Include metadata: `requiresAuth`, `roles`, `requiresFeature`, and SEO details as needed.
- Because `<Router />` automatically wraps each entry with `GuardedRoute`, declaring flags in the route config is sufficient to activate auth, permission, and feature policies.
- To surface the route in top navigation, add an item to `navigationConfig` in the same file. Guard settings are shared, so navigation will hide itself when the user lacks permissions or features.

### 6.4 Building Pages & Components

- Place routed screen containers inside `src/pages`. These components typically orchestrate data loading, compose domain widgets, and handle CTA wiring.
- House reusable UI or domain widgets (tables, cards, dialogs) inside `src/components`. Favor composition over duplication so tenant-specific variants can wrap shared components.
- Use `useTenant()` and `useAuth()` from their respective hook files (`src/store/tenant/hooks.ts`, `src/store/auth/hooks.ts`) instead of touching Redux directly; this keeps tenant logic type-safe and encapsulated.
- For complex local state, continue to rely on React hooks, but push cross-cutting concerns (for example, caching or API status) into Redux slices under `src/store`.

### 6.5 Data Fetching Patterns

- Consume the `api` helper (`src/services/api.ts`) instead of raw Axios so interceptors remain applied and error handling is uniform.
- Handle loading and error states explicitly, similar to `src/components/UserList.tsx`, which displays progress, surfaces `ApiError.message`, and prevents rendering incomplete data.
- When adding new service functions, colocate them in `src/services` to keep request logic reusable. Consider adding Vitest coverage, following the patterns in `src/services/__tests__/apiClient.test.ts`.

## 7. Testing & Quality Gates

- Run `npm run test` to execute Vitest suites. Tests live alongside services today (`src/services/__tests__`); follow this pattern when covering new utilities or slices.
- For Redux slices, export pure reducers and thunks so they can be tested in isolation. Mock Axios requests with `axios-mock-adapter`, as shown in the API client spec, to avoid real HTTP calls.
- Guard logic is deterministic; consider adding focused tests that render `GuardedRoute` with mocked context to ensure new policies do not regress existing flows.
- The project does not ship E2E coverage yet. When story-critical flows are introduced, plan to add Playwright or Cypress suites that exercise tenant switching and auth in the browser.

## 8. Operational Notes

- `getEnvFromHost()` in `src/utils/env.ts` distinguishes localhost, dev, stage, and prod based on hostname conventions, enabling environment-specific API endpoints without manual toggles.
- Local development relies on `npm run dev`, which serves assets from memory and fetches tenant manifests directly under `/public/tenants`. Use path-based tenancy locally when subdomains are inconvenient.
- Production and staging builds bundle tenant JSON into `dist/tenants`. Deploy the entire `dist` directory to your static host or CDN; the API base URLs will resolve using the tenant-aware hostname.
- Keep tenant manifests in sync with backend provisioning so that features toggled in JSON match capabilities exposed by APIs.

## 9. Reference Appendix

- Types: inspect `src/types/tenant.ts`, `src/types/auth.ts`, and `src/types/routes.ts` whenever you extend tenant configurations, auth payloads, or route metadata to guarantee compile-time coverage.
- Utilities: `src/utils/tenant` contains helpers for detection and theming, `src/utils/auth` manages persistence, and `src/utils/env.ts` abstracts host-specific logic.
- Glossary:
  - **Tenant**: Logical customer partition identified by subdomain or URL segment.
  - **Feature flag**: Boolean switch under `tenant.features` controlling UI or route availability.
  - **Guard**: Policy function returning a redirect or render override to enforce auth or tenant rules.

## 10. Observability & Monitoring

### 10.1 Elastic APM RUM Agent

- The client bundle embeds Elastic RUM (`@elastic/apm-rum`). Base settings come from Vite env vars: `VITE_APM_SERVER_URL`, `VITE_APM_SERVICE_NAME`, `VITE_APM_ENV`, `VITE_APM_SERVICE_VERSION`, `VITE_APM_ACTIVE`, `VITE_APM_LOG_LEVEL`, `VITE_APM_TRANSACTION_SAMPLE_RATE`, and `VITE_APM_DISTRIBUTED_TRACING_ORIGINS`. Configure them in your hosting platform’s environment to point at the Elastic APM intake endpoint (Cloud or self-hosted).
- Tenant manifests can override or disable telemetry per customer via the optional `apm` block (`active`, `serviceName`, `serverUrl`, `environment`, `logLevel`, `distributedTracingOrigins`). See the shipping examples in `public/tenants/*.json`.
- Bootstrapping happens synchronously before React renders and re-evaluates once tenant data resolves:

```1:36:src/monitoring/elasticApm.ts
import { init as initApm } from '@elastic/apm-rum';
// ... existing code ...
export const setupElasticApm = (tenant?: TenantConfig) => {
  const resolved = resolveApmConfig(tenant);
  // ... existing code ...
  apmInstance = initApm(rumConfig);
  return apmInstance;
};
```

```1:12:src/main.tsx
import { setupElasticApm } from './monitoring/elasticApm';
// ... existing code ...
setupElasticApm();
```

```1:34:src/App.tsx
import { setupElasticApm } from './monitoring/elasticApm';
// ... existing code ...
  useEffect(() => {
    setupElasticApm(tenant);
    // ... existing code ...
  }, [tenant]);
```

- Distributed tracing headers are automatically attached by the APM agent; outgoing Axios requests gain explicit spans through the HTTP interceptors:

```1:120:src/services/apiClient.ts
  if (apm) {
    const method = config.method?.toUpperCase() ?? 'GET';
    const spanName = `${method} ${config.url ?? ''}`.trim();
    const span = apm.startSpan(spanName, 'http', 'request');
    // ... existing code ...
  }
```

- Validation workflow:
  1. Deploy with `active=true` (env var or tenant override) and confirm the APM server URL is reachable from browsers.
  2. Load the app, switch routes, and trigger API calls; in Elastic Observability, you should see the new service (named per env/tenant overrides) under **APM → Services** with browser transactions and spans.
  3. Tail `/var/log/app/frontend-errors.log` alongside APM dashboards to ensure correlation via shared `traceId`/`spanId` fields, then point Filebeat/Elastic Agent at the same path for ingestion.

### 10.2 Frontend Crash Log Shipping

- Hosting platforms must persist unhandled errors and fatal UI events to `/var/log/app/frontend-errors.log`. The front-end bundle surfaces structured error payloads; platform glue (for example, Nginx sidecars or container entrypoints) is responsible for writing them to disk.
- Emit JSON Lines (`.jsonl`) entries with the following schema so Elastic Agent/Filebeat can forward without normalization:
  - `@timestamp` (ISO-8601 UTC string)
  - `level` (`error`, `warn`, or `info`)
  - `tenantId` (slug resolved from host)
  - `message` (human-readable summary)
  - `traceId` and `spanId` when available from Elastic APM headers
  - `context` (object for optional fields such as `route`, `userId`, or custom tags)
- Keep log rotation and retention outside the React bundle. Configure the hosting layer to rotate at 50 MB or daily, retaining at least seven days to guarantee shipping agents catch up after outages.
- Filebeat/Elastic Agent should tail the path verbatim and ship to Elastic APM/Logstash using the `logs-ui` pipeline. Include multiline handling disabled (one JSON object per line) and forward the same `tenantId` to support tenant-level dashboards.
- If multi-container deployments are used, mount a shared volume at `/var/log/app` so that crash logs remain accessible to the shipping sidecar even when the front-end container restarts.

---

### Quick Reference Checklist

- Resolve tenant → `getTenantIdFromHost()` → `loadTenant()` → `applyTheme()`.
- Authenticate user → `initializeAuth()`/`login()` → `GuardedRoute` enforces access.
- Fetch data → `api.<method>()` with automatic headers → handle `ApiError`.
- Add functionality → update types, manifests, routes, and tests together to keep the platform tenant-safe.
