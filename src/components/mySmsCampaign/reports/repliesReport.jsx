import React, { useCallback, useEffect, useState } from "react";
import { searchIconTransparent } from "../../../assets/commonFunctions";
import { Col, Row, Table } from "reactstrap";
import { IconButton, InputAdornment, MenuItem, Pagination, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getSmsCampaignsReportRepliesData } from "../../../services/smsCampaignService";

const RepliesReport = ({ csId, smsId }) => {
    const [repliesSmsData, setRepliesSmsData] = useState([])
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(25);
    const [searchSend, setSearchSend] = useState("");
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("id,desc");
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
    const displayRepliesSmsList = useCallback(() => {
        let data = `csId=${csId}&smsId=${smsId}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setRepliesSmsData([]);
        getSmsCampaignsReportRepliesData(data).then(res => {
            if (res?.status === 200) {
                if (res?.result) {
                    setRepliesSmsData(res?.result?.repliesSms || []);
                    setTotalPages(res?.result?.getTotalPages);
                    setTotalData(res?.result?.totalRepliesSms || 0);
                }
            }
        });
    }, [searchSend, csId, smsId, selectedPage, perPage, sort]);
    useEffect(() => {
        displayRepliesSmsList();
    }, [displayRepliesSmsList, csId, smsId, selectedPage, perPage, searchSend]);
    return (
        <Row className="mb-3">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className="mb-3">SMS Replies</h3>
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
                <div className="table-content-wrapper height-58" style={{overflowY:"auto",overflowX:"hidden"}}>
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center" style={{ width: "5%" }}>No</th>
                                <th onClick={() => { handleClickSort("firstName", 1) }}>First Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("lastName", 2) }}>Last Name
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("contact", 3) }}>Contact
                                    <span>
                                        {typeof sortBox[3] !== "undefined"
                                            ? (sortBox[3] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("date", 4) }}>Date
                                    <span>
                                        {typeof sortBox[4] !== "undefined"
                                            ? (sortBox[4] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                repliesSmsData?.length > 0 ?
                                    repliesSmsData?.map((dataValue, dataIndex) => {
                                        return (
                                            <tr key={dataIndex}>
                                                <td className="text-center">{dataIndex + 1}</td>
                                                <td>{dataValue?.firstName}</td>
                                                <td>{dataValue?.lastName}</td>
                                                <td>{dataValue?.contact}</td>
                                                <td>{dataValue?.date}</td>
                                                <td>{dataValue?.details}</td>
                                            </tr>
                                        );
                                    })
                                    : <tr>
                                        <td colSpan={6} className="text-center">No Records Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${repliesSmsData?.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + repliesSmsData?.length - 1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                </Row>
            </Col>
        </Row>
    );
}

export default RepliesReport;