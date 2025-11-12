import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row, Table } from 'reactstrap';
import { Button, Checkbox, FormControlLabel, IconButton, InputAdornment, MenuItem, Pagination, Select, Tab, Tabs, TextField } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { a11yProps, searchIconTransparent, TabPanel } from '../../assets/commonFunctions';
import { getAffiliateProgramBillsListPage, getAffiliateProgramListPage, setAgreeAffiliateProgram } from '../../services/profileService';
import { siteURL, websiteTitleWithExt } from '../../config/api';
import $ from 'jquery';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { connect } from 'react-redux';
import { userLoggedIn } from '../../actions/userActions';

const AffiliateProgram = ({ globalAlert, user, userLoggedIn}) => {
    const [data, setData] = useState([]);
    const [commissionData, setCommissionData] = useState([]);
    const [totalCommission, setTotalCommission] = useState({"commission": 0, "pendingCommission": 0});
    const [search,setSearch] = useState("");
    const [selectedPage,setSelectedPage] = useState(0);
    const [searchSend,setSearchSend] = useState("");
    const [perPage,setPerPage] = useState(25);
    const [sort,setSort] = useState("apTitle,asc");
    const [totalData,setTotalData] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const [agreeCheck, setAgreeCheck] = useState(user?.agreeAffiliateProgram === "Y" || false);
    const [tabValue, setTabValue] = useState(0);

    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
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
    const displayAffiliateProgram = useCallback(()=>{
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        if(tabValue === 0) {
            getAffiliateProgramListPage(data).then(res => {
                if (res.result) {
                    setData(res.result.affiliateProgram);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.totalAffiliateProgram);
                }
            });
        } else {
            getAffiliateProgramBillsListPage(data).then(res => {
                if (res.result) {
                    setCommissionData(res.result.affiliateProgramBills);
                    setTotalPages(res.result.getTotalPages);
                    setTotalData(res.result.totalAffiliateProgramBills);
                    setTotalCommission({
                        "commission": res.result.commission,
                        "pendingCommission": res.result.pendingCommission
                    });
                }
            });
        }
    }, [searchSend,selectedPage,perPage,sort]);
    const handleCopyLink = (code, index) => {
        let url = `${siteURL}/register?w=${code}`;
        navigator.clipboard.writeText(url).then(() => {
            let iconSelector = `copy-link-${index}`;
            document.querySelector("#" + iconSelector).setAttribute("data-original-title", "Copied Link");
            $("#" + iconSelector).tooltip('hide');
            $("#" + iconSelector).tooltip('show');
            setTimeout(() => {
                document.querySelector("#" + iconSelector).setAttribute("data-original-title", "Copy Link");
            }, 1500);
        });
    };
    const handleClickAgree = () => {
        if(agreeCheck) {
            setAgreeAffiliateProgram().then(res => {
                if (res.status === 200) {
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    userLoggedIn({ ...user, "agreeAffiliateProgram": "Y" });
                    sessionStorage.setItem('user', JSON.stringify({ ...user, "agreeAffiliateProgram": "Y" }));
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        } else {
            globalAlert({
                type: "Error",
                text: "Please agree to the terms and conditions",
                open: true
            });
        }
    };
    const handleChangeTab = (event, newValue) => {
        setSearch("");
        setSearchSend("");
        setSelectedPage(0);
        setPerPage(25);
        setTabValue(newValue);
        if (newValue === 0) {
            setSort("apTitle,asc");
        } else {
            setSort("apbId,asc");
        }
    };

    useEffect(()=>{
        displayAffiliateProgram();
    },[displayAffiliateProgram, selectedPage,perPage,searchSend,tabValue]);

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>Affiliate Program</h3>
                {
                    user?.agreeAffiliateProgram === "N" ?
                        <Col xs={12} sm={12} md={8} lg={8} xl={8} className='mx-auto d-flex flex-column justify-content-center' style={{ height: "calc(100vh - 200px)" }}>
                            <p>By joining the {websiteTitleWithExt} Affiliate Program, you agree to promote our services legally and without spam.</p>
                            <p>Commissions are earned on valid referrals only (no self-referrals, refunds, or fraud). Payments are made via Bank Transfer once you reach the minimum payout.</p>
                            <p>We may suspend or terminate accounts that misuse email marketing, break the law, or harm our brand.</p>
                            <FormControlLabel control={<Checkbox color="primary" checked={agreeCheck} onChange={(e)=>{setAgreeCheck(e.target.checked)}} />} label="I have read and agree to the Affiliate Program Terms & Conditions" />
                            <div className='mt-3'>
                                <Button variant="contained" color="primary" onClick={handleClickAgree} >AGREE</Button>
                            </div>
                        </Col>
                    :
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Tabs
                                        color="black"
                                        value={tabValue}
                                        onChange={handleChangeTab}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                    >
                                        <Tab label="List" {...a11yProps(0)} />
                                        <Tab label="Commission" {...a11yProps(1)} />
                                    </Tabs>
                                </Col>
                            </Row>
                            <TabPanel value={tabValue} index={0}>
                                <div className="top-button mb-2">
                                    <div>
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
                                    <div>
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
                                <div className="table-content-wrapper overflow-auto" style={{maxHeight: "calc(100vh - 355px)"}}>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th style={{width:80}}>No</th>
                                                <th onClick={()=>{handleClickSort("apTitle",1)}}>Name
                                                    <span>
                                                        {typeof sortBox[1] !== "undefined"
                                                            ? (sortBox[1] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                                <th onClick={()=>{handleClickSort("apCommissionType",2)}}>Type
                                                    <span>
                                                        {typeof sortBox[2] !== "undefined"
                                                            ? (sortBox[2] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                                <th onClick={()=>{handleClickSort("apCommission",3)}}>Commission
                                                    <span>
                                                        {typeof sortBox[3] !== "undefined"
                                                            ? (sortBox[3] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                                <th className='text-center' style={{width:80}}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.length > 0 ?
                                                    data.map((dataV, dataI)=>{
                                                        return (
                                                            <tr key={dataI}>
                                                                <td>{dataI + 1}</td>
                                                                <td>{dataV.apTitle}</td>
                                                                <td>{dataV.apCommissionType === 1 ? "Percentage" : "Amount"}</td>
                                                                <td>{dataV.apCommission}</td>
                                                                <td className="text-center">
                                                                    <i id={`copy-link-${dataI}`} className="far fa-link" data-toggle="tooltip" title="Copy Link" onClick={() => handleCopyLink(dataV.apCode, dataI)}></i>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                : 
                                                    (
                                                        <tr>
                                                            <td colSpan={5} className="text-center">No Data Found</td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <Row className="mt-3">
                                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${data.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+data.length-1} of ${totalData} entries`}</span></Col>
                                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                                </Row>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <div className="top-button mb-2">
                                    <div className="align-middle">Commission : {totalCommission.commission} <Button variant="contained" color="primary" className='ml-3' onClick={()=>{}} disabled={true}>WITHDRAW</Button></div>
                                    <div className="align-middle">Pending Commission : {totalCommission.pendingCommission}</div>
                                </div>
                                <div className="top-button mb-2">
                                    <div>
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
                                    <div>
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
                                <div className="table-content-wrapper overflow-auto" style={{maxHeight: "calc(100vh - 395px)"}}>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th style={{width:80}}>No</th>
                                                <th>Member Name</th>
                                                <th onClick={()=>{handleClickSort("apbTitle",2)}}>Name
                                                    <span>
                                                        {typeof sortBox[2] !== "undefined"
                                                            ? (sortBox[2] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                                <th onClick={()=>{handleClickSort("apbCommissionType",3)}}>Type
                                                    <span>
                                                        {typeof sortBox[3] !== "undefined"
                                                            ? (sortBox[3] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                                <th onClick={()=>{handleClickSort("apbCommissionAmount",4)}}>Commission
                                                    <span>
                                                        {typeof sortBox[4] !== "undefined"
                                                            ? (sortBox[4] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                                <th onClick={()=>{handleClickSort("apbStatus",5)}}>Status
                                                    <span>
                                                        {typeof sortBox[5] !== "undefined"
                                                            ? (sortBox[5] === true
                                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                                : <i className="fad fa-sort-down ml-1"></i> )
                                                            : <i className="fad fa-sort ml-1"></i>}
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                commissionData.length > 0 ?
                                                    commissionData.map((dataV, dataI)=>{
                                                        return (
                                                            <tr key={dataI}>
                                                                <td>{dataI + 1}</td>
                                                                <td>{dataV.toMemberName}</td>
                                                                <td>{dataV.apbTitle}</td>
                                                                <td>{dataV.apbCommissionType === 1 ? "Percentage" : "Amount"}</td>
                                                                <td>{dataV.apbCommissionAmount}</td>
                                                                <td>{dataV.apbStatus}</td>
                                                            </tr>
                                                        );
                                                    })
                                                : 
                                                    (
                                                        <tr>
                                                            <td colSpan={6} className="text-center">No Data Found</td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <Row className="mt-3">
                                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${commissionData.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+commissionData.length-1} of ${totalData} entries`}</span></Col>
                                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                                </Row>
                            </TabPanel>
                        </Col>
                }
            </Col>
        </Row>
    );
};
const mapStateToProps = state => {
    return {
        user:state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AffiliateProgram);