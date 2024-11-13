// ViewProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Box,
} from '@mui/material';

function ViewProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blockchain_data');
        const productEvents = response.data.events.filter(
          (event) => event.event === 'ProductAdded'
        );
        setProducts(productEvents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Available Products
      </Typography>
      {products.length > 0 ? (
        <List>
          {products.map((event, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`ID: ${event.data.id}`}
                secondary={`Name: ${event.data.name}`}
              />
              <Button
                variant="outlined"
                component={RouterLink}
                to="/company/product-details"
                state={{ productId: event.data.id }}
              >
                View Details
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No products available.</Typography>
      )}
    </Paper>
  );
}

export default ViewProducts;
