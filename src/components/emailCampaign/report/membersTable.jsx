import React, { Fragment, useState } from "react"
import {dateTimeFormat, searchIconTransparent} from "../../../assets/commonFunctions";
import { IconButton, InputAdornment, Link, MenuItem, Select, TextField, Pagination } from "@mui/material";
import { Col, Row, Table } from "reactstrap";
import SearchIcon from "@mui/icons-material/Search";

const MembersTable = ({
    membersData,
    setCallbackAttributes,
    totalData,
    totalPages,
    setView,
    handleClickExportToExcel,
    type,
    showViewChangeButtons = false
}) => {
    const [expandRow, setExpandRow] = useState({
        "0": false
    })
    const [perPage, setPerPage] = useState(25);
    const [selectedPage, setSelectedPage] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBox, setSortBox] = useState([true]);
    const handleChangeCallbackAttributes = (name, value) => {
        setCallbackAttributes((prev => {
            return {
                ...prev,
                [name]: value
            }
        }))
    }

    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
        handleChangeCallbackAttributes("perPage", event.target.value)
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        handleChangeCallbackAttributes("selectedPage", 0);
        handleChangeCallbackAttributes("searchSend", search)
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
        handleChangeCallbackAttributes("sort", name);
    }
    const handleChangePagination = (event, value) => {
        setSelectedPage(value - 1);
        handleChangeCallbackAttributes("selectedPage", value - 1);
    }
    return (
        <div>
            <div className="top-button">
                <div>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export Member To Excel" onClick={()=>{handleClickExportToExcel(type)}}>
                        <i className="far fa-file-excel"></i>
                        <div className="bg-green"></div>
                    </Link>
                    {showViewChangeButtons ? <Link component="a" className="btn-circle ml-2" data-toggle="tooltip" title="List View" onClick={() => { setView("table") }}>
                        <i className="far fa-list"></i>
                        <div className="bg-dark-grey"></div>
                    </Link> : null}
                    {showViewChangeButtons ? <Link component="a" className="btn-circle ml-2" data-toggle="tooltip" title="Grid View" onClick={() => { setView("grid") }}>
                        <i className="far fa-border-all"></i>
                        <div className="bg-dark-grey"></div>
                    </Link> : null}
                </div>
                <div className="d-flex align-items-center">
                    <div className="mr-4">
                        <span>Show</span>
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
                        <span>entries</span>
                    </div>
                    <div>
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
            </div>
        <div className="table-content-wrapper height-58 overflow-auto mt-2">
            <Table striped>
                <thead>
                    <tr>
                        <th></th>
                        <th width="10%" align="left">No</th>
                        <th key={0} onClick={()=>{handleClickSort("firstName",0)}} width="15%" align="left">First Name
                            <span>
                                {typeof sortBox[0] !== "undefined"
                                    ? (sortBox[0] === true
                                        ? <i className="fad fa-sort-up ml-1"></i>
                                        : <i className="fad fa-sort-down ml-1"></i> )
                                    : <i className="fad fa-sort ml-1"></i>}
                            </span>
                        </th>
                        <th key={1} onClick={()=>{handleClickSort("lastName",1)}} width="15%" align="left">Last Name
                            <span>
                                {typeof sortBox[1] !== "undefined"
                                    ? (sortBox[1] === true
                                        ? <i className="fad fa-sort-up ml-1"></i>
                                        : <i className="fad fa-sort-down ml-1"></i> )
                                    : <i className="fad fa-sort ml-1"></i>}
                            </span>
                        </th>
                        <th key={2} onClick={()=>{handleClickSort("email",2)}} width="30%" align="left">Email
                            <span>
                                {typeof sortBox[2] !== "undefined"
                                    ? (sortBox[2] === true
                                        ? <i className="fad fa-sort-up ml-1"></i>
                                        : <i className="fad fa-sort-down ml-1"></i> )
                                    : <i className="fad fa-sort ml-1"></i>}
                            </span>
                        </th>
                        <th width="15%" align="left">Total Open</th>
                        <th width="15%" align="left">Unsubscribe Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        membersData?.length > 0 ?
                            membersData?.map((value, index) => {
                                return (
                                    <Fragment key={index}>
                                        <tr>
                                            {value?.countTotalClick > 0 ? <td align="center">
                                                {expandRow[index] ?
                                                    <i className="far fa-minus" onClick={() => {
                                                        setExpandRow((prev) => {
                                                            return {
                                                                ...prev,
                                                                [index]: false
                                                            }
                                                        })
                                                    }}></i> : <i className="far fa-plus" onClick={() => {
                                                        setExpandRow((prev) => {
                                                            return {
                                                                ...prev,
                                                                [index]: true
                                                            }
                                                        })
                                                    }}></i>}
                                            </td> : <td></td>}
                                            <td>{index+1}</td>
                                            <td>{value?.firstName}</td>
                                            <td>{value?.lastName}</td>
                                            <td>{value?.email}</td>
                                            <td>{value?.totalOpen}</td>
                                            <td>{value?.unsubscribeDate === "" ? "-" : dateTimeFormat(value?.unsubscribeDate)}</td>
                                        </tr>
                                        {expandRow[index] ?
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className="d-flex flex-column w-75 w-sm-50 m-2">
                                                        <div className="d-flex flex-row border-bottom p-2">
                                                            <div className="w-75"><strong>Link</strong></div>
                                                            <div className="w-25 text-center"><strong>Link Clicked</strong></div>
                                                        </div>
                                                        {value?.linkDetail?.map((link, index) => {
                                                            return (
                                                                <div className="d-flex flex-row border-bottom p-2" key={index}>
                                                                    <div className="w-75">{link?.link}</div>
                                                                    <div className="w-25 text-center">{link?.linkClicked}</div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </td>
                                            </tr> : null}
                                    </Fragment>
                                );
                            })
                            :
                            <tr>
                                <td colSpan={7} className="text-center">No Data Found.</td>
                            </tr>
                    }
                </tbody>
            </Table>
            </div>
            <Row className="mt-3">
                <Col xs={6}><span className="align-middle pt-2">{`Showing ${membersData?.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + membersData?.length - 1} of ${totalData} entries`}</span></Col>
                <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
            </Row>
        </div>
    )
}

export default MembersTable