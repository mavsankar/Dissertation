// ProductHistory.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

function ProductHistory() {
  const [productId, setProductId] = useState('');
  const [history, setHistory] = useState([]);

  const handleGetHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/product_history/${productId}`);
      setHistory(response.data.history);
    } catch (error) {
      console.error(error);
      setHistory([]);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Product History
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
      <Button variant="contained" color="primary" onClick={handleGetHistory}>
        Get History
      </Button>
      {history.length > 0 && (
        <List sx={{ mt: 4 }}>
          {history.map((event, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`Event: ${event.event}`}
                secondary={
                  <>
                    <Typography variant="body2">
                      <strong>Block Number:</strong> {event.blockNumber}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Transaction Hash:</strong> {event.transactionHash}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data:</strong> {JSON.stringify(event.data)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default ProductHistory;
