import pandas as pd

DATA_PATH = "data/roamly_training.csv"

df = pd.read_csv(DATA_PATH)

print("\nDataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nSuitability distribution:")
print(df["suitability"].value_counts())

print("\nMissing values:")
print(df.isnull().sum())