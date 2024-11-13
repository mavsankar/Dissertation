// AddProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [supplierAccount, setSupplierAccount] = useState('');

  // Fetch accounts from the backend API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_accounts');
        setAccounts(response.data.accounts);
        // Find the supplier account
        const supplier = response.data.accounts.find(account => account.role === 'Supplier');
        if (supplier) {
          setSupplierAccount(supplier.address);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Include the supplier's address in the request if needed
      const response = await axios.post('http://localhost:5000/add_product', {
        product_name: productName,
        location: location,
        // owner: supplierAccount, // If the backend accepts owner parameter
      });
      setMessage(response.data.message);
      setProductName('');
      setLocation('');
    } catch (error) {
      console.error(error);
      setMessage('Error adding product.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleAddProduct}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
          />
        </Box>
        {supplierAccount && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            <strong>Supplier Address:</strong> {supplierAccount}
          </Typography>
        )}
        <Button variant="contained" color="primary" type="submit">
          Add Product
        </Button>
      </form>
      {message && (
        <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
}

export default AddProduct;
