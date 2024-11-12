import React from 'react';
import { Outlet } from 'react-router-dom';
import BlockchainVisualization from './BlockchainVisualization';

// Inside the CompanyDashboard component
function CompanyDashboard() {
  return (
    <div>
      <h2>Company Dashboard</h2>
      <BlockchainVisualization />
      <Outlet />
    </div>
  );
}


export default CompanyDashboard;
