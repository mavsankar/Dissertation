// AnomalyDetection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  List,
  ListItem,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';

function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/anomalies');
        setAnomalies(response.data.anomalies);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnomalies();
  }, []);

  const formatAnomalyData = (anomaly) => {
    const eventType = anomaly.event;

    if (eventType === 'ProductAdded') {
      return (
        <>
          <Typography variant="body2">
            <strong>Product ID:</strong> {anomaly.product_id}
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {anomaly.name}
          </Typography>
          <Typography variant="body2">
            <strong>Owner:</strong> {anomaly.owner}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {anomaly.location}
          </Typography>
          <Typography variant="body2">
            <strong>Timestamp:</strong> {anomaly.timestamp}
          </Typography>
        </>
      );
    } else if (eventType === 'OwnershipTransferred') {
      return (
        <>
          <Typography variant="body2">
            <strong>Product ID:</strong> {anomaly.product_id}
          </Typography>
          <Typography variant="body2">
            <strong>From:</strong> {anomaly.from}
          </Typography>
          <Typography variant="body2">
            <strong>To:</strong> {anomaly.to}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {anomaly.location}
          </Typography>
          <Typography variant="body2">
            <strong>Timestamp:</strong> {anomaly.timestamp}
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <Typography variant="body2">
            <strong>Event Data:</strong> {JSON.stringify(anomaly)}
          </Typography>
        </>
      );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Anomaly Detection
      </Typography>
      {anomalies.length > 0 ? (
        <List>
          {anomalies.map((anomaly, index) => (
            <ListItem key={index} disablePadding>
              <Card
                variant="outlined"
                sx={{
                  width: '100%',
                  mb: 2,
                  borderLeft: '5px solid',
                  borderColor:
                    anomaly.event === 'ProductAdded'
                      ? 'primary.main'
                      : anomaly.event === 'OwnershipTransferred'
                      ? 'secondary.main'
                      : 'grey.500',
                }}
              >
                <CardHeader
                  title={`Anomaly ${index + 1}`}
                  subheader={`Event: ${anomaly.event}`}
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
                <CardContent>{formatAnomalyData(anomaly)}</CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No anomalies detected.</Typography>
      )}
    </Paper>
  );
}

export default AnomalyDetection;
