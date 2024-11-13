// TransferOwnership.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

function TransferOwnership() {
  const [productId, setProductId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  // Fetch accounts from the backend API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_accounts');
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const handleTransferOwnership = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/transfer_ownership', {
        product_id: productId,
        new_owner: selectedAccount,
        location: location,
        selected_owner: selectedOwner,
      });
      setMessage(response.data.message);
      setProductId('');
      setSelectedAccount('');
      setLocation('');
      setSelectedOwner('');
    } catch (error) {
      console.error(error);
      setMessage('Error transferring ownership.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Transfer Ownership
      </Typography>
      <form onSubmit={handleTransferOwnership}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Logged In User</InputLabel>
            <Select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              label="Logged In User"
            >
              {accounts.map((account, index) => (
                <MenuItem key={index} value={account.address}>
                  {account.role} ({account.address})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Product ID"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>New Owner</InputLabel>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              label="New Owner"
            >
              {accounts.map((account, index) => (
                <MenuItem key={index} value={account.address}>
                  {account.role} ({account.address})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        <Button variant="contained" color="primary" type="submit">
          Transfer Ownership
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

export default TransferOwnership;
