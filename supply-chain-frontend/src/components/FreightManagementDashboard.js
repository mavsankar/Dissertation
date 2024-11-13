// FreightManagementDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';

function FreightManagementDashboard() {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Freight Management Dashboard
      </Typography>
      <Outlet />
    </Paper>
  );
}

export default FreightManagementDashboard;
