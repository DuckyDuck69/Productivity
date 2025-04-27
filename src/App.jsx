import { useState, useEffect } from "react";
import TimeDuration from "./components/TimeDuration";
import Title from "./components/Title";
import FileInput from "./components/FileInput";
import TodoList from "./components/ToDoList";
import Video from "./components/Video";
import StudyMethod from "./components/StudyMethod";

function App() {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [method, setMethod] = useState("regular");

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-fontcolor">

      {/* Title centered at the top */}
      <div className="flex justify-center mb-8">
        <Title />
      </div>

      {/* One Row with Custom Widths */}
      <div className="grid grid-cols-12 gap-6 w-full px-12">

        {/* Left Column: Tasks */}
        <div className="col-span-3 flex flex-col bg-[#FFFDEC] p-4 shadow-lg rounded-xl h-full hover:shadow-2xl transition-shadow duration-300">
          <TodoList />
        </div>

        {/* Center Column: File Upload */}
        <div className="col-span-6 flex flex-col bg-[#FFFDEC] p-4 shadow-lg rounded-xl h-full hover:shadow-2xl transition-shadow duration-300">
          <FileInput />
        </div>

        {/* Right Column: Video on top, Timer below */}
        <div className="col-span-3 flex flex-col bg-[#FFFDEC] p-4 shadow-lg rounded-xl min-h-[650px] justify-between hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col items-center mb-6">
            <Video />
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <TimeDuration
                hour={hour}
                setHour={setHour}
                minute={minute}
                setMinute={setMinute}
                method={method}
              />
            </div>
            <StudyMethod
              method={method}
              setMethod={setMethod}
            />
          </div>
      </div>

      </div>

    </div>
  );
}

export default App;
