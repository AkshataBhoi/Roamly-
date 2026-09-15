import sys
import json
import os
import pandas as pd
import joblib
from xgboost import XGBClassifier

# Get absolute path to the directory containing this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(ML_DIR, "models")

PREPROCESSOR_PATH = os.path.join(MODELS_DIR, "preprocessor.joblib")
MODEL_PATH = os.path.join(MODELS_DIR, "xgboost_model.json")

def load_artifacts():
    if not os.path.exists(PREPROCESSOR_PATH):
        raise FileNotFoundError(f"Preprocessor file not found at: {PREPROCESSOR_PATH}")
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

    preprocessor = joblib.load(PREPROCESSOR_PATH)
    model = XGBClassifier()
    model.load_model(MODEL_PATH)
    return preprocessor, model

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"error": "Empty input provided to batch predictor"}))
            sys.exit(1)

        items = json.loads(raw_input)
        if not isinstance(items, list) or len(items) == 0:
            print(json.dumps({"predictions": []}))
            sys.exit(0)

        preprocessor, model = load_artifacts()

        # Expected features in the exact training order
        feature_columns = [
            "city",
            "category",
            "mood",
            "available_time_min",
            "distance_km",
            "visit_duration_min",
            "preference_match",
            "is_open",
            "time_fit",
            "distance_fit"
        ]

        df = pd.DataFrame(items)
        # Ensure all columns exist
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0

        df = df[feature_columns]

        # Preprocess features
        X_encoded = preprocessor.transform(df)

        # Batch prediction
        probabilities = model.predict_proba(X_encoded)
        predictions = model.predict(X_encoded)

        results = []
        for i in range(len(items)):
            prob_suitability_1 = float(probabilities[i][1])
            predicted_class = int(predictions[i])
            results.append({
                "suitability_probability": prob_suitability_1,
                "suitability_class": predicted_class
            })

        print(json.dumps({"predictions": results}))

    except Exception as e:
        error_response = {
            "error": str(e)
        }
        print(json.dumps(error_response), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
