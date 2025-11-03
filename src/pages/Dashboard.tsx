import React from 'react';
import { useAuth } from '../store/auth/hooks';
import { useTenant } from '../store/tenant/hooks';
import { UserList } from '../components/UserList';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>Here's what's happening with {tenant?.displayName} today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📊 Overview</h3>
          <p>Your account overview and key metrics.</p>
          <div className="card-stats">
            <div className="stat">
              <span className="stat-value">1,234</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat">
              <span className="stat-value">567</span>
              <span className="stat-label">Active Sessions</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-button">Create New</button>
            <button className="action-button">View Reports</button>
            <button className="action-button">Settings</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>📈 Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">User John Doe logged in</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">4 hours ago</span>
              <span className="activity-text">New report generated</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">System backup completed</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>🎨 Tenant Info</h3>
          <div className="tenant-info">
            <p>
              <strong>Tenant:</strong> {tenant?.displayName}
            </p>
            <p>
              <strong>ID:</strong> {tenant?.id}
            </p>
            <p>
              <strong>Layout:</strong> {tenant?.layout}
            </p>
            <div className="features-list">
              <strong>Features:</strong>
              <ul>
                {tenant?.features &&
                  Object.entries(tenant.features).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value ? '✅' : '❌'}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>User Management</h2>
        <UserList />
      </div>
    </div>
  );
};

export default Dashboard;
