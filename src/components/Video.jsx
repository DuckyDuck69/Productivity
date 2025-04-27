import { useRef } from "react";

function Video() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  function stopCam() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null; //clean the ref
    }
  }

  function startCam() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream; // Connect the stream to the <video>
          videoRef.current.play(); // Start playing the video
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        width="320"
        height="240"
        autoPlay
        muted
        style={{ transform: "scaleX(-1)" }}
        className="rounded-lg shadow-md"
      ></video>
      <div className="flex gap-4 mt-4">
        <button 
          onClick={startCam}
          className="bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
          Start Camera
        </button>
        <button 
          onClick={stopCam}
          className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
          Stop Camera
        </button>
      </div>
    </div>
  );
}  
export default Video;
