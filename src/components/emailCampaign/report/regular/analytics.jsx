import React, { Fragment, useCallback, useEffect, useState } from "react"
import { connect } from "react-redux";
import {normalizeUrl, searchIconTransparent} from "../../../../assets/commonFunctions";
import { IconButton, InputAdornment, Link, MenuItem, Select, TextField, Pagination } from "@mui/material";
import { Col, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap";
import SearchIcon from "@mui/icons-material/Search";
import { getEmailCampaignsMemberOpenListPage} from "../../../../services/emailCampaignService";
import { setGlobalAlertAction } from "../../../../actions/globalAlertActions";
import { getEmailCampaignOpenMemberLink, grabAnalyticsCsvData } from "../../../../services/analyticsService";
import { grabAnalyticsCsvPolling } from "../../../../services/pollingservices";

const Analytics = ({ globalAlert, id, campId }) => {
    const [perPage, setPerPage] = useState(25);
    const [selectedPage, setSelectedPage] = useState(0);
    const [search, setSearch] = useState("");
    const [sortBox, setSortBox] = useState([true]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [membersData, setMembersData] = useState([])
    const [callbackAttributes, setCallbackAttributes] = useState({
        searchSend: "",
        perPage: "25",
        selectedPage: "0",
        sort: "firstName,asc"
    });
    const [visitedLinkModal, setVisitedLinkModal] = useState(false);
    const toggleVisitedLinkModal = () => { setVisitedLinkModal(!visitedLinkModal); }
    const [selectedMemberLinkData, setSelectedMemberLinkData] = useState({});
    const [csvDownloadProcess, setCsvDownloadCsvProcess] = useState("not_started");
    const [csvDownloadFileUrl, setCsvDownloadFileUrl] = useState("");
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
    const displayMembersList = useCallback(() => {
        const { searchSend, selectedPage, perPage, sort } = callbackAttributes
        let data = `id=${id}&campId=${campId}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setMembersData([])
        getEmailCampaignsMemberOpenListPage(data).then(async res => {
            if (res.status === 200) {
                if (res.result) {
                    const { emailCampaignsReportMembers } = res.result;
                    const tempEmailCampaignsReportMembers = await Promise.all(
                        emailCampaignsReportMembers.map(async (user) => {
                            let requestData = {
                                "emailId": user.emailId,
                                "campId": campId
                            };
                            const response = await getEmailCampaignOpenMemberLink(requestData);
                            let allLinks = response.result?.links?.map(item => normalizeUrl(item)) || [];
                            allLinks = [...new Set(allLinks)];
                            let tempUrl = allLinks.slice(0,8).map((link,i) => { return { [`url${i+1}`]: link } });
                            if(tempUrl.length < 8) {
                                for(let j = tempUrl.length; j < 8; j++) {
                                    tempUrl.push({ [`url${j+1}`]: "" });
                                }
                            }
                            let tempUser = user;
                            tempUrl.forEach(item => {
                                tempUser = { ...tempUser, ...item };
                            });
                            return { ...tempUser };
                        })
                    );
                    setMembersData(tempEmailCampaignsReportMembers);
                    setTotalPages(res?.result?.getTotalPages);
                    setTotalData(res?.result?.totalCampaignsSendEmail);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [callbackAttributes, globalAlert, id, campId]);

    const startPollingForCsv = () => {
        setCsvDownloadCsvProcess("in_progress");
        const pollingInterval = setInterval(() => {
            grabAnalyticsCsvPolling(campId).then(res => {
                if(res.status === 200) {
                    setCsvDownloadCsvProcess(res.result.status);
                    if(res.result.status === "completed") {
                        setCsvDownloadFileUrl(res.result.csvUrl);
                        clearInterval(pollingInterval);
                    }
                }
            });
        }, 5000);
    }

    const downloadCsvFile = () => {
        if(csvDownloadFileUrl) {
            const link = document.createElement('a');
            link.href = csvDownloadFileUrl;
            link.setAttribute('download', `email_campaign_${campId}_analytics.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const startCsvProcess = () => {
        grabAnalyticsCsvData(campId).then(res => {
            if(res.status === 200) {
                startPollingForCsv();
            }
        });
    }
    useEffect(() => {
        displayMembersList();
    }, [displayMembersList, callbackAttributes]);

    useEffect(() => {
        grabAnalyticsCsvPolling(campId).then(res => {
            if(res.status === 200) {
                setCsvDownloadCsvProcess(res.result.status);
                if(res.result.status === "completed") {
                    setCsvDownloadFileUrl(res.result.csvUrl);
                } else if(res.result.status === "in_progress") {
                    startPollingForCsv();
                }
            }
        });
    }, []);

    return (
        <div>
            <div className="top-button">
                <div>
                    { 
                        membersData?.length > 0 && (
                            csvDownloadProcess === "not_started" ?
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export To CSV" onClick={()=>{startCsvProcess()}}>
                                <i className="far fa-file-csv"></i>
                                <div className="bg-green"></div>
                            </Link>:null
                        )
                    }
                    { 
                        membersData?.length > 0 && (
                            csvDownloadProcess === "in_progress" ?
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="In Progerss" onClick={()=>{}}>
                                <i className="fad fa-spinner-third fa-spin" style={{padding: 5}}></i>
                                <div className="bg-green"></div>
                            </Link>:null
                        )
                    }
                    { 
                        membersData?.length > 0 && (
                            csvDownloadProcess === "completed" ?
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Download" onClick={()=>{downloadCsvFile()}}>
                                <i className="far fa-download" style={{padding: 5}}></i>
                                <div className="bg-green"></div>
                            </Link>:null
                        )
                    }
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
                            <th width="5%" align="left">No</th>
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
                            <th width="15%" align="left">Mobile</th>
                            <th width="10%" align="left">Total Open</th>
                            {/* <th width="10%" align="left">Actions</th> */}
                            <th width="10%" align="left">URL 1</th>
                            <th width="10%" align="left">URL 2</th>
                            <th width="10%" align="left">URL 3</th>
                            <th width="10%" align="left">URL 4</th>
                            <th width="10%" align="left">URL 5</th>
                            <th width="10%" align="left">URL 6</th>
                            <th width="10%" align="left">URL 7</th>
                            <th width="10%" align="left">URL 8</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            membersData?.length > 0 ?
                                membersData?.map((value, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{value?.firstName}</td>
                                                <td>{value?.lastName}</td>
                                                <td>{value?.email}</td>
                                                <td>{value?.phoneNumber}</td>
                                                <td>{value?.totalOpen}</td>
                                                <td>{value?.url1}</td>
                                                <td>{value?.url2}</td>
                                                <td>{value?.url3}</td>
                                                <td>{value?.url4}</td>
                                                <td>{value?.url5}</td>
                                                <td>{value?.url6}</td>
                                                <td>{value?.url7}</td>
                                                <td>{value?.url8}</td>
                                            </tr>
                                        </Fragment>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={15} className="text-center">No Data Found.</td>
                                </tr>
                        }
                    </tbody>
                </Table>
            </div>
            <Row className="mt-3">
                <Col xs={6}><span className="align-middle pt-2">{`Showing ${membersData?.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + membersData?.length - 1} of ${totalData} entries`}</span></Col>
                <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
            </Row>
            <Modal isOpen={visitedLinkModal} size="lg">
                <ModalHeader toggle={toggleVisitedLinkModal}>Visited Link Report</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={6}><b>Name</b> : <span>{selectedMemberLinkData?.firstName} {selectedMemberLinkData?.lastName}</span></Col>
                        <Col xs={6}><b>Total Open</b> : <span>{selectedMemberLinkData?.totalOpen}</span></Col>
                        <Col xs={6}><b>Email</b> : <span>{selectedMemberLinkData?.email}</span></Col>
                        <Col xs={6}><b>Mobile</b> : <span>{selectedMemberLinkData?.phoneNumber}</span></Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <div className="table-content-wrapper">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>Visited Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedMemberLinkData?.links?.length > 0 ?
                                            selectedMemberLinkData?.links?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item}</td>
                                                    </tr>
                                                )
                                            }) :
                                            <tr>
                                                <td className="text-center">No Data Found</td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Analytics);