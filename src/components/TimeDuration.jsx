import { useState, useRef, useEffect } from "react";

function TimeDuration({ method = "regular" }) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [progress, setProgress] = useState(100);
  const [totalDuration, setTotalDuration] = useState(0);

  const intervalID = useRef(null);

  // Implement convertInput function directly in the component
  const convertInput = (hours, minutes) => {
    return (hours * 60 * 60) + (minutes * 60);
  };

  const handleTimeInput = () => {
    const hours = parseInt(hour) || 0;
    const minutes = parseInt(minute) || 0;
    const seconds = convertInput(hours, minutes);
    return seconds > 0 ? seconds : 0;
  };

  const notifyUser = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
      let message;
      if (method === "pomodoro") {
        message = mode === "work" ? "Take a 5 minute break!" : "Back to work!";
      } else if (method === "eyecare") {
        message = mode === "work" ? "Rest your eyes for 20 seconds!" : "Back to work!";
      } else {
        message = mode === "work" ? "Time to work!" : "Take a break!";
      }
      new Notification(message);
    }
  };

  const finalNotify = async () => {
    const message = "🎉 All study sessions completed!";
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(message);
      }
    }
  };

  useEffect(() => {
    if (!isRunning || !intervalID.current) return;
    if (second === 0) {
      (async () => {
        await notifyUser();
        clearInterval(intervalID.current);
        intervalID.current = null;
        if (method !== "regular") {
          if (mode === "work") {
            if (method === "pomodoro") {
              setTargetSeconds((prev) => Math.max(prev - 25 * 60, 0));
            } else if (method === "eyecare") {
              setTargetSeconds((prev) => Math.max(prev - 20 * 60, 0));
            } else if (method === "flowtime" || method === "ultradian") {
              setTargetSeconds((prev) => Math.max(prev - totalDuration, 0));
            }
            startBreak();
          } else {
            startWork();
          }
        } else {
          setIsRunning(false);
        }
      })();
    }
  }, [second, mode, method, isRunning, totalDuration]);

  useEffect(() => {
    if (targetSeconds <= 0 && isRunning && method !== "regular") {
      clearInterval(intervalID.current);
      intervalID.current = null;
      setIsRunning(false);
      setSecond(0);
      setMode("work");
      finalNotify();
    }
  }, [targetSeconds, isRunning, method]);

  // Calculate progress as a percentage
  useEffect(() => {
    if (totalDuration > 0 && second >= 0) {
      setProgress((second / totalDuration) * 100);
    }
  }, [second, totalDuration]);

  function runTime() {
    if (intervalID.current) clearInterval(intervalID.current);
    intervalID.current = setInterval(() => {
      setSecond((prev) => {
        if (prev <= 1) {
          clearInterval(intervalID.current);
          intervalID.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function startTimer() {
    if (second > 0 && isRunning) return;
    setIsRunning(true);
    if (method !== "regular") {
      const totalStudyTime = handleTimeInput();
      if (totalStudyTime <= 0) {
        setIsRunning(false);
        return;
      }
      setTargetSeconds(totalStudyTime);
      startWork();
    } else {
      const totalSec = handleTimeInput();
      if (totalSec <= 0) {
        setIsRunning(false);
        return;
      }
      setSecond(totalSec);
      setTotalDuration(totalSec);
      runTime();
    }
  }

  function startWork() {
    setMode("work");
    let duration = 0;
    
    if (method === "pomodoro") {
      duration = 25 * 60;
      setHour("0");
      setMinute("25");
      setSecond(duration);
    } else if (method === "eyecare") {
      duration = 20 * 60;
      setHour("0");
      setMinute("20");
      setSecond(duration);
    } else if (method === "flowtime") {
      duration = handleTimeInput();
      if (duration <= 0) {
        setIsRunning(false);
        return;
      }
      setSecond(duration);
    } else if (method === "ultradian") {
      duration = 90 * 60;
      setHour("1");
      setMinute("30");
      setSecond(duration);
    }
    
    setTotalDuration(duration);
    runTime();
  }

  function startBreak() {
    setMode("break");
    let duration = 0;
    
    if (method === "pomodoro") {
      duration = 5 * 60;
      setHour("0");
      setMinute("5");
      setSecond(duration);
    } else if (method === "eyecare") {
      duration = 20;
      setHour("0");
      setMinute("0");
      setSecond(duration);
    } else if (method === "flowtime") {
      duration = 10 * 60;
      setHour("0");
      setMinute("10");
      setSecond(duration);
    } else if (method === "ultradian") {
      duration = 30 * 60;
      setHour("0");
      setMinute("30");
      setSecond(duration);
    }
    
    setTotalDuration(duration);
    runTime();
  }

  function resetTimer() {
    clearInterval(intervalID.current);
    intervalID.current = null;
    setSecond(0);
    setTargetSeconds(0);
    setIsRunning(false);
    setMode("work");
    setHour("");
    setMinute("");
    setProgress(100);
  }

  // Format time for display
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const time = formatTime(second);
  
  // Calculate the circumference of the circle
  const circleRadius = 72;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white shadow-lg place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[200px] rounded-xl">
      <h3 className="text-xl font-semibold text-center mb-4">
        {method.charAt(0).toUpperCase() + method.slice(1)} - {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
      </h3>
      
      {/* Circular Timer */}
      <div className="flex justify-center mb-6 ">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle 
              cx="80" 
              cy="80" 
              r={circleRadius} 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle 
              cx="80" 
              cy="80" 
              r={circleRadius} 
              fill="transparent" 
              stroke={mode === "work" ? "#8b5cf6" : "#10b981"} 
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 80 80)"
            />
          </svg>
          {/* Time display inside circle */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold">
              {time.hours !== "00" ? `${time.hours}:${time.minutes}:${time.seconds}` : `${time.minutes}:${time.seconds}`}
            </div>
            <div className="text-sm font-medium text-gray-500 mt-1">
              {mode === "work" ? "Focus Time" : "Break Time"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Input Form */}
      <div className="grid grid-cols-2 gap-x-2 mb-4">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          type="number"
          id="hour-input"
          placeholder="Hour"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          disabled={method === "pomodoro" || method === "ultradian" || isRunning}
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          type="number"
          id="minute-input"
          placeholder="Minute"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          disabled={method === "pomodoro" || method === "ultradian" || isRunning}
        />
      </div>
      
      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          className={`text-white px-3 py-2 rounded-lg ${!isRunning ? "bg-[var(--primary)] hover:bg-[var(--accent)]" : "bg-gray-300 cursor-not-allowed"}`}
          onClick={startTimer}
          disabled={isRunning}
        >
          Start Timer
        </button>
        <button
          className={`text-white px-3 py-2 rounded-lg ${!isRunning ? "bg-[var(--primary)] hover:bg-[var(--accent)]" : "bg-gray-300 cursor-not-allowed"}`}
          onClick={() => {
            if (isRunning) {
              clearInterval(intervalID.current);
              intervalID.current = null;
              setIsRunning(false);
            }
          }}
          disabled={!isRunning}
        >
          Pause Timer
        </button>
        <button
          className={`text-white px-3 py-2 rounded-lg ${!isRunning ? "bg-[var(--primary)] hover:bg-[var(--accent)]" : "bg-gray-300 cursor-not-allowed"}`}
          onClick={() => {
            if (!isRunning && second > 0) {
              setIsRunning(true);
              runTime();
            }
          }}
          disabled={isRunning || second === 0}
        >
          Resume
        </button>
        <button
          className="text-white px-3 py-2 bg-gray-400 hover:bg-gray-500 rounded-lg"
          onClick={resetTimer}
        >
          Reset Timer
        </button>
      </div>
      
      {/* Progress Info */}
      {(method === "pomodoro" || method === "eyecare" || method === "flowtime") && (
        <div className="mt-2 text-center text-gray-700">
          <p>Remaining Study Time: {Math.floor(targetSeconds / 60)} minutes</p>
        </div>
      )}
    </div>
  );
}

export default TimeDuration;
