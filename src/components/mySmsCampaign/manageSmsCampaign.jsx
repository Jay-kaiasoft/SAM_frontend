import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {Row, Col, Table, Input, Button, ModalHeader, ModalBody, ModalFooter, Modal, FormGroup} from 'reactstrap';
import {Checkbox, FormControlLabel, IconButton, InputAdornment, Link, MenuItem, Radio, RadioGroup, Select, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material"
import history from "../../history";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {buyNumberForSmsCampaign, checkNumberAssignOrNot, closeSmsCampaign, deleteSmsCampaign, editSmsCampaignSchedule, getSmsCampaignList} from "../../services/smsCampaignService";
import {resetGlobalAlertAction, setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {connect} from "react-redux";
import {checkPopupClose, dateTimeFormat, dateTimeFormatDB, displayFormatNumber, getClientTimeZone, handleClickHelp} from "../../assets/commonFunctions";
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {checkAuthorized, getCountry} from "../../services/commonService";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import InputField from "../shared/commonControlls/inputField";
import {searchForBuyNumber} from "../../services/clientContactService";
import {userLoggedIn} from "../../actions/userActions";
import {searchIconTransparent} from "../../assets/commonFunctions";
import { setLoader } from '../../actions/loaderActions';
import { checkSmsWhiteFlag } from '../../services/userService';
import { tenDLCFormUrl, websiteTitle } from '../../config/api';
import { get10DLCStatus } from '../../services/profileService';
import { setSubUserAction } from '../../actions/subUserActions';

const ManageSmsCampaign = ({globalAlert,resetGlobalAlert,confirmDialog,user,subUser,pendingTransaction,userLoggedIn,setLoader,setSubUserAction}) => {
    const [smsDetails, setSmsDetails] = useState([]);
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setModalBuyTwilioNo(!modalBuyTwilioNo);
        setDataBuyTwilioNo({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
    };
    const [perPage,setPerPage] = useState(25);
    const [totalPages,setTotalPages] = useState(0);
    const [selectedPage,setSelectedPage] = useState(0);
    const [sort,setSort] = useState("smsId,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [search,setSearch] = useState("");
    const [searchSend,setSearchSend] = useState("");
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [totalData,setTotalData] = useState(0);
    const [editScheduleValue,setEditScheduleValue] = useState([]);
    const [editScheduleSendOnDate,setEditScheduleSendOnDate] = useState("");
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const [smsStatus, setSmsStatus] = useState([]);
    const [tenDLCStatus, setTenDLCStatus] = useState(false);
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
    const handleClickSort = (name,index) => {
        if(sortBox[index] === true) {
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
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        const newTableCheckBoxValueList = []
        smsDetails.forEach(element => {
            if(!flag)
                newTableCheckBoxValueList.push(element.smsId)
        });
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }
    const tableCheckBox = (id,status) => {
        let l = tableCheckBoxValueList.length;
        if(tableCheckBoxValueList.includes(id)){
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
            const t = smsStatus.indexOf(status);
            if (t > -1) {
                smsStatus.splice(t, 1);
            }
            l--;
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList,id]);
            setSmsStatus([...smsStatus,status]);
            l++;
        }
        if (smsDetails.length !== l) {
            setMainTablecheckBoxValue(false);
        } else {
            setMainTablecheckBoxValue(true);
        }
    }
    const fetchData = () => {
        getCountry().then(res => {
            if (res.result.country) {
                let country = [];
                res.result.country.map(x => (
                    country.push({
                        "key": x.iso2,
                        "value": x.cntName,
                        "id": x.id,
                        "cntCode": x.cntCode
                    })
                ));
                setCountryBuyTwilioNo(country);
            }
        });
        get10DLCStatus().then(res => {
            if (res.status === 200 && (res.result.status === "Processing" || res.result.status === "Approved")) {
                setTenDLCStatus(true);
            }
        });
    }
    useEffect(()=>{
       fetchData();
    },[]);
    const handleChangeBuyTwilioNo = (name, value) => {
        setDataBuyTwilioNo(prev => ({ ...prev, [name]: value }));
        if(name === "checkForwardingYesNo" && value === "yes"){
            handleChangeBuyTwilioNo("callForwardingNumber",user.cell);
            let tempIso2 = countryBuyTwilioNo.filter((x)=>{ return x.id === parseInt(user.country) })[0].key;
            handleChangeBuyTwilioNo("callForwardingCountryCode", tempIso2);
        } else if(name === "checkForwardingYesNo" && value === "no") {
            handleChangeBuyTwilioNo("callForwardingNumber", "");
            handleChangeBuyTwilioNo("callForwardingCountryCode", "");
        }
    }
    const searchBuyTwilioNo = () => {
        let d = {
            "areaCode":dataBuyTwilioNo.areaCode ? dataBuyTwilioNo.areaCode : 0,
            "countryCode":dataBuyTwilioNo.countryCode ? dataBuyTwilioNo.countryCode : "US"
        }
        searchForBuyNumber(d).then(res => {
            if (res.status === 200) {
                if(res.result.searchNumber.length > 0){
                    setDataSearchTwilioNo(res.result.searchNumber);
                    setMsgSearchTwilioNo("");
                } else {
                    setMsgSearchTwilioNo("Phone number not found for this area code");
                }
            } else {
                setMsgSearchTwilioNo("OOPS!! there is some problem arise. Please try again.");
            }
        });
    }
    const saveBuyTwilioNo = () => {
        let isValid = true;
        if(typeof dataBuyTwilioNo.twilioNumber === "undefined" || dataBuyTwilioNo.twilioNumber === ""){
            globalAlert({
                type: "Error",
                text: "Please select number.",
                open: true
            });
            isValid = false
        }
        if(dataBuyTwilioNo.checkForwardingYesNo === "yes" &&  (typeof dataBuyTwilioNo.callForwardingNumber === "undefined" || dataBuyTwilioNo.callForwardingNumber === "" || dataBuyTwilioNo.callForwardingNumber === null)){
            globalAlert({
                type: "Error",
                text: "Please enter forward number.",
                open: true
            });
            isValid = false
        }
        if (!isValid) {
            return
        }
        confirmDialog({
            open: true,
            title: `Are you sure, you want to buy this ${dataBuyTwilioNo.twilioNumber} number?`,
            onConfirm: () => { confirmSaveBuyTwilioNo() }
        })
    }
    const confirmSaveBuyTwilioNo = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "memberId":user.memberId,
            "subMemberId":subUser.memberId,
            "fullName":`${user.firstName} ${user.lastName}`,
            "subFullName":`${subUser.firstName} ${subUser.lastName}`,
            "twilioNumber":dataBuyTwilioNo.twilioNumber,
            "flagType": "manage",
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        buyNumberForSmsCampaign(d).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({ ...subUser, "twilioNumber": dataBuyTwilioNo.twilioNumber });
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "twilioNumber": dataBuyTwilioNo.twilioNumber}));
                } else {
                    userLoggedIn({...user, "twilioNumber": dataBuyTwilioNo.twilioNumber});
                    sessionStorage.setItem('user',JSON.stringify({...user, "twilioNumber": dataBuyTwilioNo.twilioNumber}));
                }
                toggleBuyTwilioNo();
                globalAlert({
                    type: "Success",
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
            setLoader({
                load: false
            });
        });
    }
    const handleClickAdd = () => {
        if (tenDLCStatus) {
            checkSmsWhiteFlag().then(res2 => {
                if (res2.status === 200) {
                    checkAuthorized().then(res => {
                        if (res.status === 200) {
                            if(typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null){
                                toggleBuyTwilioNo();
                            } else {
                                checkNumberAssignOrNot().then(res1 => {
                                    if (res1.status === 200) {
                                        history.push("/buildsmscampaign");
                                    } else {
                                        function redirectToLink(){
                                            resetGlobalAlert();
                                            history.push("/sms");
                                        }
                                        window.redirectToLink=redirectToLink;
                                        globalAlert({
                                            type: "Success",
                                            text: res1.message,
                                            open: true
                                        });
                                    }
                                });
                            }
                        } else {
                            pendingTransaction([{
                                "pendingTransactionType": "addSmsCampaign"
                            }]);
                            history.push("/carddetails");
                        }
                    });
                } else if(res2.status === 401) {
                    globalAlert({
                        type: "Warning",
                        text: res2.message,
                        open: true
                    });
                } else {
                    globalAlert({
                        type: "Error",
                        text: res2.message,
                        open: true
                    });
                }
            });
        } else {
            globalAlert({
                type: "Error",
                text: "You need to Register for 10DLC to activate SMS Campaign",
                open: true
            });
        }
    }
    const editSmsCampaign = (smsId, status) => {
        if(status === "Sending"){
            globalAlert({
                type: "Warning",
                text: 'Your campaign is in "Sending State".\nYou can edit it after sending complete.',
                open: true
            });
            return false;
        }
        checkAuthorized().then(res => {
            if (res.status === 200) {
                if(typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null){
                    toggleBuyTwilioNo();
                } else {
                    history.push("/buildsmscampaign?v="+smsId);
                }
            } else {
                pendingTransaction([{
                    "pendingTransactionType": "editSmsCampaign"
                }]);
                history.push("/carddetails");
            }
        });
    }
    const editSchedule = (index,date) =>{
        const newEditScheduleValue = [];
        newEditScheduleValue[index] = !newEditScheduleValue[index];
        setEditScheduleValue(newEditScheduleValue);
        setEditScheduleSendOnDate(date);
    }
    const saveSchedule = (smsId,schId) => {
        let requestData = {
            "memberId" : user.memberId,
            "subMemberId" : subUser.memberId,
            "smsId" : smsId,
            "sendOnDate" : editScheduleSendOnDate,
            "scheduleId" : schId,
            "timeZone" : (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone
        }
        editSmsCampaignSchedule(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayCampaignList();
                setEditScheduleValue([]);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickDelete = (id) => {
        let requestData = {
            "smsId": id === "" ? tableCheckBoxValueList : [id]
        }
        deleteSmsCampaign(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueList([]);
                setMainTablecheckBoxValue(false);
                displayCampaignList();
                setSmsStatus([]);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickDeleteSingle = (index,id,status) => {
        if(status === "Sending"){
            globalAlert({
                type: "Warning",
                text: 'Your campaign is in "Sending State".\nYou can delete it after sending complete.',
                open: true
            });
            return false;
        }
        setTableCheckBoxValueList([]);
        setMainTablecheckBoxValue(false);
        setSmsStatus([]);
        setTableCheckBoxValueList([id]);
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete selected SMS campaign?',
            onConfirm: () => {handleClickDelete(id)}
        });
    }
    const handleClickReport = (id) => {
        history.push(`/managesmsreport?v=${id}`);
    }
    const handleClickClose = () => {
        if (tableCheckBoxValueList.length > 0) {
            confirmDialog({
                open: true,
                title: 'Are you sure you want to close this SMS campaign?',
                onConfirm: () => {
                    let requestData = {
                        "smsId": tableCheckBoxValueList,
                        "conversationsTwilioNumber":(user.conversationsTwilioNumber === null || user.conversationsTwilioNumber === "" || (typeof user.conversationsTwilioNumber === "undefined")) ? "" : user.conversationsTwilioNumber
                    }
                    closeSmsCampaign(requestData).then(res => {
                        if (res.status === 200) {
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            setTableCheckBoxValueList([]);
                            setMainTablecheckBoxValue(false);
                            displayCampaignList();
                            setSmsStatus([]);
                        } else {
                            globalAlert({
                                type: "Error",
                                text: res.message,
                                open: true
                            });
                        }
                    });
                }
            })
        } else {
            globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
        }
    }
    const displayCampaignList = useCallback(() => {
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}&timeZone=${timeZone}`;
        setSmsDetails([]);
        getSmsCampaignList(data).then(res => {
            if(res.status === 200){
                if (res.result) {
                    setSmsDetails(res.result.smsCampaigns);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.totalSmsCampaigns);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[searchSend,selectedPage,perPage,sort,globalAlert,user.timeZone]);
    const handleChangeTenDLC = () => {
        if(tenDLCStatus === false){
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    setLoader({
                        load: true,
                        text: "Please wait !!!"
                    });
                    let closeWindow = window.open(tenDLCFormUrl, "_blank");
                    checkPopupClose(setLoader, setTenDLCStatus, closeWindow, globalAlert);
                } else {
                    confirmDialog({
                        open: true,
                        title: 'Your credit card is not available. Please add it.',
                        onConfirm: () => {
                            pendingTransaction([{
                                "pendingTransactionType": "addSmsCampaign"
                            }]);
                            history.push("/carddetails");
                        }
                    })
                }
            });
        } else {
            globalAlert({
                type: "Success",
                text: "You have already applied for 10DLC",
                open: true
            });
        }
    }
    useEffect(()=>{
        displayCampaignList();
    },[displayCampaignList,selectedPage,perPage,searchSend]);
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>SMS/MMS Campaign</h3>
                    <div className="top-button">
                        <div className="icon-wrapper">
                            <CheckPermissionButton module="sms campaign" action="add">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=> { handleClickAdd()}}>
                                    <i className="far fa-plus-square"></i>
                                    <div className="bg-green"></div>
                                </Link>
                            </CheckPermissionButton>
                            <CheckPermissionButton module="sms campaign" action="delete">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Close" onClick={()=> { handleClickClose()}}>
                                    <i className="far fa-eye-slash"></i>
                                    <div className="bg-purple"></div>
                                </Link>
                            </CheckPermissionButton>
                            <CheckPermissionButton module="sms campaign" action="delete">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete"
                                    onClick={() => {
                                        if (tableCheckBoxValueList.length > 0) {
                                            if(smsStatus.includes("Sending")){
                                                globalAlert({
                                                    type: "Warning",
                                                    text: 'Your campaign is in "Sending State".\nYou can delete it after sending complete.',
                                                    open: true
                                                });
                                                return false;
                                            }
                                            confirmDialog({
                                                open: true,
                                                title: 'Are you sure you want to delete selected SMS campaign?',
                                                onConfirm: () => {handleClickDelete("")}
                                            })
                                        } else {
                                            globalAlert({
                                                type: "Error",
                                                text: "You must check one of the checkboxes.",
                                                open: true
                                            });
                                        }
                                    }}
                                >
                                    <i className="far fa-trash-alt"></i>
                                    <div className="bg-red"></div>
                                </Link>
                            </CheckPermissionButton>
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help" onClick={()=>{handleClickHelp("SMS/Features/SendSMS/HowtoSendYourFirstSMS.html")}}>
                                <i className="far fa-question-circle"></i>
                                <div className="bg-grey"></div>
                            </Link>
                            <Button variant="contained" color="primary" onClick={()=>{handleChangeTenDLC();}} >Register for 10DLC</Button>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="d-inline-block mr-5">
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
                            </div>
                            <div className="d-inline-block">
                                <TextField
                                    placeholder="Search"
                                    name="search"
                                    type="text"
                                    value={search}
                                    onChange={handleChangeSearch}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                    variant="standard"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="table-content-wrapper height-58 overflow-auto">
                        <Table striped>
                            <thead>
                                <tr role="row">
                                    <th className="text-center" width="4%">
                                        <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()}/>
                                    </th>
                                    <th key={0} onClick={()=>{handleClickSort("smsId",0)}} className="text-center" width="5%">Id
                                        <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                    </th>
                                    <th key={1} onClick={()=>{handleClickSort("smsName",1)}} width="20%">Name
                                        <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                    </th>
                                    <th width="28%">Schedule On</th>
                                    <th width="5%">Open/Close</th>
                                    <th className="text-center" width="10%">Close Date</th>
                                    <th width="8%">Phone Number</th>
                                    <th width="5%">Status</th>
                                    <th className="text-center" width="10%">Created Date</th>
                                    <th className="text-center" width="5%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    smsDetails.length > 0 ?
                                        smsDetails.map((value,index) => {
                                            return (
                                                <tr key={value.smsId}>
                                                    <td className="text-center">
                                                        <Input type="checkbox" checked={tableCheckBoxValueList.includes(value.smsId)} onChange={() => tableCheckBox(value.smsId, value.status)}/>
                                                    </td>
                                                    <td className="text-center">{value.smsId}</td>
                                                    <td>{value.smsName}</td>
                                                    <td>
                                                        {
                                                            value.scheduleId !== null && editScheduleValue[index] !== true ?
                                                                <>{dateTimeFormat(value.sendOnDate)} <CheckPermissionButton module="sms campaign" action="edit"><i className="far fa-pencil-alt" onClick={()=>{editSchedule(index,dateTimeFormat(value.sendOnDate))}}></i></CheckPermissionButton></>
                                                                : null
                                                        }
                                                        {
                                                            editScheduleValue[index] === true ?
                                                                <><LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <DateTimePicker
                                                                        value={editScheduleSendOnDate !== "" ? new Date(editScheduleSendOnDate) : new Date(value.sendOnDate)}
                                                                        inputFormat="MM/dd/yyyy hh:mm a"
                                                                        onChange={(value) => {
                                                                            setEditScheduleSendOnDate(dateTimeFormatDB(value))
                                                                        }}
                                                                        slotProps={{ textField: { variant: "standard", className: "editScheduleDate" } }}
                                                                        minDateTime={new Date()}
                                                                    />
                                                                </LocalizationProvider><i className="far fa-check ml-3" onClick={()=>{saveSchedule(value.smsId,value.scheduleId)}}></i> <i className="far fa-times" onClick={()=>{setEditScheduleValue([])}}></i></>
                                                                : null
                                                        }
                                                    </td>
                                                    <td className="text-center">{value.smsOpenClose}</td>
                                                    <td>{dateTimeFormat(value.smsCloseDate)}</td>
                                                    <td>
                                                        {
                                                            value.arrFromMo.length > 0 ?
                                                                value.arrFromMo.map((v,i)=>{
                                                                    return <p className="mb-0" key={i}>{v}</p>
                                                                })
                                                            : null
                                                        }
                                                    </td>
                                                    <td>{value.status}</td>
                                                    <td className="text-center">{dateTimeFormat(value.sendDate)}</td>
                                                    <td className="text-center">
                                                        <CheckPermissionButton module="sms campaign" action="edit">
                                                            <i  className="mx-1 far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{editSmsCampaign(value.smsId, value.status)}}></i>
                                                        </CheckPermissionButton>
                                                        <CheckPermissionButton module="sms campaign" action="delete">
                                                            <i  className="mx-1 far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={()=>{handleClickDeleteSingle(index, value.smsId, value.status)}}></i>
                                                        </CheckPermissionButton>
                                                        <CheckPermissionButton module="sms campaign" action="report">
                                                            <i  className="mx-1 far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={()=>{handleClickReport(value.smsId)}}></i>
                                                        </CheckPermissionButton>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    :
                                        <tr>
                                            <td colSpan={10} className="text-center">No Campaign Found.</td>
                                        </tr>
                                }
                            </tbody>
                        </Table>
                    </div>
                    <Row className="mt-3">
                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${smsDetails.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+smsDetails.length-1} of ${totalData} entries`}</span></Col>
                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                    </Row>
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalBuyTwilioNo} toggle={toggleBuyTwilioNo}>
                <ModalHeader toggle={toggleBuyTwilioNo}>SMS/MMS Number Setup</ModalHeader>
                <ModalBody>
                    <h6>Hello {user.firstName},</h6>
                    <p>It looks like this is the first time you will be sending SMS/MMS message from {websiteTitle}. Let set your account up for this. In order to send SMS/MMS message you will first need to select a phone number to use to send SMS/MMS from. This phone number can be released in the My Profile section of our Applcation.</p>
                    <p>There is a $2.00 per month cost for this phone number regardless if you send SMS/MMS. </p>
                    <p>You can search for phone number by country and certain area code (NPA) or exchange (NXX).</p>
                    <div className="borderBottomContactBox"></div>
                    <Row>
                        <Col xs={1}></Col>
                        <Col xs={4}>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefsBuyTwilioNo.current[0]}
                                    name="countryCode"
                                    label="Select Country"
                                    onChange={handleChangeBuyTwilioNo}
                                    value={dataBuyTwilioNo?.countryCode || "US"}
                                    dropdownList={countryBuyTwilioNo}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={4}>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsBuyTwilioNo.current[0]}
                                    type="text"
                                    id="areaCode"
                                    name="areaCode"
                                    label="Please Enter Your Area Code"
                                    onChange={handleChangeBuyTwilioNo}
                                    value={dataBuyTwilioNo?.areaCode || ""}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={3}><Button variant="contained" color="primary" className="mt-3" onClick={()=>{searchBuyTwilioNo()}} >SEARCH</Button></Col>
                    </Row>
                    <div className="borderBottomContactBox"></div>
                    {
                        dataSearchTwilioNo.length > 0 && msgSearchTwilioNo === "" ?
                            <Row>
                                <RadioGroup className="w-100" row aria-label="twilioNumber" name="twilioNumber" value={dataBuyTwilioNo?.twilioNumber || ""} onChange={(e)=>{handleChangeBuyTwilioNo(e.target.name,e.target.value)}}>
                                    {
                                        dataSearchTwilioNo.map((value,index)=>(
                                            <Col xs={3} key={index}>
                                                <FormControlLabel className="mb-0" value={value.phoneNumber} control={<Radio color="primary" />} label={displayFormatNumber(value.friendlyName,value.countryCode)} />
                                            </Col>
                                        ))
                                    }
                                </RadioGroup>
                                <Col xs={12} className="border-bottom mt-2 mb-3"></Col>
                                <Col xs={12}>
                                    <FormControlLabel control={<Checkbox color="primary" checked={dataBuyTwilioNo.checkForwardingYesNo === "yes"} onChange={(e)=>{handleChangeBuyTwilioNo("checkForwardingYesNo",e.target.checked ? "yes" : "no")}} />} label="Do you want to forward call to this number?" />
                                </Col>
                                {
                                    dataBuyTwilioNo.checkForwardingYesNo === "yes" &&
                                    <>
                                        <Col sx={6}>
                                            <FormGroup className='mb-4'>
                                                <DropDownControls
                                                    ref={dropDownRefsBuyTwilioNo.current[1]}
                                                    name="callForwardingCountryCode"
                                                    label="Select Country"
                                                    onChange={handleChangeBuyTwilioNo}
                                                    value={dataBuyTwilioNo?.callForwardingCountryCode || "US"}
                                                    dropdownList={countryBuyTwilioNo}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sx={6}>
                                            <FormGroup className='mb-4'>
                                                <InputField
                                                    ref={inputRefsBuyTwilioNo.current[1]}
                                                    type="text"
                                                    id="callForwardingNumber"
                                                    name="callForwardingNumber"
                                                    label="Please Enter Your Number"
                                                    onChange={handleChangeBuyTwilioNo}
                                                    value={dataBuyTwilioNo?.callForwardingNumber || ""}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </>
                                }
                            </Row>
                            :
                            <Row>
                                <Col xs={12} className="text-center">{msgSearchTwilioNo}</Col>
                            </Row>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=>{saveBuyTwilioNo()}} >SAVE</Button>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleBuyTwilioNo()}} >CANCEL</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        resetGlobalAlert: () => {
            dispatch(resetGlobalAlertAction())
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        setSubUserAction: (data) => {
            dispatch(setSubUserAction(data))
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ManageSmsCampaign);