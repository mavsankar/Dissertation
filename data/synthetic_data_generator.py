import pandas as pd
import numpy as np

def generate_synthetic_data(num_records=1000):
    data = pd.DataFrame({
        'timestamp': pd.date_range(start='2023-01-01', periods=num_records, freq='H'),
        'product_id': np.random.randint(1, 100, size=num_records),
        'demand': np.random.poisson(lam=20, size=num_records),
        'supply': np.random.poisson(lam=22, size=num_records),
        'location': np.random.choice(['Factory', 'Warehouse', 'Store'], size=num_records)
    })
    data.to_csv('synthetic_data.csv', index=False)

if __name__ == "__main__":
    generate_synthetic_data()
