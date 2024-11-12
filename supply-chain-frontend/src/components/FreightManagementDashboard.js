import React from 'react';
import { Outlet } from 'react-router-dom';

function FreightManagementDashboard() {
  return (
    <div>
      <h2>FreightManagement Dashboard</h2>
      <Outlet />
    </div>
  );
}

export default FreightManagementDashboard;
