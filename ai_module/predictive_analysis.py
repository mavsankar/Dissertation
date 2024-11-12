import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def prepare_data(series, time_steps=10):
    X, y = [], []
    for i in range(len(series) - time_steps):
        X.append(series[i:i+time_steps])
        y.append(series[i+time_steps])
    return np.array(X), np.array(y)

def predict_event_occurrences(data):
    # Filter 'ProductAdded' events
    data = data[data['event'] == 'ProductAdded']

    # Create a time series of event counts per time interval (e.g., per hour)
    data.set_index('timestamp', inplace=True)
    event_counts = data.resample('10s').size().reset_index(name='event_count')
    print(event_counts)
    # Ensure there is enough data
    if len(event_counts) < 20:
        return np.array(["Cannot predict with insufficient data"])  

    # Prepare data for time series prediction
    time_steps = 10
    series = event_counts['event_count'].values
    X, y = prepare_data(series, time_steps)

    # Reshape input to be [samples, time steps, features]
    X = X.reshape((X.shape[0], X.shape[1], 1))

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=(time_steps, 1)))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')

    # Fit model
    model.fit(X, y, epochs=50, batch_size=16, verbose=1)

    # Make predictions for the next time step
    last_sequence = series[-time_steps:].reshape(1, time_steps, 1)
    prediction = model.predict(last_sequence)

    return prediction.flatten()
