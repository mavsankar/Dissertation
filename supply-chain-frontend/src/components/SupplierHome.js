import React from 'react';
import { Link } from 'react-router-dom';

function SupplierHome() {
  return (
    <div>
      <p>Welcome, Supplier!</p>
      <Link to="add-product">Add a new product</Link>
    </div>
  );
}

export default SupplierHome;
