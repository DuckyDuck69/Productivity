import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export function WarningPopup({ onDismiss, autoHide }) {
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef(null); // ADD THIS LINE

  useEffect(() => {
    if (isVisible && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    }
  }, [isVisible]);

  // Auto-hide the notification after 5 seconds if autoHide is true
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 h-auto">
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-10 flex flex-col items-center space-y-5 max-w-lg w-full animate-slide-in">
        <audio ref={audioRef} src="/asuka_sound.mp3" /> 
        <button
          className="text-lg px-6 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-red-100 transition"
          onClick={handleDismiss}
        >
          Dismiss
        </button>
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Distraction Alert</h3>
          <img src="/asuka_angry.png" alt="Asuka" />
          <p className="text-lg">
            You've been distracted for too long. Please focus on your tasks!
          </p>
        </div>
      </div>
    </div>
  );
}

export default WarningPopup;
