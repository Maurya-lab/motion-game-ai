
const video = document.getElementById("webcam");
const button = document.getElementById("startButton");
const status = document.getElementById("status");

console.log("CAMERA SCRIPT LOADED");

button.addEventListener("click", async () => {
    status.textContent = "BUTTON CLICKED!";

    console.log("Camera button clicked");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = stream;
        await video.play();

        status.textContent = "CAMERA WORKING!";
    } catch (error) {
        console.error("CAMERA ERROR:", error);
        status.textContent = error.name + ": " + error.message;
    }
});





