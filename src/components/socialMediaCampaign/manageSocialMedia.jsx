import React, {useCallback, useEffect, useState} from "react";
import {connect} from "react-redux";
import {Col, Input, Row, Table} from "reactstrap";
import {IconButton, InputAdornment, Link, MenuItem, Select, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material"
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import history from "../../history";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import {dateTimeFormat, dateTimeFormatDB, getClientTimeZone} from "../../assets/commonFunctions";
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {deleteSocialMediaPost, editSocialMediaPostSchedule, getSocialMediaCampaignList} from "../../services/socialMediaService";
import {checkAuthorized} from "../../services/commonService";
import {searchIconTransparent} from "../../assets/commonFunctions";

const ManageSocialMedia = ({globalAlert,confirmDialog,user,subUser,pendingTransaction}) => {
    const [perPage,setPerPage] = useState(25);
    const [totalPages,setTotalPages] = useState(0);
    const [selectedPage,setSelectedPage] = useState(0);
    const [sort,setSort] = useState("smId,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [search,setSearch] = useState("");
    const [searchSend,setSearchSend] = useState("");
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValue, setTableCheckBoxValue] = useState([]);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [dataSMCampaign, setDataSMCampaign] = useState([]);
    const [totalData,setTotalData] = useState(0);
    const [editScheduleValue,setEditScheduleValue] = useState([]);
    const [editScheduleSendOnDate,setEditScheduleSendOnDate] = useState("");
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
        dataSMCampaign.forEach(element => {
            newTableCheckBoxValue.push(!flag)
            if(!flag)
                newTableCheckBoxValueList.push(element.smId)
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
    const displayCampaignList = useCallback(() => {
        let data = `searchKey=${searchSend}&timeZone=${getClientTimeZone()}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setDataSMCampaign([]);
        getSocialMediaCampaignList(data).then(res => {
            if(res.status === 200){
                if (res.result) {
                    setDataSMCampaign(res.result.socialMediaCampaign);
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
    },[searchSend,selectedPage,perPage,sort,globalAlert]);
    const handleClickAdd = () => {
        checkAuthorized().then(res => {
            if (res.status === 200) {
                history.push("/createsocialmediapost");
            } else {
                confirmDialog({
                    open: true,
                    title: 'Your credit card is not available. Please add it.',
                    onConfirm: () => {
                        pendingTransaction([{
                            "pendingTransactionType": "addSocialMediaPost"
                        }]);
                        history.push("/carddetails");
                    }
                })
            }
        })
    }
    const handleClickEdit = (smId) => {
        checkAuthorized().then(res => {
            if (res.status === 200) {
                history.push("/createsocialmediapost?v="+smId);
            } else {
                confirmDialog({
                    open: true,
                    title: 'Your credit card is not available. Please add it.',
                    onConfirm: () => {
                        pendingTransaction([{
                            "pendingTransactionType": "editSocialMediaPost"
                        }]);
                        history.push("/carddetails");
                    }
                })
            }
        })
    }
    const deleteSMCampaign = () => {
        let requestData = {
            "smId": tableCheckBoxValueList
        }
        deleteSocialMediaPost(requestData).then(res => {
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
    const editSchedule = (index) =>{
        const newEditScheduleValue = [];
        newEditScheduleValue[index] = !newEditScheduleValue[index];
        setEditScheduleValue(newEditScheduleValue);
    }
    const saveSchedule = (campId) => {
        let requestData = {
            "memberId":user.memberId,
            "subMemberId":subUser.memberId,
            "smId":campId,
            "smpScheduleDateTime":editScheduleSendOnDate,
            "timeZone": getClientTimeZone()
        }
        editSocialMediaPostSchedule(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayCampaignList();
                setEditScheduleValue([]);
                setEditScheduleSendOnDate("");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    useEffect(()=>{
        displayCampaignList();
    },[displayCampaignList,selectedPage,perPage,searchSend]);
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>Social Media Post</h3>
                <div className="top-button">
                    <div className="icon-wrapper">
                        <CheckPermissionButton module="social media post" action="add">
                            <Link component="a" className="btn-circle" onClick={()=>{handleClickAdd()}} data-toggle="tooltip" title="Add">
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </CheckPermissionButton>
                        <CheckPermissionButton module="social media post" action="delete">
                            <Link id="deleteCamp" component="a" className="btn-circle" data-toggle="tooltip" title="Delete"
                                  onClick={() => {
                                      if (tableCheckBoxValueList.length > 0) {
                                          confirmDialog({
                                              open: true,
                                              title: 'Are you sure you want to delete selected social media post?',
                                              onConfirm: () => {deleteSMCampaign()}
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
                        <tr>
                            <th className="text-center" width="5%">
                                <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()}/>
                            </th>
                            <th key={0} onClick={()=>{handleClickSort("smId",0)}} className="text-center" width="7%">Id
                                <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                            </th>
                            <th key={1} onClick={()=>{handleClickSort("smName",1)}}>Name
                                <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                            </th>
                            <th width="30%">Schedule On</th>
                            <th width="10%">Status</th>
                            <th width="10%">Created Date</th>
                            <th className="text-center" width="7%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            dataSMCampaign.length > 0 ?
                                dataSMCampaign.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td align="center">
                                                <Input type="checkbox" checked={tableCheckBoxValue[index]} onChange={() => tableCheckBox(index, value.smId)}/>
                                            </td>
                                            <td align="center">{value.smId}</td>
                                            <td>{value.smName}</td>
                                            <td>
                                                {
                                                    value.smpScheduleDateTime !== null && editScheduleValue[index] !== true ?
                                                        <>{dateTimeFormat(value.smpScheduleDateTime)} <CheckPermissionButton module="social media post" action="edit"><i className="far fa-pencil-alt" onClick={()=>{editSchedule(index)}}></i></CheckPermissionButton></>
                                                        : null
                                                }
                                                {
                                                    editScheduleValue[index] === true ?
                                                        <><LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DateTimePicker
                                                                value={editScheduleSendOnDate ? new Date(editScheduleSendOnDate) : new Date(value.smpScheduleDateTime)}
                                                                inputFormat="MM/dd/yyyy hh:mm a"
                                                                onChange={(value) => {
                                                                    setEditScheduleSendOnDate(dateTimeFormatDB(value))
                                                                }}
                                                                slotProps={{ textField: { variant: "standard", className: "editScheduleDate" } }}
                                                                minDateTime={new Date()}
                                                            />
                                                        </LocalizationProvider><i className="far fa-check ml-3" onClick={()=>{saveSchedule(value.smId)}}></i> <i className="far fa-times" onClick={()=>{setEditScheduleValue([])}}></i></>
                                                        : null
                                                }
                                            </td>
                                            <td>{value.status}</td>
                                            <td>{value.publishDateTime}</td>
                                            <td>
                                                {value.status !== "Published" && <CheckPermissionButton module="social media post" action="edit">
                                                    <i className="mx-1 far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{handleClickEdit(value.smId)}}></i>
                                                </CheckPermissionButton>}
                                                {value.status === "Published" && <CheckPermissionButton module="social media post" action="edit">
                                                    <i className="mx-1 far fa-eye" data-toggle="tooltip" title="View" onClick={()=>{handleClickEdit(value.smId)}}></i>
                                                </CheckPermissionButton>}
                                                {value.status === "Published" && <CheckPermissionButton module="social media post" action="report">
                                                    <i className="mx-1 far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={()=>{history.push("/managesocialmediareport?v="+value.smId)}}></i>
                                                </CheckPermissionButton>}
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={7} className="text-center">No Social Media Found.</td>
                                </tr>
                        }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${dataSMCampaign.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+dataSMCampaign.length-1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                </Row>
            </Col>
        </Row>
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
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ManageSocialMedia);