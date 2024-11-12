import React from 'react';
import { Link } from 'react-router-dom';

function FreightManagementHome() {
  return (
    <div>
      <p>Welcome, FreightManagement!</p>
      <Link to="transfer-ownership">Transfer Product Ownership</Link>
    </div>
  );
}

export default FreightManagementHome;
