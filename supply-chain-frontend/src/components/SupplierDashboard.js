// SupplierDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';

function SupplierDashboard() {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Dashboard
      </Typography>
      <Outlet />
    </Paper>
  );
}

export default SupplierDashboard;
