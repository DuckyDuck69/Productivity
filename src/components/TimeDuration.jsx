import { convertInput, useTimeInput } from "../utils/timeUtils";

function TimeDuration(){
    const {second} = convertInput();
    return(
        <div className="time-duration-box">
            <h3>Time Duration</h3>
            <div className="time-boxes">
                <input type = "number" id = "hour-input" placeholder="Hour"/>
                <input type = "number" id = "minute-input" placeholder="Minutes"/>
            </div>
            <button onClick={console.log(second)}>rereive time</button>
            <button></button>
        </div>
    );
}
export default TimeDuration