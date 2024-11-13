// CompanyDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';
import BlockchainVisualization from './BlockchainVisualization';

function CompanyDashboard() {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Company Dashboard
      </Typography>
      <BlockchainVisualization />
      <Outlet />
    </Paper>
  );
}

export default CompanyDashboard;
