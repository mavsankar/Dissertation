// src/components/ProductDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SupplyChainMap from "./SupplyChainMap";

function ProductDetails() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [events, setEvents] = useState([]);

  const handleGetDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/product_details/${productId}`
      );
      setProduct(response.data.product);
      setEvents(response.data.events);
    } catch (error) {
      console.error(error);
      setProduct(null);
      setEvents([]);
    }
  };

  return (
    <div>
      <h3>Product Details</h3>
      <div>
        <label>Product ID:</label>
        <br />
        <input
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={handleGetDetails}>Get Details</button>
      </div>
      {product && (
        <div>
          <p>
            <strong>ID:</strong> {product.id}
          </p>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Current Owner:</strong> {product.currentOwner}
          </p>
          <p>
            <strong>Location:</strong> {product.location}
          </p>

          {/* Include the SupplyChainMap component and pass events */}
          <SupplyChainMap productId={productId} events={events} />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
