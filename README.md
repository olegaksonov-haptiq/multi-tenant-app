# Multi-Tenant React App (Vite + TypeScript + SCSS)

This project is a **multi-tenant React application** built with **Vite + TypeScript + SCSS**.  
It allows multiple clients (tenants) to use the same codebase but with **isolated themes, features, and layouts**.

---

## 🎯 Key Features

- **Multi-Tenant Support**  
  Each client (tenant) can have its own **branding, theme, and layout**.

- **Secure Tenant Isolation**  
  No data leakage between tenants — UI and features are controlled via config.

- **Configurable**
  - 🎨 Themes via CSS variables (`--primary`, `--accent`)
  - 🖼 Logos & names
  - ⚙️ Layouts (`navbar`, `sidebar`, `both`)
  - ✨ Features (`Reports`, `Pie Charts`, etc.)

- **Scalable**  
  Single codebase serves multiple clients.

- **Performant**
  - Lazy loading (`React.lazy + Suspense`) for features like advanced reports.
  - CSS variables from API for lightweight theming.

- **Maintainable**  
  Config-driven design, no code duplication across tenants.

---

## ⚙️ Prerequisites

Before running the app, make sure you have:

- **Node.js** ≥ 20
- **npm** ≥ 10 (or `yarn` / `pnpm`)

---

## 🚀 Running the Application

### 1. Clone the repo

```bash
git clone https://github.com/vishwajit-haptiq/multi-tenant-app.git
cd multi-tenant-react-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run in development

```bash
npm run dev
```

App will run at [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

---

## 📡 API Layer

The app now uses a centralized Axios client that automatically adds tenant and security headers to every request.

- `src/services/apiClient.ts` – configures Axios, injects `Authorization`, `X-Tenant-Id`, and a `X-Request-Id`, and normalizes errors into a consistent `ApiError`.
- `src/services/api.ts` – lightweight helpers (`api.get`, `api.post`, etc.) that return deserialized data.

### Example usage

```ts
import { api } from '../services/api';

const users = await api.get('/users');
```

### Testing the API layer

Vitest for unit tests. Is built to mirror Jest’s API but is optimized for Vite/ESM builds.

Zero extra bundler config, faster runs (thanks to Vite + esbuild), and straightforward TypeScript support out of the box. It also integrates cleanly with the existing tooling (no global setup tweaks or Babel layer required) and keeps our test runner consistent with the dev server.

Run the targeted tests with:

```bash
npm run test
```

The tests live under `src/services/__tests__` and validate that tenant and auth headers are set and that errors are normalized.

---

## 🛠️ Tenant Configuration

Each tenant is defined in a **config object** inside `TenantProvider.tsx`
(or fetched dynamically from an API).

Example tenant config:

```ts
export interface TenantConfig {
  id: string;
  displayName: string;
  theme: Record<string, string>;
  branding?: {
    logo?: string;
  };
  layout?: 'navbar' | 'sidebar' | 'both';
  features: {
    advancedReports: boolean;
    reportCharts: boolean;
  };
  footerText?: string; // Optional footer override
}
```

Example:

```ts
const tenant: TenantConfig = {
  id: 'client-a',
  displayName: 'Client A Racing',
  branding: {
    logo: '/logos/client-a.png',
  },
  layout: 'both',
  features: {
    advancedReports: true,
    reportCharts: false,
  },
  footerText: 'Powered by Client A Technologies',
};
```

---

## 🎨 Theming

- Colors and branding are powered by **CSS variables** (`theme.scss`).
- Variables are set dynamically from tenant config:

```scss
:root {
  --primary: #19345e;
  --accent: #ffb100;
  --fontFamily: system-ui, sans-serif;
  --bg: #f9fafb;
  --text: #333;
}
```

Example usage in JSX:

```tsx
<div style={{ backgroundColor: 'var(--primary)', color: 'white' }}>Tenant themed section</div>
```

---
