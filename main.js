const cam = document.querySelector("#video");
Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]).then();
async function StartVideo() {
    const constraints = { video: true };

    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cam) {
            cam.srcObject = stream;
            cam.onloadedmetadata = () => {
                cam.play();
            };
        }
    } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
    }
}

cam.addEventListener('play', () => {
    const canvas = faceapi.creatCanvasFromMedia(cam)
    document.body.append(canvas)

    const displaySize ={widht: cam.widht, height: cam.height}

    faceapi.matchDimensions(canvas,displaySize)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            cam,
            new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        canvas.getContext("2d").clearRect(0,0, canvas.widht, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


        console.log(detections);
    }, 100);
});