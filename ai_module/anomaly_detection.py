import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_anomalies(data):
    # Preprocess data
    # Convert categorical variables to numeric if necessary
    data_encoded = pd.get_dummies(data, columns=['event', 'location'])

    # Exclude non-numeric columns
    numeric_columns = data_encoded.select_dtypes(include=[np.number]).columns
    numeric_data = data_encoded[numeric_columns]

    # Handle missing values
    numeric_data = numeric_data.fillna(0)

    model = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
    model.fit(numeric_data)
    data['anomaly_score'] = model.decision_function(numeric_data)
    data['anomaly'] = model.predict(numeric_data)
    anomalies = data[data['anomaly'] == -1]
    return anomalies
