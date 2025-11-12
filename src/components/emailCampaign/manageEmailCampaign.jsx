import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Input, Row, Table } from "reactstrap";
import { IconButton, InputAdornment, Link, MenuItem, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material"
import {
    deleteCampaign, editCampaignSchedule,
    getCampaignById,
    getCampaignList,
    pauseCampaign, resendAllCampaign,
    resendCampaignNotOpened,
    restartCampaign
} from "../../services/emailCampaignService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import history from "../../history";
import { setPendingTransactionAction } from "../../actions/pendingTransactionActions";
import { dateTimeFormat, dateTimeFormatDB, getClientTimeZone, handleClickHelp } from "../../assets/commonFunctions";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import { searchIconTransparent } from "../../assets/commonFunctions";
import $ from 'jquery';
import { emailVerificationGroup } from "../../services/clientContactService";

const ManageEmailCampaign = ({ globalAlert, confirmDialog, user, subUser, countrySetting, pendingTransaction }) => {
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("campId,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [search, setSearch] = useState("");
    const [searchSend, setSearchSend] = useState("");
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValue, setTableCheckBoxValue] = useState([]);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [dataEmailCampaign, setDataEmailCampaign] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [editScheduleValue, setEditScheduleValue] = useState([]);
    const [editScheduleSendOnDate, setEditScheduleSendOnDate] = useState("");
    const [campDetails, setCampDetails] = useState({})
    const handleChangePagination = (event, value) => {
        setSelectedPage(value - 1);
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
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        let newTableCheckBoxValue = []
        const newTableCheckBoxValueList = []
        dataEmailCampaign.forEach(element => {
            newTableCheckBoxValue.push(!flag)
            if (!flag)
                newTableCheckBoxValueList.push(element.campId)
        });
        setTableCheckBoxValue(newTableCheckBoxValue)
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }
    const tableCheckBox = (index, id) => {
        const newTableCheckBoxValue = [...tableCheckBoxValue]
        newTableCheckBoxValue[index] = !newTableCheckBoxValue[index]
        setTableCheckBoxValue(newTableCheckBoxValue)
        if (!newTableCheckBoxValue[index]) {
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList, id]);
        }
        let length = newTableCheckBoxValue.filter(function (value) {
            return value === true;
        }).length
        if (length !== newTableCheckBoxValue.length) {
            setMainTablecheckBoxValue(false)
        }
    }
    const displayCampaignList = useCallback(() => {
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}&timeZone=${timeZone}`;
        getCampaignList(data).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setDataEmailCampaign(res.result.campaign);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.totalCampaign);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }, [searchSend, selectedPage, perPage, sort, globalAlert, user.timeZone]);
    const deleteEmailCampaign = (id) => {
        let requestData = {
            "campId": id === "" ? tableCheckBoxValueList : [id]
        }
        deleteCampaign(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueList([]);
                setTableCheckBoxValue([]);
                setMainTablecheckBoxValue(false);
                displayCampaignList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const deleteEmailCampaignSingle = (index, id) => {
        setTableCheckBoxValueList([]);
        setTableCheckBoxValue([]);
        setMainTablecheckBoxValue(false);
        const newTableCheckBoxValue = [];
        newTableCheckBoxValue[index] = !newTableCheckBoxValue[index];
        setTableCheckBoxValue(newTableCheckBoxValue);
        setTableCheckBoxValueList([id]);
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete selected campaign?',
            onConfirm: () => { deleteEmailCampaign(id) }
        });
    }
    const pauseEmailCampaign = (id) => {
        let requestData = {
            "memberId": user.memberId,
            "subMemberId": subUser.memberId,
            "campId": id
        }
        pauseCampaign(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayCampaignList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const restartEmailCampaign = (id) => {
        let requestData = {
            "memberId": user.memberId,
            "subMemberId": subUser.memberId,
            "campId": id
        }
        restartCampaign(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayCampaignList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const resendEmailCampaignNotOpened = (sendOnDate, campId, campSendId, totalMember) => {
        let requestData = {
            "memberId": user.memberId,
            "sendOnDate": sendOnDate,
            "subMemberId": subUser.memberId,
            "campId": campId,
            "campSendId": campSendId,
            "totalMember": totalMember
        }
        resendCampaignNotOpened(requestData).then(res => {
            if (res.status === 200) {
                if (res.result.location === "paymentProfile") {
                    pendingTransaction([{ ...requestData, "pendingTransactionType": "resendEmailCampaign" }]);
                    history.push("/carddetails");
                } else {
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
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
    const resendEmailCampaignAll = (sendOnDate, campId, campSendId, totalMember) => {
        let requestData = {
            "memberId": user.memberId,
            "sendOnDate": sendOnDate,
            "subMemberId": subUser.memberId,
            "campId": campId,
            "campSendId": campSendId,
            "totalMember": totalMember
        }
        resendAllCampaign(requestData).then(res => {
            if (res.status === 200) {
                if (res.result.location === "paymentProfile") {
                    pendingTransaction([{ ...requestData, "pendingTransactionType": "resendEmailCampaign" }]);
                    history.push("/carddetails");
                } else {
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
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
    const editSchedule = (index, date) => {
        const newEditScheduleValue = [];
        newEditScheduleValue[index] = !newEditScheduleValue[index];
        setEditScheduleValue(newEditScheduleValue);
        setEditScheduleSendOnDate(dateTimeFormatDB(date));
    }
    const saveSchedule = (campId, schId) => {
        let requestData = {
            "campId": campId,
            "sendOnDate": editScheduleSendOnDate,
            "scheduleId": schId,
            "timeZone": (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone
        }
        editCampaignSchedule(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayCampaignList();
                setEditScheduleValue([]);
                setEditScheduleSendOnDate(new Date());
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    useEffect(() => {
        let interval = null;
        if(interval === null){
            displayCampaignList();
        }
        interval = setInterval(() => {
            displayCampaignList();
        }, 30 * 1000);
        return ()=>{
            clearInterval(interval);
            interval = null;
        }
    }, [displayCampaignList, selectedPage, perPage, searchSend]);
    const handleGetCampaignById = async (campId, tooltipsShow) => {
        if (campDetails[campId]) {
            return campDetails[campId];
        } else {
            return await getCampaignById(`campId=${campId}`).then(res => {
                if (res.status === 200) {
                    setCampDetails((prev) => {
                        return {
                            ...prev,
                            [campId]: res.result.campaign
                        }
                    })
                    if(tooltipsShow === "yes"){
                        setTimeout(()=>{
                            $(`#campName-${campId}`).tooltip('show');
                        },1000);
                    }
                    return res.result.campaign;
                }
            })
        }
    }
    const renderStatusBox = (status,cronStatus) => {
        let color = "text-transparent";
        let title;
        if(status.indexOf("%") !== -1){
            color = "text-success";
            title="Sending";
        }
        if(cronStatus === "pause"){
            color = "text-warning";
            title="Paused - Warmup Schedule";
        } else if(cronStatus === "Bounce") {
            color = "text-danger";
            if(status === "Completed") {
                title="Stopped - Completed With High Bounce Rate";
            } else {
                title="Stopped - Bounce Rate";
            }
        }
        return <i className={`fas fa-square mr-2 ${color}`} data-toggle="tooltip" title={title}></i>;
    }
    const handleClickVerifyGroupContact = (groupId) => {
        let innerTitle = '';
        innerTitle += '<div class="row">';
        innerTitle += '<div class="col-6 font-weight-bold">Emails</div><div class="col-6 font-weight-bold">Price/Email</div>';
        countrySetting.emailVerificationPrice.map((v)=>(
            innerTitle += '<div class="col-6 text-left">'+v.evpContactTotal+'</div><div class="col-6 text-right">'+countrySetting.cntyPriceSymbol+v.evpRate+'</div>'
        ));
        innerTitle += '</div>';
        let title = `Validated email address improve your chances of landing in inbox and reduces bounce rate with email providers putting your domain in good standing with them. <span class="cursor-pointer" data-toggle="tooltip" data-html=${true} data-template="<div class='tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>" title='${innerTitle}'><u>Charges apply</u></span>.<br/><br/>Would you like to verify the email address to make sure they are reachable valid email address?`;
        confirmDialog({
            open: true,
            title: title,
            onConfirm: () => {
                let requestData = {
                    "groupId": groupId,
                    "subMemberId": subUser.memberId
                }
                emailVerificationGroup(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        })
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        })
                    }
                });
            }
        });
    }
    const handleCheckRestartButton = (cronStatus, stopStatus, typeEmail) => {
        if(typeEmail === "done" && stopStatus === "Bounce") {
            return true;
        } else if(typeEmail !== "done" && stopStatus === "Bounce") {
            return false;
        } else if(cronStatus === "pause"){
            return true;
        } else {
            return false;
        }
    }

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>Email Campaign</h3>
                <div className="top-button">
                    <div className="icon-wrapper">
                        <CheckPermissionButton module="email campaign" action="add">
                            <Link component="a" className="btn-circle" onClick={() => { history.push("/buildemailcampaign") }} data-toggle="tooltip" title="Add">
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </CheckPermissionButton>
                        <CheckPermissionButton module="email campaign" action="delete">
                            <Link id="deleteCamp" component="a" className="btn-circle" data-toggle="tooltip" title="Delete"
                                onClick={() => {
                                    if (tableCheckBoxValueList.length > 0) {
                                        confirmDialog({
                                            open: true,
                                            title: 'Are you sure you want to delete selected campaign?',
                                            onConfirm: () => { deleteEmailCampaign("") }
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
                        <Link component="a" className="btn-circle" onClick={() => { handleClickHelp("EmailMarketing/EmailCampaign/sendemailcampaign/HowtoSendYourFirstEmailCampaign.html") }} data-toggle="tooltip" title="Help">
                            <i className="far fa-question-circle"></i>
                            <div className="bg-grey"></div>
                        </Link>
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
                        </div>
                    </div>
                </div>
                <div className="table-content-wrapper height-58 overflow-auto">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center" width="5%">
                                    <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()} />
                                </th>
                                <th key={0} onClick={() => { handleClickSort("campId", 0) }} className="text-center" width="10%">Id
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={1} onClick={() => { handleClickSort("campName", 1) }}>Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th width="25%">Schedule On</th>
                                <th width="10%">Status</th>
                                <th className="text-center" width="15%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataEmailCampaign.length > 0 ?
                                    dataEmailCampaign.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td align="center">
                                                    <Input type="checkbox" checked={tableCheckBoxValue[index]} onChange={() => tableCheckBox(index, value.campId)} />
                                                </td>
                                                <td align="center">{value.campId}</td>
                                                <td
                                                    id={`campName-${value.campId}`}
                                                    className="cursor-pointer"
                                                    onClick={() => handleGetCampaignById(value.campId, "yes")}
                                                    data-toggle="tooltip"
                                                    data-trigger="click"
                                                    data-html={true}
                                                    data-template="<div class='tooltip tooltip-left' role='tooltip'><div class='arrow'></div><div class='tooltip-inner tooltip-nowrap'></div></div>"
                                                    title={""}
                                                    data-original-title={ typeof campDetails[value.campId] !== "undefined" ? `Subject : ${campDetails[value.campId].subject}<br/>Group Name : ${campDetails[value.campId].groupName}<br/>Template Name : ${campDetails[value.campId].templateName}<br/>Created Date : ${campDetails[value.campId].sendDate}<br/>Last Send Date : ${campDetails[value.campId].lastSendDate}<br/>Total Member : ${campDetails[value.campId].totalMemberTooltip}` : ""}
                                                >{value.campName}</td>
                                                <td>
                                                    {
                                                        value.schId !== null && editScheduleValue[index] !== true ?
                                                            <>{dateTimeFormat(value.sendOnDate)} <CheckPermissionButton module="email campaign" action="edit"><i className="far fa-pencil-alt" onClick={() => { editSchedule(index, value.sendOnDate) }}></i></CheckPermissionButton></>
                                                            : null
                                                    }
                                                    {
                                                        editScheduleValue[index] === true ?
                                                            <><LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <DateTimePicker
                                                                    hideTabs
                                                                    value={editScheduleSendOnDate ? new Date(editScheduleSendOnDate) : new Date(value.sendOnDate)}
                                                                    inputFormat="MM/dd/yyyy hh:mm a"
                                                                    onChange={(value) => {
                                                                        setEditScheduleSendOnDate(dateTimeFormatDB(value))
                                                                    }}
                                                                    slotProps={{ textField: { variant: "standard", className: "editScheduleDate" } }}
                                                                    minDateTime={new Date()}
                                                                />
                                                            </LocalizationProvider><i className="far fa-check ml-3" onClick={() => { saveSchedule(value.campId, value.schId) }}></i> <i className="far fa-times" onClick={() => { setEditScheduleValue([]) }}></i></>
                                                            : null
                                                    }
                                                </td>
                                                <td>{renderStatusBox(value.status,value.cronStatus)}{value.status}</td>
                                                <td align="right">
                                                    {
                                                        value.cronStatus === "Bounce" &&
                                                        <span className="icons-mixed-main mr-3"  data-toggle="tooltip" title="Verify Group Contact" onClick={()=>{handleClickVerifyGroupContact(Number(value.groupList))}}>
                                                            <i className="far fa-users icons-mixed-first"></i>
                                                            <i className="fas fa-check-circle icons-mixed-second"></i>
                                                        </span>
                                                    }
                                                    {
                                                        value.status !== "Completed" ?
                                                            <>
                                                                {
                                                                    value.cronStatus === "active" || value.cronStatus === "restart" ?
                                                                        <CheckPermissionButton module="email campaign" action="pause">
                                                                            <i className="far fa-pause mr-3" data-toggle="tooltip" title="Pause"
                                                                                onClick={() => {
                                                                                    confirmDialog({
                                                                                        open: true,
                                                                                        title: 'Are you sure you want to Pause selected campaign sending?',
                                                                                        onConfirm: () => { pauseEmailCampaign(value.campId) }
                                                                                    })
                                                                                }}
                                                                            ></i>
                                                                        </CheckPermissionButton>
                                                                    : null
                                                                }
                                                                {
                                                                    handleCheckRestartButton(value.cronStatus, value.stopStatus, value.typeEmail) ?
                                                                        <CheckPermissionButton module="email campaign" action="restart">
                                                                            <i className="far fa-redo mr-3" data-toggle="tooltip" title="Restart"
                                                                                onClick={() => {
                                                                                    confirmDialog({
                                                                                        open: true,
                                                                                        title: 'Are you sure you want to Restart selected campaign sending?',
                                                                                        onConfirm: () => { restartEmailCampaign(value.campId) }
                                                                                    })
                                                                                }}
                                                                            ></i>
                                                                        </CheckPermissionButton>
                                                                    : null
                                                                }
                                                            </>
                                                        : null
                                                    }
                                                    {
                                                        value.intervalDays > 0 && value.status !== "Scheduled" ?
                                                            <>
                                                                <CheckPermissionButton module="email campaign" action="resend">
                                                                    <i className="far fa-share mr-3" data-toggle="tooltip" title="Resend Not Opened"
                                                                        onClick={async () => {
                                                                            const campDetails = await handleGetCampaignById(value.campId, "no")
                                                                            if((typeof campDetails.groupName !== "undefined" || campDetails.groupName !== "" || campDetails.groupName !== null) && (typeof campDetails.templateName !== "undefined" || campDetails.templateName !== "" || campDetails.templateName !== null)) {
                                                                            } else {
                                                                                globalAlert({
                                                                                    type: "Error",
                                                                                    text: "Group or template is not found.",
                                                                                    open: true
                                                                                }); 
                                                                                return false;
                                                                            }
                                                                            campDetails.totalMemberNotOpen > 0 ?
                                                                                confirmDialog({
                                                                                    open: true,
                                                                                    title: "Are you sure you want to Resend selected campaign?<table><tr><td>Campaign Name&nbsp;&nbsp;</td><td> : " + value.campName + "</td></tr><tr><td>Subject </td><td> : " + campDetails.subject + "</td></tr><tr><td>Group Name </td><td> : " + campDetails.groupName + "</td></tr><tr><td>Template Name </td><td> : " + campDetails.templateName + "</td></tr><tr><td>Total Member </td><td> : " + campDetails.totalMemberNotOpen + "</td></tr></table>",
                                                                                    onConfirm: () => { resendEmailCampaignNotOpened(value.sendOnDate, value.campId, campDetails.campSendId, campDetails.totalMemberNotOpen) }
                                                                                })
                                                                            :
                                                                                globalAlert({
                                                                                    type: "Error",
                                                                                    text: "Members to resend are not available in your contact list.",
                                                                                    open: true
                                                                                });
                                                                            
                                                                        }}
                                                                    ></i>
                                                                </CheckPermissionButton>
                                                                <CheckPermissionButton module="email campaign" action="resend">
                                                                    <i className="far fa-share mr-3" data-toggle="tooltip" title="Resend All"
                                                                        onClick={async () => {
                                                                            const campDetails = await handleGetCampaignById(value.campId, "no")
                                                                            if((typeof campDetails.groupName !== "undefined" || campDetails.groupName !== "" || campDetails.groupName !== null) && (typeof campDetails.templateName !== "undefined" || campDetails.templateName !== "" || campDetails.templateName !== null)) {
                                                                            } else {
                                                                                globalAlert({
                                                                                    type: "Error",
                                                                                    text: "Group or template is not found.",
                                                                                    open: true
                                                                                }); 
                                                                                return false;
                                                                            }
                                                                            campDetails.totalMemberResendAll > 0 ?
                                                                                confirmDialog({
                                                                                    open: true,
                                                                                    title: "Are you sure you want to Resend selected campaign?<table><tr><td>Campaign Name&nbsp;&nbsp;</td><td> : " + value.campName + "</td></tr><tr><td>Subject </td><td> : " + campDetails.subject + "</td></tr><tr><td>Group Name </td><td> : " + campDetails.groupName + "</td></tr><tr><td>Template Name </td><td> : " + campDetails.templateName + "</td></tr><tr><td>Total Member </td><td> : " + campDetails.totalMemberResendAll + "</td></tr></table>",
                                                                                    onConfirm: () => { resendEmailCampaignAll(value.sendOnDate, value.campId, campDetails.campSendId, campDetails.totalMemberResendAll) }
                                                                                })
                                                                            :
                                                                                globalAlert({
                                                                                    type: "Error",
                                                                                    text: "Members to resend are not available in your contact list.",
                                                                                    open: true
                                                                                });
                                                                        }}
                                                                    ></i>
                                                                </CheckPermissionButton>
                                                            </>
                                                            : null
                                                    }
                                                    <CheckPermissionButton module="email campaign" action="delete">
                                                        <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={() => { deleteEmailCampaignSingle(index, value.campId) }}></i>
                                                    </CheckPermissionButton> 
                                                    <CheckPermissionButton module="email campaign" action="report">
                                                        <i className="far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={() => { 
                                                            value?.archiveYn === "Y" ?
                                                                globalAlert({
                                                                    type: "Success",
                                                                    text: "To download/view report please contact Support",
                                                                    open: true
                                                                })
                                                            :
                                                                history.push(`/managecampaignreport?v=${value?.campId}`) 
                                                        }}></i>
                                                    </CheckPermissionButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={6} className="text-center">No Campaign Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${dataEmailCampaign.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + dataEmailCampaign.length - 1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                </Row>
            </Col>
        </Row>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser,
        countrySetting: state.countrySetting
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ManageEmailCampaign);