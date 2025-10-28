import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTenant } from '../../utils/tenant/tenantContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

import '../../styles/theme.scss';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useTenant();

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show layout for auth pages and error pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isErrorPage =
    location.pathname.startsWith('/404') ||
    location.pathname.startsWith('/unauthorized') ||
    location.pathname.startsWith('/feature-unavailable');

  if (isAuthPage || isErrorPage) {
    return <div className="auth-layout">{children}</div>;
  }

  const hasSidebar = tenant?.layout === 'sidebar' || tenant?.layout === 'both';
  const hasNavbar = tenant?.layout === 'navbar' || tenant?.layout === 'both';

  return (
    <div className="layout">
      {hasNavbar && <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} showMenuButton={hasSidebar} />}

      <div className="content-wrapper">
        {hasSidebar && sidebarOpen && <Sidebar isOpen={sidebarOpen} />}
        <div className="main-content-wrapper">
          <main className="main-content">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
