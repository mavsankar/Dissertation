import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def prepare_data(data, feature, time_steps=10):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[feature].values[i:i+time_steps])
        y.append(data[feature].values[i+time_steps])
    return np.array(X), np.array(y)

def predict_event_occurrences(data):
    # We'll predict the occurrence of 'ProductAdded' events over time
    # Create a time series of event counts per block
    event_counts = data.groupby('timestamp').size().reset_index(name='event_count')
    # Prepare data for time series prediction
    time_steps = 10
    X, y = prepare_data(event_counts, 'event_count', time_steps)
    if(len(X) == 0):
        return "Cannot predict with so less data"
    
    X = X.reshape((X.shape[0], X.shape[1], 1))

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=(time_steps, 1)))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')

    # Fit model
    model.fit(X, y, epochs=20, batch_size=32, verbose=0)

    # Make predictions
    predictions = model.predict(X)
    return predictions
