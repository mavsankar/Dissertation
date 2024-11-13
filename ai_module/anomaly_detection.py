import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import DBSCAN

def detect_anomalies(data):
    # Copy data to avoid modifying the original dataset
    data = data.copy()
    # Print data where event is OwnershipTransferred
    print(data[data['event'] == 'OwnershipTransferred'].head())
    # Ensure necessary columns are present
    required_columns = ['event', 'from', 'to','product_id', 'location', 'timestamp', 'name', 'owner']
    for col in required_columns:
        if col not in data.columns:
            raise ValueError(f'Missing required column: {col}')
    
    # Sort data
    data.sort_values(by=['timestamp'], inplace=True)
    
    # Feature Engineering
    # Time difference between events for the same product
    data['time_diff'] = data.groupby('product_id')['timestamp'].diff().dt.total_seconds()
    data['time_diff'].fillna(0, inplace=True)
    
    # Map addresses to roles
    owner_role_mapping = {
        '0x0D994Ae49Ed8787FFF884e1565769802fDffE409': 'Supplier',
        '0xA39FE293D49D42e0EB4A8cfe636DD17a9352423d': 'Freight Provider',
        '0x3db38037F29019339809b4EF20Cf64AcD64f2f54': 'Company',
    }
    data['from_role'] = data['from'].map(owner_role_mapping)
    data['to_role'] = data['to'].map(owner_role_mapping)
    
    # Handle missing roles
    data['from_role'].fillna('Unknown', inplace=True)
    data['to_role'].fillna('Unknown', inplace=True)
    
    # Encode categorical variables
    label_encoders = {}
    categorical_columns = ['event', 'from_role', 'to_role', 'location', 'name', 'owner']
    for col in categorical_columns:
        le = LabelEncoder()
        data[col + '_encoded'] = le.fit_transform(data[col])
        label_encoders[col] = le  # Save encoders if needed later
    
    # Select features
    feature_columns = ['event_encoded', 'from_role_encoded', 'to_role_encoded', 'location_encoded', 'time_diff', 'product_id', 'name_encoded', 'owner_encoded']
    X = data[feature_columns]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply DBSCAN
    dbscan = DBSCAN(eps=1.5, min_samples=5)
    data['cluster'] = dbscan.fit_predict(X_scaled)
    
    # Identify anomalies
    data['anomaly'] = data['cluster'] == -1
    anomalies = data[data['anomaly']]
    
    # Return anomalies
    return anomalies

