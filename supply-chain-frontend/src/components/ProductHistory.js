import React, { useState } from "react";
import axios from "axios";

function ProductHistory() {
  const [productId, setProductId] = useState("");
  const [history, setHistory] = useState([]);

  const handleGetHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/product_history/${productId}`
      );
      setHistory(response.data.history);
    } catch (error) {
      console.error(error);
      setHistory([]);
    }
  };

  return (
    <div>
      <h3>Product History</h3>
      <div>
        <label>Product ID:</label>
        <br />
        <input
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={handleGetHistory}>Get History</button>
      </div>
      {history.length > 0 && (
        <ul>
          {history.map((event, index) => (
            <li key={index}>
              <p>
                <strong>Event:</strong> {event.event}
              </p>
              <p>
                <strong>Block Number:</strong> {event.blockNumber}
              </p>
              <p>
                <strong>Transaction Hash:</strong> {event.transactionHash}
              </p>
              <p>
                <strong>Data:</strong> {JSON.stringify(event.data)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductHistory;
