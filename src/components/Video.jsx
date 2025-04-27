import { useRef, useState, useEffect } from "react";
import WarningPopup from "./AlertNotification";

function Video() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [distractionStatus, setDistractionStatus] = useState('');
  const [distractionTime, setDistractionTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false); 
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const isDistractedRef = useRef(false);
  const consecutiveDistractedTimeRef = useRef(0); // Track consecutive distraction time

  // Clean up function to clear all intervals and stop camera
  function cleanup() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }

  // Use useEffect to ensure cleanup when component unmounts
  useEffect(() => {
    return () => cleanup();
  }, []);

  // Effect to handle state changes for distraction
  useEffect(() => {
    // If user becomes focused, hide the warning
  }, [distractionStatus, showWarning]);

  function stopCam() {
    cleanup();
    setDistractionStatus('');
    setDistractionTime(0);
    setShowWarning(false);
    consecutiveDistractedTimeRef.current = 0;
  }

  function startCam() {
    // Reset timer and warning when starting camera
    setDistractionTime(0);
    setShowWarning(false);
    consecutiveDistractedTimeRef.current = 0;
    
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          
          // Start capturing frames
          intervalRef.current = setInterval(captureAndSendFrame, 1000);
        }
        timerRef.current = setInterval(() => {
          if (isDistractedRef.current) {
            setDistractionTime(prevTime => {
              const newTime = prevTime + 1;
        
              // Every 15 seconds of total distracted time, show warning
              if (newTime > 0 && newTime % 15 === 0) {
                setShowWarning(true);
              }
        
              return newTime;
            });
          }
        }, 1000);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  function captureAndSendFrame() {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    if (!video) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const frame = canvas.toDataURL('image/jpeg');
  
    // Simulate server response if server is unavailable (for testing)
    const simulateResponse = process.env.NODE_ENV === 'development' && !window.location.search.includes('useServer');

    if (simulateResponse) {
      // For testing without the server
      const isDistracted = Math.random() > 0.5;
      console.log('Simulated distraction:', isDistracted);
      setDistractionStatus(isDistracted ? "Distracted" : "Focused");
      isDistractedRef.current = isDistracted;
      return;
    }
    
    // Send the frame to the Flask server
    fetch('http://localhost:5001/process_frame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frame: frame }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Received data:', data);
      const isDistracted = data.distracted;
      setDistractionStatus(isDistracted ? "Distracted" : "Focused");
      
      // Update the ref value for the timer to use
      isDistractedRef.current = isDistracted;
    })
    .catch((error) => {
      console.error('Error:', error);
      // Fallback to simulated response on error
      const isDistracted = Math.random() > 0.5;
      console.log('Fallback simulated distraction:', isDistracted);
      setDistractionStatus(isDistracted ? "Distracted" : "Focused");
      isDistractedRef.current = isDistracted;
    });    
  }
  
  // Format seconds to mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Handle dismissal of warning popup
  const handleWarningDismiss = () => {
    setShowWarning(false);
  };
  
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
      <div>
        <button 
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={startCam}
        >
          Start Camera
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={stopCam}
        >
          Stop Camera
        </button>
      </div>
      <p className="mt-2">Status: <span className={distractionStatus === "Distracted" ? "text-red-500 font-bold" : "text-green-500 font-bold"}>{distractionStatus}</span></p>
      <p className="mt-1">Total Distraction Time: {formatTime(distractionTime)}</p>
      
      {showWarning && (
        <WarningPopup 
          onDismiss={handleWarningDismiss} 
          autoHide={distractionStatus === "Focused"} 
        />
      )}
    </>
  );
}
  
export default Video;
