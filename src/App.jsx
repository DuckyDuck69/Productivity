import TimeDuration from "./components/TimeDuration";
import Title from "./components/Title";
import FileInput from "./components/FileInput";
import TodoList from "./components/ToDoList";
import Video from "./components/Video";
import StudyMethod from "./components/StudyMethod";
import { useState, useEffect } from "react";

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
    <>
      <div className="page-container" style={{ display: "inline-flex" }}>
        <Title />
        <Video />
        <TimeDuration
          hour={hour}
          setHour={setHour}
          minute={minute}
          setMinute={setMinute}
          method={method}
        />
        <StudyMethod
          method = {method}
          setMethod = {setMethod}
        />
        <FileInput />
        <TodoList />
      </div>
    </>
  );
}

export default App;
