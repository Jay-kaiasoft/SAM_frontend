import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Table } from 'reactstrap';
import { IconButton, InputAdornment, MenuItem, Pagination, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { dateTimeFormat, searchIconTransparent } from "../../../assets/commonFunctions";
import DetailsModal from "./detailsModal";
import { getSmsCampaignsReportsNotSentData } from "../../../services/smsCampaignService";

const NotSend = ({ csId, smsId }) => {
    const [notSentSmsData, setNotSentSmsData] = useState([])
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(25);
    const [searchSend, setSearchSend] = useState("");
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("id,desc");
    const [totalData, setTotalData] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const [detailsModal, setDetailsModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const toggleDetailsModal = (errorMessage) => {
        setDetailsModal((prevState) => (!prevState));
        setErrorMessage(errorMessage)
    }
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
    const displayNotSendSmsList = useCallback(() => {
        let data = `csId=${csId}&smsId=${smsId}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setNotSentSmsData([]);
        getSmsCampaignsReportsNotSentData(data).then(res => {
            if (res?.status === 200) {
                if (res?.result) {
                    setNotSentSmsData(res?.result?.notSentSmsData);
                    setTotalPages(res?.result?.getTotalPages);
                    setTotalData(res?.result?.totalNotSentSms);
                }
            }
        });
    }, [searchSend, csId, smsId, selectedPage, perPage, sort]);
    useEffect(() => {
        displayNotSendSmsList();
    }, [displayNotSendSmsList, csId, smsId, selectedPage, perPage, searchSend]);
    return (
        notSentSmsData?.length > 0 ?
            <Row className="mb-3">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="mb-3">Not Send</h3>
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
                                    <th className="text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    notSentSmsData?.map((dataValue, dataIndex) => {
                                        return (
                                            <tr key={dataIndex}>
                                                <td className="text-center">{dataIndex + 1}</td>
                                                <td>{dataValue.firstName}</td>
                                                <td>{dataValue.lastName}</td>
                                                <td>{dataValue.contact}</td>
                                                <td>{dateTimeFormat(dataValue.date)}</td>
                                                <td className="text-center" style={{ fontSize: 18 }} onClick={() => toggleDetailsModal(dataValue?.errorMessage)}>
                                                    <i className="fal fa-info-circle"></i>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                    <Row className="mt-3">
                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${notSentSmsData?.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + notSentSmsData?.length - 1} of ${totalData} entries`}</span></Col>
                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                    </Row>
                </Col>
                <DetailsModal detailsModal={detailsModal} toggleDetailsModal={() => toggleDetailsModal("")} details={errorMessage} />
            </Row>
        : null
    );

}

export default NotSend;
