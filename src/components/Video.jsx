import { useRef } from "react";

function Video() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  function stopCam(){
    if(streamRef.current){
        streamRef.current.getTracks().forEach(track => {
            track.stop();
        }); 
        streamRef.current = null   //clean the ref
    }
  }

  function startCam(){
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
    <>
        <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        style={{ transform: "scaleX(-1)" }}
        ></video>
        <button onClick={startCam}>Start Camera</button>
        <button onClick={stopCam}>Stop Camera</button>
    </>
    
  );
}
export default Video;
