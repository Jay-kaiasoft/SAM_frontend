import React, {useEffect, useMemo, useState} from 'react';
import {connect} from "react-redux";
import {Col, FormGroup, Row} from "reactstrap";
import {Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField} from "@mui/material";
import {Autocomplete} from "@mui/material";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputField from "../../../shared/commonControlls/inputField";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import {setLoader} from "../../../../actions/loaderActions";
import {getSlotString1, getDurationString, weekDayMap, getDisabledDayList} from "./utility";
import {dateFormat, timeFormat, validateEmail, dateTimeFormatDB, QontoConnector, QontoStepIcon, easUrlEncoder} from "../../../../assets/commonFunctions";
import {getMemberDetails} from "../../../../services/userService";
import {getTimeZoneList, freeSlotList, saveAppointment, getEventTypeAllList, getAvailabilitySlotsList} from "../../../../services/myCalendarServices";
import $ from "jquery";
import {getCountry} from "../../../../services/commonService";
import { getClientTimeZone } from './../../../../assets/commonFunctions';

const Appointment = ({location, globalAlert, setLoader})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const userName = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : "";
    const steps = ["1","2","3","4"];
    const [guestDetails, setGuestDetails] = useState({
        name: "",
        email: "",
        guestEmails: [],
        contactList: [],
        selectedTimeSlot: "",
        description: "",
        timeZone: getClientTimeZone()
    });
    const [activeStep, setActiveStep] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(-1);
    const [eventData, setEventData] = useState({});
    const [user, setUser] = useState({});
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState( new Date());
    const [endDate, setEndDate] = useState(null);
    const [showTimeSlots, setShowTimeSlots] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [addGuest, setAddGuest] = useState(false);
    const [disabledDateList, setDisabledDateList] = useState([]);
    const [disabledWeekDays, setDisabledWeekDays] = useState([]);
    const [country, setCountry] = useState([]);
    const [contactDetail, setContactDetail] = useState({countryId: 100, countryCode: "+1", contactNo: ""});
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleStep1Click = (eId)=>{
        if(selectedEvent !== -1){
            setEventData(prevState => {
                return {prevState, ...user.events.filter(val=>(val.aetId === eId))[0]}
            });
            handleNext();
        } else {
            globalAlert({
                type: "Error",
                text: "Please select at least one event.",
                open: true
            });
        }
    };
    const handleStep2Click = ()=>{
        if(selectedTimeSlot === null){
            globalAlert({
                type: "Error",
                text: "Please select a Time Slot",
                open: true
            });
        } else {
            setEndDate((prev)=>{
                prev = getSlotString1(eventData.aetDurationHours, eventData.aetDurationMinutes, selectedDate);
                return prev;
            });
            handleNext();
        }
    };
    const handleStep2BackClick = ()=>{
        setShowTimeSlots(false);
        setSelectedTimeSlot(null);
        handleBack();
    };
    const handleSelectDate = (date, timeZone="")=>{
        setSelectedTimeSlot(null);
        let tempDuration = 0;
        if(eventData.aetDurationHours !== 0 && eventData.aetDurationHours !== null){
            tempDuration += parseInt(eventData.aetDurationHours)*60;
            tempDuration += parseInt(eventData.aetDurationMinutes);
        } else {
            tempDuration += parseInt(eventData.aetDurationMinutes);
        }
        setSelectedDate(date);
        let requestData = {
            slotTimeMinus: tempDuration,
            slotDateTime: dateFormat(date),
            slotMember: userName,
            timeZone: timeZone || guestDetails.timeZone,
            currentDateYN: dateFormat(date) === dateFormat(new Date()) ? 'Y' : 'N'
        }
        setLoader({
            load: true,
            text: "Please wait !!!"
        })
        freeSlotList(requestData).then((res)=>{
            if(res.status === 200){
                setTimeSlots((prev)=>{
                    prev = res.result.freeSlotList.map((v)=>{
                        let tempDate = new Date();
                        tempDate.setHours(v.split(":")[0]);
                        tempDate.setMinutes(v.split(":")[1]);
                        tempDate.setSeconds(0);
                        return [tempDate, timeFormat(tempDate)];
                    });
                    return [...prev];
                });
                setShowTimeSlots(true);
            }
            setLoader({
                load: false
            })
        })
    };
    const handleGuestChanges = (name, val)=>{
        setGuestDetails((prev)=>{
            return { ...prev, [name]: val };
        })
    };
    const handleScheduleEvent = ()=>{
        if(guestDetails.name === ""){
            globalAlert({
                type: "Error",
                text: "Please enter your name.",
                open: true
            });
            return;
        } else if(guestDetails.email === ""){
            globalAlert({
                type: "Error",
                text: "Please enter your email.",
                open: true
            });
            return;
        } else if(!validateEmail(guestDetails.email)){
            globalAlert({
                type: "Error",
                text: "Please enter valid email.",
                open: true
            });
            return;
        }
        $("button.scheduleEvent").remove();
        $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.close-schedule");
        let attendees = JSON.stringify({"attendees": [...guestDetails.guestEmails, guestDetails.email]});
        let tempDuration = 0;
        if(eventData.aetDurationHours !== 0 && eventData.aetDurationHours !== null){
            tempDuration += parseInt(eventData.aetDurationHours)*60;
            tempDuration += parseInt(eventData.aetDurationMinutes);
        } else {
            tempDuration += parseInt(eventData.aetDurationMinutes);
        }
        let requestData = {
            "calAetId": eventData.aetId,
            "title": guestDetails.name,
            "description": guestDetails.description,
            "start": dateTimeFormatDB(selectedDate),
            "end": dateTimeFormatDB(endDate),
            "calTimeZone": guestDetails.timeZone,
            "calAttendees": attendees,
            "slotMember": userName,
            "slotTimeMinus": tempDuration,
            "contactList": guestDetails.contactList,
            "currentDateYN": dateFormat(selectedDate) === dateFormat(new Date()) ? 'Y' : 'N',
            "memTimeZone": getClientTimeZone()
        };
        saveAppointment(requestData).then((res)=>{
            if(res.status === 200){
                handleNext();
            } else if(res.status === 304){
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
                handleBack();
                handleSelectDate(selectedDate);
            } else{
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    };
    const handleClickAddContact = () => {
        setGuestDetails((prev)=>{
            return {
                ...prev,
                contactList: [...prev.contactList,`${contactDetail.countryCode}${contactDetail.contactNo.replace(/\D/g, "")}`]
            }
        })
        setContactDetail({countryId: 100, countryCode: "+1", contactNo: ""});
    }
    const handleClickDeleteContact = (index) => {
        let t = guestDetails.contactList;
        t.splice(index, 1);
        setGuestDetails((prev)=>{
            return {
                ...prev,
                contactList: t
            }
        })
    }
    const getStepContent = (step)=>{
        switch (step){
            case 0:
                return (
                    <>
                        {
                            user.events.length > 0 &&
                            <>
                                <div className="w-50 d-flex align-items-center flex-column" style={{maxHeight: "65vh", overflowY: "auto", overflowX: "hidden"}}>
                                    {
                                        user.events.map((val, i) => (
                                            <div
                                                className={`event-card ${val.aetId === selectedEvent?"active-appointment":""}`}
                                                onClick={() => {
                                                    setSelectedEvent(val.aetId);
                                                }}
                                                key={i}
                                            >
                                                <div className="event-card-header d-flex">
                                                    <div>
                                                        <i className="far fa-calendar-check"></i>
                                                    </div>
                                                    <div
                                                        className="d-flex justify-content-between align-items-center ml-2"
                                                        style={{flex: "1 1 auto"}}>
                                                        {val.aetTitle}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <i className="far fa-clock mr-2"></i>
                                                    <span>{getDurationString(val.aetDurationMinutes, val.aetDurationHours)}</span>
                                                </div>
                                                <div className="mt-3">
                                                    <p>{val.aetDescription}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <FormGroup className="text-center mb-5 mt-3">
                                    <Button variant="contained" color="primary" onClick={()=>handleStep1Click(selectedEvent)}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                                </FormGroup>
                            </>
                        }
                        {
                            user.events.length === 0 &&
                            <div className="w-50 d-flex align-items-center flex-column justify-content-center" style={{height: 400, overflowY: "auto", overflowX: "hidden"}}>
                                <h4>The link is currently not active.<br/>
                                    Please retry after sometimes.</h4>
                            </div>
                        }
                    </>
                );
            case 1:
                return (
                    <>
                        <div className="my-2 text-center">
                            <h3><i className="far fa-clock mr-2"></i><span>{getDurationString(eventData.aetDurationMinutes, eventData.aetDurationHours)}</span></h3>
                        </div>
                        <Row className="w-100">
                            <Col md={6} className="p-2 mx-auto">
                                <div>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateCalendar
                                            className="mr-3"
                                            value={selectedDate}
                                            views={['year', 'month', 'day']}
                                            minDate={new Date()}
                                            onChange={(newValue) => handleSelectDate(newValue)}
                                        onMonthChange={(date)=>{
                                            setDisabledDateList(getDisabledDayList(date, disabledWeekDays));
                                        }}
                                            shouldDisableDate={(date) => {
                                                return disabledDateList.some(
                                                    (disabledDate) => date.getTime() === disabledDate.getTime()
                                                );
                                            }}
                                    />
                                    </LocalizationProvider>
                                    <div className="d-flex justify-content-center">
                                        <Box sx={{display: 'flex', alignItems: 'center', maxWidth: '100%'}} className="mb-3">
                                            <i className="far fa-globe ml-1 mr-2 mt-2"></i>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="combo-label">Select Timezone</InputLabel>
                                                <Select
                                                    value={guestDetails?.timeZone || ""}
                                                    onChange={(event) => {
                                                        setGuestDetails((prev) => {
                                                            return {
                                                                ...prev,
                                                                timeZone: event.target.value
                                                            }
                                                        });
                                                        handleSelectDate(selectedDate, event.target.value);
                                                    }}
                                                    className="mb-2 pt-1"
                                                    label="Time Zone"
                                                    fullWidth
                                                >
                                                    {
                                                        timeZoneList.map((ele, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={ele.key}>{ele.value}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </div>
                                </div>
                            </Col>
                            {
                                showTimeSlots &&
                                <Col md={6}>
                                    <div className="d-flex justify-content-center calendar-wrapper">
                                        <div style={{width: "80%"}}>
                                            <div className="text-center mb-3">
                                                <strong>{dateFormat(selectedDate)}</strong>
                                            </div>
                                            <div className="overflow-auto" style={{height: 320}}>
                                                {
                                                    timeSlots.length > 0 ?
                                                        timeSlots.map((val, i) => {
                                                            return (
                                                                <div className="mb-3 d-flex align-items-center justify-content-center" key={i}>
                                                                    <div className={`slots ${selectedTimeSlot === val[0]?"slots-active":""}`}
                                                                        onClick={()=>{
                                                                            setSelectedTimeSlot(val[0]);
                                                                            setSelectedDate((prev)=>{
                                                                                prev.setHours(val[0].getHours());
                                                                                prev.setMinutes(val[0].getMinutes());
                                                                                prev.setSeconds(0);
                                                                                return prev;
                                                                            });
                                                                        }}
                                                                    >
                                                                        {val[1]}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    :
                                                        <div className="mb-3 d-flex align-items-center justify-content-center">
                                                            Appointment time slot is not available
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            }
                        </Row>
                        <FormGroup className="text-center mb-5 mt-3">
                            <Button variant="contained" color="primary" onClick={handleStep2BackClick} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handleStep2Click}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </>
                );
            case 2:
                return (
                    <>
                        <Row className="w-100 my-3">
                            <Col md={6} className="p-2 border-right">
                                <div className="font-weight-bolder mt-5 mb-3">
                                    <h4>{eventData.aetTitle}</h4>
                                </div>
                                <div className="font-size-18 mb-3">
                                    <i className="far fa-clock mr-2"></i>
                                    <span>{getDurationString(eventData.aetDurationMinutes, eventData.aetDurationHours)}</span>
                                </div>
                                <div className="font-size-18 mb-3">
                                    <i className="far fa-calendar-alt mr-2"></i>
                                    <span>{timeFormat(selectedDate)} - {timeFormat(endDate)}, {dateFormat(selectedDate)} </span>
                                </div>
                                <div>
                                    {eventData.aetDescription}
                                </div>
                            </Col>
                            <Col md={6} className="pl-5 pr-0">
                                <div className="text-center my-3">
                                    <h3>Enter Details</h3>
                                </div>
                                <div className="mb-3">
                                    <InputField
                                        type="text"
                                        value={guestDetails.name}
                                        label="Name"
                                        name="name"
                                        onChange={handleGuestChanges}
                                    />
                                </div>
                                <div className="mb-3">
                                    <InputField
                                        type="text"
                                        value={guestDetails.email}
                                        label="Email"
                                        name="email"
                                        onChange={handleGuestChanges}
                                    />
                                </div>
                                <div className="mb-3">
                                    {
                                        !addGuest ?
                                            <Button variant="outlined" color="primary"
                                                    onClick={() => {
                                                        setAddGuest(true)
                                                    }}>
                                                ADD GUEST(s)
                                            </Button>
                                            : <Autocomplete
                                                multiple
                                                options={[]}
                                                freeSolo
                                                onChange={(event, value) => {
                                                    setGuestDetails((prevState)=> {
                                                            return {
                                                            ...prevState,
                                                                guestEmails: value
                                                            }
                                                        })
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        variant="standard"
                                                        {...params}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            type: 'search'
                                                        }}
                                                        multiline
                                                        minRows={4}
                                                        name="guestEmail"
                                                        label="Guest Email(s)"
                                                        className="d-flex align-items-start"
                                                        onKeyDown={event => {
                                                            if(event.key === "Enter"){
                                                                if(!validateEmail(event.target.value)){
                                                                    event.defaultMuiPrevented = true;
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => {
                                                        return (
                                                            <Chip
                                                                variant="default"
                                                                label={option}
                                                                {...getTagProps({index})}
                                                            />
                                                        )
                                                    })
                                                }
                                            />
                                    }
                                </div>
                                {
                                    (user.twilioNumber !== "" && user.twilioNumber !== null) &&
                                        <>
                                            <div className="mb-3 d-flex">
                                                <div style={{width:"40%"}} className="pr-2" >
                                                    <Select variant="standard" labelId="country-label" value={contactDetail.countryId?contactDetail.countryId:100} style={{marginTop:"16px"}}
                                                        onChange={
                                                            (e) => {
                                                                setContactDetail((prev)=>
                                                                {
                                                                    return {...prev, countryId: parseInt(e.target.value), countryCode: country.filter((x)=>{return x.key === e.target.value})[0].cntCode};
                                                                })
                                                            }
                                                        }
                                                    fullWidth>
                                                        {country.map((ele, i) => (
                                                            ele.cntCode !== null ?
                                                                <MenuItem key={i} value={ele.key}>
                                                                    {`${ele.value} (${ele.cntCode})`}
                                                                </MenuItem>
                                                                : null
                                                        ))}
                                                    </Select>
                                                </div>
                                                <div style={{width:"45%"}}>
                                                    <InputField
                                                        type="text"
                                                        value={contactDetail.contactNo}
                                                        label="Mobile Number"
                                                        name="contactNo"
                                                        className="pr-2 w-100"
                                                        onChange={(name,value)=>{
                                                            setContactDetail((prev)=>
                                                            {
                                                                return {...prev, contactNo: value};
                                                            })
                                                        }}
                                                    />
                                                </div>
                                                <div style={{width:"15%"}}>
                                                    <Button variant="outlined" color="primary" onClick={() => handleClickAddContact()} style={{marginTop:"12px"}}>Add</Button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                {
                                                    guestDetails.contactList.length > 0 ?
                                                        guestDetails.contactList.map((v,i)=>(
                                                            <div key={i} className="contact-box">
                                                                {v}
                                                                <i className="fas fa-times-circle ml-2" onClick={()=>{handleClickDeleteContact(i);}}></i>
                                                            </div>
                                                        ))
                                                    : null
                                                }
                                            </div>
                                        </>
                                }
                                <div className="mb-3">
                                    <InputField
                                        type="text"
                                        value={guestDetails.description}
                                        label="Please share anything that will help prepare for our meeting."
                                        name="description"
                                        onChange={handleGuestChanges}
                                        multiline
                                        minRows={4}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <FormGroup className="text-center mb-5 mt-3 w-100">
                            <Button variant="contained" color="primary" onClick={handleBack} className="mr-3 close-schedule"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handleScheduleEvent} className="scheduleEvent"><i className="far fa-calendar-check mr-2"></i>SCHEDULE EVENT</Button>
                        </FormGroup>
                    </>
                );
            case 3:
                return (
                    <>
                        <Row className="w-100">
                            <Col md={6} className="mx-auto">
                                <div className="mb-3 d-flex justify-content-center">
                                    <div className="profilePick">
                                        {
                                            typeof user.imageUrl !== "undefined" && user?.imageUrl !== "" && user.imageUrl !== null ?
                                                <img src={user.imageUrl} alt=""/>
                                                :
                                                <span>{user.firstName[0]}{user.lastName[0]}</span>
                                        }
                                    </div>
                                </div>
                                <div className="mb-5">Great! Your appointment has been booked with {user.firstName} {user.lastName}</div>
                                <div className="mb-3">
                                    <i className="far fa-calendar-check mr-2"></i>
                                    <span className="font-size-18 font-weight-bold">{eventData.aetTitle}</span>
                                </div>
                                <div className="mb-3">
                                    <i className="far fa-clock mr-2"></i>
                                    <span className="font-size-18 font-weight-bold">Your Appointment is Scheduled for {getDurationString(eventData.aetDurationMinutes, eventData.aetDurationHours)}</span>
                                </div>
                                <div className="font-size-18 mb-3">
                                    <i className="far fa-calendar-alt mr-2"></i>
                                    <span>{timeFormat(selectedDate)} - {timeFormat(endDate)}, {dateFormat(selectedDate)}</span>
                                </div>
                                <div className="font-size-18 mb-5">
                                    <i className="far fa-globe mr-2"></i>
                                    <span>{guestDetails.timeZone}</span>
                                </div>
                                <p className="text-center">
                                    <strong>Appointment schedule event has been sent to your email address.</strong>
                                </p>
                            </Col>
                        </Row>
                    </>
                );
            default:
                return (
                    <>
                    </>
                );
        }
    };
    useEffect(()=>{
        getTimeZoneList().then(res => {
            if (res.status === 200) {
                const formattedTimeZoneList = res?.result?.timeZoneList.map((zone) => {
                    return {
                        id: zone?.tmzId,
                        value: zone?.tmzTitle,
                        key: zone?.tmzValue
                    }
                })
                setTimeZoneList(formattedTimeZoneList)
            }
        });
        getMemberDetails(userName).then((res)=>{
            if(res?.status === 200){
                getEventTypeAllList(userName).then((res1)=>{
                    if(res1.status === 200){
                        let event = res1.result.eventTypeList;
                        setUser({firstName: res.result.firstName, lastName: res.result.lastName, found: true, events: event, imageUrl: res.result.imageUrl, twilioNumber: res.result.twilioNumber});
                    }
                })
            } else {
                setUser({found: false})
            }

        })
        getAvailabilitySlotsList(userName).then(res=>{
           if(res.status === 200){
                let disabledWeekDay = res.result?.availabilitySlotsList.filter(val=>(val.aasAvailableYN === "N")).map(val=>{
                    return weekDayMap[val.aasDayName]
                });
                setDisabledWeekDays(disabledWeekDay);
                let disabledDateObjects = getDisabledDayList(selectedDate, disabledWeekDay);
                setDisabledDateList(disabledDateObjects);
           }
        })
        getCountry().then(res => {
            if (res.result.country) {
                let c = [];
                res.result.country.map(x => (
                    c.push({
                        "key": String(x.id),
                        "value": x.cntName,
                        "cntCode":x.cntCode
                    })
                ));
                setCountry(c);
            }
        })
    }, [userName, selectedDate]);
    return (
        <>
            {
                (user.hasOwnProperty("found") && user.found)?
                    <Row className="middleMain">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="text-center mb-4 mt-3 d-flex justify-content-center align-items-center">
                                <div className="profilePick mr-3">
                                    {
                                        typeof user.imageUrl !== "undefined" && user?.imageUrl !== "" && user.imageUrl !== null ?
                                            <img src={user.imageUrl} alt=""/>
                                        :
                                            <span>{user.firstName[0]}{user.lastName[0]}</span>
                                    }
                                </div>
                                <div className="mt-3">
                                    <h4>Welcome to {user.firstName} {user.lastName}'s Appointment Scheduling.</h4>
                                    <p>Please select event type and follow the instruction to add event to my calendar.</p>
                                </div>
                            </div>
                            <Row>
                                <Col xs={12} md={8} className="mx-auto d-flex flex-column align-items-center">
                                        <Stepper className="w-50 p-1 mb-1" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                        {getStepContent(activeStep)}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                : null
            }
            {
                (user.hasOwnProperty("found") && (!user?.found)) ?
                    <p>No Such User Exists.</p>
                    :null
            }
        </>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(Appointment);