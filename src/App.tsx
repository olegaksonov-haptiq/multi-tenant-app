import React, { useEffect, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Router from './routes/Router';
import { initializeAuth } from './store/auth/authSlice';
import { useAppDispatch } from './store/hooks';
import { useTenant } from './store/tenant/hooks';
import { loadTenant } from './store/tenant/tenantSlice';
import { applyTheme } from './utils/tenant/applyTheme';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tenant } = useTenant();

  useEffect(() => {
    void dispatch(loadTenant());
    void dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (tenant?.theme) {
      applyTheme(tenant.theme);
    }
  }, [tenant]);

  return (
    <BrowserRouter>
      <Suspense fallback={<></>}>
        <Layout>
          <Router />
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
