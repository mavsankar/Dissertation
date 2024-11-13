// PredictiveAnalysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
} from '@mui/material';

function PredictiveAnalysis() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/predict');
        setPredictions(response.data.predictions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Predictive Analysis
      </Typography>
      {Array.isArray(predictions) && predictions.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Based on historical data, the following products are likely to be added in the next time period:
          </Typography>
          <List>
            {predictions.map((prediction, index) => (
              <ListItem key={index}>
                <ListItemText primary={prediction} />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Typography variant="body1">No predictions available.</Typography>
      )}
    </Paper>
  );
}

export default PredictiveAnalysis;
