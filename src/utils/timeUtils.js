export function useTimeInput(){
    let hour = Number(document.getElementById("hour-input").value);
    let minute = Number(document.getElementById("minute-input").value);
    return {hour, minute}
}

export function convertInput(hour, minute){
    let hr = Number(hour)
    let min = Number(minute)
    if(min > 60){
        hr += Math.floor(min/60)
        min = min % 60
    }
    const second = hr*3600 + min*60
    return second
}