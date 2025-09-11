import React, { useEffect } from 'react';
import { useTenant } from './utils/tenant/tenantContext';
import Dashboard from './components/Dashboard';
import { applyTheme } from './utils/tenant/applyTheme';
import Layout from './components/layout/Layout';

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
