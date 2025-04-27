import TimeDuration from "./components/TimeDuration"
import Title from "./components/Title"
import FileInput from "./components/FileInput"
import TodoList from "./components/ToDoList"
import Video from "./components/Video"
import StudyMethod from "./components/StudyMethod"

function App() {


  return (
      <div className="grid grid-cols-3">

        <div className="col-start-2 col-span-3"><Title/></div>
        <div className="col-start-3"><Video/></div>
        <div className="col-start-1"><TodoList /></div>
        <div className="col-start-2 col-span-3"><FileInput /></div>
        <div className="col-start-1"><TimeDuration/></div>
        <div className="col-start-1 col-span-2"><StudyMethod/></div>
      </div>
  )
}

export default App;
