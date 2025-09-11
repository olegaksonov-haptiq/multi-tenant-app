import React from 'react';

export const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
    <a href="#">🏠 Dashboard</a>
    <a href="#">📊 Reports</a>
    <a href="#">⚙️ Settings</a>
  </aside>
);
