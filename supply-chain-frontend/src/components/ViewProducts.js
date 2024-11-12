import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ViewProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blockchain_data');
        const productEvents = response.data.events.filter(event => event.event === 'ProductAdded');
        setProducts(productEvents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h3>Available Products</h3>
      {products.length > 0 ? (
        <ul>
          {products.map((event, index) => (
            <li key={index}>
              <p><strong>ID:</strong> {event.data.id}</p>
              <p><strong>Name:</strong> {event.data.name}</p>
              <Link to="/company/product-details" state={{ productId: event.data.id }}>View Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}

export default ViewProducts;
