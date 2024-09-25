import pandas as pd
from web3 import Web3
import json

blockchain_address = 'http://127.0.0.1:8545'
web3 = Web3(Web3.HTTPProvider(blockchain_address))

def fetch_blockchain_data(contract):
    from_block = 0
    to_block = 'latest'

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
    # Create data lists
    data_list = []

    # Process ProductAdded events
    for event in product_added_events:
        data_list.append({
            'timestamp': event['blockNumber'],  # Use block number as a proxy for time
            'event': 'ProductAdded',
            'product_id': event['args']['id'],
            'name': event['args']['name'],
            'owner': event['args']['owner'],
            'location': event['args']['location']
        })

    # Process OwnershipTransferred events
    for event in ownership_transferred_events:
        data_list.append({
            'timestamp': event['blockNumber'],
            'event': 'OwnershipTransferred',
            'product_id': event['args']['id'],
            'from': event['args']['from'],
            'to': event['args']['to'],
            'location': event['args']['location']
        })
        
    for event in data_list:
        block = web3.eth.get_block(event['timestamp'])
        event['timestamp'] = pd.to_datetime(block['timestamp'], unit='s')

    # Create DataFrame
    df = pd.DataFrame(data_list)
    return df
