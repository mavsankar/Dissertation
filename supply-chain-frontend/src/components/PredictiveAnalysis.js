// src/components/PredictiveAnalysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
        <h3>Predictive Analysis</h3>
        {Array.isArray(predictions) && predictions.length > 0 ? (
            <ul>
            Based on historic data, this product is likely to get the following products added in the next time period:
                {predictions.map((prediction, index) => (
                    <li key={index}>{prediction}</li>
                ))}
            </ul>
        ) : (
            <p>No predictions available.</p>
        )}
    </div>
);
}

export default PredictiveAnalysis;
