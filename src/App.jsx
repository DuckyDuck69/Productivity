import TimeDuration from "./components/TimeDuration"
import Title from "./components/Title"
import FileInput from "./components/FileInput"
import TodoList from "./components/ToDoList"
import Video from "./components/Video"

function App() {
  return (
    <>
      <div className="page-container" style = {{display : "inline-flex"}}>

        <Title/>
        <Video/>
        <TimeDuration/>
        <Video/>
        <FileInput />
        <TodoList />
      </div>
    </>
  )
}

export default App
