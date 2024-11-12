import sys
from pathlib import Path
import os

from flask_cors import CORS
sys.path.append(str(Path(__file__).resolve().parents[1]))

from flask import Flask, jsonify, request
from web3 import Web3
import json
import pymongo
from ai_module.anomaly_detection import detect_anomalies
from ai_module.predictive_analysis import predict_event_occurrences
from data.blockchain_data_fetcher import fetch_blockchain_data
import pandas as pd

app = Flask(__name__)
# Configure Cors
CORS(app, resources={r'/*': {'origins': '*'}})

# Blockchain connection
blockchain_address = 'http://127.0.0.1:8545'
web3 = Web3(Web3.HTTPProvider(blockchain_address))
web3.eth.default_account = web3.eth.accounts[0]  # Set default account

# Load contract ABI and address from file path folder
with open(r'C:\Users\mavsa\Desktop\repos\supply_chain_project\blockchain\build\contracts\SupplyChain.json') as f:
    contract_json = json.load(f)
    contract_abi = contract_json['abi']

contract_address = '0xE24Dbf5C6BCD25080164E60e732Cc3c5E2AcF9fa'  # Replace with actual contract address from migration
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Database connection
db = pymongo.MongoClient("mongodb://localhost:27017/")['supply_chain_db']

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Supply Chain API"})

@app.route('/get_accounts', methods=['GET'])
def get_accounts():
    accounts = web3.eth.accounts
    # Map accounts to roles
    roles = ['Supplier', 'Freight Provider', 'Company']
    account_roles = [{'address': account, 'role': roles[i % len(roles)]} for i, account in enumerate(accounts[0:len(roles)])]
    return jsonify({'accounts': account_roles})


@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.json
    product_name = data.get('product_name')
    location = data.get('location')
    owner_address = data.get('owner', web3.eth.default_account)  # Use provided owner or default

    # Interact with smart contract
    tx_hash = contract.functions.addProduct(product_name, location).transact({
        'from': owner_address
    })
    web3.eth.wait_for_transaction_receipt(tx_hash)

    return jsonify({"message": "Product added successfully", "product_name": product_name, "location": location})



@app.route('/transfer_ownership', methods=['POST'])
def transfer_ownership():
    data = request.json
    product_id = int(data.get('product_id'))
    new_owner_address = data.get('new_owner')
    location = data.get('location')
    selected_owner = data.get('selected_owner')

    # Convert to checksum address
    new_owner_address = web3.to_checksum_address(new_owner_address)

    # Retrieve current owner from the smart contract
    product = contract.functions.products(product_id).call()
    current_owner = product[2]

    # Interact with smart contract
    tx_hash = contract.functions.transferOwnership(
        product_id, new_owner_address, location
    ).transact({
        'from': selected_owner  # Use the current owner as the sender
    })
    web3.eth.wait_for_transaction_receipt(tx_hash)

    return jsonify({"message": "Ownership transferred successfully", "product_id": product_id, "new_owner": new_owner_address, "location": location})


@app.route('/product_details/<int:product_id>', methods=['GET'])
def product_details(product_id):
    # Retrieve product information
    product = contract.functions.products(product_id).call()

    product_info = {
        'id': product[0],
        'name': product[1],
        'currentOwner': product[2],
        'location': product[3]
    }

    # Fetch events related to the product
    from_block = 0
    to_block = 'latest'

    # Fetch ProductAdded events
    product_added_events = contract.events.ProductAdded().get_logs(
        from_block=from_block,
        to_block=to_block,
        argument_filters={'id': product_id}
    )

    # Fetch OwnershipTransferred events
    ownership_transferred_events = contract.events.OwnershipTransferred().get_logs(
        from_block=from_block,
        to_block=to_block,
        argument_filters={'id': product_id}
    )

    # Combine events and extract transaction hashes
    events = []

    for event in product_added_events + ownership_transferred_events:
        tx_hash = event['transactionHash'].hex()
        events.append({
            'event': event['event'],
            'transactionHash': tx_hash,
            'blockNumber': event['blockNumber'],
            'data': {k: str(v) for k, v in event['args'].items()}
        })

    # Return product info and events
    return jsonify({"product": product_info, "events": events})



@app.route('/predict', methods=['GET'])
def predict():
    # Fetch data from blockchain
    data = fetch_blockchain_data(contract)
    predictions = predict_event_occurrences(data)
    predictions_list = predictions.tolist()  # Convert ndarray to list
    return jsonify({"predictions": predictions_list})


@app.route('/anomalies', methods=['GET'])
def anomalies():
    # Fetch data from blockchain
    data = fetch_blockchain_data(contract)
    anomalies = detect_anomalies(data)
    anomalies_list = anomalies.where(pd.notnull(anomalies), None).to_dict(orient='records')
    return jsonify({"anomalies": anomalies_list})


@app.route('/product_history/<int:product_id>', methods=['GET'])
def product_history(product_id):
    # Fetch events related to the product
    product_added_filter = contract.events.ProductAdded.create_filter(
        from_block=0,
        argument_filters={'id': product_id}
    )
    ownership_transferred_filter = contract.events.OwnershipTransferred.create_filter(
        from_block=0,
        argument_filters={'id': product_id}
    )

    # Get event logs
    added_events = product_added_filter.get_all_entries()
    transferred_events = ownership_transferred_filter.get_all_entries()

    # Compile the history
    history = []

    for event in added_events:
        history.append({
            'event': 'ProductAdded',
            'blockNumber': event['blockNumber'],
            'data': {
                'id': event['args']['id'],
                'name': event['args']['name'],
                'owner': event['args']['owner'],
                'location': event['args']['location']
            }
        })

    for event in transferred_events:
        history.append({
            'event': 'OwnershipTransferred',
            'blockNumber': event['blockNumber'],
            'data': {
                'id': event['args']['id'],
                'from': event['args']['from'],
                'to': event['args']['to'],
                'location': event['args']['location']
            }
        })

    # Sort history by block number
    history.sort(key=lambda x: x['blockNumber'])

    return jsonify({"history": history})


@app.route('/blockchain_data', methods=['GET'])
def blockchain_data():
    # Fetch all events from the blockchain
    from_block = 0  # Starting block
    to_block = 'latest'  # Up to the latest block

    # Fetch ProductAdded events
    product_added_events = contract.events.ProductAdded.create_filter(
        from_block=from_block,
        to_block=to_block
    ).get_all_entries()

    # Fetch OwnershipTransferred events
    ownership_transferred_events = contract.events.OwnershipTransferred.create_filter(
        from_block=from_block,
        to_block=to_block
    ).get_all_entries()

    # Combine events
    events = []

    # Process ProductAdded events
    for event in product_added_events:
        events.append({
            'event': 'ProductAdded',
            'blockNumber': event['blockNumber'],
            'transactionHash': event['transactionHash'].hex(),
            'data': {
                'id': event['args']['id'],
                'name': event['args']['name'],
                'owner': event['args']['owner'],
                'location': event['args']['location']
            }
        })

    # Process OwnershipTransferred events
    for event in ownership_transferred_events:
        events.append({
            'event': 'OwnershipTransferred',
            'blockNumber': event['blockNumber'],
            'transactionHash': event['transactionHash'].hex(),
            'data': {
                'id': event['args']['id'],
                'from': event['args']['from'],
                'to': event['args']['to'],
                'location': event['args']['location']
            }
        })

    # Sort events by block number
    events.sort(key=lambda x: x['blockNumber'])

    return jsonify({"events": events})

if __name__ == '__main__':
    app.run(debug=True)
