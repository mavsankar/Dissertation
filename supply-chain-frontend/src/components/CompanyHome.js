// CompanyHome.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

function CompanyHome() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome, Company!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="view-products"
        sx={{ mt: 2 }}
      >
        View Products
      </Button>
    </Box>
  );
}

export default CompanyHome;
