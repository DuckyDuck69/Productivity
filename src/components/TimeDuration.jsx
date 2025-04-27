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
    <div className="bg-white shadow-lg place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[200px] rounded-xl">
      <h3>Study session:</h3>
      <div>
      <div className="grid grid-cols-2 gap-x-2">
        <input
          className="border-solid border-1 border-gray-200 "
          type="number"
          id="hour-input"
          placeholder="Hour"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />
        <input
          className="border-solid border-1 border-gray-200 "
          type="number"
          id="minute-input"
          placeholder="Minute"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
        />
        </div>
      <div/>
      <div className="grid grid-cols-2 gap-2">
      <button className="text-white px-3 py-1 text-sm bg-purple-300 rounded-lg hover:bg-[#e6d8ff] gap-4" onClick={startTimer}>Start timer</button>
      <button className="text-white px-3 py-1 text-sm bg-purple-300 rounded-lg hover:bg-[#e6d8ff] gap-4" onClick={() => clearInterval(intervalID.current)}>Stop timer</button>
      <button className="text-white px-3 py-1 text-sm bg-purple-300 rounded-lg hover:bg-[#e6d8ff] gap-4" onClick={runTime}>Resume</button>
      <button className="text-white px-3 py-1 text-sm bg-purple-300 rounded-lg hover:bg-[#e6d8ff] gap-4" onClick={() => setSecond(0)}>Reset timer</button>
      </div>
      <h3>Hour: {Math.floor(second / 3600)}</h3>
      <h3>Minute: {Math.floor((second % 3600) / 60)}</h3>
      <h3>Second: {second % 60}</h3>
    </div>
    </div>
  );
}
export default TimeDuration;
