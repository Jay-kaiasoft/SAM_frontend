import React, {useCallback, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Col, Row, Table} from "reactstrap";
import {IconButton, InputAdornment, Link, MenuItem, Select, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventTypeModal from "./eventTypeModal";
import {getDurationString} from "./utility";
import {getEventTypeList, deleteEventType} from "../../../../services/myCalendarServices";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import { Pagination } from "@mui/material"
import {setConfirmDialogAction} from "../../../../actions/confirmDialogActions";
import {dateTimeFormat, searchIconTransparent} from "../../../../assets/commonFunctions";

const AppointmentEvents = ({globalAlert, subUser, confirmDialog})=>{
    const [data, setData] = useState({});
    const [selectedPage,setSelectedPage] = useState(0);
    const [perPage,setPerPage] = useState(25);
    const [search,setSearch] = useState("");
    const [searchSend,setSearchSend] = useState("");
    const [sort,setSort] = useState("aetTitle,desc");
    const [totalData,setTotalData] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const [eventTypeModal, setEventTypeModal] = useState(false);
    const [modalAction, setModalAction] = useState("Add");
    const displayEventTypes = useCallback(()=>{
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        getEventTypeList(data).then((res)=>{
            if(res.status === 200){
                setData(res.result?.eventTypeList);
                setTotalPages(res.result?.getTotalPages);
                setTotalData(res.result?.totalEventType);
            }
        });
    }, [searchSend,selectedPage,perPage,sort]);
    const [updateData, setUpdateData] = useState({});
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
    };
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };
    const toggleEventTypeModal = ()=>{
        setEventTypeModal(!eventTypeModal);
    };
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
    const handleDeleteEventType = (id)=>{
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete event type?',
            onConfirm: ()=>{
                deleteEventType({"aetId": [id]}).then((res)=>{
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        setData((prev)=>{ return prev.filter((v)=>{ return v.aetId !== id}); });
                        setTotalData((prev) => { return prev-1 });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const handleUpdateEventType = (data)=>{
        setUpdateData(data);
        setModalAction("Update");
        toggleEventTypeModal();
    }
    const handleAddEventType = ()=>{
        setModalAction("Add");
        toggleEventTypeModal();
    }
    useEffect(()=>{
        displayEventTypes();
    }, [displayEventTypes, searchSend,selectedPage, perPage,sort, eventTypeModal]);
    return (
        <>
            <EventTypeModal eventTypeModal={eventTypeModal} toggleEventTypeModal={toggleEventTypeModal} subMemberId={subUser.memberId} action={modalAction} updateData={updateData}/>
            <Row>
                <Col xs={12}>
                    <h4 className="d-inline-block mb-0 align-middle">Appointment Event Type</h4>
                    <div className="icon-wrapper d-inline-block mx-5">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={handleAddEventType}>
                            <i className="far fa-plus-square"></i>
                            <div className="bg-green"></div>
                        </Link>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div className="top-button mb-2">
                        <div>
                            <span className="align-middle">Show</span>
                            <Select
                                variant="standard"
                                name="perPage"
                                onChange={handleChangePerPage}
                                value={perPage}
                                className="mx-2 align-middle"
                            >
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={75}>75</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                            <span className="align-middle">entries</span>
                        </div>
                        <div>
                            <TextField
                                placeholder="Search"
                                variant="standard"
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
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div className="table-content-wrapper height-58 overflow-auto">
                        <Table striped>
                            <thead>
                                <tr>
                                    <th onClick={()=>{handleClickSort("aetTitle",0)}}>Event Type Title
                                        <span>
                                            {typeof sortBox[0] !== "undefined"
                                                ? (sortBox[0] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i> )
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th>Duration</th>
                                    <th onClick={()=>{handleClickSort("aetDateTime",1)}}>Created Time
                                        <span>
                                            {typeof sortBox[1] !== "undefined"
                                                ? (sortBox[1] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i> )
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th style={{width: "7%"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                data.length>0?
                                data.map((dataV, dataI)=>{
                                  return (
                                      <tr key={dataI}>
                                            <td>{dataV.aetTitle}</td>
                                            <td>
                                                {getDurationString(dataV.aetDurationMinutes, dataV.aetDurationHours)}
                                            </td>
                                            <td>{dateTimeFormat(new Date(dataV.aetDateTime))}</td>
                                            <td>
                                                <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={()=>{
                                                    handleUpdateEventType(dataV);
                                                }}></i>
                                                <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={()=> {
                                                    handleDeleteEventType(dataV.aetId);
                                                }}></i>
                                            </td>
                                      </tr>
                                  );
                                }):<tr><td colSpan={4} className="text-center">No Data Found</td></tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                    <Row className="mt-3">
                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${data.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+data.length-1} of ${totalData} entries`}</span></Col>
                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(AppointmentEvents);
