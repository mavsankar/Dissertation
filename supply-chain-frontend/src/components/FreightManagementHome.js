// FreightManagementHome.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

function FreightManagementHome() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome, Freight Management!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="transfer-ownership"
        sx={{ mt: 2 }}
      >
        Transfer Product Ownership
      </Button>
    </Box>
  );
}

export default FreightManagementHome;
