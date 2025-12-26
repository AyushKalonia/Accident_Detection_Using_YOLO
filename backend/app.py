from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import torch
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# ================= PATH SETUP =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best.pt")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

# ================= MODEL LOAD =================
device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO(MODEL_PATH)
model.to(device)

# ================= CONFIDENCE THRESHOLDS =================
CONF_DETECTION = 0.25   # YOLO detection threshold
CONF_ACCIDENT = 0.70    # Decision threshold

@app.route("/")
def home():
    return jsonify({
        "message": "Road Accident Detection API running",
        "device": device
    })


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    try:
        image_bytes = request.files["file"].read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        results = model.predict(
            source=image,
            imgsz=640,
            conf=CONF_DETECTION,
            device=device,
            verbose=False
        )[0]

        boxes = []
        scores = []
        classes = []

        accident_detected = False
        max_accident_conf = 0.0

        if results.boxes is not None:
            for box, score, cls in zip(
                results.boxes.xyxy,
                results.boxes.conf,
                results.boxes.cls
            ):
                score = float(score)
                cls = int(cls)

                boxes.append(box.cpu().tolist())
                scores.append(score)
                classes.append(cls)

                # 🚨 Accident decision logic
                if cls == 0 and score >= CONF_ACCIDENT:
                    accident_detected = True
                    max_accident_conf = max(max_accident_conf, score)

        return jsonify({
            "boxes": boxes,
            "scores": scores,
            "classes": classes,
            "accident": accident_detected,
            "accident_confidence": round(max_accident_conf * 100, 2)
        })

    except Exception as e:
        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


# ================= MAIN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
