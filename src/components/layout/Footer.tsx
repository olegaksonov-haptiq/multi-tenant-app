import React from 'react';
import { useTenant } from '../../utils/tenant/tenantContext';

export const Footer: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <footer className="footer">
      © {new Date().getFullYear()} {tenant?.displayName || 'My App'}
    </footer>
  );
};
