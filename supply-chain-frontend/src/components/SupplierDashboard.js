import React from 'react';
import { Outlet } from 'react-router-dom';

function SupplierDashboard() {
  return (
    <div>
      <h2>Supplier Dashboard</h2>
      <Outlet />
    </div>
  );
}

export default SupplierDashboard;
