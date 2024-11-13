import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function Navbar({ persona, setPersona }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setPersona(null);
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Supply Chain Blockchain Demo
        </Typography>
        {persona && (
          <>
            {persona === "supplier" && (
              <>
                <Button color="inherit" component={RouterLink} to="/supplier">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/supplier/add-product">
                  Add Product
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
            {persona === "FreightManagement" && (
              <>
                <Button color="inherit" component={RouterLink} to="/FreightManagement">
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/FreightManagement/transfer-ownership"
                >
                  Transfer Ownership
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
            {persona === "company" && (
              <>
                <Button color="inherit" component={RouterLink} to="/company">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/company/view-products">
                  View Products
                </Button>
                <Button color="inherit" component={RouterLink} to="/company/product-details">
                  Product Details
                </Button>
                <Button color="inherit" component={RouterLink} to="/company/product-history">
                  Product History
                </Button>
                <Button color="inherit" component={RouterLink} to="/company/predictive-analysis">
                  Predictive Analysis
                </Button>
                <Button color="inherit" component={RouterLink} to="/company/anomaly-detection">
                  Anomaly Detection
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
  