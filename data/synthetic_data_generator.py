import requests
import json
import time

# API base URL
API_BASE_URL = 'http://localhost:5000'

# Fetch accounts from the API
def get_accounts():
    response = requests.get(f'{API_BASE_URL}/get_accounts')
    accounts = response.json()['accounts']
    return accounts

def add_product(product_name, location, selected_owner):
    payload = {
        'product_name': product_name,
        'location': location,
        'owner': selected_owner
    }
    response = requests.post(f'{API_BASE_URL}/add_product', json=payload)
    print(f'Add Product Response: {response.json()}')

def transfer_ownership(product_id, new_owner_address, location, selected_owner):
    payload = {
        'product_id': product_id,
        'new_owner': new_owner_address,
        'location': location,
        'selected_owner': selected_owner
    }
    response = requests.post(f'{API_BASE_URL}/transfer_ownership', json=payload)
    print(f'Transfer Ownership Response: {response.json()}')

def main():
    # Get accounts
    accounts = get_accounts()
    suppliers = [acc for acc in accounts if acc['role'] == 'Supplier']
    freight_providers = [acc for acc in accounts if acc['role'] == 'Freight Provider']
    companies = [acc for acc in accounts if acc['role'] == 'Company']
    
    if not suppliers or not freight_providers or not companies:
        print('Error: Not all roles are available in the accounts.')
        return
    print(suppliers, freight_providers, companies)
    total_products = 20
    # Add multiple products
    print('\nAdding Products...')
    for i in range(1, total_products):
        product_name = f'Product_{i}'
        location = 'Factory A'
        selected_owner = suppliers[0]
        print(f'Adding {product_name} by Supplier {selected_owner}')
        add_product(product_name, location, selected_owner)
        # time.sleep(1)  # Pause to simulate time between actions
    # Perform ownership transfers
    print('\nTransferring Ownerships...')
    # Assuming product IDs start from 1
    product_ids = list(range(1, total_products))
    for pid in product_ids:
        # Transfer from Supplier to Freight Provider
        print(f'\nTransferring ownership of product {pid} to Freight Provider')
        selected_owner = suppliers[0]
        new_owner = freight_providers[0]
        transfer_ownership(pid, new_owner, 'Warehouse B', selected_owner)
        time.sleep(1)
        
        # Transfer from Freight Provider to Company
        print(f'Transferring ownership of product {pid} to Company')
        selected_owner = new_owner
        new_owner = companies[0]
        transfer_ownership(pid, new_owner, 'Store C', selected_owner)
        time.sleep(1)

    # Introduce anomalies
    print('\n--- Introducing Anomalies ---')

    # Anomaly 1: Company transfers product back to Supplier
    print('\nAnomaly 1: Company transfers product back to Supplier')
    pid = product_ids[0]  # Use the first product
    selected_owner = companies[0]  # Current owner is company
    new_owner = suppliers[0]['address']
    transfer_ownership(pid, new_owner, 'Returned Goods Warehouse', selected_owner)
    time.sleep(1)
    
    # Anomaly 2: Product moves to an unexpected location
    print('\nAnomaly 2: Product moves to an unexpected location')
    pid = product_ids[1]  # Use the second product
    selected_owner = companies[0]['address']  # Current owner is company
    new_owner = companies[0]['address']  # Ownership remains the same
    unusual_location = 'Antarctica Research Station'
    transfer_ownership(pid, new_owner, unusual_location, selected_owner)
    time.sleep(1)
    
    # Anomaly 3: Rapid successive transfers to different addresses
    print('\nAnomaly 3: Rapid successive transfers of a product')
    pid = product_ids[2]  # Use the third product
    current_owner = companies[0]['address']
    for i in range(5):
        # Transfer to different freight providers (simulate multiple addresses)
        selected_owner = current_owner
        new_owner = freight_providers[i % len(freight_providers)]['address']
        location = f'Location_{i}'
        print(f'Transfer {i+1}: Product {pid} from {selected_owner} to {new_owner}')
        transfer_ownership(pid, new_owner, location, selected_owner)
        current_owner = new_owner  # Update current owner for next transfer
        time.sleep(0.5)  # Short pause to simulate rapid transfers

    # Ensure the product ends up back with the company for consistency
    print(f'\nReturning product {pid} back to Company')
    selected_owner = current_owner
    new_owner = companies[0]['address']
    transfer_ownership(pid, new_owner, 'Final Destination', selected_owner)

if __name__ == '__main__':
    main()
