// src/components/AnomalyDetection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

return (
    <div>
        <h3>Anomaly Detection</h3>
        {anomalies.length > 0 ? (
            <ul>
                {anomalies.map((anomaly, index) => (
                    <li key={index}>
                        <p><strong>Event:</strong> {anomaly.event}</p>
                        <p><strong>Name:</strong> {anomaly.name}</p>
                        <p><strong>Location:</strong> {anomaly.location}</p>
                        <p><strong>Owner:</strong> {anomaly.owner}</p>
                        <p><strong>Product ID:</strong> {anomaly.product_id}</p>
                        <p><strong>Timestamp:</strong> {anomaly.timestamp}</p>
                        <p><strong>Anomaly Score:</strong> {anomaly.anomaly_score}</p>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No anomalies detected.</p>
        )}
    </div>
);
}

export default AnomalyDetection;
