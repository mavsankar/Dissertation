// src/components/SupplyChainMap.js
import React from "react";
import "./SupplyChainMap.css";

function SupplyChainMap({ productId, events }) {
  if (!events || events.length === 0) {
    return <p>No events found for this product.</p>;
  }

  return (
    <div className="supply-chain-map">
      <h3>Supply Chain Journey for Product ID: {productId}</h3>
      <div className="timeline">
        {events.map((event, index) => (
          <div key={index} className="timeline-event">
            <div className="event-content">
              <h4>{event.event}</h4>
              <p>
                <strong>Block Number:</strong> {event.blockNumber}
              </p>
              <p>
                <strong>Transaction Hash:</strong> {event.transactionHash}
              </p>
              <p>
                <strong>Data:</strong> {JSON.stringify(event.data)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplyChainMap;
