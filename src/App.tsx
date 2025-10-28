import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTenant } from './utils/tenant/tenantContext';
import { applyTheme } from './utils/tenant/applyTheme';
import Layout from './components/layout/Layout';
import Router from './routes/Router';
import { AuthProvider } from './hooks/useAuth';

const App: React.FC = () => {
  const { tenant, loading } = useTenant();

  useEffect(() => {
    if (tenant?.theme) {
      applyTheme(tenant.theme);
    }
  }, [tenant]);

  if (loading) return <div>Loading tenant...</div>;

  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Router />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
