import React, {useCallback, useEffect, useState} from 'react';
import {connect} from "react-redux";
import { Row, Col, Table, Input } from 'reactstrap';
import {Button, IconButton, InputAdornment, Link, MenuItem, Select, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material"
import history from "../../history";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {closeSmsPolling, deleteSmsPolling, getDuplicateSmsPolling, getSmsPollingList} from "../../services/smsPollingService";
import {checkPopupClose, dateFormat, handleClickHelp} from "../../assets/commonFunctions";
import {checkAuthorized} from "../../services/commonService";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import {searchIconTransparent} from "../../assets/commonFunctions";
import { get10DLCStatus } from '../../services/profileService';
import { tenDLCFormUrl } from '../../config/api';
import { setLoader } from '../../actions/loaderActions';

const ManageSmsPolling = ({subUser,globalAlert,confirmDialog,pendingTransaction,setLoader}) => {
    const [smsDetails, setSmsDetails] = useState([]);
    const [perPage,setPerPage] = useState(25);
    const [totalPages,setTotalPages] = useState(0);
    const [selectedPage,setSelectedPage] = useState(0);
    const [sort,setSort] = useState("iId,desc");
    const [sortBox, setSortBox] = useState([]);
    const [search,setSearch] = useState("");
    const [searchSend,setSearchSend] = useState("");
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValue, setTableCheckBoxValue] = useState([]);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [totalData,setTotalData] = useState(0);
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
        let newTableCheckBoxValue = []
        const newTableCheckBoxValueList = []
        smsDetails.forEach(element => {
            newTableCheckBoxValue.push(!flag)
            if(!flag)
                newTableCheckBoxValueList.push(element.iid)
        });
        setTableCheckBoxValue(newTableCheckBoxValue)
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }
    const tableCheckBox = (index,id) => {
        const newTableCheckBoxValue = [...tableCheckBoxValue]
        newTableCheckBoxValue[index] = !newTableCheckBoxValue[index]
        setTableCheckBoxValue(newTableCheckBoxValue)
        if(!newTableCheckBoxValue[index]){
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList,id]);
        }
        let length = newTableCheckBoxValue.filter(function (value) {
            return value === true;
        }).length
        if (length !== newTableCheckBoxValue.length) {
            setMainTablecheckBoxValue(false)
        }
    }
    const displaySmsPollingList = useCallback(() => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setSmsDetails([]);
        getSmsPollingList(data).then(res => {
            if(res.status === 200){
                if (res.result && res.result.smsPolling) {
                    setSmsDetails(res.result.smsPolling);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.totalSmsPolling);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[searchSend,selectedPage,perPage,sort,globalAlert]);
    const handleClickDelete = () => {
        let requestData = {
            "ids": tableCheckBoxValueList
        }
        deleteSmsPolling(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueList([]);
                setTableCheckBoxValue([]);
                setMainTablecheckBoxValue(false);
                displaySmsPollingList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickClose = () => {
        let requestData = {
            "ids": tableCheckBoxValueList,
            "subMemberId":subUser.memberId
        }
        closeSmsPolling(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueList([]);
                setTableCheckBoxValue([]);
                setMainTablecheckBoxValue(false);
                displaySmsPollingList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickAdd = () => {
        if (tenDLCStatus) {
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    history.push("/createsmspolling");
                } else {
                    pendingTransaction([{
                        "pendingTransactionType": "addSmsPolling"
                    }]);
                    history.push("/carddetails");
                }
            });
        } else {
            globalAlert({
                type: "Error",
                text: "You need to Register for 10DLC to activate SMS Polling",
                open: true
            });
        }
    }
    const handleClickEdit = () => {
        checkAuthorized().then(res => {
            if (res.status === 200) {
                let selectedSms = smsDetails.filter((v)=>(v.iid === tableCheckBoxValueList[0]));
                if(selectedSms[0].ispstatus === 2 || selectedSms[0].ispstatus === 3){
                    confirmDialog({
                        open: true,
                        title: 'Please ensure to save your changes and Re-Publish your SMS Polling.',
                        onConfirm: () => {
                            getDuplicateSmsPolling(subUser.memberId,selectedSms[0].rndHash).then(res => {
                                if (res.status === 200) {
                                    history.push("/createsmspolling?v="+res.result.rndHash);
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
                    history.push("/createsmspolling?v="+selectedSms[0].rndHash);
                }
            } else {
                confirmDialog({
                    open: true,
                    title: 'Your credit card is not available. Please add it.',
                    onConfirm: () => {
                        pendingTransaction([{
                            "pendingTransactionType": "editSmsPolling"
                        }]);
                        history.push("/carddetails");
                    }
                })
            }
        });
    }
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
                                "pendingTransactionType": "addSmsPolling"
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
    useEffect(() => {
        displaySmsPollingList();
    }, [selectedPage,perPage,searchSend,displaySmsPollingList]);
    useEffect(()=>{
        get10DLCStatus().then(res => {
            if (res.status === 200 && (res.result.status === "Processing" || res.result.status === "Approved")) {
                setTenDLCStatus(true);
            }
        });
    },[]);
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>SMS Polling</h3>
                    <div className="top-button">
                        <div className="icon-wrapper">
                            <CheckPermissionButton module="sms polling" action="add">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add"
                                      onClick={()=> { handleClickAdd(); }}
                                >
                                    <i className="far fa-plus-square"></i>
                                    <div className="bg-green"></div>
                                </Link>
                            </CheckPermissionButton>
                            <CheckPermissionButton module="sms polling" action="edit">
                                {
                                    tableCheckBoxValueList.length < 2 ?
                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit"
                                            onClick={() => {
                                                if (tableCheckBoxValueList.length > 0) {
                                                    handleClickEdit();
                                                } else {
                                                    globalAlert({
                                                        type: "Error",
                                                        text: "You must check one of the checkboxes.",
                                                        open: true
                                                    });
                                                }
                                            }}
                                        >
                                            <i className="far fa-pencil-alt"></i>
                                            <div className="bg-blue"></div>
                                        </Link>
                                    : null
                                }
                            </CheckPermissionButton>
                            <CheckPermissionButton module="sms polling" action="close">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Close"
                                    onClick={() => {
                                        if (tableCheckBoxValueList.length > 0) {
                                            confirmDialog({
                                                open: true,
                                                title: 'Are you sure you want to close this poll?\n' +
                                                    'Once this poll is closed the associated phone number will be release and no new responses will be recorded.',
                                                onConfirm: () => {handleClickClose()}
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
                                    <i className="far fa-eye-slash"></i>
                                    <div className="bg-purple"></div>
                                </Link>
                            </CheckPermissionButton>
                            <CheckPermissionButton module="sms polling" action="delete">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete"
                                    onClick={() => {
                                        if (tableCheckBoxValueList.length > 0) {
                                            confirmDialog({
                                                open: true,
                                                title: 'Are you sure you want to delete selected SMS polling?',
                                                onConfirm: () => {handleClickDelete()}
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
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help" onClick={()=>{handleClickHelp("SMS/Features/createSMSPoll/HowtoCreateYourFirstSMSPoll.html")}}>
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
                                <th key={0} onClick={()=>{handleClickSort("vHeading",0)}}>Name
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={1} onClick={()=>{handleClickSort("iSPStatus",1)}}>Status
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th>Created</th>
                                <th width="15%">Phone Number</th>
                                <th width="10%">Total Responses</th>
                                <th className="text-center" width="10%">Report</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                smsDetails.length > 0 ?
                                    smsDetails.map((value,index) => {
                                        return (
                                            <tr key={value.iid}>
                                                <td className="text-center">
                                                    <Input type="checkbox" checked={tableCheckBoxValue[index]} onChange={() => tableCheckBox(index, value.iid)}/>
                                                </td>
                                                <td>
                                                    <p className="m-0">{value.vheading}</p>
                                                    <p className="m-0">{value.totalQuestion} questions</p>
                                                </td>
                                                <td>{value.status}</td>
                                                <td>{dateFormat(value.createdDate)}</td>
                                                <td>{value.vsmspollingNumber}</td>
                                                <td className="text-center">{value.totalMember}</td>
                                                <td className="text-center">
                                                    {
                                                        value.ispstatus === 2 || value.ispstatus === 3 ?
                                                            <CheckPermissionButton module="sms polling" action="report">
                                                                <i  className="mx-1 far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={()=>{history.push("/smspollingreport?v="+value.rndHash)}}></i>
                                                            </CheckPermissionButton>
                                                        : null
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={7} className="text-center">No SMS Polling Found.</td>
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
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser
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
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ManageSmsPolling);
