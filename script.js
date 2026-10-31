
import {
    FilesetResolver,
    HandLandmarker,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const video = document.getElementById("webcam");
const canvas = document.getElementById("output");
const button = document.getElementById("startButton");
const status = document.getElementById("status");

let handLandmarker;
let drawingUtils;

async function setupAI() {
    status.textContent = "Loading hand recognition AI...";

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },
        runningMode: "VIDEO",
        numHands: 2
    });

    drawingUtils = new DrawingUtils(canvas.getContext("2d"));
}

function detectHands() {
    if (!handLandmarker || video.readyState < 2) {
        requestAnimationFrame(detectHands);
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const results = handLandmarker.detectForVideo(
        video,
        performance.now()
    );

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks.length > 0) {
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                HandLandmarker.HAND_CONNECTIONS,
                { color: "#00FF00", lineWidth: 4 }
            );

            drawingUtils.drawLandmarks(
                landmarks,
                { color: "#FF0000", lineWidth: 2 }
            );
        }

        status.textContent =
            "AI detected " + results.landmarks.length + " hand(s)!";
    } else {
        status.textContent = "Show your hands to the camera";
    }

    requestAnimationFrame(detectHands);
}

button.addEventListener("click", async () => {
    try {
        button.disabled = true;

        await setupAI();

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = stream;
        await video.play();

        status.textContent = "AI is ready! Show your hands.";

        detectHands();
    } catch (error) {
        console.error(error);
        status.textContent = "Error: " + error.message;
        button.disabled = false;
    }
});






