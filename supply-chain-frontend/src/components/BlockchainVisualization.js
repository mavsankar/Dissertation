// BlockchainVisualization.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Tooltip,
  Divider,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function BlockchainVisualization() {
  const [blocks, setBlocks] = useState([]);
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [ledgerExpanded, setLedgerExpanded] = useState(true);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blockchain_data');
        const events = response.data.events;

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

        const sortedBlocks = Object.values(blocksData).sort(
          (a, b) => a.blockNumber - b.blockNumber
        );

        setBlocks(sortedBlocks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlockchainData();

    const interval = setInterval(fetchBlockchainData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBlockExpandClick = (blockNumber) => {
    setExpandedBlocks((prevExpanded) => ({
      ...prevExpanded,
      [blockNumber]: !prevExpanded[blockNumber],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    blocks.forEach((block) => {
      allExpanded[block.blockNumber] = true;
    });
    setExpandedBlocks(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedBlocks({});
  };

  const handleLedgerExpandClick = () => {
    setLedgerExpanded(!ledgerExpanded);
  };

  const formatEventData = (event) => {
    if (event.event === 'ProductAdded') {
      return (
        <>
          <Typography variant="body2">
            <strong>Product ID:</strong> {event.data.id}
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {event.data.name}
          </Typography>
          <Typography variant="body2">
            <strong>Owner:</strong> {event.data.owner}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {event.data.location}
          </Typography>
        </>
      );
    } else if (event.event === 'OwnershipTransferred') {
      return (
        <>
          <Typography variant="body2">
            <strong>Product ID:</strong> {event.data.id}
          </Typography>
          <Typography variant="body2">
            <strong>From:</strong> {event.data.from}
          </Typography>
          <Typography variant="body2">
            <strong>To:</strong> {event.data.to}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {event.data.location}
          </Typography>
        </>
      );
    } else {
      return (
        <Typography variant="body2">
          <strong>Data:</strong> {JSON.stringify(event.data)}
        </Typography>
      );
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <IconButton onClick={handleLedgerExpandClick}>
          <ExpandMoreIcon
            sx={{
              transform: ledgerExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
        <LayersIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5" gutterBottom>
          Blockchain Ledger
        </Typography>
        <Box flexGrow={1} />
        {ledgerExpanded && (
          <>
            <Button variant="outlined" onClick={handleExpandAll} sx={{ mr: 1 }}>
              Expand All
            </Button>
            <Button variant="outlined" onClick={handleCollapseAll}>
              Collapse All
            </Button>
          </>
        )}
      </Box>
      <Collapse in={ledgerExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
          {blocks.map((block) => (
            <Card
              key={block.blockNumber}
              variant="outlined"
              sx={{
                minWidth: 260,
                mx: 1,
                flexShrink: 0,
                backgroundColor: '#f9f9f9',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Tooltip title="Block">
                    <LayersIcon color="primary" sx={{ mr: 1 }} />
                  </Tooltip>
                  <Typography variant="h6">Block #{block.blockNumber}</Typography>
                  <Box flexGrow={1} />
                  <Tooltip title="Expand Transactions">
                    <IconButton
                      size="small"
                      onClick={() => handleBlockExpandClick(block.blockNumber)}
                    >
                      <ExpandMoreIcon
                        sx={{
                          transform: expandedBlocks[block.blockNumber]
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                          transition: 'transform 0.3s',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Collapse in={expandedBlocks[block.blockNumber]} timeout="auto" unmountOnExit>
                  {block.transactions.map((tx, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center">
                        <ReceiptLongIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {tx.event}
                        </Typography>
                      </Box>
                      {formatEventData(tx)}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Tx Hash:</strong> {tx.transactionHash}
                      </Typography>
                      {index < block.transactions.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export default BlockchainVisualization;
