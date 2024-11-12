import React from 'react';
import { Link } from 'react-router-dom';

function CompanyHome() {
  return (
    <div>
      <p>Welcome, Company!</p>
      <Link to="view-products">View Products</Link>
    </div>
  );
}

export default CompanyHome;
