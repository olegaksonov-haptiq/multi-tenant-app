import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useAuth } from '../store/auth/hooks';
import { useTenant } from '../store/tenant/hooks';
import { clearError } from '../store/auth/authSlice';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { login, isAuthenticated, error, isLoading } = useAuth();
  const { tenant } = useTenant();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    await login({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          {tenant?.branding?.logo && <img src={tenant.branding.logo} alt={tenant.displayName} className="login-logo" />}
          <h1>Sign in to {tenant?.displayName || 'App'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
