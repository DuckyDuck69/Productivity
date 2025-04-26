export function useTimeInput(){
    let hour = Number(document.getElementById("hour-input").value);
    let minute = Number(document.getElementById("minute-input").value);
    return {hour, minute}
}

export function convertInput(){
    let {hour, minute} = useTimeInput();
    if(minute > 60){
        hour += Math.floor(minute/60)
        minute = minute % 60
    }
    
    console.log(hour,minute)

    const second = hour*3600 + minute*60
    return second
}