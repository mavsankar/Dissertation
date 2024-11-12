import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ persona, setPersona }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setPersona(null);
    navigate("/");
  };

  return (
    <nav>
      <h2>Supply Chain Blockchain Demo</h2>
      {persona && (
        <ul>
          {persona === "supplier" && (
            <>
              <li>
                <Link to="/supplier">Dashboard</Link>
              </li>
              <li>
                <Link to="/supplier/add-product">Add Product</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
          {persona === "FreightManagement" && (
            <>
              <li>
                <Link to="/FreightManagement">Dashboard</Link>
              </li>
              <li>
                <Link to="/FreightManagement/transfer-ownership">
                  Transfer Ownership
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
          {persona === "company" && (
            <>
              <li>
                <Link to="/company">Dashboard</Link>
              </li>
              <li>
                <Link to="/company/view-products">View Products</Link>
              </li>
              <li>
                <Link to="/company/product-details">Product Details</Link>
              </li>
              <li>
                <Link to="/company/product-history">Product History</Link>
              </li>
              <li>
                <Link to="/predictive-analysis">Predictive Analysis</Link>
              </li>
              <li>
                <Link to="/anomaly-detection">Anomaly Detection</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
