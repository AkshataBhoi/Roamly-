import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report
)

from xgboost import XGBClassifier


# ============================================================
# 1. LOAD DATASET
# ============================================================

DATA_PATH = "data/roamly_training.csv"

df = pd.read_csv(DATA_PATH)


# ============================================================
# 2. SEPARATE FEATURES AND TARGET
# ============================================================

# place_name is an identifier, not a useful ML feature.
# state is excluded because city already represents location
# context for this small Roamly model.

X = df.drop(
    columns=["suitability", "place_name", "state"]
)

y = df["suitability"]


# ============================================================
# 3. DEFINE FEATURE TYPES
# ============================================================

categorical_features = [
    "city",
    "category",
    "mood"
]

numerical_features = [
    "available_time_min",
    "distance_km",
    "visit_duration_min",
    "preference_match",
    "is_open",
    "time_fit",
    "distance_fit"
]


# ============================================================
# 4. CREATE PREPROCESSOR
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# ============================================================
# 5. SPLIT DATASET
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ============================================================
# 6. PREPROCESS DATA
# ============================================================

X_train_encoded = preprocessor.fit_transform(X_train)

X_test_encoded = preprocessor.transform(X_test)


print("\nOriginal feature count:", X.shape[1])
print("Encoded feature count:", X_train_encoded.shape[1])

print("\nTraining samples:", X_train_encoded.shape[0])
print("Testing samples:", X_test_encoded.shape[0])


# ============================================================
# 7. CREATE XGBOOST MODEL
# ============================================================

model = XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    random_state=42,
    eval_metric="logloss"
)


# ============================================================
# 8. TRAIN MODEL
# ============================================================

print("\nTraining XGBoost model...")

model.fit(
    X_train_encoded,
    y_train
)

print("Training completed!")


# ============================================================
# 9. MAKE PREDICTIONS
# ============================================================

y_pred = model.predict(X_test_encoded)


# ============================================================
# 10. EVALUATE MODEL
# ============================================================

accuracy = accuracy_score(y_test, y_pred)

precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)


print("\n==============================")
print("XGBOOST MODEL PERFORMANCE")
print("==============================")

print(f"Accuracy  : {accuracy:.2f}")
print(f"Precision : {precision:.2f}")
print(f"Recall    : {recall:.2f}")
print(f"F1 Score  : {f1:.2f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)


# ============================================================
# 11. SAVE TRAINED MODEL
# ============================================================

MODEL_PATH = "models/xgboost_model.json"

model.save_model(MODEL_PATH)

print(f"\nXGBoost model saved to: {MODEL_PATH}")


# ============================================================
# 12. SAVE PREPROCESSOR
# ============================================================

PREPROCESSOR_PATH = "models/preprocessor.joblib"

joblib.dump(
    preprocessor,
    PREPROCESSOR_PATH
)

print(
    f"Preprocessor saved to: {PREPROCESSOR_PATH}"
)


# ============================================================
# 13. FINAL STATUS
# ============================================================

print("\n===================================")
print("ML TRAINING PIPELINE COMPLETED")
print("===================================")