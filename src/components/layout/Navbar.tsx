import React from "react";
import { useTenant } from "../../utils/tenant/TenantProvider";
import "../../styles/theme.scss";

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenuButton }) => {
  const { tenant } = useTenant();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showMenuButton && (
          <button className="menu-toggle" onClick={onMenuClick}>
            ☰
          </button>
        )}
        {tenant?.branding?.logo && (
          <img src={tenant.branding.logo} alt="logo" className="navbar-logo" />
        )}
      </div>
      <div className="navbar-links">
        <a href="#">Home</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>
      </div>
    </nav>
  );
};
