import {  useState } from "react";



export function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    function handleInputChange(event) {
        setNewTask(event.target.value);
    };
    function addTask() {
        if(newTask.trim() !== "") {
            setTasks(t => [...t, newTask]);
            setNewTask("");
        }

    };

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    function moveTaskUp(index) {
        if(index > 0){
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index -1]] = [updatedTasks[index -1], updatedTasks[index]];
            setTasks(updatedTasks);
        }

    };

    function moveTaskDown(index) {
        if(index < tasks.length - 1){
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index +1]] = [updatedTasks[index +1], updatedTasks[index]];
            setTasks(updatedTasks);
        }

    };
    return (
        <div className="bg-white shadow-lg place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[450px] rounded-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tasks to Do</h1>
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={newTask}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={addTask}
                >
                    +
                </button>
            </div>
            <ol className="space-y-3">
                {tasks.map((task, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
                    >
                        <span className="text-gray-700 font-medium flex-1">{task}</span>
                        <div className="flex gap-2">
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                                onClick={() => deleteTask(index)}
                            >
                                X
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                                onClick={() => moveTaskUp(index)}
                            >
                                ↑
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                                onClick={() => moveTaskDown(index)}
                            >
                                ↓
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default TodoList;
