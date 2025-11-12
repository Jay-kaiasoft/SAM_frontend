import React, { Fragment, useCallback, useEffect, useState } from "react";
import {Col, Input, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import {Autocomplete, Button, Checkbox, FormControlLabel, FormLabel, IconButton, InputAdornment, Link, MenuItem, Pagination, Select, Step, StepLabel, Stepper, TextField} from "@mui/material";
import { QontoConnector, QontoStepIcon, dateFormat, dateTimeFormat, dateTimeFormatDB, getClientTimeZone, searchIconTransparent, validateEmail } from "../../../../assets/commonFunctions";
import InputField from "../../../shared/commonControlls/inputField";
import History from "../../../../history";
import FilterMyPages from "../../../shared/commonControlls/filterMyPages";
import { myPageImageUrl } from "../../../../config/api";
import { getMyPagesList, getMyPagesTags, getSmsTemplateList } from "../../../../services/myDesktopService";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { getContactList, getGroupListWithCheckDuplicate } from "../../../../services/clientContactService";
import SearchIcon from "@mui/icons-material/Search";
import { checkAuthorized, getCountry } from "../../../../services/commonService";
import { add, setHours }  from "date-fns";
import $ from "jquery";
import { deleteEvent, getTimeZoneList, saveReminder } from "../../../../services/myCalendarServices";
import ModalBuyTwilioNo from "./modalBuyTwilioNo";
import { setPendingTransactionAction } from "../../../../actions/pendingTransactionActions";
import { checkSmsWhiteFlag } from "../../../../services/userService";
import { connect } from "react-redux";
import DropDownControls from "../../../shared/commonControlls/dropdownControl";
import ModalRepeat from "./modalRepeat";
import { setConfirmDialogAction } from "../../../../actions/confirmDialogActions";

const ModalReminder = ({modalReminder, toggleModalReminder, globalAlert, user, subUser, slotData, currentView, getAndFormatEventList, currentRange, confirmDialog, pendingTransaction}) => {
    const steps = ["1","2","3","4","5"];
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = useState({});
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setModalBuyTwilioNo(!modalBuyTwilioNo);
    };
    const [modalRepeat, setModalRepeat] = useState(false);
    const toggleModalRepeat = () => { setModalRepeat(!modalRepeat); };
    
    const handleReset = () => {
        setActiveStep(0);
        setData({});
        toggleModalReminder();
    }
    const handleChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleClickNextFirst = () => {
        if(typeof data?.calReminderSubject === "undefined" || data?.calReminderSubject === "" || data?.calReminderSubject === null){
            globalAlert({
                type: "Error",
                text: "Please enter reminder subject.",
                open: true
            });
            return false;
        }
        if(typeof data?.calReminderType === "undefined" || data?.calReminderType?.length === 0){
            globalAlert({
                type: "Error",
                text: "Please select atleast one reminder type.",
                open: true
            });
            return false;
        }
        if(new Date(data?.calScheduleDateTime) < new Date()){
            globalAlert({
                type: "Error",
                text: "Please select time greater than current time.",
                open: true
            });
            return false;
        }
        handleNext();
    }
    const handleClickNextSecond = () => {
        if(data?.calAttendees?.length === 0 && data?.calReminderType?.includes("email")){
            globalAlert({
                type: "Error",
                text: "Please enter guest email.",
                open: true
            });
            return false;
        }
        if(data?.contactList?.length === 0 && data?.calReminderType?.includes("sms")){
            globalAlert({
                type: "Error",
                text: "Please enter mobile number.",
                open: true
            });
            return false;
        }
        if(typeof data?.calReminderType !== "undefined" && data?.calReminderType?.includes("email")){
            handleNext();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 2);
        }
    }
    const handleClickNextThird = () => {
        if(typeof data?.calMyPageId === "undefined" || data?.calMyPageId === "" || data?.calMyPageId === null){
            globalAlert({
                type: "Error",
                text: "Please select page design.",
                open: true
            });
            return false;
        }
        if(typeof data?.calReminderType !== "undefined" && data?.calReminderType?.includes("sms")){
            handleNext();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 2);
        }
    }
    const handleClickNextFourth = () => {
        if(typeof data?.calSmsSstId === "undefined" || data?.calSmsSstId === "" || data?.calSmsSstId === null){
            globalAlert({
                type: "Error",
                text: "Please select SMS template.",
                open: true
            });
            return false;
        }
        handleNext();
    }
    const handleClickBackFourth = () => {
        if(typeof data?.calReminderType !== "undefined" && data?.calReminderType?.includes("email")){
            handleBack();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 2);
        }
    }
    const handleClickBackFifth = () => {
        if(typeof data?.calReminderType !== "undefined" && data?.calReminderType?.includes("sms")){
            handleBack();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 2);
        }
    }
    const handleClickSave = (editAll,buttonClassName) => {
        let attendees = JSON.stringify({"attendees": [...data.calAttendees]});
        let requestData = {
            ...data,
            id: data?.id ? data?.id : 0,
            calAttendees: attendees,
            calReminderType: data.calReminderType.join(","),
            start: dateTimeFormatDB(data?.start),
            end: dateTimeFormatDB(data?.end),
            calScheduleDateTime: dateTimeFormatDB(data?.calScheduleDateTime),
            subUserId: subUser.memberId,
            editAll: editAll,
            calParentId: data?.calParentId ? data?.calParentId : 0
        }
        $(`button.${buttonClassName}`).hide();
        $(`button.${buttonClassName}`).after(`<div class="lds-ellipsis"><div></div><div></div><div></div>`);
        saveReminder(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                getAndFormatEventList(currentRange);
                handleReset();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
            $(".lds-ellipsis").remove();
            $(`button.${buttonClassName}`).show();
        })
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <ReminderDetails
                        data={data}
                        setData={setData}
                        handleChange={handleChange}
                        handleClickNextFirst={handleClickNextFirst}
                        toggleBuyTwilioNo={toggleBuyTwilioNo}
                        pendingTransaction={pendingTransaction}
                        globalAlert={globalAlert}
                        user={user}
                        toggleModalRepeat={toggleModalRepeat}
                    />
                );
            case 1:
                return (
                    <SelectContacts
                        data={data}
                        setData={setData}
                        handleBack={handleBack}
                        handleClickNextSecond={handleClickNextSecond}
                        globalAlert={globalAlert}
                        user={user}
                    />
                );
            case 2:
                return (
                    <SelectMyPage
                        data={data}
                        handleChange={handleChange}
                        user={user}
                        handleBack={handleBack}
                        handleClickNextThird={handleClickNextThird}
                    />
                );
            case 3:
                return (
                    <SelectSmsTemplate
                        data={data}
                        handleChange={handleChange}
                        handleClickBackFourth={handleClickBackFourth}
                        handleClickNextFourth={handleClickNextFourth}
                    />
                );
            case 4:
                return (
                    <ScheduleTime
                        data={data}
                        handleClickBackFifth={handleClickBackFifth}
                        handleClickSave={handleClickSave}
                    />
                );
            default:
                return 'Unknown step';
        }
    }
    const formatEnd = (end) => {
        return new Date(add(end, {days: -1}).setHours(8, 30))
    }
    const addNewReminder = (slotInfo) => {
        setData({
            ...slotInfo,
            contactList: [], 
            calAttendees: [], 
            calReminderType: [],
            calMyPageId: 0,
            calSmsSstId: 0,
            dialogTitle: "Add New Reminder",
            allDay:	false,
            calScheduleDateTime: currentView === "month" ? setHours(slotInfo?.start, 8) : slotInfo?.start,
            start: currentView === "month" ? setHours(slotInfo?.start, 8) : slotInfo?.start,
            end: currentView === "month" ? formatEnd(slotInfo?.end) : slotInfo?.end,
            calTimeZone: (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone,
            calRepeatType: "donotrepeat"
        })
    }
    const editReminder = (slotInfo) => {
        setData({
            ...slotInfo,
            dialogTitle: "Edit Reminder",
            editMode: true,
            calAttendees: (typeof slotInfo.calAttendees !== "undefined" && slotInfo.calAttendees !== "" && slotInfo.calAttendees !== null) ? JSON.parse(slotInfo.calAttendees).attendees : [],
            calReminderType: slotInfo.calReminderType !== null ? slotInfo.calReminderType.split(",") : []
        });
    }
    const handleClickDelete = (deleteAll) => {
        const payload = {
            calId: data?.id,
            googleCalendar: false,
            outlookCalendar: false,
            calParentId:data?.calParentId ? data?.calParentId : 0,
            deleteAll: deleteAll
        }
        deleteEvent(payload).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                getAndFormatEventList(currentRange);
            }
        })
        handleReset();
    }
    useEffect(()=>{
        if(typeof slotData.id === "undefined"){
            addNewReminder(slotData);
        } else {
            editReminder(slotData);
        }
    },[slotData]);
    return (
        <>
            <Modal size="xl" isOpen={modalReminder}>
                <ModalHeader toggle={() => { handleReset(); }}>{data?.dialogTitle}</ModalHeader>
                <ModalBody>
                    <Stepper className="w-50 p-1 mb-1 mx-auto" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {getStepContent(activeStep)}
                </ModalBody>
                <ModalFooter>
                    {data?.id &&
                        <Button variant="contained" color="primary" onClick={() => {
                            confirmDialog({
                                open: true,
                                title: 'Are you sure you want to delete selected reminder?',
                                onConfirm: () => {
                                    handleClickDelete("N")
                                }
                            })
                        }}>DELETE</Button>
                    }
                    {(data?.id && data?.calRepeatType !== "donotrepeat") &&
                        <Button className="ml-3" variant="contained" color="primary" onClick={() => {
                            confirmDialog({
                                open: true,
                                title: 'Are you sure you want to delete selected reminder?',
                                onConfirm: () => {
                                    handleClickDelete("Y")
                                }
                            })
                        }}>DELETE ALL</Button>
                    }
                    <Button className="ml-3" variant="contained" color="primary" onClick={() => { handleReset(); }}>CLOSE</Button>
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
                currentEventDetails={data}
                setCurrentEventDetails={setData}
                globalAlert={globalAlert}
            />}
        </>
    );
}

const ReminderDetails = ({data, setData, handleChange, handleClickNextFirst, toggleBuyTwilioNo, pendingTransaction, globalAlert, user, toggleModalRepeat}) => {
    const [timeZoneList, setTimeZoneList] = useState([]);
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
    const handleChangeCheckBox = (checked, value) => {
        if(checked){
            if(value === "sms"){
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
                            let t = [...data?.calReminderType];
                            t.push(value);
                            handleChange("calReminderType", t);
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
            } else {
                let t = [...data?.calReminderType];
                t.push(value);
                handleChange("calReminderType", t);
            }
        } else {
            let t = data?.calReminderType?.filter((x)=> {return x !== value});
            handleChange("calReminderType", t);
        }
    }
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
    }, []);
    return (
        <Row>
            <Col xs={4} className="mx-auto">
                <div className="mb-3">
                    <InputField type="text" id="calReminderSubject" name="calReminderSubject" value={data?.calReminderSubject || ""} onChange={handleChange} label="Reminder Subject"/>
                </div>
                <div className="mb-3">
                    <FormLabel className="w-100">Reminder Type</FormLabel>
                    <FormControlLabel className="w-100" control={ <Checkbox checked={data?.calReminderType?.includes("email") || false} onChange={(e)=>{handleChangeCheckBox(e.target.checked,"email")}} /> } label="Email" />
                    <FormControlLabel className="w-100" control={ <Checkbox checked={data?.calReminderType?.includes("sms") || false} onChange={(e)=>{handleChangeCheckBox(e.target.checked,"sms")}} /> } label="SMS" />
                </div>
                <div className="mb-3">
                    <p>Schedule Time</p>
                    <LocalizationProvider dateAdapter={AdapterDateFns} className="mt-5">
                        <DateTimePicker
                            className="w-100"
                            value={new Date(data.calScheduleDateTime)}
                            inputFormat="MM/dd/yyyy hh:mm a"
                            onChange={(value) => {
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        calScheduleDateTime: value,
                                        start: value,
                                        end: add(value, { minutes: 30 })
                                    };
                                })
                            }}
                            slotProps={{ textField: { variant: "standard" } }}
                            minDateTime={new Date()}
                        />
                    </LocalizationProvider>
                </div>
                <div className="mb-3">
                    <DropDownControls
                        label="Time Zone"
                        name="calTimeZone"
                        value={data?.calTimeZone || ""}
                        onChange={(name, value) => {
                            setData((prev) => {
                                return {
                                    ...prev,
                                    [name]: value
                                }
                            })
                        }}
                        dropdownList={timeZoneList}
                    />
                </div>
                <div className="mb-3">
                    <DropDownControls
                        label="Repeat Type"
                        name="calRepeatType"
                        value={data?.calRepeatType || ""}
                        onChange={(name, value) => {
                            setData((prev) => {
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
                    {data?.outOccours && <p className="mb-0 mt-3">{`${data?.outOccours} ${data?.calRepeatEndDate !== null ? dateFormat(data?.calRepeatEndDate) : ""}`}</p>}
                </div>
                <div className="text-center">
                    <Button variant="contained" color="primary" onClick={handleClickNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </div>
            </Col>
        </Row>
    );
}

const SelectContacts = ({data, setData, handleBack, handleClickNextSecond, globalAlert, user}) => {
    const [selectedPage, setSelectedPage] = useState(0);
    const [search, setSearch] = useState("");
    const [searchSend,setSearchSend] = useState("");
    const [sort,setSort] = useState("firstName,asc");
    const [sortBox, setSortBox] = useState([true]);
    const [perPage,setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData,setTotalData] = useState(0);
    const [groupList, setGroupList] = useState([]);
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValue, setTableCheckBoxValue] = useState([]);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [contactDetails, setContactDetails] = useState([]);
    const [country, setCountry] = useState([]);
    const [contactDetail, setContactDetail] = useState({countryId: 100, countryCode: "+1", contactNo: ""});

    const mainTableCheckBox = useCallback(() => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        let newTableCheckBoxValue = [];
        const newTableCheckBoxValueList = [];
        let newGuestEmails = [];
        let newContactList = [];
        contactDetails.forEach(element => {
            newTableCheckBoxValue.push(!flag)
            if (!flag){
                newTableCheckBoxValueList.push(element.emailId);
                if(element.email !== "" && data?.calReminderType?.includes("email")){
                    newGuestEmails.push(element.email);
                }
                if(element.phoneNumber !== "" && data?.calReminderType?.includes("sms")){
                    let t = "";
                    if(element.country !== ""){
                        let cntId = country.find((val) => (element.country === val.value)).cntCode;
                        t = cntId+element.phoneNumber;
                    } else {
                        t = user.countryCode+element.phoneNumber;
                    }
                    newContactList.push(t);
                }
            } else {
                if(element.email !== "" && data?.calReminderType?.includes("email")){
                    setData((prev)=> {
                        let t = prev.calAttendees.filter(x => x !== element.email);
                        return {
                            ...prev,
                            calAttendees: t
                        }
                    });
                }
                if(element.phoneNumber !== "" && data?.calReminderType?.includes("sms")){
                    let tempContact = "";
                    if(element.country !== ""){
                        let cntId = country.find((val) => (element.country === val.value)).cntCode;
                        tempContact = cntId+element.phoneNumber;
                    } else {
                        tempContact = user.countryCode+element.phoneNumber;
                    }
                    setData((prev)=> {
                        let t = prev.contactList.filter(x => x !== tempContact);
                        return {
                            ...prev,
                            contactList: t
                        }
                    });
                }
            }
        });
        setTableCheckBoxValue(newTableCheckBoxValue)
        setTableCheckBoxValueList(newTableCheckBoxValueList);
        if(data?.calReminderType?.includes("email")){
            setData((prev)=> {
                return {
                    ...prev,
                    calAttendees: [...prev.calAttendees,...newGuestEmails]
                }
            });
        }
        if(data?.calReminderType?.includes("sms")){
            setData((prev)=> {
                return {
                    ...prev,
                    contactList: [...prev.contactList,...newContactList]
                }
            });
        }
    },[country, contactDetails, mainTablecheckBoxValue]);
    const tableCheckBox = (index, id, email, phoneNumber, countryName) => {
        const newTableCheckBoxValue = [...tableCheckBoxValue]
        newTableCheckBoxValue[index] = !newTableCheckBoxValue[index]
        setTableCheckBoxValue(newTableCheckBoxValue)
        if (!newTableCheckBoxValue[index]) {
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
            if(email !== "" && data?.calReminderType?.includes("email")){
                setData((prev)=> {
                    let t = prev.calAttendees.filter(x => x !== email);
                    return {
                        ...prev,
                        calAttendees: t
                    }
                });
            }
            if(phoneNumber !== "" && data?.calReminderType?.includes("sms")){
                let tempContact = "";
                if(countryName !== ""){
                    let cntId = country.find((val) => (countryName === val.value)).cntCode;
                    tempContact = cntId+phoneNumber;
                } else {
                    tempContact = user.countryCode+phoneNumber;
                }
                setData((prev)=> {
                    let t = prev.contactList.filter(x => x !== tempContact);
                    return {
                        ...prev,
                        contactList: t
                    }
                });
            }
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList, id]);
            if(email !== "" && data?.calReminderType?.includes("email")){
                setData((prev)=> {
                    return {
                        ...prev,
                        calAttendees: [...prev.calAttendees,email]
                    }
                });
            }
            if(phoneNumber !== "" && data?.calReminderType?.includes("sms")){
                let t = "";
                if(countryName !== ""){
                    let cntId = country.find((val) => (countryName === val.value)).cntCode;
                    t = cntId+phoneNumber;
                } else {
                    t = user.countryCode+phoneNumber;
                }
                setData((prev)=> {
                    return {
                        ...prev,
                        contactList: [...prev.contactList,t]
                    }
                });
            }
        }
        let length = newTableCheckBoxValue.filter(function (value) {
            return value === true;
        }).length
        if (length !== newTableCheckBoxValue.length) {
            setMainTablecheckBoxValue(false)
        }
    }
    const displayContactList = useCallback((groupId) => {
        if(typeof groupId !== "undefined") {
            let requestData = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
            getContactList(groupId, requestData).then(res => {
                if (res.status === 200) {
                    if (res.result && res.result.contact) {
                        setContactDetails(res.result.contact);
                        setTotalPages(res.result.getTotalPages);
                        setTotalData(res.result.totalContact);
                    }
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    },[searchSend,selectedPage,perPage,sort,globalAlert]);
    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleClickSort = (name, index) => {
        if (sortBox[index] === true) {
            name += ",desc";
            const newSortBox = [...sortBox];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        } else {
            name += ",asc";
            const newSortBox = [];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        }
        setSelectedPage(0);
        setSort(name);
    }
    const handleClickAddContact = () => {
        setData((prev)=>{
            return {
                ...prev,
                contactList: [...prev.contactList,`${contactDetail.countryCode}${contactDetail.contactNo.replace(/\D/g, "")}`]
            }
        })
        setContactDetail({countryId: 100, countryCode: "+1", contactNo: ""});
    }
    const handleClickDeleteContact = (index) => {
        let t = data.contactList;
        t.splice(index, 1);
        setData((prev)=>{
            return {
                ...prev,
                contactList: t
            }
        })
    }

    useEffect(() => {
        displayContactList(data.groupList);
    }, [selectedPage,perPage,searchSend,displayContactList,data.groupList]);
    useEffect(() => {
        getGroupListWithCheckDuplicate().then(
            res => {
                if (res.result.group) {
                    let groups = [];
                    res.result.group.forEach((element) => {
                        groups.push({
                            gId: element.groupId,
                            name: element.groupName,
                            lockGroup: element.lockGroup
                        });
                    });
                    setGroupList(groups);
                }
            }
        );
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
    },[]);
    return (
        <Row>
            <Col xs={12} className="mb-3">
                Select or Enter Contact Details
            </Col>
            <Col xs={6}>
                {data?.calReminderType?.includes("email") && <Autocomplete
                    multiple
                    options={[]}
                    freeSolo
                    autoSelect={true}
                    value={data.calAttendees}
                    onChange={(event, value) => {
                        setData((prev)=> {
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
            </Col>
            <Col xs={6}>
                { data?.calReminderType?.includes("sms") && 
                    <>
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
                                data?.contactList?.length > 0 ?
                                    data?.contactList?.map((v,i)=>(
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
            </Col>
            <Col xs={12}>
                <hr/>
            </Col>
            <Col xs={4}>
            </Col>
            <Col xs={8}>
                <Row className="mb-2">
                    <Col xs={12} sm={12} md={6} lg={6} xl={6} align="left">
                        <span className="align-middle">Show</span>
                        <Select
                            name="perPage"
                            onChange={handleChangePerPage}
                            value={perPage}
                            className="mx-2 align-middle"
                            variant="standard"
                        >
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={75}>75</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                        <span className="align-middle">entries</span>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6} align="right">
                        <TextField
                            placeholder="Search"
                            name="search"
                            type="text"
                            value={search}
                            onChange={handleChangeSearch}
                            variant="standard"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </Col>
                </Row>
            </Col>
            <Col xs={4}>
                <div className="table-content-wrapper group-table-style">
                    <Table striped className="table-layout-fixed">
                        <thead>
                            <tr>
                                <th>
                                    Group Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                groupList?.length > 0 ?
                                    groupList?.map((group) => {
                                        return (
                                            group.lockGroup !== "Y" && <Fragment key={group.gId}>
                                                <tr>
                                                    <td className="p-0">
                                                        <FormGroup check className="w-100">
                                                            <Label check className="w-100 cursor-pointer">
                                                                <Input
                                                                    name="groupOption"
                                                                    type="radio"
                                                                    onChange={
                                                                        () => {
                                                                            setTableCheckBoxValue([])
                                                                            setTableCheckBoxValueList([])
                                                                            setData((prev) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    groupList: group.gId,
                                                                                    groupName: group.name
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                    checked={data.groupList === group.gId}
                                                                />{group.name}
                                                            </Label>
                                                        </FormGroup>
                                                    </td>
                                                </tr>
                                            </Fragment>
                                        )
                                    })
                                : null
                            }
                        </tbody>
                    </Table>
                </div>
            </Col>
            <Col xs={8}>
                {
                    (groupList.length > 0 && contactDetails.length > 0) &&
                    <div className="table-content-wrapper group-table-style">
                        <Table striped>
                            <thead>
                                <tr>
                                    <th width="5%">
                                        <FormGroup check className="w-100 px-2">
                                            <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()} />
                                        </FormGroup>
                                    </th>
                                    <th key={0} onClick={() => { handleClickSort("firstName", 0) }} className="align-middle" width="20%">First Name
                                        <span>
                                            {typeof sortBox[0] !== "undefined"
                                                ? (sortBox[0] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i>)
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th key={1} onClick={() => { handleClickSort("lastName", 1) }} className="align-middle" width="20%">Last Name
                                        <span>
                                            {typeof sortBox[1] !== "undefined"
                                                ? (sortBox[1] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i>)
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th key={2} onClick={() => { handleClickSort("email", 2) }} className="align-middle" width="30%">Email
                                        <span>
                                            {typeof sortBox[2] !== "undefined"
                                                ? (sortBox[2] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i>)
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th key={3} onClick={() => { handleClickSort("phoneNumber", 3) }} className="align-middle" width="25%">Mobile Number
                                        <span>
                                            {typeof sortBox[3] !== "undefined"
                                                ? (sortBox[3] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i>)
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    contactDetails.length > 0 ?
                                        contactDetails.map((contact,index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <FormGroup check className="w-100 px-2">
                                                            <Input className="clientCheck" type="checkbox" checked={tableCheckBoxValueList.includes(contact.emailId)} onChange={() => tableCheckBox(index,contact.emailId,contact.email,contact.phoneNumber,contact.country)} />
                                                        </FormGroup>
                                                    </td>
                                                    <td className="align-middle">{contact.firstName}</td>
                                                    <td className="align-middle">{contact.lastName}</td>
                                                    <td className="align-middle">{contact.email}</td>
                                                    <td className="align-middle">{contact.phoneNumber}</td>
                                                </tr>
                                            )
                                        })
                                    : null
                                }
                            </tbody>
                        </Table>
                    </div>
                }
                {
                    (groupList.length > 0 && contactDetails.length > 0) &&
                    <Row>
                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${contactDetails.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+contactDetails.length-1} of ${totalData} entries`}</span></Col>
                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                    </Row>
                }
            </Col>
            <Col xs={12}>
                <div className="text-center mt-3">
                    <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={handleClickNextSecond}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </div>
            </Col>
        </Row>
    );
}

const SelectMyPage = ({data, handleChange, user, handleBack, handleClickNextThird}) => {
    const [filterPublishedValues, setFilterPublishedValues] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [myDataPublishedAll, setMyDataPublishedAll] = useState([]);
    const [search, setSearch] = useState("");

    const handleChangeSelectedFilter = (filterName) => {
        if(selectedFilter.includes(filterName)){
            setSelectedFilter(selectedFilter.filter(x => x !== filterName));
        } else {
            setSelectedFilter([...selectedFilter,filterName]);
        }
    }
    const handleClickPage = (mpId, mpName) => {
        handleChange("calMyPageId",mpId);
        handleChange("mpName",mpName);
    }
    const renderPagesList = () => {
        let renderedPagesList = []
        for (let index = 0; index < myDataPublished.length; index += 2) {
            const page =
                <div className="col-lg-3 col-md-6 card-container" key={index}>
                    <div className={`card mb-3 ${myDataPublished[index].mpId === data?.calMyPageId ? "active-tmpt" : ""}`} onClick={() => { handleClickPage(myDataPublished[index].mpId, myDataPublished[index].mpName) }}>
                        <div className="card-img-wrapper">
                            <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", myDataPublished[index].mpId)} alt="tile" />
                        </div>
                        <div className="card-body">
                            <div className="card-title">{(myDataPublished[index].mpType === 2  && myDataPublished[index].groupName !== "") ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={myDataPublished[index].groupName}></i> : null}{myDataPublished[index].mpName}</div>
                        </div>
                    </div>
                    {index + 1 <= myDataPublished.length - 1 &&
                        <div className={`card mb-3 ${myDataPublished[index + 1].mpId === data?.calMyPageId ? "active-tmpt" : ""}`} onClick={() => { handleClickPage(myDataPublished[index + 1].mpId, myDataPublished[index + 1].mpName) }}>
                            <div className="card-img-wrapper">
                                <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", myDataPublished[index+1].mpId)} alt="tile" />
                            </div>
                            <div className="card-body">
                                <div className="card-title">{(myDataPublished[index + 1].mpType === 2  && myDataPublished[index + 1].groupName !== "") ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={myDataPublished[index + 1].groupName}></i> : null}{myDataPublished[index + 1].mpName}</div>
                            </div>
                        </div>
                    }
                </div>
            renderedPagesList.push(page)
        }
        return renderedPagesList.length !== 0?renderedPagesList:0;
    }
    const handleChangeFilter = () => {
        if(selectedFilter.length > 0) {
            setMyDataPublished([]);
            myDataPublishedAll.filter((value) => (
                (value.mpTags !== null && value.mpTags !== "") ?
                    selectedFilter.map((filter) => (
                        value.mpTags.toLowerCase().split(", ").includes(filter) === true ?
                            setMyDataPublished((prev) => {
                                let t = 0;
                                prev.map((p)=>(
                                    t = p.mpId === value.mpId ? 1 : 0
                                ))
                                if(t === 0){
                                    if(search === "") {
                                        return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                    } else if(search !== "" && value.mpName.toLowerCase().includes(search.toLocaleLowerCase())) {
                                        return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                    } else {
                                        return [...prev];
                                    }
                                } else {
                                    return [...prev];
                                }
                            })
                        : null
                    ))
                : null
            ))
        } else {
            let t = [];
            myDataPublishedAll?.map((v)=>(
                t.push({...v,id:v.mpId,name:v.mpName})
            ))
            if(search !== ""){
                t = t.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())});
            }
            setMyDataPublished(t);
        }
    }

    useEffect(()=>{
        if(typeof data.mpName === "undefined" && typeof data.calMyPageId !== "undefined" && data.calMyPageId !== 0 && myDataPublishedAll.length > 0){
            let t = myDataPublishedAll.filter((x) => {return x.mpId === data.calMyPageId})[0].mpName;
            handleChange("mpName",t);
        }
    },[data, myDataPublishedAll]);
    useEffect(()=>{
        getMyPagesTags(2).then(res => {
            if (res.result) {
                setFilterPublishedValues(res.result.tags);
            }
        });
        getMyPagesList(2).then(res => {
            if (res.result) {
                setMyDataPublishedAll(res.result.mypage);
            }
        });
        return () => {
            setFilterPublishedValues([]);
            setMyDataPublishedAll([]);
        };
    },[]);
    useEffect(()=>{
        handleChangeFilter();
        return () => {
            setMyDataPublished([]);
        };
    },[selectedFilter,myDataPublishedAll]);
    return (
        <Row className="px-3">
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                Select A Page Design
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3 text-right">
                <TextField
                    placeholder="Search"
                    name="search"
                    type="text"
                    value={search}
                    onChange={(event)=>{setSearch(event.target.value);}}
                    variant="standard"
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton sx={searchIconTransparent.root} onClick={handleChangeFilter}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                    }}
                />
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                <FilterMyPages filterValues={filterPublishedValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
            </Col>
            <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                <div className="pages-container">
                    {
                        myDataPublished.length !== 0 ?
                            renderPagesList()
                        :
                            <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                    <p className="mb-5">You have no page design available</p>
                                    <p>Create A Page Design</p>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{History.push("/addmypage")}} style={{zIndex:9}}>
                                        <i className="far fa-plus-square"></i>
                                        <div className="bg-green"></div>
                                    </Link>
                                </Col>
                            </Row>
                    }
                </div>
            </Col>
            <Col xs={12} className="mt-3">
                <div className="text-center">
                    <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={handleClickNextThird}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </div>
            </Col>
        </Row>
    );
}

const SelectSmsTemplate = ({data, handleChange, handleClickBackFourth, handleClickNextFourth}) => {
    const [smsTemplateList, setSmsTemplateList] = useState([]);

    const handleClickTemplate = (sstId, sstName) => {
        handleChange("calSmsSstId",sstId);
        handleChange("sstName",sstName);
    }
    const renderSmsTemplatesList = () => {
        let renderedSmsTemplatesList = []
        for (let index = 0; index < smsTemplateList.length; index += 2) {
            const page =
                <div className="card-container" key={index}>
                    <div className={`sms-main-box2 ${smsTemplateList[index].sstId === data?.calSmsSstId ? "active-tmpt" : ""}`} onClick={() => { handleClickTemplate(smsTemplateList[index].sstId, smsTemplateList[index].sstName) }}>
                        <div className="sms-bg">
                            <div className="sms-text">
                                {smsTemplateList[index].sstDetails}
                            </div>
                        </div>
                        <div className="card-sms-body2">
                            <div className="card-title">{smsTemplateList[index].sstName}</div>
                        </div>
                    </div>
                    {index + 1 <= smsTemplateList.length - 1 &&
                        <div className={`sms-main-box2 ${smsTemplateList[index+1].sstId === data?.calSmsSstId ? "active-tmpt" : ""}`} onClick={() => { handleClickTemplate(smsTemplateList[index+1].sstId, smsTemplateList[index+1].sstName) }}>
                            <div className="sms-bg">
                                <div className="sms-text">
                                    {smsTemplateList[index+1].sstDetails}
                                </div>
                            </div>
                            <div className="card-sms-body2">
                                <div className="card-title">{smsTemplateList[index+1].sstName}</div>
                            </div>
                        </div>
                    }
                </div>
            renderedSmsTemplatesList.push(page)
        }
        return renderedSmsTemplatesList.length !== 0?renderedSmsTemplatesList:0;
    }

    useEffect(()=> {
        getSmsTemplateList().then(res => {
            if (res?.status === 200) {
                setSmsTemplateList(res?.result?.smsTemplateList)
            }
        })
        return () => {
            setSmsTemplateList([]);
        };
    },[]);
    useEffect(()=>{
        if(typeof data.sstName === "undefined" && typeof data.calSmsSstId !== "undefined" && data.calSmsSstId !== 0 && smsTemplateList.length > 0){
            let t = smsTemplateList.filter((x) => {return x.sstId === data.calSmsSstId})[0].sstName;
            handleChange("sstName",t);
        }
    },[data, smsTemplateList]);

    return (
        <Row className="px-3">
            <Col xs={12}>
                Select A SMS Template
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="pages-container">
                    {
                        smsTemplateList.length !== 0 ?
                            renderSmsTemplatesList()
                        :
                            <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                    <p className="mb-5">You have no SMS Template available</p>
                                    <p>Create A SMS Template</p>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{History.push("/smstemplates")}} style={{zIndex:9}}>
                                        <i className="far fa-plus-square"></i>
                                        <div className="bg-green"></div>
                                    </Link>
                                </Col>
                            </Row>
                    }
                </div>
            </Col>
            <Col xs={12}>
                <div className="text-center">
                    <Button variant="contained" color="primary" onClick={handleClickBackFourth} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={handleClickNextFourth}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </div>
            </Col>
        </Row>
    );
}

const ScheduleTime = ({data, handleClickBackFifth, handleClickSave}) => {
    return (
        <Row>
            <Col xs={6} className="mx-auto">
                <Row>
                    <Col xs={5} className="d-flex justify-content-between mb-3">
                        <div>Reminder Subject</div>
                        <div>:</div>
                    </Col>
                    <Col xs={7} className="mb-3">
                        {data.calReminderSubject}
                    </Col>
                    <Col xs={5} className="d-flex justify-content-between mb-3">
                        <div>Reminder Type</div>
                        <div>:</div>
                    </Col>
                    <Col xs={7} className="mb-3">
                        {data.calReminderType.join(", ")}
                    </Col>
                    <Col xs={5} className="d-flex justify-content-between mb-3">
                        <div>Schedule Time</div>
                        <div>:</div>
                    </Col>
                    <Col xs={7} className="mb-3">
                        {dateTimeFormat(data.calScheduleDateTime)}
                    </Col>
                    { data?.calReminderType?.includes("email") && 
                        <>
                            <Col xs={5} className="d-flex justify-content-between mb-3">
                                <div>Total Guest Email(s)</div>
                                <div>:</div>
                            </Col>
                            <Col xs={7} className="mb-3">
                                {data.calAttendees.length}
                            </Col>
                        </>
                    }
                    { data?.calReminderType?.includes("sms") && 
                        <>
                            <Col xs={5} className="d-flex justify-content-between mb-3">
                                <div>Total Mobile Number(s)</div>
                                <div>:</div>
                            </Col>
                            <Col xs={7} className="mb-3">
                                {data.contactList.length}
                            </Col>
                        </>
                    }
                    { data?.calReminderType?.includes("email") && 
                        <>
                            <Col xs={5} className="d-flex justify-content-between mb-3">
                                <div>Selected Page Design</div>
                                <div>:</div>
                            </Col>
                            <Col xs={7} className="mb-3">
                                {data.mpName}
                            </Col>
                        </>
                    }
                    { data?.calReminderType?.includes("sms") && 
                        <>
                            <Col xs={5} className="d-flex justify-content-between mb-3">
                                <div>Selected SMS Template</div>
                                <div>:</div>
                            </Col>
                            <Col xs={7} className="mb-3">
                                {data.sstName}
                            </Col>
                        </>
                    }
                </Row>
                <div className="text-center mt-3">
                    <Button variant="contained" color="primary" onClick={handleClickBackFifth} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickSave("N","handleSave")}} className="handleSave mr-3"><i className="far fa-save mr-2"></i>SAVE</Button>
                    {(data?.id && data?.calRepeatType !== null && data?.calRepeatType !== "donotrepeat") && <Button variant="contained" color="primary" onClick={()=>{handleClickSave("Y","handleSaveAll")}} className="handleSaveAll"><i className="far fa-save mr-2"></i>SAVE ALL</Button>}
                </div>
            </Col>
        </Row>
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
export default connect(null, mapDispatchToProps)(ModalReminder);