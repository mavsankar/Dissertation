import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [supplierAccount, setSupplierAccount] = useState('');

  // Fetch accounts from the backend API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_accounts');
        setAccounts(response.data.accounts);
        // Find the supplier account
        const supplier = response.data.accounts.find(account => account.role === 'Supplier');
        if (supplier) {
          setSupplierAccount(supplier.address);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Include the supplier's address in the request if needed
      const response = await axios.post('http://localhost:5000/add_product', {
        product_name: productName,
        location: location,
        // owner: supplierAccount, // If the backend accepts owner parameter
      });
      setMessage(response.data.message);
      setProductName('');
      setLocation('');
    } catch (error) {
      console.error(error);
      setMessage('Error adding product.');
    }
  };

  return (
    <div>
      <h3>Add Product</h3>
      <form onSubmit={handleAddProduct}>
        <div>
          <label>Product Name:</label><br/>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label><br/>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        {/* Optional: Display the supplier's address */}
        {supplierAccount && (
          <div>
            <p><strong>Supplier Address:</strong> {supplierAccount}</p>
          </div>
        )}
        <button type="submit">Add Product</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddProduct;
