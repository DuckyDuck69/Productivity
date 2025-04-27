import TimeDuration from "./components/TimeDuration"
import Title from "./components/Title"
import FileInput from "./components/FileInput"
import TodoList from "./components/ToDoList"
import Video from "./components/Video"


function App() {
  return (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-start-2"><Title/> </div>
        <div className="col-start-3"><Video/> </div>
        <div className="col-start-1"> <TodoList /> </div>
        <div  className="col-start-2 col-span-3"><FileInput/> </div>
        <div className="col-start-1"><TimeDuration/> </div>
      </div>
  )
}

export default App;
