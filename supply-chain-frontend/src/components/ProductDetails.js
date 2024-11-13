// ProductDetails.js
import React, { useState } from 'react';
import axios from 'axios';
import SupplyChainMap from './SupplyChainMap';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

function ProductDetails() {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [events, setEvents] = useState([]);

  const handleGetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/product_details/${productId}`);
      setProduct(response.data.product);
      setEvents(response.data.events);
    } catch (error) {
      console.error(error);
      setProduct(null);
      setEvents([]);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Product Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Product ID"
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          fullWidth
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleGetDetails}>
        Get Details
      </Button>
      {product && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Product Information
          </Typography>
          <Typography variant="body1">
            <strong>ID:</strong> {product.id}
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {product.name}
          </Typography>
          <Typography variant="body1">
            <strong>Current Owner:</strong> {product.currentOwner}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {product.location}
          </Typography>
          <SupplyChainMap productId={productId} events={events} />
        </Box>
      )}
    </Paper>
  );
}

export default ProductDetails;
