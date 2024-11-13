// SupplierHome.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

function SupplierHome() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome, Supplier!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="add-product"
        sx={{ mt: 2 }}
      >
        Add a New Product
      </Button>
    </Box>
  );
}

export default SupplierHome;
