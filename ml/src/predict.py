import pandas as pd
import joblib

from xgboost import XGBClassifier


# ============================================================
# 1. LOAD SAVED PREPROCESSOR
# ============================================================

PREPROCESSOR_PATH = "models/preprocessor.joblib"

preprocessor = joblib.load(PREPROCESSOR_PATH)


# ============================================================
# 2. LOAD SAVED XGBOOST MODEL
# ============================================================

MODEL_PATH = "models/xgboost_model.json"

model = XGBClassifier()

model.load_model(MODEL_PATH)


# ============================================================
# 3. CREATE A NEW ROAMLY USER + PLACE EXAMPLE
# ============================================================

new_place = pd.DataFrame([
    {
        "city": "Mumbai",
        "category": "park",
        "mood": "relax",
        "available_time_min": 180,
        "distance_km": 2.5,
        "visit_duration_min": 60,
        "preference_match": 0.85,
        "is_open": 1,
        "time_fit": 1,
        "distance_fit": 1
    }
])


# ============================================================
# 4. PREPROCESS NEW DATA
# ============================================================

new_place_encoded = preprocessor.transform(new_place)


# ============================================================
# 5. PREDICT SUITABILITY
# ============================================================

prediction = model.predict(new_place_encoded)

probability = model.predict_proba(new_place_encoded)


# ============================================================
# 6. DISPLAY RESULT
# ============================================================

predicted_class = int(prediction[0])

suitability_score = float(probability[0][1])


print("\n==============================")
print("ROAMLY ML PREDICTION")
print("==============================")

print("\nPlace information:")
print(new_place.to_string(index=False))

print("\nPrediction:")
print(
    "Suitable" if predicted_class == 1
    else "Not suitable"
)

print(f"\nSuitability probability: {suitability_score:.2%}")