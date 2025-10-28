import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => (
  <div className="error-page">
    <div className="error-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export const Unauthorized: React.FC = () => (
  <div className="error-page">
    <div className="error-content">
      <h1>403</h1>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this resource.</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export const FeatureUnavailable: React.FC = () => (
  <div className="error-page">
    <div className="error-content">
      <h1>🔒</h1>
      <h2>Feature Unavailable</h2>
      <p>This feature is not available for your tenant.</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  </div>
);
