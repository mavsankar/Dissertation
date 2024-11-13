import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonaSelection from "./components/PersonaSelection";
import SupplierDashboard from "./components/SupplierDashboard";
import FreightManagementDashboard from "./components/FreightManagementDashboard";
import CompanyDashboard from "./components/CompanyDashboard";
import AddProduct from "./components/AddProduct";
import TransferOwnership from "./components/TransferOwnership";
import ViewProducts from "./components/ViewProducts";
import ProductDetails from "./components/ProductDetails";
import ProductHistory from "./components/ProductHistory";
import SupplierHome from "./components/SupplierHome";
import FreightManagementHome from "./components/FreightManagementHome";
import CompanyHome from "./components/CompanyHome";
import Navbar from "./components/Navbar";
import PredictiveAnalysis from "./components/PredictiveAnalysis";
import AnomalyDetection from "./components/AnomalyDetection";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline } from "@mui/material";

function App() {
  const [persona, setPersona] = useState(null);

  const theme = createTheme({
    palette: {
      mode: "light", // You can switch between 'light' and 'dark' modes
      primary: {
        main: "#1976d2", // Customize your primary color
      },
      secondary: {
        main: "#dc004e", // Customize your secondary color
      },
    },
    typography: {
      fontFamily: "Roboto, Arial",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar persona={persona} setPersona={setPersona} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route
              path="/"
              element={<PersonaSelection setPersona={setPersona} />}
            />

            <Route path="/supplier/*" element={<SupplierDashboard />}>
              <Route index element={<SupplierHome />} />
              <Route path="add-product" element={<AddProduct />} />
            </Route>

            <Route
              path="/FreightManagement/*"
              element={<FreightManagementDashboard />}
            >
              <Route index element={<FreightManagementHome />} />
              <Route path="transfer-ownership" element={<TransferOwnership />} />
            </Route>

            <Route path="/company/*" element={<CompanyDashboard />}>
              <Route index element={<CompanyHome />} />
              <Route path="view-products" element={<ViewProducts />} />
              <Route path="product-details" element={<ProductDetails />} />
              <Route path="product-history" element={<ProductHistory />} />
              <Route path="predictive-analysis" element={<PredictiveAnalysis />} />
              <Route path="anomaly-detection" element={<AnomalyDetection />} />
            </Route>
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
