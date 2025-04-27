import { useState, useRef } from "react";

function StudyMethod({method, setMethod }) {
  function handleChanges(event) {
    const selectedOne = event.target.value;
    setMethod(selectedOne);
    console.log("Choose study: ", selectedOne);
  }
  return (
    <div>
      <h4>Extra Study Methods: </h4>
      <select value={method} onChange={handleChanges}>
        <option value="regular">No Option</option>
        <option value="pomodoro">Pomodoro</option>
        <option value="flowtime">Flowtime Technique</option>
        <option value="ultradian">Ultradian Sprints</option>
      </select>
      <button onClick={setMethod(method)}>Confirm method</button>
    </div>
  );
}
export default StudyMethod;
