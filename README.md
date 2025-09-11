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
````

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
  layout?: "navbar" | "sidebar" | "both";
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
  id: "client-a",
  displayName: "Client A Racing",
  branding: {
    logo: "/logos/client-a.png"
  },
  layout: "both",
  features: {
    advancedReports: true,
    reportCharts: false
  },
  footerText: "Powered by Client A Technologies"
};
```

---

## 🎨 Theming

* Colors and branding are powered by **CSS variables** (`theme.scss`).
* Variables are set dynamically from tenant config:

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
<div style={{ backgroundColor: "var(--primary)", color: "white" }}>
  Tenant themed section
</div>
```

---