import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from flask import Flask, render_template, request, redirect, url_for
from web3 import Web3
import json
import pymongo
from ai_module.anomaly_detection import detect_anomalies
from ai_module.predictive_analysis import predict_event_occurrences
from data.blockchain_data_fetcher import fetch_blockchain_data

app = Flask(__name__)

# Blockchain connection
blockchain_address = 'http://127.0.0.1:8545'
web3 = Web3(Web3.HTTPProvider(blockchain_address))
web3.eth.default_account = web3.eth.accounts[0]  # Set default account

# Load contract ABI and address
with open('../blockchain/build/contracts/SupplyChain.json') as f:
    contract_json = json.load(f)
    contract_abi = contract_json['abi']

contract_address = '0xc605C62EEB4d43c9aFD8349B304fE995A4b6E429'  # Replace with actual contract address from migration
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Database connection
db = pymongo.MongoClient("mongodb://localhost:27017/")['supply_chain_db']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        product_name = request.form['product_name']
        location = request.form['location']
        
        # Interact with smart contract
        tx_hash = contract.functions.addProduct(product_name, location).transact({
            'from': web3.eth.default_account
        })
        web3.eth.wait_for_transaction_receipt(tx_hash)

        return redirect(url_for('index'))
    else:
        return render_template('add_product.html')

    
@app.route('/transfer_ownership', methods=['GET', 'POST'])
def transfer_ownership():
    if request.method == 'POST':
        product_id = int(request.form['product_id'])
        new_owner_address = request.form['new_owner']
        location = request.form['location']
        
        # Convert to checksum address
        new_owner_address = web3.to_checksum_address(new_owner_address)

        # Interact with smart contract
        tx_hash = contract.functions.transferOwnership(
            product_id, new_owner_address, location
        ).transact({
            'from': web3.eth.default_account
        })
        web3.eth.wait_for_transaction_receipt(tx_hash)

        return redirect(url_for('index'))
    else:
        return render_template('transfer_ownership.html', owners = web3.eth.accounts)


@app.route('/product_details', methods=['GET', 'POST'])
def product_details():
    if request.method == 'POST':
        product_id = int(request.form['product_id'])

        # Retrieve product information
        product = contract.functions.products(product_id).call()

        product_info = {
            'id': product[0],
            'name': product[1],
            'currentOwner': product[2],
            'location': product[3]
        }

        return render_template('product_details.html', product=product_info)
    else:
        return render_template('product_details_form.html')

@app.route('/predict', methods=['GET'])
def predict():
    # Fetch data from blockchain
    data = fetch_blockchain_data(contract)
    predictions = predict_event_occurrences(data)
    return render_template('predictions.html', predictions=predictions)

@app.route('/anomalies', methods=['GET'])
def anomalies():
    # Fetch data from blockchain
    data = fetch_blockchain_data(contract)
    anomalies = detect_anomalies(data)
    return render_template('anomalies.html', anomalies=anomalies.to_html())


@app.route('/product_history', methods=['GET', 'POST'])
def product_history():
    if request.method == 'POST':
        product_id = int(request.form['product_id'])

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

        return render_template('product_history.html', history=history, product_id=product_id)
    else:
        return render_template('product_history_form.html')

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
    print(product_added_events)
    print(ownership_transferred_events)

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

    return render_template('blockchain_data.html', events=events)

if __name__ == '__main__':
    app.run(debug=True)
