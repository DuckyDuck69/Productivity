import { convertInput, useTimeInput } from "../utils/timeUtils";
import { useState, useRef, useEffect } from "react";
// useState is a React hook that lets you store and manage state within functional components.
// It returns an array with two elements:
// State value (current state)
// Setter function (to update this state)

function TimeDuration({ hour, setHour, minute, setMinute, method }) {
  const [second, setSecond] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");

  const intervalID = useRef(null); // This holds the interval ID across renders

  const handleTimeInput = () => {
    const second = convertInput(hour, minute);
    return second;
  };

  const notifyUser = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  
    if (Notification.permission === "granted") {
      let message;
      if (method == "pomodoro") {
        message = mode === "work" ? "Take a 5 minutes break!" : "Back to work!";
      } else if (method == "eyecare") {
        message = mode === "work" ? "Rest your eyes" : "Back to work!";
      } else {
        message = mode !== "work" ? "Take a break!" : "Time to work!";
      }
      new Notification(message);
    }
  };

  //load the final message
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
    if (!isRunning) return;
    if (second === 0 && intervalID.current) {
      (async () => {
        await notifyUser(); // wait for the notification process to finish
        clearInterval(intervalID.current);
        if (method !== "regular") {
          if (mode === "work") {
            if (method === "pomodoro") {
              setTargetSeconds((prev) => prev - 25*60);
            } else if (method === "eyecare") {
              setTargetSeconds((prev) => prev - 20 * 60);
            }
            startBreak();
          } else {
            startWork();
          }
        }
      })(); // immediately invoked function
    }
  }, [second, mode, method, isRunning]);

  useEffect(() => {
    // If user completed their goal, set running to false and notify them
    if (targetSeconds <= 0 && isRunning) {
      clearInterval(intervalID.current);
      setIsRunning(false);
      setSecond(0);
      finalNotify();
    }
  }, [targetSeconds, isRunning]);

  function runTime() {
    intervalID.current = setInterval(() => {
      setSecond((prev) => {
        if (prev == 0) {
          clearInterval(intervalID.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function startTimer() {
    //shoot the useEffect
    setIsRunning(true);

    if (mode != "regular") {
      const totalStudyTime = handleTimeInput(); // the goal the user entered
      setTargetSeconds(totalStudyTime);
      startWork();
    } else {
      const totalSec = handleTimeInput();
      setSecond(totalSec); //set the second only when the user prompt inputs
      runTime();
    }
  }

  function startWork() {
    setMode("work");
    if (method == "pomodoro") {
      setHour(0);
      setMinute(25);
      setSecond(25 *60 ); // 25 minutes
      runTime();
    } else if (method == "eyecare"){
      setHour(0);
      setMinute(20);
      setSecond(20 * 60); // 20 minutes
      runTime();
    } 
    else if (method == "flowtime") {
      runTime();
    } else if (method == "ultradian") {
      runTime();
    }
  }

  function startBreak() {
    setMode("break");
    if (method == "pomodoro") {
      setHour(0);
      setMinute(5);
      setSecond(5 *60); // 5 minutes
      runTime();
    } else if (method == "flowtime") {
      runTime();
    } else if (method == "ultradian") {
      runTime();
    } else if (method == "eyecare"){
      setHour(0);
      setMinute(0);
      setSecond(20); //the eyes need to rest for 20 seconds
      runTime()
    }
  }

  return (
    <div className="time-duration-box">
      <h3>Time Duration ({mode})</h3>
      <div className="time-boxes">
        <input
          type="number"
          id="hour-input"
          placeholder="Hour"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          disabled={method === "pomodoro"}
        />
        <input
          type="number"
          id="minute-input"
          placeholder="Minute"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          disabled={method === "pomodoro"}
        />
      </div>
      <button onClick={startTimer}>Start timer</button>
      <button
        onClick={() => {
          clearInterval(intervalID.current);
          setIsRunning(false);
        }}
      >
        Stop timer
      </button>
      <button onClick={runTime}>Resume</button>
      <button
        onClick={() => {
          clearInterval(intervalID.current);
          setSecond(0);
          setIsRunning(false);
        }}
      >
        Reset timer
      </button>
      <h3>Hour: {Math.floor(second / 3600)}</h3>
      <h3>Minute: {Math.floor((second % 3600) / 60)}</h3>
      <h3>Second: {second % 60}</h3>
      {method === "pomodoro" && (
        <h4>
          Remaining Study Time: {Math.floor(targetSeconds / 60) - 25} minutes
        </h4>
      )}
    </div>
  );
}
export default TimeDuration;
