import { useState, useEffect } from "react";
import { Clock, Coffee, Trophy } from "lucide-react";

// Main notification component with different modes
export function StudyNotification({ type, onDismiss, autoHide = true }) {
  const [isVisible, setIsVisible] = useState(true);

  // Configuration based on notification type
  const notificationConfig = {
    start: {
      icon: <Clock className="w-6 h-6 text-white flex-shrink-0 mt-1" />,
      bgColor: "bg-orange-500",
      title: "Work Session Started",
      message: "Time to focus on your studies. Stay productive!",
      buttonColor: "text-orange-600 hover:bg-orange-100"
    },
    break: {
      icon: <Coffee className="w-6 h-6 text-white flex-shrink-0 mt-1" />,
      bgColor: "bg-blue-500",
      title: "Break Time",
      message: "Take a short break to refresh your mind. Don't forget to stretch!",
      buttonColor: "text-blue-600 hover:bg-blue-100"
    },
    goal: {
      icon: <Trophy className="w-6 h-6 text-white flex-shrink-0 mt-1" />,
      bgColor: "bg-green-600",
      title: "Goal Achieved!",
      message: "Congratulations! You've completed all your study sessions.",
      buttonColor: "text-green-600 hover:bg-green-100"
    }
  };

  const config = notificationConfig[type] || notificationConfig.start;

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
      <div className={`${config.bgColor} text-white rounded-lg shadow-lg p-4 flex items-start space-x-3`}>
        {config.icon}
        <div className="flex-1">
          <h3 className="font-bold mb-1">{config.title}</h3>
          <p className="text-sm mb-2">
            {config.message}
          </p>
          <button
            className={`text-xs px-3 py-1 bg-white font-semibold rounded-full ${config.buttonColor} transition`}
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

export default StudyNotification;