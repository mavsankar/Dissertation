// src/components/SupplyChainMap.js
import React from 'react';
import { Typography, Box, Card, CardContent, Divider } from '@mui/material';

function SupplyChainMap({ productId, events }) {
  if (!events || events.length === 0) {
    return <Typography>No events found for this product.</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Supply Chain Journey for Product ID: {productId}
      </Typography>
      <Box sx={{ position: 'relative', mt: 4 }}>
        {events.map((event, index) => (
          <Box key={index} sx={{ position: 'relative', mb: 4, pl: 5 }}>
            {/* Timeline Dot */}
            <Box
              sx={{
                position: 'absolute',
                left: 12,
                top: 0,
                width: 16,
                height: 16,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
              }}
            />
            {/* Timeline Line */}
            {index !== events.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 19,
                  top: 16,
                  width: 2,
                  height: 'calc(100% + 16px)',
                  backgroundColor: 'primary.main',
                }}
              />
            )}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{event.event}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  <strong>Block Number:</strong> {event.blockNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Transaction Hash:</strong> {event.transactionHash}
                </Typography>
                <Typography variant="body2">
                  <strong>Data:</strong> {JSON.stringify(event.data)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default SupplyChainMap;
