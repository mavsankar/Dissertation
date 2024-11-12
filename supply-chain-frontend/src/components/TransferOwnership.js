import React, { useState, useEffect } from "react";
import axios from "axios";

function TransferOwnership() {
  const [productId, setProductId] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // Fetch accounts from the backend API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_accounts");
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  const handleTransferOwnership = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/transfer_ownership",
        {
          product_id: productId,
          new_owner: selectedAccount,
          location: location,
          selected_owner: selectedOwner,
        }
      );
      setMessage(response.data.message);
      setProductId("");
      setSelectedAccount("");
      setLocation("");
    } catch (error) {
      console.error(error);
      setMessage("Error transferring ownership.");
    }
  };

  return (
    <div>
      <h3>Transfer Ownership</h3>
      <form onSubmit={handleTransferOwnership}>
        <div>
          <label>Logged In User:</label>
          <br />
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            required
          >
            <option value="">Select New Owner</option>
            {accounts.map((account, index) => (
              <option key={index} value={account.address}>
                {account.role} ({account.address})
              </option>
            ))}
          </select>
          <br />
        </div>
        <div>
          <label>Product ID:</label>
          <br />
          <input
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Owner:</label>
          <br />
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            required
          >
            <option value="">Select New Owner</option>
            {accounts.map((account, index) => (
              <option key={index} value={account.address}>
                {account.role} ({account.address})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Location:</label>
          <br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Transfer Ownership</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default TransferOwnership;
