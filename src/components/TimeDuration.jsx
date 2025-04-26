import { convertInput, useTimeInput } from "../utils/timeUtils";
import { useState, useRef } from "react";
// useState is a React hook that lets you store and manage state within functional components.
// It returns an array with two elements:
// State value (current state)
// Setter function (to update this state)

function TimeDuration() {
  const [hour, setHour] = useState(""); //both hour and setHour is empty string,
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState(0);

  const intervalID = useRef(null); // This holds the interval ID across renders

  const handleTimeInput = () =>{
    const second = convertInput(hour,minute);
    return second
  }

  function runTime(){
    intervalID.current = setInterval(()=>{
      setSecond(prev => {
        if(prev == 0){
          clearInterval(intervalID.current); 
          return 0;
        }
        return prev - 1
      })
    }, 1000
    )
  }

  function startTimer(){
    const totalSec = handleTimeInput();
    setSecond(totalSec); //set the second only when the user prompt inputs
    runTime();
  }

  return (
    <div className="time-duration-box">
      <h3>Time Duration</h3>
      <div className="time-boxes">
        <input
          type="number"
          id="hour-input"
          placeholder="Hour"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />
        <input
          type="number"
          id="minute-input"
          placeholder="Minute"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
        />
      </div>
      <button onClick={()=>console.log(handleTimeInput())}>rereive time</button>
      <button onClick={startTimer}>Timer</button>
      <button onClick={() => clearInterval(intervalID.current)}>Stop timer</button>
      <button onClick={runTime}>Resume</button>
      <button onClick={() => setSecond(0)}>Reset timer</button>
      <h3>Hour: {Math.floor(second / 3600)}</h3>
      <h3>Minute: {Math.floor((second % 3600) / 60)}</h3>
      <h3>Second: {second % 60}</h3>
    </div>
  );
}
export default TimeDuration;
