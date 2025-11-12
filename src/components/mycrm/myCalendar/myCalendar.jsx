import React, {useCallback, useEffect, useState} from "react";
import {Col, Row} from "reactstrap";
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Link, Menu, MenuItem, InputAdornment} from "@mui/material";
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import $ from 'jquery';
import {dateFormat, handleClickHelp} from "../../../assets/commonFunctions";
import {getCalendarAuthentication, getEventList, getEventTypeAllList, getSync, googleCalendarOauth, outlookCalendarOauth} from "../../../services/myCalendarServices";
import {connect} from "react-redux";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {calenderName, googleCalendarUrl, outlookCalendarUrl, siteURL} from "../../../config/api";
import {setLoader} from "../../../actions/loaderActions";
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import history from "../../../history";
import LinkSendToModal from "./commonComponents/linkSendToModal";
import { getClientTimeZone } from '../../../assets/commonFunctions';
import ModalAppointmentLink from "./commonComponents/modalAppointmentLink";
import ModalEvent from "./commonComponents/modalEvent";
import ModalSelectType from "./commonComponents/modalSelectType";
import ModalReminder from "./commonComponents/modalReminder";
import { add } from "date-fns";

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const MyCalendar = ({subUser, globalAlert, setLoader, user}) => {
    const [openEventModal, setOpenEventModal] = useState(false)
    const [events, setEvents] = useState([])
    const [currentRange, setCurrentRange] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [thirdPartyCalendar, setThirdPartyCalendar] = useState({})
    const [currentView, setCurrentView] = useState("month")
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [modalLink, setModalLink] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [shareMedium, setShareMedium] = useState("");
    const [syncStart, setSyncStart] = useState(false);
    const [slotData, setSlotData] = useState({});
    const [modalSelectType, setModalSelectType] = useState(false);
    const toggleModalSelectType = () => { setModalSelectType(!modalSelectType); };
    const [modalReminder, setModalReminder] = useState(false);
    const toggleModalReminder = () => { setModalReminder(!modalReminder); };

    const displayGetCalendarAuthentication = () => {
        getCalendarAuthentication().then(res => {
            if (res.status === 200) {
                setThirdPartyCalendar(res.result);
            }
        })
    }
    useEffect(() => {
        $(".rbc-btn-group:first").find("button:first").trigger("click");
        displayGetCalendarAuthentication();
    }, []);
    useEffect(() => {
        getEventTypeAllList(user.encMemberId).then((res) => {
           if(res.status === 200 && res.result.eventTypeList.length > 0) {
               setShowLink(true);
           }
        });
    }, [user.encMemberId])

    const toggleLink = ()=>{
        setModalLink(!modalLink)
    };
    const toggleShareModal = () => {
        setShareModal((prevState) => (!prevState));
    };
    const handleClose = (event) => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const addNew = (slotInfo) => {
        if(slotInfo?.start < add(new Date(new Date()), { days: -1 })){
            globalAlert({
                type: "Error",
                text: "Please select time greater than current time.",
                open: true
            });
            return false;
        } else {
            setSlotData(slotInfo);
            toggleModalSelectType();
        }
    }
    const editSlot = (slotInfo) => {
        setSlotData(slotInfo);
        if(slotInfo.calEventReminder === "event"){
            setOpenEventModal(true);
        } else if(slotInfo.calEventReminder === "reminder"){
            toggleModalReminder();
        }
    }
    const handleClickGoogleCalendar = async () => {
        let x = window.innerWidth / 2 - 600 / 2;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open(googleCalendarUrl + '/googleCalendarSignIn', "GoogleCalendarWindow", "width=600,height=700,left=" + x + ",top=" + y);
        window.gcSuccess = function (data) {
            googleCalendarOauth(data).then(res => {
                if (res.status === 200) {
                    displayGetCalendarAuthentication();
                    let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
                    getSync(tz).then(res => {
                        if (res.status === 200) {
                            getEventListOnRangeChange(currentRange)
                        }
                    })
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
        window.gcError = function () {
            globalAlert({
                type: "Error",
                text: "Something went wrong!!!",
                open: true
            });
        }
    }
    const handleClickOutlookCalendar = () => {
        let x = window.innerWidth / 2 - 600 / 2;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open(outlookCalendarUrl + '/outlookCalendarSignIn', "OutlookCalendarWindow", "width=600,height=700,left=" + x + ",top=" + y);
        window.ocSuccess = function (data) {
            outlookCalendarOauth(data).then(res => {
                if (res.status === 200) {
                    displayGetCalendarAuthentication();
                    let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
                    getSync(tz).then(res => {
                        if (res.status === 200) {
                            getEventListOnRangeChange(currentRange)
                        }
                    })
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
        window.ocError = function () {
            globalAlert({
                type: "Error",
                text: "Something went wrong!!!",
                open: true
            });
        }
    }
    const setBgColor = (event) => {
        if(event?.calEventReminder === "reminder"){
            return "#9e69af";
        } else {
            if(event?.calType === "google"){
                return "#ef6c00";
            } else if(event?.calType === "outlook"){
                return "#E67C73";
            } else {
                return "#7986CB";
            }
        }
    }
    const getAndFormatEventList = (range) => {
        setSyncStart(true);
        getEventList(range).then(res => {
            if (res.status === 200 && res?.result?.eventList) {
                const eventList = res?.result?.eventList
                const formattedEventList = eventList?.map((event) => {
                    return {
                        ...event,
                        start: new Date(event?.start),
                        end: new Date(event?.end),
                        backgroundColor: setBgColor(event),
                        borderColor: setBgColor(event),
                        textColor: '#ffffff'
                    }
                })
                setEvents(formattedEventList)
            }
        })
    }
    const getEventListOnRangeChange = useCallback((range) => {
        let start, end;
        let timeZone=(typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        if (range.start && range.end) {
            start = dateFormat(range.start)
            end = dateFormat(range.end)
        } else {
            start = dateFormat(range[0])
            end = dateFormat(range[range.length - 1])
        }
        setCurrentRange((prev)=>({...prev, start, end, timeZone}));
        getAndFormatEventList({start, end, timeZone})
    },[user.timeZone]);
    const navigate = (date, view, action) => {
        setSelectedDate(date)
    }
    const handleCalendarSync = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        })
        let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        getSync(tz).then(res => {
            if (res.status === 200) {
                getEventListOnRangeChange(currentRange)
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
            }
            setLoader({
                load: false
            })
        })
    }
    const handleLinkModal = ()=>{
        if(showLink) {
            toggleLink();
        } else {
            globalAlert({
                type: "Error",
                text: "You need to Add Event Type to generate link.",
                open: true
            });
        }
    }
    const handleClickSelectTypeGo = (type) => {
        toggleModalSelectType();
        if(type === "event"){
            setOpenEventModal(true);
        } else if(type === "reminder"){
            toggleModalReminder();
        }
    }
    // useEffect(() => {
        // let interval = null;
        // if(thirdPartyCalendar?.googleCalendar || thirdPartyCalendar?.outlookCalendar){
        //     interval = setInterval(() => {
        //         setSyncStart(true);
        //         let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        //         getSync(tz).then(res => {
        //             if (res.status === 200) {
        //                 setSyncStart(false);
        //                 getEventListOnRangeChange(currentRange);
        //             }
        //         })
        //     }, 120 * 1000);
        // }
        // return ()=>{
        //     clearInterval(interval);
        //     interval = null;
        // }
    // }, [thirdPartyCalendar,currentRange,getEventListOnRangeChange])
    useEffect(()=>{
        if(syncStart === false && Object.keys(currentRange).length > 0){
            setTimeout(()=>{
                let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
                getSync(tz).then(res => {
                    if (res.status === 200) {
                        getAndFormatEventList(currentRange);
                    }
                });
            },2000);
        }
    },[syncStart, user.timeZone, currentRange]);
    return (
        <div>
            <Row>
                <Col>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex">
                                    <h3>My Calendar</h3>
                                    <ul className="sm-Profiles ml-3">
                                        {!thirdPartyCalendar?.googleCalendar || !thirdPartyCalendar.outlookCalendar ?
                                        <li>
                                            <InputAdornment position="start" className="align-items-baseline">
                                                <Link component="a" className={`btn-circle ${open ? "active" : ""}`} data-toggle="tooltip" title="Add" onClick={handleClick}>
                                                    <i className="far fa-plus-square"></i>
                                                    <div className="bg-green"></div>
                                                </Link>
                                                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}}>
                                                    {!thirdPartyCalendar?.googleCalendar &&
                                                        <MenuItem onClick={() => {handleClickGoogleCalendar();handleClose()}}>
                                                            <img src={siteURL + "/img/googlecalendar.png"} alt="Google Calendar" style={{width: "20px"}} className="mr-2"/>Connect Google Calendar
                                                        </MenuItem>
                                                    }
                                                    {!thirdPartyCalendar?.outlookCalendar &&
                                                        <MenuItem onClick={() => {handleClickOutlookCalendar();handleClose()}}>
                                                            <img src={siteURL + "/img/outlookcalendar.png"} alt="Outlook Calendar" style={{width: "20px"}} className="mr-2"/>Connect Outlook Calendar
                                                        </MenuItem>
                                                    }
                                                </Menu>
                                            </InputAdornment>
                                        </li> : null}
                                    </ul>
                                    {thirdPartyCalendar?.googleCalendar || thirdPartyCalendar?.outlookCalendar ?
                                        <>
                                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Sync" onClick={() => handleCalendarSync()}>
                                                <i className={`far fa-sync`}></i>
                                                <div className="bg-green"></div>
                                            </Link>
                                        </>
                                    : null}
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Appointment Link" onClick={handleLinkModal}>
                                        <i className="far fa-link"></i>
                                        <div className="bg-blue"></div>
                                    </Link>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="My Calender Settings" onClick={()=>{history.push("/mycalendarsettings")}}>
                                        <i className="far fa-cog"></i>
                                        <div className="bg-dark-grey"></div>
                                    </Link>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text" onClick={()=>{handleClickHelp("Calendar/Features/synch/CalendarFunctionalityinEmailsAndSurveys.html")}}>
                                        <i className="far fa-question-circle"></i>
                                        <div className="bg-grey"></div>
                                    </Link>
                                </div>
                                <div>
                                    {
                                        (thirdPartyCalendar?.googleCalendar || thirdPartyCalendar.outlookCalendar) &&
                                            <>
                                                <span>Connected To :</span>
                                                {
                                                    thirdPartyCalendar?.googleCalendar && <img src={siteURL + "/img/googlecalendar.png"} alt="Google Calendar" style={{width: "30px"}} className="mx-2 cursor-pointer" data-toggle="tooltip" title={thirdPartyCalendar?.googleCalendarEmail}/>
                                                }
                                                {
                                                    thirdPartyCalendar?.outlookCalendar && <img src={siteURL + "/img/outlookcalendar.png"} alt="Outlook Calendar" style={{width: "30px"}} className="cursor-pointer" data-toggle="tooltip" title={thirdPartyCalendar?.outlookCalendarEmail}/>
                                                }
                                            </>
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xs={12} sm={12} md={5} lg={3} xl={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateCalendar 
                                    value={selectedDate} 
                                    views={['year', 'month', 'day']}
                                    sx={{
                                        width: "auto !important",
                                        ".MuiYearCalendar-root": {
                                            width: "auto !important"
                                        },
                                        ".MuiMonthCalendar-root": {
                                            width: "auto !important"
                                        }
                                    }}
                                    onChange={(newValue) => setSelectedDate(newValue)} 
                                />
                            </LocalizationProvider>
                            <div className="mx-3 px-3">
                                <div className="d-flex align-items-center mb-3"><span className="square-box mr-2" style={{backgroundColor:"#7986CB",width:"30px",height:"30px"}}></span>{calenderName}</div>
                                <div className="d-flex align-items-center mb-3"><span className="square-box mr-2" style={{backgroundColor:"#E67C73",width:"30px",height:"30px"}}></span>Google Calendar</div>
                                <div className="d-flex align-items-center mb-3"><span className="square-box mr-2" style={{backgroundColor:"#ef6c00",width:"30px",height:"30px"}}></span>Outlook Calendar</div>
                                <div className="d-flex align-items-center mb-3"><span className="square-box mr-2" style={{backgroundColor:"#9e69af",width:"30px",height:"30px"}}></span>Reminder</div>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={7} lg={9} xl={9}>
                            <Calendar
                                localizer={localizer}
                                selectable
                                startAccessor="start"
                                endAccessor="end"
                                style={{height: 700}}
                                date={selectedDate}
                                onNavigate={navigate}
                                events={events}
                                onSelectSlot={(slotInfo) => {
                                    addNew(slotInfo)
                                }}
                                onSelectEvent={(slotInfo) => {
                                    editSlot(slotInfo)
                                }}
                                views={['month', 'week', 'day']}
                                onRangeChange={(range, view) => {
                                    getEventListOnRangeChange(range)
                                    if (view) {
                                        setCurrentView(view)
                                    }
                                }}
                                eventPropGetter={
                                    (event)=>{
                                        var style = {
                                            backgroundColor: event.backgroundColor,
                                            borderColor: event.borderColor,
                                            color: event.textColor
                                        };
                                        return {
                                            style: style
                                        };
                                    }
                                }
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {shareModal && <LinkSendToModal
                shareModal={shareModal}
                toggleShareModal={toggleShareModal}
                shareMedium={shareMedium}
                memberId={user.encMemberId}
                subMemberId={subUser.memberId}
                userCountry={user.country}
                globalAlert={globalAlert}
            />}
            {modalLink && <ModalAppointmentLink
                modalLink={modalLink}
                toggleLink={toggleLink}
                user={user}
                globalAlert={globalAlert}
                setShareMedium={setShareMedium}
                toggleShareModal={toggleShareModal}
                setLoader={setLoader}
                subUser={subUser}
            />}
            {openEventModal && <ModalEvent
                openEventModal={openEventModal}
                setOpenEventModal={setOpenEventModal}
                getAndFormatEventList={getAndFormatEventList}
                currentRange={currentRange}
                globalAlert={globalAlert}
                subUser={subUser}
                thirdPartyCalendar={thirdPartyCalendar}
                currentView={currentView}
                user={user}
                slotData={slotData}
            />}
            {modalSelectType && <ModalSelectType
                modalSelectType={modalSelectType}
                toggleModalSelectType={toggleModalSelectType}
                handleClickSelectTypeGo={handleClickSelectTypeGo}
            />}
            {modalReminder && <ModalReminder
                modalReminder={modalReminder}
                toggleModalReminder={toggleModalReminder}
                globalAlert={globalAlert}
                user={user}
                subUser={subUser}
                slotData={slotData}
                currentView={currentView}
                getAndFormatEventList={getAndFormatEventList}
                currentRange={currentRange}
            />}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        subUser: state.subUser,
        user: state.user
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(MyCalendar);