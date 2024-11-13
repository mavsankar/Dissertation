import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';

function PersonaSelection({ setPersona }) {
  const navigate = useNavigate();

  const handleSelect = (persona) => {
    setPersona(persona);
    navigate(`/${persona}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select Your Persona
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" align="center">
                Supplier
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Manage and add new products to the supply chain.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSelect('supplier')}
              >
                Select Supplier
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" align="center">
                Freight Management
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Transfer ownership and manage logistics.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSelect('FreightManagement')}
              >
                Select Freight Management
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" align="center">
                Company
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                View products and analyze supply chain data.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSelect('company')}
              >
                Select Company
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PersonaSelection;
