import { useState, useRef, useEffect } from "react";
import StudyNotification from "./StudyNotification";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

function TimeDuration({ method = "regular" }) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState("work");
  const [progress, setProgress] = useState(100);
  const [totalDuration, setTotalDuration] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("start");
  const [showGoalVideo, setShowGoalVideo] = useState(false);

  const intervalID = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [width, height] = useWindowSize();

  const convertInput = (hours, minutes) => (hours * 60 * 60) + (minutes * 60);

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
      setNotificationType(mode === "work" ? "break" : "start");
      new Notification(message);
      setShowNotification(true);
    }
  };

  const finalNotify = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    new Notification("🎉 All study sessions completed!");
    setNotificationType("goal");
    setShowNotification(true);
    setShowGoalVideo(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 1.0;
        audioRef.current.loop = true;
        audioRef.current.play().catch(err => console.error("Audio play error:", err));
      }
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
      }
    }, 100);
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
              setTargetSeconds(prev => Math.max(prev - 25 * 60, 0));
            } else if (method === "eyecare") {
              setTargetSeconds(prev => Math.max(prev - 20 * 60, 0));
            } else if (method === "flowtime" || method === "ultradian") {
              setTargetSeconds(prev => Math.max(prev - totalDuration, 0));
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
    if (isRunning && second <= 0) {
      clearInterval(intervalID.current);
      intervalID.current = null;
      setIsRunning(false);
      finalNotify();
    }
  }, [second, isRunning]);

  useEffect(() => {
    if (totalDuration > 0 && second >= 0) {
      setProgress((second / totalDuration) * 100);
    }
  }, [second, totalDuration]);

  function runTime() {
    if (intervalID.current) clearInterval(intervalID.current);
    intervalID.current = setInterval(() => {
      setSecond(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  }

  function startTimer() {
    if (second > 0 && isRunning) return;
    const totalStudyTime = handleTimeInput();
    setIsRunning(true);
    setIsPaused(false);
    if (method !== "regular") {
      setTargetSeconds(totalStudyTime);
      startWork();
    } else {
      if (totalStudyTime > 0) {
        setSecond(totalStudyTime);
        setTotalDuration(totalStudyTime);
        runTime();
      } else {
        finalNotify();
      }
    }
    setNotificationType("start");
    setShowNotification(true);
  }

  function pauseTimer() {
    if (intervalID.current) {
      clearInterval(intervalID.current);
      intervalID.current = null;
      setIsPaused(true);
    }
  }

  function resumeTimer() {
    if (!intervalID.current && isPaused) {
      runTime();
      setIsPaused(false);
    }
  }

  function startWork() {
    setMode("work");
    let duration = method === "pomodoro" ? 25 * 60 : method === "eyecare" ? 20 * 60 : method === "ultradian" ? 90 * 60 : handleTimeInput();
    setHour(Math.floor(duration / 3600).toString());
    setMinute(Math.floor((duration % 3600) / 60).toString());
    setSecond(duration);
    setTotalDuration(duration);
    runTime();
  }

  function startBreak() {
    setMode("break");
    let duration = method === "pomodoro" ? 5 * 60 : method === "eyecare" ? 20 : method === "ultradian" ? 30 * 60 : 10 * 60;
    setHour(Math.floor(duration / 3600).toString());
    setMinute(Math.floor((duration % 3600) / 60).toString());
    setSecond(duration);
    setTotalDuration(duration);
    runTime();
  }

  function resetTimer() {
    clearInterval(intervalID.current);
    intervalID.current = null;
    setSecond(0);
    setTargetSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    setMode("work");
    setHour("");
    setMinute("");
    setProgress(100);
  }

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
  const circleRadius = 72;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  function getProgressColor(progress) {
  if (progress > 66) return "#8b5cf6"; // purple
  if (progress > 33) return "#60a5fa"; // blue
  return "#34d399"; // green
}
  return (
    <div className="bg-white shadow-lg place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[200px] rounded-xl">
      <h3 className="text-xl font-semibold text-center mb-4">
        {method.charAt(0).toUpperCase() + method.slice(1)} - {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
      </h3>

      {/* Timer Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={circleRadius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="80" cy="80" r={circleRadius} fill="transparent" stroke={getProgressColor(progress)} strokeWidth="14" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 80 80)" />
          </svg>
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

      {/* Remaining Study Time */}
      {(method === "pomodoro" || method === "eyecare" || method === "flowtime") && (
        <div className="mt-2 text-center text-gray-700">
          <p>Remaining Study Time: {Math.floor(targetSeconds / 60)} minutes</p>
        </div>
      )}

      {/* Time Inputs */}
      <div className="grid grid-cols-2 gap-x-2 mb-4">
        <input
          type="number"
          placeholder="Hour"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          disabled={isRunning}
        />
        <input
          type="number"
          placeholder="Minute"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          disabled={isRunning}
        />
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={startTimer} 
          disabled={isRunning} 
          className="bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all duration-300 ease-in-out text-white font-semibold rounded-xl px-4 py-2"
          >
          Start Timer
        </button>
        <button 
          onClick={pauseTimer} 
          disabled={!isRunning} 
          className="bg-gray-400 hover:bg-gray-500 transition-all duration-300 ease-in-out text-white font-semibold rounded-xl px-4 py-2"
        >
          Pause
        </button>
        <button 
          onClick={resumeTimer} 
          disabled={!isPaused} 
          className="bg-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out text-white font-semibold rounded-xl px-4 py-2"
        >
          Resume
        </button>
        <button 
          onClick={resetTimer} 
          className="bg-red-400 hover:bg-red-500 transition-all duration-300 ease-in-out text-white font-semibold rounded-xl px-4 py-2"
        >
          Reset
        </button>
      </div>


      {/* Study Notification */}
      {showNotification && (
        <StudyNotification type={notificationType} onDismiss={() => setShowNotification(false)} autoHide={true} />
      )}

      {/* Video Popup and Confetti */}
      {showGoalVideo && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <video
                ref={videoRef}
                src="/omedetou-congratulations.mp4"
                autoPlay
                loop
                controls
                className="w-full h-auto rounded-lg"
              />
              <button 
                className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                  setShowGoalVideo(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
          <Confetti
            width={width}
            height={height}
            numberOfPieces={500}
            recycle={false}
            gravity={0.5}
            initialVelocityY={20}
            opacity={0.8}
          />        </>
      )}

      <audio ref={audioRef} src="/omenetou-sound.mp3" />
    </div>
  );
}

export default TimeDuration;
