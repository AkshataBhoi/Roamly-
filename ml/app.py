import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import pandas as pd
import joblib
from xgboost import XGBClassifier

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
PREPROCESSOR_PATH = os.path.join(MODELS_DIR, "preprocessor.joblib")
MODEL_PATH = os.path.join(MODELS_DIR, "xgboost_model.json")

# Module-level cached model artifacts (loaded once per instance)
_preprocessor = None
_model = None

FEATURE_COLUMNS = [
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

def get_artifacts():
    global _preprocessor, _model
    if _preprocessor is None or _model is None:
        if not os.path.exists(PREPROCESSOR_PATH):
            raise FileNotFoundError(f"Preprocessor file not found at: {PREPROCESSOR_PATH}")
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

        _preprocessor = joblib.load(PREPROCESSOR_PATH)
        _model = XGBClassifier()
        _model.load_model(MODEL_PATH)
    return _preprocessor, _model

def predict_places(items):
    if not items:
        return []

    preprocessor, model = get_artifacts()
    df = pd.DataFrame(items)

    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    df = df[FEATURE_COLUMNS]
    X_encoded = preprocessor.transform(df)

    probabilities = model.predict_proba(X_encoded)
    predictions = model.predict(X_encoded)

    results = []
    for i in range(len(items)):
        results.append({
            "suitability_probability": float(probabilities[i][1]),
            "suitability_class": int(predictions[i])
        })
    return results

class MLServiceHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, data):
        response_bytes = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        if self.path == "/health" or self.path == "/":
            self._send_json(200, {"status": "ok", "service": "roamly-ml-service"})
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        if self.path == "/predict" or self.path == "/":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                items = json.loads(body)

                if not isinstance(items, list):
                    self._send_json(400, {"error": "Input must be a JSON array of features"})
                    return

                predictions = predict_places(items)
                self._send_json(200, {"predictions": predictions})
            except Exception as e:
                self._send_json(500, {"error": str(e)})
        else:
            self._send_json(404, {"error": "Not found"})

    def log_message(self, format, *args):
        # Suppress noisy standard request logs
        return

# Standard WSGI entrypoint for Vercel Python Serverless / Services runtime
def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET").upper()
    path = environ.get("PATH_INFO", "/")

    if method == "GET":
        response_body = json.dumps({"status": "ok", "service": "roamly-ml-service"}).encode("utf-8")
        status = "200 OK"
        headers = [
            ("Content-Type", "application/json"),
            ("Content-Length", str(len(response_body)))
        ]
        start_response(status, headers)
        return [response_body]

    if method == "POST":
        try:
            content_length = int(environ.get("CONTENT_LENGTH", 0))
            body = environ["wsgi.input"].read(content_length).decode("utf-8")
            items = json.loads(body)

            if not isinstance(items, list):
                response_body = json.dumps({"error": "Input must be a JSON array of features"}).encode("utf-8")
                start_response("400 Bad Request", [("Content-Type", "application/json"), ("Content-Length", str(len(response_body)))])
                return [response_body]

            predictions = predict_places(items)
            response_body = json.dumps({"predictions": predictions}).encode("utf-8")
            start_response("200 OK", [("Content-Type", "application/json"), ("Content-Length", str(len(response_body)))])
            return [response_body]
        except Exception as e:
            response_body = json.dumps({"error": str(e)}).encode("utf-8")
            start_response("500 Internal Server Error", [("Content-Type", "application/json"), ("Content-Length", str(len(response_body)))])
            return [response_body]

    response_body = json.dumps({"error": "Not found"}).encode("utf-8")
    start_response("404 Not Found", [("Content-Type", "application/json"), ("Content-Length", str(len(response_body)))])
    return [response_body]

# Alias handler to app for Vercel functions compatibility
handler = app

def run(port=5001):
    server_address = ("", port)
    httpd = HTTPServer(server_address, MLServiceHandler)
    print(f"Roamly ML Service listening on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    # Pre-warm model in memory
    try:
        get_artifacts()
        print("Model and preprocessor loaded successfully.")
    except Exception as err:
        print(f"Warning loading artifacts during startup: {err}")
    run(port)
