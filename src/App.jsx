import TimeDuration from "./components/TimeDuration"
import Title from "./components/Title"
import FileInput from "./components/FileInput"
import TodoList from "./components/ToDoList"

function App() {
  return (
    <>
      <div className="page-container" style = {{display : "inline-flex"}}>

        <Title/>
        <TimeDuration/>
        <FileInput />
        <TodoList />
      </div>
    </>
  )
}

export default App
