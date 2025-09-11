import React, { Suspense, lazy } from 'react';
import { useTenant } from '../utils/tenant/tenantContext';
import '../styles/theme.scss';
import { UserList } from './UserList';

const AdvancedReports = lazy(() => import('./AdvancedReports'));

export const Dashboard: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <div>
      <h2 className="text-2xl font-bold">{tenant?.displayName} Dashboard</h2>
      <div className="dashboard">
        <div className="card">
          <h3>📈 Reports</h3>
          {tenant?.features?.advancedReports ? (
            <Suspense fallback={<div>Loading reports...</div>}>
              <AdvancedReports />
            </Suspense>
          ) : (
            <p>Basic reporting is enabled.</p>
          )}
        </div>

        <div className="card">
          <h3>⚡ Data</h3>
          {tenant?.features?.reportCharts ? <p>Data are enabled for your account.</p> : <p>Upgrade to enable Data.</p>}
        </div>

        <div className="card">
          <h3>🎨 Theming</h3>
          <p>Your app is themed with tenant-specific colors.</p>
          <button className="button">Sample button</button>
        </div>
      </div>
      <UserList />
    </div>
  );
};

export default Dashboard;
