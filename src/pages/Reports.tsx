import React, { Suspense, lazy } from 'react';
import { useTenant } from '../store/tenant/hooks';

const AdvancedReports = lazy(() => import('../components/AdvancedReports'));

const Reports: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>View and analyze your data with comprehensive reports.</p>
      </div>

      <div className="reports-content">
        {tenant?.features?.advancedReports ? (
          <Suspense fallback={<div className="loading">Loading advanced reports...</div>}>
            <AdvancedReports />
          </Suspense>
        ) : (
          <div className="basic-reports">
            <div className="report-card">
              <h3>📊 Basic Reports</h3>
              <p>Basic reporting is enabled for your account.</p>
              <div className="report-actions">
                <button className="btn-primary">Generate Report</button>
                <button className="btn-secondary">Export Data</button>
              </div>
            </div>
          </div>
        )}

        {tenant?.features?.reportCharts ? (
          <div className="charts-section">
            <h3>📈 Data Visualization</h3>
            <div className="charts-grid">
              <div className="chart-placeholder">
                <p>Chart visualization would go here</p>
                <small>Charts are enabled for your account</small>
              </div>
            </div>
          </div>
        ) : (
          <div className="upgrade-prompt">
            <h3>📈 Data Visualization</h3>
            <p>Upgrade your account to enable advanced data visualization and charts.</p>
            <button className="btn-primary">Upgrade Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
