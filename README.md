# 🚨 Accident Detection Using YOLO

A real-time **Road Accident Detection System** built using **YOLO (You Only Look Once)**, **Flask**, and a **modern responsive web dashboard**.
The system detects road accidents from images or live webcam feed and triggers alerts based on **confidence-threshold decision logic** to reduce false positives.

> ⚠️ **Project Status Notice**  
> This project is developed **strictly for learning, experimentation, and academic demonstration purposes**.  
> It is **not production-ready** and **not intended for real-world deployment** in its current form.  
> Several improvements, validations, and safety mechanisms are required before it can be deployed in a real environment.

---

## 📌 Features

- 🚗 Real-time accident detection using YOLO
- 📷 Image upload & live webcam detection
- 🎯 Confidence-based accident confirmation
- 🚨 Visual alert badge for accident detection
- 📊 Confidence score meter
- 📱 Mobile-first responsive dashboard
- ⚡ Optimized Flask backend with GPU support
- 🔒 Reduced false positives using decision thresholds

---

## 🧠 System Architecture

Frontend (HTML/CSS/JS) → Flask REST API → YOLO Model (best.pt) → Accident Decision Logic (Confidence Threshold)

---

## 🛠️ Tech Stack

### 🔹 Frontend
- HTML5
- CSS3 (Responsive, Mobile-first)
- JavaScript (Canvas API, Fetch API)

### 🔹 Backend
- Python
- Flask
- Flask-CORS

### 🔹 Machine Learning
- YOLO (Ultralytics)
- PyTorch
- OpenCV (implicit via YOLO)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/Accident-Detection-Using-YOLO.git
cd Accident-Detection-Using-YOLO
```
### 2️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on:
http://localhost:5000

### 3️⃣ Frontend Setup
Open `frontend/index.html` in your browser  
(or use Live Server in VS Code)

---

## 🎯 Confidence-Based Decision Logic

To avoid false accident alerts:

- YOLO detection threshold: **0.25**
- Accident confirmation threshold: **0.70**

Only detections with **≥ 70% confidence** are classified as accidents.

---

## 🎓 Academic Use Case

This project is suitable for:
- IoT-based safety systems
- Computer Vision projects
- Machine Learning applications
- Final-year / semester projects
- Real-time ML system demonstrations

---

## 🚀 Future Enhancements

- 🔔 Emergency sound alert
- 📍 GPS & location-based alerts
- 📊 Detection history & logs
- ☁️ Cloud deployment
- 🧠 Improved dataset & model training

---

## 👨‍💻 Author

**Ayush Kalonia**  
India

---

You are free to use, modify, and distribute this project with attribution.

---

## ⭐ Acknowledgements

- Ultralytics YOLO
- PyTorch
- Flask Community
