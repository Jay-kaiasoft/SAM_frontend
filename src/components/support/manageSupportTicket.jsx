import React, { useCallback, useEffect, useState } from "react";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import { IconButton, InputAdornment, Link, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { Col, Row, Table } from "reactstrap";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import { getSubmitRequestList } from "../../services/supportService";
import history from "../../history";
import { searchIconTransparent } from "../../assets/commonFunctions";
import SearchIcon from "@mui/icons-material/Search";

const ManageSupportTicket = ({ globalAlert, confirmDialog }) => {
    const [requestList, setRequestList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("srId,asc");
    const [sortBox, setSortBox] = useState([false]);
    const [search, setSearch] = useState("");
    const [searchSend, setSearchSend] = useState("");
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
    const displaySubmitRequest = useCallback(() => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setRequestList([]);
        getSubmitRequestList(data).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setRequestList(res.result.submitRequestList || []);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.getTotalRecords);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }, [searchSend, selectedPage, perPage, sort, globalAlert]);
    useEffect(() => {
        displaySubmitRequest();
    }, [displaySubmitRequest, selectedPage, perPage, searchSend]);

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>Manage Support Ticket</h3>
                <div className="top-button">
                    <div className="icon-wrapper">
                        <CheckPermissionButton module="email campaign" action="add">
                            <Link component="a" className="btn-circle" onClick={() => { history.push("/addticket") }} data-toggle="tooltip" title="Add">
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
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
                                <th key={0} onClick={() => { handleClickSort("srId", 0) }} className="text-left" width="5%">Id
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={1} onClick={() => { handleClickSort("srSubject", 1) }} className="text-left" width="30%">Subject
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={2} onClick={() => { handleClickSort("srType", 2) }} className="text-left" width="30%">Type
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={3} onClick={() => { handleClickSort("srDate", 3) }} className="text-center" width="10%">Created
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={4} onClick={() => { handleClickSort("srStatus", 4) }} className="text-center" width="10%">Status
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th className="text-center" width="5%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                requestList.length > 0 ?
                                    requestList.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td align="left">{value.srId}</td>
                                                <td align="left">{value.srSubject}</td>
                                                <td align="left">{value.srType}</td>
                                                <td align="center">{value.srDate}</td>
                                                <td align="center">{value.srStatus}</td>
                                                <td align="right">
                                                    <CheckPermissionButton module="submit request" action="edit">
                                                        <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={() => { history.push("/viewticket?srId=" + value.srId) }}></i>
                                                    </CheckPermissionButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={6} className="text-center">No record Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${requestList.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + requestList.length - 1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageSupportTicket);
