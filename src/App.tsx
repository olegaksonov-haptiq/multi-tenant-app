import React, { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/Dashboard";
import { useTenant } from "./utils/tenant/TenantProvider";
import { applyTheme } from "./utils/tenant/applyTheme";

const App: React.FC = () => {
  const { tenant, loading } = useTenant();

  useEffect(() => {
    if (tenant?.theme) {
      applyTheme(tenant.theme);
    }
  }, [tenant]);

  if (loading) return <div>Loading tenant...</div>;

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default App;
