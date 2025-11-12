import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button, Checkbox, FormControlLabel, TextField, Box, Autocomplete, Select, MenuItem} from "@mui/material";
import InputField from "../../../shared/commonControlls/inputField";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import { dateFormat, dateTimeFormatDB, getClientTimeZone, validateEmail } from "../../../../assets/commonFunctions";
import $ from 'jquery';
import { deleteEvent, getTimeZoneList, saveEvent } from "../../../../services/myCalendarServices";
import { checkAuthorized, getCountry } from "../../../../services/commonService";
import {LocalizationProvider, DatePicker, TimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setConfirmDialogAction } from "../../../../actions/confirmDialogActions";
import DropDownControls from "../../../shared/commonControlls/dropdownControl";
import { add, setHours } from "date-fns";
import { checkSmsWhiteFlag } from "../../../../services/userService";
import ModalBuyTwilioNo from "./modalBuyTwilioNo";
import { setPendingTransactionAction } from "../../../../actions/pendingTransactionActions";
import History from "../../../../history";
import ModalRepeat from "./modalRepeat";

const toolbarProperties = {
    options: ['inline', 'list', 'link', 'emoji', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    list: {
        options: ['unordered', 'ordered'],
    }
}
const repeatList = [
    {
        key: "donotrepeat",
        value: "Don't repeat"
    },
    {
        key: "Daily",
        value: "Daily"
    },
    {
        key: "Weekly",
        value: "Weekly"
    },
    {
        key: "Monthly",
        value: "Monthly"
    },
    {
        key: "Yearly",
        value: "Yearly"
    },
    {
        key: "Custom",
        value: "Custom"
    }
]
const ModalEvent = ({openEventModal, setOpenEventModal, getAndFormatEventList, currentRange, globalAlert, subUser, thirdPartyCalendar, currentView, user, slotData, confirmDialog, pendingTransaction}) => {
    const [currentEventDetails, setCurrentEventDetails] = useState({contactList: []});
    const [contactDetail, setContactDetail] = useState({countryId: 100, countryCode: "+1", contactNo: ""});
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [country, setCountry] = useState([]);
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => { setModalBuyTwilioNo(!modalBuyTwilioNo); };
    const [modalRepeat, setModalRepeat] = useState(false);
    const toggleModalRepeat = () => { setModalRepeat(!modalRepeat); };

    const formatEnd = (end) => {
        return new Date(add(end, {days: -1}).setHours(8, 30))
    }
    const addNewEvent = (slotInfo) => {
        setCurrentEventDetails({
            ...slotInfo,
            contactList: currentEventDetails.contactList,
            calAttendees:[],
            dialogTitle: "Add New Event",
            allDay: false,
            start: currentView === "month" ? setHours(slotInfo?.start, 8) : slotInfo?.start,
            end: currentView === "month" ? formatEnd(slotInfo?.end) : slotInfo?.end,
            calTimeZone: (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone,
            calRepeatType: "donotrepeat"
        })
        if(typeof user.webConference !== "undefined" && user.webConference !== "" && user.webConference !== null){
            let data = `<br/>\nWeb Conference Link\n\n${user.webConference}`;
            const blocksFromHtml = htmlToDraft(data);
            const {contentBlocks, entityMap} = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(() => EditorState.createWithContent(contentState));
        } else {
            setEditorState(() => EditorState.createEmpty());
        }
    }
    const editEvent = (slotInfo) => {
        setCurrentEventDetails({
            ...slotInfo,
            dialogTitle: "Edit Event",
            editMode: true,
            start: slotInfo?.start,
            end: slotInfo?.end,
            calAttendees: (typeof slotInfo.calAttendees !== "undefined" && slotInfo.calAttendees !== "" && slotInfo.calAttendees !== null) ? JSON.parse(slotInfo.calAttendees).attendees : []
        });
        let description = slotInfo?.description === null || slotInfo?.description === "null" ? "" : slotInfo?.description;
        const blocksFromHtml = htmlToDraft(description);
        const {contentBlocks, entityMap} = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(() => EditorState.createWithContent(contentState));
    }
    const handleClickSave = (editAll,buttonClassName) => {
        if(typeof currentEventDetails?.title === "undefined" || currentEventDetails?.title === "" || currentEventDetails?.title === null){
            globalAlert({
                type: "Error",
                text: "Please enter event title.",
                open: true
            });
            return false;
        }
        if(currentEventDetails?.start < new Date()){
            globalAlert({
                type: "Error",
                text: "Please select time greater than current time.",
                open: true
            });
            return false;
        }
        if(currentEventDetails?.end < currentEventDetails?.start){
            globalAlert({
                type: "Error",
                text: "Please select end date greater than start date.",
                open: true
            });
            return false;
        }
        let attendees = JSON.stringify({"attendees": [...currentEventDetails.calAttendees]});
        const payload = {
            ...currentEventDetails,
            id: currentEventDetails?.id ? currentEventDetails?.id : 0,
            title: currentEventDetails?.title,
            description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            start: dateTimeFormatDB(currentEventDetails?.start),
            end: dateTimeFormatDB(currentEventDetails?.end),
            allDay: currentEventDetails?.allDay,
            calTimeZone: currentEventDetails?.calTimeZone || "",
            calAttendees: attendees,
            contactList: currentEventDetails.contactList,
            subMemberId: subUser.memberId,
            editAll: editAll,
            calParentId: currentEventDetails?.calParentId ? currentEventDetails?.calParentId : 0
        }
        $(`button.${buttonClassName}`).hide();
        $(`button.${buttonClassName}`).after(`<div class="lds-ellipsis"><div></div><div></div><div></div>`);
        saveEvent(payload).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                getAndFormatEventList(currentRange)
            }
            $(".lds-ellipsis").remove();
            $(`button.${buttonClassName}`).show();
            setOpenEventModal(false)
        })
    }
    const handleClickDelete = (deleteAll) => {
        const payload = {
            calId: currentEventDetails?.id,
            googleCalendar: currentEventDetails?.googleCalendar ? currentEventDetails?.googleCalendar : false,
            outlookCalendar: currentEventDetails?.outlookCalendar ? currentEventDetails?.outlookCalendar : false,
            calParentId:currentEventDetails?.calParentId ? currentEventDetails?.calParentId : 0,
            deleteAll: deleteAll
        }
        deleteEvent(payload).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                getAndFormatEventList(currentRange)
            }
        })
        setOpenEventModal(false)
    }
    const handleClickAddContact = () => {
        if(typeof user.twilioNumber === "undefined" || user.twilioNumber === null || user.twilioNumber === "") {
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    toggleBuyTwilioNo();
                } else {
                    pendingTransaction([{
                        "pendingTransactionType": "myCalendar"
                    }]);
                    History.push("/carddetails");
                }
            });
        } else {
            checkSmsWhiteFlag().then(res => {
                if (res.status === 200) {
                    setCurrentEventDetails((prev)=>{
                        return {
                            ...prev,
                            contactList: [...prev.contactList,`${contactDetail.countryCode}${contactDetail.contactNo.replace(/\D/g, "")}`]
                        }
                    })
                    setContactDetail({countryId: 100, countryCode: "+1", contactNo: ""});
                } else if(res.status === 401) {
                    globalAlert({
                        type: "Warning",
                        text: res.message,
                        open: true
                    });
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    }
    const handleClickDeleteContact = (index) => {
        let t = currentEventDetails.contactList;
        t.splice(index, 1);
        setCurrentEventDetails((prev)=>{
            return {
                ...prev,
                contactList: t
            }
        })
    }
    useEffect(() => {
        getCountry().then(res => {
            if (res.result.country) {
                let country = [];
                res.result.country.map(x => (
                    country.push({
                        "key": String(x.id),
                        "value": x.cntName,
                        "cntCode":x.cntCode
                    })
                ));
                setCountry(country);
            }
        });
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
    }, []);
    useEffect(()=>{
        if(typeof slotData.id === "undefined"){
            addNewEvent(slotData);
        } else {
            editEvent(slotData);
        }
    },[slotData]);
    return (
        <>
            <Modal size="xs" isOpen={openEventModal}>
                <ModalHeader toggle={() => { setOpenEventModal(false) }}>{currentEventDetails?.dialogTitle}</ModalHeader>
                <ModalBody className="p-4">
                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                        <i className="far fa-align-left mr-3 mb-2"></i>
                        <div className="w-100">
                            <InputField
                                name="title"
                                id="title"
                                value={currentEventDetails?.title}
                                label="Title"
                                onChange={(name, value) => {
                                    setCurrentEventDetails((prev) => {
                                        return {
                                            ...prev,
                                            [name]: value
                                        }
                                    })
                                }}
                            />
                        </div>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                            <i className="far fa-calendar-alt mr-3 mb-2"></i>
                            <div className="d-flex">
                                <DatePicker
                                    value={currentEventDetails?.start}
                                    label="Start Date"
                                    inputFormat="MM/dd/yyyy"
                                    className="mr-5"
                                    onChange={(date) => {
                                        setCurrentEventDetails((prev) => {
                                            return {
                                                ...prev,
                                                start: date
                                            }
                                        })
                                    }}
                                    slotProps={{ textField: { variant: "standard", className: "mt-3" } }}
                                    minDate={new Date()}
                                />
                                <div className="ml-5">
                                    <DatePicker
                                        value={currentEventDetails?.end}
                                        label="End Date"
                                        inputFormat="MM/dd/yyyy"
                                        onChange={(date) => {
                                            setCurrentEventDetails((prev) => {
                                                return {
                                                    ...prev,
                                                    end: date
                                                }
                                            })
                                        }}
                                        slotProps={{ textField: { variant: "standard", className: "mt-3" } }}
                                        minDate={new Date()}
                                    />
                                </div>
                            </div>
                        </Box>
                        <FormControlLabel className="mt-3 ml-3"
                            control={<Checkbox color="primary"
                                checked={currentEventDetails?.allDay ? currentEventDetails?.allDay : false}
                                onChange={(event) => {
                                    setCurrentEventDetails((prev) => {
                                        return {
                                            ...prev,
                                            allDay: event.target.checked
                                        }
                                    })
                                }}/>
                            } label="All Day"/>
                        {!currentEventDetails?.allDay ?
                            <Box sx={{display: 'flex', alignItems: 'flex-end'}} className="mb-3">
                                <i className="far fa-alarm-clock mr-3 mb-2"></i>
                                <div className="d-flex">
                                    <TimePicker
                                        label="Start Time"
                                        value={currentEventDetails?.start}
                                        onChange={(time) => {
                                            setCurrentEventDetails((prev) => {
                                                return {
                                                    ...prev,
                                                    start: time
                                                }
                                            })
                                        }}
                                        slotProps={{ textField: { variant: "standard" } }}
                                        minTime={new Date()}
                                    />
                                    <div className="ml-5">
                                        <TimePicker
                                            label="End Time"
                                            value={currentEventDetails?.end}
                                            onChange={(time) => {
                                                setCurrentEventDetails((prev) => {
                                                    return {
                                                        ...prev,
                                                        end: time
                                                    }
                                                })
                                            }}
                                            slotProps={{ textField: { variant: "standard" } }}
                                            minTime={new Date()}
                                        />
                                    </div>
                                </div>
                            </Box> : null
                        }
                        {!currentEventDetails?.allDay ?
                            <Box sx={{display: 'flex', alignItems: 'start'}} className="mb-3">
                                <i className="far fa-globe mr-3 mt-4"></i>
                                <div className="w-100">
                                    <DropDownControls
                                        label="Time Zone"
                                        name="calTimeZone"
                                        value={currentEventDetails?.calTimeZone || ""}
                                        onChange={(name, value) => {
                                            setCurrentEventDetails((prev) => {
                                                return {
                                                    ...prev,
                                                    [name]: value
                                                }
                                            })
                                        }}
                                        dropdownList={timeZoneList}
                                    />
                                </div>
                            </Box> : null
                        }
                    </LocalizationProvider>
                    <Box className="mb-3 d-flex">
                        <i className="far fa-repeat mr-3 mt-4"></i>
                        <div className="w-100">
                            <DropDownControls
                                label="Repeat Type"
                                name="calRepeatType"
                                value={currentEventDetails?.calRepeatType || ""}
                                onChange={(name, value) => {
                                    setCurrentEventDetails((prev) => {
                                        return {
                                            ...prev,
                                            [name]: value
                                        }
                                    });
                                    if(value !== "donotrepeat"){
                                        toggleModalRepeat();
                                    }
                                }}
                                onClick={(event)=>{
                                    if(event.target.textContent !== "Don't repeat"){
                                        toggleModalRepeat();
                                    }
                                }}
                                dropdownList={repeatList}
                            />
                            {currentEventDetails?.outOccours && <p className="mb-0 mt-3">{`${currentEventDetails?.outOccours} ${currentEventDetails?.calRepeatEndDate !== null ? dateFormat(currentEventDetails?.calRepeatEndDate) : ""}`}</p>}
                        </div>
                    </Box>
                    <Box className="mb-3">
                        <i className="far fa-align-left mr-3 mt-4 align-top"></i>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="wrapper-class d-inline-block"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            onEditorStateChange={(state) => {
                                setEditorState(state)
                            }}
                            toolbar={toolbarProperties}
                            wrapperStyle={{width:"87%"}}
                        />
                    </Box>
                    <Box className="d-flex mb-3">
                        <i className="far fa-users-medical mr-2 mt-4 align-top"></i>
                        <div className="w-100">
                            {currentEventDetails?.calAttendees && <Autocomplete
                                multiple
                                options={[]}
                                freeSolo
                                autoSelect={true}
                                value={currentEventDetails.calAttendees}
                                onChange={(event, value) => {
                                    setCurrentEventDetails((prev)=> {
                                            return {
                                                ...prev,
                                                calAttendees: value
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
                            />}
                        </div>
                    </Box>
                    <Box className="d-flex">
                        <i className="fas fa-mobile-alt mr-3 mt-4 align-top"></i>
                        <div className="w-100">
                            <div className="d-flex mb-3">
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
                            <div>
                                {
                                    currentEventDetails?.contactList?.length > 0 ?
                                        currentEventDetails?.contactList?.map((v,i)=>(
                                            <div key={i} className="contact-box">
                                                {v}
                                                <i className="fas fa-times-circle ml-2" onClick={()=>{handleClickDeleteContact(i);}}></i>
                                            </div>
                                        ))
                                    : null
                                }
                            </div>
                        </div>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    {currentEventDetails?.editMode &&
                        <Button variant="contained" color="primary" onClick={() => {
                            confirmDialog({
                                open: true,
                                title: 'Are you sure you want to delete selected event?',
                                component: <>
                                    {
                                        thirdPartyCalendar?.googleCalendar ?
                                            <FormControlLabel control={<Checkbox color="primary" onClick={(event) => {
                                                setCurrentEventDetails((prev) => {
                                                    prev.googleCalendar=event.target.checked;
                                                    return prev;
                                                })
                                            }}/>} label="Delete from Google Calendar"/>
                                        : null
                                    }
                                    {
                                        thirdPartyCalendar?.outlookCalendar ?
                                            <FormControlLabel control={<Checkbox color="primary" onClick={(event) => {
                                                setCurrentEventDetails((prev) => {
                                                    prev.outlookCalendar=event.target.checked;
                                                    return prev;
                                                })
                                            }}/>} label="Delete from Outlook Calendar"/>
                                        : null
                                    }
                                </>,
                                onConfirm: () => {
                                    handleClickDelete("N")
                                }
                            })
                        }}>DELETE</Button>
                    }
                    {(currentEventDetails?.editMode && currentEventDetails?.calRepeatType !== "donotrepeat") &&
                        <Button className="ml-3" variant="contained" color="primary" onClick={() => {
                            confirmDialog({
                                open: true,
                                title: 'Are you sure you want to delete selected event?',
                                component: <>
                                    {
                                        thirdPartyCalendar?.googleCalendar ?
                                            <FormControlLabel control={<Checkbox color="primary" onClick={(event) => {
                                                setCurrentEventDetails((prev) => {
                                                    prev.googleCalendar=event.target.checked;
                                                    return prev;
                                                })
                                            }}/>} label="Delete from Google Calendar"/>
                                        : null
                                    }
                                    {
                                        thirdPartyCalendar?.outlookCalendar ?
                                            <FormControlLabel control={<Checkbox color="primary" onClick={(event) => {
                                                setCurrentEventDetails((prev) => {
                                                    prev.outlookCalendar=event.target.checked;
                                                    return prev;
                                                })
                                            }}/>} label="Delete from Outlook Calendar"/>
                                        : null
                                    }
                                </>,
                                onConfirm: () => {
                                    handleClickDelete("Y")
                                }
                            })
                        }}>DELETE ALL</Button>
                    }
                    <Button className="mx-3" variant="contained" color="primary" onClick={() => {
                        setOpenEventModal(false)
                    }}>CLOSE</Button>
                    <Button className="handleEventSave" variant="contained" color="primary" onClick={() => {
                        handleClickSave("N","handleEventSave")
                    }}>SAVE</Button>
                    {(currentEventDetails?.editMode && currentEventDetails?.calRepeatType !== null && currentEventDetails?.calRepeatType !== "donotrepeat") && <Button className="ml-3 handleEventSaveAll" variant="contained" color="primary" onClick={() => {
                        handleClickSave("Y","handleEventSaveAll")
                    }}>SAVE ALL</Button>}
                </ModalFooter>
            </Modal>
            <ModalBuyTwilioNo
                modalBuyTwilioNo={modalBuyTwilioNo}
                toggleBuyTwilioNo={toggleBuyTwilioNo}
                user={user}
                globalAlert={globalAlert}
                subUser={subUser}
            />
            {modalRepeat && <ModalRepeat
                modalRepeat={modalRepeat}
                toggleModalRepeat={toggleModalRepeat}
                currentEventDetails={currentEventDetails}
                setCurrentEventDetails={setCurrentEventDetails}
                globalAlert={globalAlert}
            />}
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(ModalEvent);