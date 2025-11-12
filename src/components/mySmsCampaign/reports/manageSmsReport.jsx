import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Table } from 'reactstrap';
import { IconButton, InputAdornment, Link, MenuItem, Pagination, Select, TextField } from "@mui/material";
import history from "../../../history";
import SearchIcon from "@mui/icons-material/Search";
import {dateTimeFormat, easUrlEncoder, searchIconTransparent} from "../../../assets/commonFunctions";
import { getSmsCampaignsReportListPage } from "../../../services/smsCampaignService";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { connect } from "react-redux";

const ManageSmsReport = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [campaignReportData, setCampaignReportData] = useState({});
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(25);
    const [searchSend, setSearchSend] = useState("");
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("smsId,desc");
    const [totalData, setTotalData] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const handleChangePagination = (event, value) => {
        setSelectedPage(value - 1);
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
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
        let data = `id=${id}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setCampaignReportData([]);
        getSmsCampaignsReportListPage(data).then(res => {
            if (res?.status === 200) {
                if (res?.result) {
                    setCampaignReportData(res?.result?.smsCampaignsReportList || []);
                    setTotalPages(res?.result?.getTotalPages);
                    setTotalData(res?.result?.totalSmsCampaigns || 0);
                }
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }, [searchSend, id, selectedPage, perPage, sort, props]);
    useEffect(() => {
        displayCampaignReportList();
    }, [displayCampaignReportList, id, selectedPage, perPage, searchSend, props]);

    const handleClickReport = (encId, smsId) => {
        history.push(`/smsreport?v=${smsId}&y=${encId}`);
    }
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="d-flex align-items-center">
                    <div className="icon-wrapper mr-3">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={() => { history.push("/managesmscampaign") }}>
                            <i className="far fa-long-arrow-left"></i>
                            <div className="bg-dark-grey"></div>
                        </Link>
                    </div>
                    <h3 className="">SMS/MMS Campaign Report</h3>
                </div>
                <div className="top-button mb-1">
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
                <div className="table-content-wrapper height-58">
                    <Table striped>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }} onClick={() => { handleClickSort("id", 0) }}>No
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th style={{ width: "50%" }}>Name</th>
                                <th style={{ width: "20%" }}>Phone Number</th>
                                <th style={{ width: "20%" }} onClick={() => { handleClickSort("sendDate", 3) }}>Created On
                                    <span>
                                        {typeof sortBox[3] !== "undefined"
                                            ? (sortBox[3] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th style={{ width: "5%" }} className="text-center">Report</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                campaignReportData?.length > 0 ?
                                    campaignReportData?.map((dataVal, dataIndex) => {
                                        return (
                                            <tr key={dataIndex}>
                                                <td>{dataIndex + 1}</td>
                                                <td>{dataVal.smsName}</td>
                                                <td>{dataVal.phoneNumber}</td>
                                                <td>{dateTimeFormat(dataVal.sendDate)}</td>
                                                <td className="text-center"><i className="mx-1 far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={() => { handleClickReport(dataVal.encId, dataVal.smsId) }}></i></td>
                                            </tr>
                                        );
                                    })
                                    : <tr>
                                        <td colSpan={5} className="text-center">No SMS/MMS Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                    <Row className="mt-3">
                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${campaignReportData?.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + campaignReportData?.length - 1} of ${totalData} entries`}</span></Col>
                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ManageSmsReport);
