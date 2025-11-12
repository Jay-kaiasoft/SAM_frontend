import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Col, Row, Table } from "reactstrap";
import History from "../../../history";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../../actions/confirmDialogActions";
import { connect } from "react-redux";
import { IconButton, InputAdornment, Link, MenuItem, Select, TextField, Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckPermissionButton from "../../shared/commonControlls/checkPermissionButton";
import { getEmailCampaignsReportListPage } from "../../../services/emailCampaignService";
import {dateTimeFormat, easUrlEncoder, getClientTimeZone, searchIconTransparent} from "../../../assets/commonFunctions";

const ManageCampaignReport = (props, { globalAlert }) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("id,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [search, setSearch] = useState("");
    const [searchSend, setSearchSend] = useState("");
    const [totalData, setTotalData] = useState(0);
    const [campaignReportData, setCampaignReportData] = useState([]);

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
    const handleChangePagination = (event, value) => {
        setSelectedPage(value - 1);
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

    const displayCampaignReportList = useCallback(() => {
        let timeZone = (typeof props.user.timeZone === "undefined" || props.user.timeZone === "" || props.user.timeZone === null) ? getClientTimeZone() : props.user.timeZone;
        let data = `id=${id}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}&timeZone=${timeZone}`;
        setCampaignReportData([]);
        getEmailCampaignsReportListPage(data).then(res => {
            if (res?.status === 200) {
                if (res?.result) {
                    setCampaignReportData(res?.result?.emailCampaignsReportList);
                    setTotalPages(res?.result?.getTotalPages);
                    setTotalData(res?.result?.totalCampaignsEmailSend);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }, [searchSend, id, selectedPage, perPage, sort, globalAlert, props.user.timeZone]);
    useEffect(() => {
        displayCampaignReportList();
    }, [displayCampaignReportList, id, selectedPage, perPage, searchSend]);

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="icon-wrapper d-inline-block mr-3">
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={() => { History.push("/manageemailcampaign") }}>
                        <i className="far fa-long-arrow-left"></i>
                        <div className="bg-dark-grey"></div>
                    </Link>
                </div>
                <h3 className="d-inline-block mb-0 align-middle">Email Campaign Report</h3>
                <div className="top-button mb-1">
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
                            variant="standard"
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
                <div className="table-content-wrapper height-58 overflow-auto">
                    <Table striped>
                        <thead>
                            <tr>
                                <th key={0} onClick={() => { handleClickSort("id", 0) }} className="text-center" width="5%">No
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={1} align="left">Name</th>
                                <th width="20%" align="left" onClick={() => { handleClickSort("sendDate", 2) }}>Created On
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th width="20%" align="left">Send On</th>
                                <th className="text-center" width="10%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                campaignReportData.length > 0 ?
                                    campaignReportData.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td align="center">{index + 1}</td>
                                                <td>{value?.campName}</td>
                                                <td>{dateTimeFormat(value?.createdOn)}</td>
                                                <td>{dateTimeFormat(value?.sendOnDate)}</td>
                                                <td align="center">
                                                    <CheckPermissionButton module="email campaign" action="report">
                                                        <i className="far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={() => { History.push(value?.campMainType === 2 ? `/campaignreportabtesting?v=${id}&y=${value?.encCampId}` : `/campaignreport?v=${id}&y=${value?.encCampId}`) }}></i>
                                                    </CheckPermissionButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={5} className="text-center">No Campaign Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${campaignReportData.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + campaignReportData.length - 1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageCampaignReport);