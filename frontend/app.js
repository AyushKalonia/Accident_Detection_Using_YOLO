const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const errorDiv = document.getElementById('error');
const submitButton = document.getElementById('submitButton');
const startWebcam = document.getElementById('startWebcam');
const stopWebcam = document.getElementById('stopWebcam');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const alertBadge = document.getElementById('alertBadge');
const confidenceFill = document.getElementById('confidenceFill');
const confidenceText = document.getElementById('confidenceText');

let videoStream;
let captureInterval;

/* ================= DASHBOARD UPDATE (FIXED) ================= */
function updateDashboard(data) {
    if (!data || !("accident" in data)) {
        alertBadge.textContent = "No Detection";
        alertBadge.className = "badge safe";
        confidenceFill.style.width = "0%";
        confidenceText.textContent = "0%";
        return;
    }

    const confidence = data.accident_confidence || 0;

    confidenceFill.style.width = confidence + "%";
    confidenceText.textContent = confidence + "%";

    if (data.accident) {
        alertBadge.textContent = "Accident Detected";
        alertBadge.className = "badge danger";
    } else {
        alertBadge.textContent = "No Accident";
        alertBadge.className = "badge safe";
    }
}

/* ================= DRAG & DROP ================= */
dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('highlight');
});

dropArea.addEventListener('dragleave', () =>
    dropArea.classList.remove('highlight')
);

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => handleFiles(fileInput.files));

function handleFiles(files) {
    fileList.innerHTML = '';
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            let preview;
            if (file.type.startsWith('image/')) {
                preview = document.createElement('img');
                preview.src = URL.createObjectURL(file);
            } else {
                preview = document.createElement('video');
                preview.src = URL.createObjectURL(file);
                preview.controls = true;
            }

            const fileName = document.createElement('p');
            fileName.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;

            fileItem.appendChild(preview);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);
        } else {
            errorDiv.textContent = `File "${file.name}" is not an image or video.`;
        }
    });
}

/* ================= IMAGE UPLOAD DETECTION ================= */
submitButton.addEventListener('click', () => {
    const file = fileInput.files[0];

    if (!file) {
        errorDiv.textContent = "Please upload an image.";
        return;
    }
    errorDiv.textContent = "";

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                canvas.style.display = 'block';
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                data.boxes.forEach((box, index) => {
                    const [x1, y1, x2, y2] = box;
                    context.lineWidth = 2;

                    context.strokeStyle =
                        data.classes[index] === 0 ? 'red' :
                            data.classes[index] === 1 ? 'green' : 'blue';

                    context.strokeRect(x1, y1, x2 - x1, y2 - y1);
                });

                // ✅ FIXED
                updateDashboard(data);
            };
        })
        .catch(() => {
            errorDiv.textContent = "Prediction failed.";
        });
});

/* ================= WEBCAM DETECTION ================= */
startWebcam.addEventListener('click', async () => {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('videoElement');
        video.srcObject = videoStream;
        video.style.display = 'block';

        video.addEventListener('play', () => {
            captureInterval = setInterval(() => {
                if (!video.paused && !video.ended) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(blob => {
                        const formData = new FormData();
                        formData.append('file', blob, 'frame.jpg');

                        fetch('http://localhost:5000/predict', {
                            method: 'POST',
                            body: formData
                        })
                            .then(res => res.json())
                            .then(data => {
                                data.boxes.forEach((box, index) => {
                                    const [x1, y1, x2, y2] = box;
                                    context.lineWidth = 2;

                                    context.strokeStyle =
                                        data.classes[index] === 0 ? 'red' :
                                            data.classes[index] === 1 ? 'green' : 'blue';

                                    context.strokeRect(x1, y1, x2 - x1, y2 - y1);
                                });

                                // ✅ FIXED
                                updateDashboard(data);
                            });
                    }, 'image/jpeg');
                }
            }, 1000);
        });
    } catch {
        errorDiv.textContent = "Webcam access denied.";
    }
});

/* ================= STOP WEBCAM ================= */
stopWebcam.addEventListener('click', () => {
    clearInterval(captureInterval);
    const video = document.getElementById('videoElement');

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    video.style.display = 'none';
});
