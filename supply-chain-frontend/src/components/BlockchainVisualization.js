// src/components/BlockchainVisualization.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlockchainVisualization.css";

function BlockchainVisualization() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/blockchain_data"
        );
        const events = response.data.events;

        // Group events by block number to simulate blocks
        const blocksData = events.reduce((acc, event) => {
          const blockNumber = event.blockNumber;
          if (!acc[blockNumber]) {
            acc[blockNumber] = {
              blockNumber,
              transactions: [],
            };
          }
          acc[blockNumber].transactions.push(event);
          return acc;
        }, {});

        setBlocks(Object.values(blocksData));
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlockchainData();

    // Poll every 5 seconds for new data
    const interval = setInterval(fetchBlockchainData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="blockchain-visualization">
      <h3>Blockchain Ledger</h3>
      <div className="blocks">
        {blocks.map((block) => (
          <div key={block.blockNumber} className="block">
            <h4>Block #{block.blockNumber}</h4>
            <div className="transactions">
              {block.transactions.map((tx, index) => (
                <div key={index} className="transaction">
                  <p>
                    <strong>Tx Hash:</strong> {tx.transactionHash}
                  </p>
                  <p>
                    <strong>Event:</strong> {tx.event}
                  </p>
                  <p>
                    <strong>Data:</strong> {JSON.stringify(tx.data)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockchainVisualization;
