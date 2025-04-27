import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export function WarningPopup({ onDismiss, autoHide }) {
  const [isVisible, setIsVisible] = useState(true);

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
    <div className="fixed top-4 right-4 max-w-sm z-50 animate-slide-in">
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold mb-1">Distraction Alert</h3>
          <p className="text-sm mb-2">
            You've been distracted for too long. Please focus on your tasks!
          </p>
          <button
            className="text-xs px-3 py-1 bg-white text-red-600 font-semibold rounded-full hover:bg-red-100 transition"
            onClick={handleDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// Add CSS animation for slide-in effect
// Add this to your global CSS or use styled-components/emotion
const slideInStyles = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
`;

export default WarningPopup;