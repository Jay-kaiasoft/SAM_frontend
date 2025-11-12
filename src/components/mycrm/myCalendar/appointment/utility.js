import { eachDayOfInterval, endOfMonth, getDay, startOfMonth } from "date-fns";

const leadZero = (n)=>{
    if(n.toString().length === 1){
        return `0${n}`;
    } else {
        return n;
    }
};
export const getSlotString1 = (hrs, mins, selectedTimeSlot)=>{
    let tempDate = selectedTimeSlot;
    tempDate.setHours(selectedTimeSlot.getHours());
    tempDate.setMinutes(selectedTimeSlot.getMinutes());
    tempDate.setSeconds(0);
    let increement = 0;
    if(hrs !== 0 && hrs !== null){
        increement += parseInt(hrs)*60*60*1000;
    }
    if(mins !== 0 && mins !== null){
        increement += parseInt(mins)*60*1000;
    }
    tempDate = new Date(tempDate.getTime() + increement);
    return tempDate;
};
export const getDurationString = (minutes, hours)=>{
    if(hours === null || hours === 0){
        return `${minutes} Minute`
    } else {
        if(minutes === 0 || minutes === null){
            return `${hours} Hour`;
        } else {
            return  `${leadZero(hours)}:${leadZero(minutes)} Hour`;
        }
    }
};
export const get15MinuteSlots = () => {
    let slots = [];
    let tempDate = new Date(0);
    tempDate.setHours(0);
    tempDate.setMinutes(0);
    tempDate.setSeconds(0);
    Array.from({length: 96}, (_, i)=>(i)).forEach((_, i)=>{
        slots = [...slots, new Date(tempDate.getTime()+(i*900*1000))];
    });
    return slots;
};
export const getDisabledDayList  = (date, disabledWeekDay) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const allDays = eachDayOfInterval({start: monthStart, end: monthEnd});
    return allDays.filter((day)=>{
        return disabledWeekDay.includes(getDay(day))
    })
};
export const availabilitySlots = [
    {
        "aasId": 0,
        "aasDayName": "Sunday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    },
    {
        "aasId": 0,
        "aasDayName": "Monday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    },
    {
        "aasId": 0,
        "aasDayName": "Tuesday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    },
    {
        "aasId": 0,
        "aasDayName": "Wednesday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    },
    {
        "aasId": 0,
        "aasDayName": "Thursday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    },
    {
        "aasId": 0,
        "aasDayName": "Friday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    },
    {
        "aasId": 0,
        "aasDayName": "Saturday",
        "aasStartTime": "10:00:00",
        "aasEndTime": "18:00:00",
        "subMemberId": 0,
        "aasAvailableYN": "N"
    }
];
export const weekDayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
};
