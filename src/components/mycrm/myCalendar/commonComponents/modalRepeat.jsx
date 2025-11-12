import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button, FormControlLabel, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import DropDownControls from "../../../shared/commonControlls/dropdownControl";
import { add, format } from "date-fns";
import { dateTimeFormatDB, localGetWeekOfMonth } from "../../../../assets/commonFunctions";
import { websiteColor } from "../../../../config/api";

const calRepeatEveryList = [];
for (let i = 1; i < 100; i++) {
    calRepeatEveryList.push({
        key: i,
        value: i
    })
}
const calRepeatEveryTypeList = [
    {
        key: "day",
        value: "day"
    },
    {
        key: "week",
        value: "week"
    },
    {
        key: "month",
        value: "month"
    },
    {
        key: "year",
        value: "year"
    },
];
const calRepeatEveryTypeList2 = [
    {
        key: "day",
        value: "days"
    },
    {
        key: "week",
        value: "weeks"
    },
    {
        key: "month",
        value: "months"
    },
    {
        key: "year",
        value: "years"
    },
];
const daysList = [
    {
        key: "Sunday",
        label: "S"
    },
    {
        key: "Monday",
        label: "M"
    },
    {
        key: "Tuesday",
        label: "T"
    },
    {
        key: "Wednesday",
        label: "W"
    },
    {
        key: "Thursday",
        label: "T"
    },
    {
        key: "Friday",
        label: "F"
    },
    {
        key: "Saturday",
        label: "S"
    }
];
const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
    "& :not(:first-of-type)": {
        border: "1px solid",
        borderColor: websiteColor,
        borderRadius: "50%"
    },
    "& :first-of-type": {
        border: "1px solid",
        borderColor: websiteColor,
        borderRadius: "50%"
    }
});
const StyledToggle = styled(ToggleButton)({
    color: websiteColor,
    "&.Mui-selected": {
        color: "#ffffff",
        backgroundColor: `${websiteColor} !important`
    },
    "&:hover": {
        color: "#ffffff",
        borderColor: websiteColor,
        background: websiteColor
    },
    "&:hover.Mui-selected": {
        borderColor: websiteColor,
        background: websiteColor
    },
    minWidth: 32,
    maxWidth: 32,
    height: 32,
    textTransform: "unset",
    padding: 0,
    marginRight: "15px",
    marginLeft: "0 !important"
});

const ModalRepeat = ({ modalRepeat, toggleModalRepeat, currentEventDetails, setCurrentEventDetails, globalAlert }) => {
    const [data, setData] = useState({});
    const handleReset = () => {
        setData({});
        setCurrentEventDetails((prev)=>{
            return {
                ...prev,
                "calRepeatType": "donotrepeat"
            }
        });
        toggleModalRepeat();
    }
    const handleClickSave = () => {
        if(data?.calRepeatDate < add(new Date(new Date()), { days: -1 })){
            globalAlert({
                type: "Error",
                text: "Please select time greater than current time for start date.",
                open: true
            });
            return false;
        }
        if(data?.calRepeatEndDate < add(new Date(new Date()), { days: -1 })){
            globalAlert({
                type: "Error",
                text: "Please select time greater than current time for end date.",
                open: true
            });
            return false;
        }
        setCurrentEventDetails((prev)=>{
            return {
                ...prev,
                ...data,
                calRepeatDate: dateTimeFormatDB(data?.calRepeatDate),
                calRepeatEndDate: dateTimeFormatDB(data?.calRepeatEndDate),
                calRepeatDayName:data.calRepeatDayName.join(","),
                calParentId:data?.calParentId ? data?.calParentId : 0
            }
        });
        setData({});
        toggleModalRepeat();
    }
    useEffect(() => {
        if(typeof currentEventDetails.calRepeatEveryType === "undefined") {
            let tempCalRepeatEveryType = "", tempCalRepeatDayName = [], tempCalRepeatEndDate = null;
            if (currentEventDetails.calRepeatType === "Daily") {
                tempCalRepeatEveryType = "day";
                daysList.forEach((v)=>{
                    tempCalRepeatDayName.push(v.key);
                });
                tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { months: 3 });
            } else if (currentEventDetails.calRepeatType === "Weekly" || currentEventDetails.calRepeatType === "Custom") {
                tempCalRepeatEveryType = "week";
                tempCalRepeatDayName.push(format(new Date(currentEventDetails.start), 'EEEE'));
                tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { days: 175 });
            } else if (currentEventDetails.calRepeatType === "Monthly") {
                tempCalRepeatEveryType = "month";
                tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { years: 1 });
            } else if (currentEventDetails.calRepeatType === "Yearly") {
                tempCalRepeatEveryType = "year";
                tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { years: 2 });
            }
            setData((prev) => {
                return {
                    ...prev,
                    "calRepeatEveryType": tempCalRepeatEveryType,
                    "calRepeatEvery": 1,
                    "calRepeatDate": currentEventDetails.start,
                    "calRepeatSelectedOption": 1,
                    "weekNo": Math.ceil(format(new Date(currentEventDetails.start), 'd')/7),
                    "calRepeatDayName": tempCalRepeatDayName,
                    "calRepeatEndDate": tempCalRepeatEndDate
                }
            });
            handleChangeTextValue();
        } else {
            setData((prev) => {
                return {
                    ...prev,
                    ...currentEventDetails,
                    calRepeatDayName:currentEventDetails.calRepeatDayName !== "" ? currentEventDetails.calRepeatDayName.split(",") : [],
                    calRepeatDate: new Date(currentEventDetails?.calRepeatDate),
                    calRepeatEndDate: new Date(currentEventDetails?.calRepeatEndDate),
                }
            });
            handleChangeTextValue();
        }
    }, [currentEventDetails]);
    const handleChangeTextValue = () => {
        setData((prev) => {
            let tempCalRepeatSelectedOptionTextOne = "", tempCalRepeatSelectedOptionTextTwo = "", tempCalRepeatSelectedOptionTextThree = "", tempOccours = "", tempOutOccours = "", tempCalRepeatType = "";
            if (prev?.calRepeatEveryType === "day") {
                if(prev?.calRepeatEvery === 1){
                    tempOccours = "Occurs every day until";
                    tempCalRepeatType = "Daily";
                } else if(prev?.calRepeatEvery === 2) {
                    tempOccours = "Occurs every other day until";
                    tempCalRepeatType = "Custom";
                } else {
                    tempOccours = "Occurs every " + prev?.calRepeatEvery + " days until";
                    tempCalRepeatType = "Custom";
                }
                tempOutOccours = tempOccours;
            } else if (prev?.calRepeatEveryType === "week") {
                tempOccours = "Occurs every " + prev?.calRepeatDayName?.join(", ") + " until";
                if(prev?.calRepeatEvery === 1){
                    tempOccours = "Occurs every " + prev?.calRepeatDayName?.join(", ") + " until";
                    tempCalRepeatType = "Weekly";
                } else if(prev?.calRepeatEvery === 2) {
                    tempOccours = "Occurs every other " + prev?.calRepeatDayName?.join(", ") + " until";
                    tempCalRepeatType = "Custom";
                } else {
                    tempOccours = "Occurs every " + prev?.calRepeatEvery + " weeks on " + prev?.calRepeatDayName?.join(", ") + " until";
                    tempCalRepeatType = "Custom";
                }
                tempOutOccours = tempOccours;
            } else if (prev?.calRepeatEveryType === "month") {
                tempCalRepeatSelectedOptionTextOne = "On day " + new Date(prev?.calRepeatDate).getDate();
                tempCalRepeatSelectedOptionTextTwo = "On the " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE');
                tempCalRepeatSelectedOptionTextThree = "On the last " + format(new Date(prev?.calRepeatDate), 'EEEE');
                if(prev?.calRepeatEvery === 1 && prev?.calRepeatSelectedOption === 1){
                    tempCalRepeatType = "Monthly";
                } else {
                    tempCalRepeatType = "Custom";
                }
                if (prev?.calRepeatSelectedOption === 1) {
                    tempOccours = "Occurs on day " + new Date(prev?.calRepeatDate).getDate() + " until";
                    if(prev?.calRepeatEvery === 1){
                        tempOutOccours = "Occurs on day " + new Date(prev?.calRepeatDate).getDate() + " of every month until";
                    } else if(prev?.calRepeatEvery === 2) {
                        tempOutOccours = "Occurs on day " + new Date(prev?.calRepeatDate).getDate() + " of every other month until";
                    } else {
                        tempOutOccours = "Occurs on day " + new Date(prev?.calRepeatDate).getDate() + " of every " + prev?.calRepeatEvery + " months until";
                    }
                } else if (prev?.calRepeatSelectedOption === 2) {
                    tempOccours = "Occurs on the " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE') + " until";
                    if(prev?.calRepeatEvery === 1){
                        tempOutOccours = "Occurs every " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE') + " until";
                    } else if(prev?.calRepeatEvery === 2) {
                        tempOutOccours = "Occurs every other " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE') + " until";
                    } else {
                        tempOutOccours = "Occurs every " + prev?.calRepeatEvery + " months on the " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE') + " of the month until";
                    }
                } else if (prev?.calRepeatSelectedOption === 3) {
                    tempOccours = "Occurs the last " + format(new Date(prev?.calRepeatDate), 'EEEE') + " until";
                    if(prev?.calRepeatEvery === 1){
                        tempOutOccours = "Occurs every last " + format(new Date(prev?.calRepeatDate), 'EEEE') + " until";
                    } else if(prev?.calRepeatEvery === 2) {
                        tempOutOccours = "Occurs every other last " + format(new Date(prev?.calRepeatDate), 'EEEE') + " until";
                    } else {
                        tempOutOccours = "Occurs every " + prev?.calRepeatEvery + " months of the last " + format(new Date(prev?.calRepeatDate), 'EEEE') + " of the month until";
                    }
                }
            } else if (prev?.calRepeatEveryType === "year") {
                tempCalRepeatSelectedOptionTextOne = "On " + format(new Date(prev?.calRepeatDate), 'MMMM') + " " + new Date(prev?.calRepeatDate).getDate();
                tempCalRepeatSelectedOptionTextTwo = "On the " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE') + " of " + format(new Date(prev?.calRepeatDate), 'MMMM');
                tempCalRepeatSelectedOptionTextThree = "On the last " + format(new Date(prev?.calRepeatDate), 'EEEE') + " of " + format(new Date(prev?.calRepeatDate), 'MMMM');
                if (prev?.calRepeatSelectedOption === 1) {
                    tempOccours = "Occurs every " + format(new Date(prev?.calRepeatDate), 'MMMM') + " " + new Date(prev?.calRepeatDate).getDate();
                    tempCalRepeatType = "Yearly";
                } else if (prev?.calRepeatSelectedOption === 2) {
                    tempOccours = "Occurs every year on the " + localGetWeekOfMonth(new Date(prev?.calRepeatDate)) + " " + format(new Date(prev?.calRepeatDate), 'EEEE') + " of " + format(new Date(prev?.calRepeatDate), 'MMMM');
                    tempCalRepeatType = "Custom";
                } else if (prev?.calRepeatSelectedOption === 3) {
                    tempOccours = "Occurs every year on the last " + format(new Date(prev?.calRepeatDate), 'EEEE') + " of " + format(new Date(prev?.calRepeatDate), 'MMMM');
                    tempCalRepeatType = "Custom";
                }
                tempOutOccours = tempOccours;
            }
            return {
                ...prev,
                "calRepeatSelectedOptionTextOne": tempCalRepeatSelectedOptionTextOne,
                "calRepeatSelectedOptionTextTwo": tempCalRepeatSelectedOptionTextTwo,
                "calRepeatSelectedOptionTextThree": tempCalRepeatSelectedOptionTextThree,
                "occours": tempOccours,
                "outOccours": tempOutOccours,
                "calRepeatType": tempCalRepeatType,
                "weekNo": Math.ceil(format(new Date(prev?.calRepeatDate), 'd')/7),
            }
        });
    }
    return (
        <Modal size="xs" isOpen={modalRepeat}>
            <ModalHeader toggle={() => { handleReset(); }}>Repeat</ModalHeader>
            <ModalBody>
                <div className="d-flex align-items-end mb-3">
                    <div className="mb-1 mr-3" style={{ width: "10%" }}>Start</div>
                    <div className="w-100">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={data?.calRepeatDate || null}
                                inputFormat="MM/dd/yyyy"
                                onChange={(date) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            calRepeatDate: date,
                                            start: date,
                                            end: date,
                                            calScheduleDateTime: date
                                        }
                                    });
                                    handleChangeTextValue();
                                }}
                                slotProps={{ textField: { variant: "standard", className: "w-100" } }}
                                minDate={new Date()}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                    <div className="mt-1 mr-3" style={{ width: "10%" }}>
                        <i className="far fa-sync"></i>
                    </div>
                    <div className="w-100">
                        <div className="d-flex align-items-end">
                            <p className="tooltip-nowrap mb-1 mr-3">Repeat every</p>
                            {data?.calRepeatEveryType !== "year" &&
                                <div className="w-100 mr-3">
                                    <DropDownControls
                                        name="calRepeatEvery"
                                        className="mt-0"
                                        value={data?.calRepeatEvery || ""}
                                        onChange={(name, value) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    [name]: value
                                                }
                                            });
                                            handleChangeTextValue();
                                        }}
                                        dropdownList={calRepeatEveryList}
                                    />
                                </div>
                            }
                            <div className="w-100">
                                <DropDownControls
                                    name="calRepeatEveryType"
                                    className="mt-0"
                                    value={data?.calRepeatEveryType || ""}
                                    onChange={(name, value) => {
                                        let tempCalRepeatDayName = [], tempCalRepeatEndDate = "", tempCalRepeatEvery = 0;
                                        if(value === "day"){
                                            daysList.forEach((v)=>{
                                                tempCalRepeatDayName.push(v.key);
                                            });
                                            tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { months: 3 });
                                        } else if(value === "week"){
                                            tempCalRepeatDayName.push(format(new Date(currentEventDetails.start), 'EEEE'));
                                            tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { days: 175 });
                                        } else if(value === "month"){
                                            tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { years: 1 });
                                        } else if(value === "year"){
                                            tempCalRepeatEndDate = add(new Date(currentEventDetails.start), { years: 2 });
                                            tempCalRepeatEvery = 1;
                                        }
                                        let tempCalRepeatSelectedOption = 1;
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                [name]: value,
                                                "calRepeatDayName": tempCalRepeatDayName,
                                                "calRepeatSelectedOption": tempCalRepeatSelectedOption,
                                                "calRepeatEndDate": tempCalRepeatEndDate,
                                                "calRepeatEvery": tempCalRepeatEvery === 0 ? prev.calRepeatEvery : tempCalRepeatEvery
                                            }
                                        });
                                        handleChangeTextValue();
                                    }}
                                    dropdownList={data?.calRepeatEvery > 1 ? calRepeatEveryTypeList2 : calRepeatEveryTypeList}
                                />
                            </div>
                        </div>
                        {(data?.calRepeatEveryType === "month" || data?.calRepeatEveryType === "year") &&
                            <RadioGroup
                                id="calRepeatSelectedOption"
                                name="calRepeatSelectedOption"
                                className="mt-3"
                                value={data?.calRepeatSelectedOption || 0}
                                onChange={(event) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            "calRepeatSelectedOption": Number(event.target.value)
                                        }
                                    });
                                    handleChangeTextValue();
                                }}>
                                <FormControlLabel value={1} control={<Radio color="primary" />} label={data.calRepeatSelectedOptionTextOne} />
                                {data.weekNo !== 5 && <FormControlLabel value={2} control={<Radio color="primary" />} label={data.calRepeatSelectedOptionTextTwo} />}
                                {data.weekNo > 3 && <FormControlLabel value={3} control={<Radio color="primary" />} label={data.calRepeatSelectedOptionTextThree} />}
                            </RadioGroup>
                        }
                        {((data?.calRepeatEveryType === "day" && data?.calRepeatEvery === 1) || data?.calRepeatEveryType === "week") &&
                            <StyledToggleButtonGroup
                                size="small"
                                className="mt-3"
                                value={data?.calRepeatDayName}
                                onChange={(event, value) => {
                                    let tempValue = [], tempCalRepeatEveryType = "";
                                    daysList.forEach((v)=>{
                                        if(value.includes(v.key)){
                                            tempValue.push(v.key);
                                        }
                                    })
                                    if(tempValue.length === 7){
                                        tempCalRepeatEveryType = "day";
                                    } else {
                                        tempCalRepeatEveryType = "week";
                                    }
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            "calRepeatDayName": tempValue,
                                            "calRepeatEveryType": tempCalRepeatEveryType
                                        }
                                    });
                                    handleChangeTextValue();
                                }}
                            >
                                {daysList.map((day, index) => (
                                    <StyledToggle key={day.key} value={day.key} aria-label={day.key}>
                                        {day.label}
                                    </StyledToggle>
                                ))}
                            </StyledToggleButtonGroup>
                        }
                    </div>
                </div>
                <div className="d-flex align-items-end">
                    <div className="mb-1 mr-3" style={{ width: "10%" }}>End</div>
                    <div className="w-100">
                        <p className="mb-0">{data?.occours}</p>
                        <div className="d-flex align-items-center">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={data?.calRepeatEndDate || null}
                                    inputFormat="MM/dd/yyyy"
                                    onChange={(date) => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                calRepeatEndDate: date
                                            }
                                        })
                                    }}
                                    slotProps={{ textField: { variant: "standard", className: "w-100" } }}
                                    minDate={new Date()}
                                />
                            </LocalizationProvider>
                            {/* {data?.calRepeatEndDate !== null &&
                                <i className="far fa-trash-alt ml-3" data-toggle="tooltip" title="Remove end date"
                                    onClick={() => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                calRepeatEndDate: null
                                            }
                                        })
                                    }}
                                ></i>
                            } */}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="mr-3" variant="contained" color="primary" onClick={() => { handleReset(); }}>CLOSE</Button>
                <Button variant="contained" color="primary" onClick={() => { handleClickSave(); }}>SAVE</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalRepeat;