import React from 'react';

const AdminPanel: React.FC = () => {
  return (
    <div style={{ border: '1px solid var(--accent)', padding: '1rem' }}>
      <h3 className="text-lg">Admin Panel</h3>
      <p>Here you can manage your tenants.</p>
    </div>
  );
};

export default AdminPanel;
