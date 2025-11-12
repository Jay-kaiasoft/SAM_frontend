import React, {useCallback, useEffect, useState} from "react";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {Button, IconButton, InputAdornment, Link, MenuItem, Select, TextField} from "@mui/material";
import history from "../../history";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material"
import {closeSurvey, deleteSurvey, getSurveyCopy, getSurveyListPages} from "../../services/surveyService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {connect} from "react-redux";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import {siteURL} from "../../config/api";
import CopyLink from "../shared/commonControlls/copyLink";
import {handleClickHelp, searchIconTransparent} from "../../assets/commonFunctions";

const ManageSurvey = ({subUser,globalAlert,confirmDialog,pendingTransactionData,pendingTransaction}) => {
    const [data, setData] = useState({});
    const [search,setSearch] = useState("");
    const [selectedPage,setSelectedPage] = useState(0);
    const [searchSend,setSearchSend] = useState("");
    const [perPage,setPerPage] = useState(25);
    const [sort,setSort] = useState("sryCreatedDate,desc");
    const [totalData,setTotalData] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const [modalLink, setModalLink] = useState(false);
    const toggleLink = useCallback(() => setModalLink(!modalLink),[modalLink]);
    const [link, setLink] = useState({});
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
    const handleClickEdit = (sryId,sryStatus) => {
        if(sryStatus === 1 || sryStatus === 2){
            confirmDialog({
                open: true,
                title: 'Please ensure to save your changes and Re-Publish your Survey. Please note the URL will be different and Reporting will be reset.',
                onConfirm: () => {
                    getSurveyCopy(subUser.memberId,sryId).then(res => {
                        if (res.status === 200) {
                            history.push("/createsurvey?v="+res.result.sryId);
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
        } else {
            history.push("/createsurvey?v="+sryId);
        }
    }
    const handleClickDelete = (sryId) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete survey?',
            onConfirm: () => {
                let requestData = {
                    "sryId": [sryId]
                }
                deleteSurvey(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        setData((prev)=>{ return prev.filter((v)=>{ return v.sryId !== sryId}); });
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
    const handleClickClose = (sryId) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to close survey?',
            onConfirm: () => {
                let requestData = {
                    "sryId": [sryId]
                }
                closeSurvey(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        displaySurvey();
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
    const handleClickLink = useCallback((link) => {
        let jsLink = `<script type="text/javascript" src="${siteURL}/svscript.js?entid=${link.split("/").pop()}&~t~=survey"></script>`;
        let embedLink = `<iframe src="${link}" style="border:none;" height="100%" width="100%"></iframe>`;
        setLink({"link":link,"jsLink":jsLink,"embedLink":embedLink});
        toggleLink();
    },[toggleLink])
    const displaySurvey = useCallback(()=>{
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        getSurveyListPages(data).then(res => {
            if (res.result) {
                setData(res.result.surveyList);
                setTotalPages(res.result.getTotalPages);
                setTotalData(res.result.totalSurvey);
            }
        });
    }, [searchSend,selectedPage,perPage,sort]);
    useEffect(()=>{
        displaySurvey();
    },[displaySurvey, selectedPage,perPage,searchSend]);
    useEffect(()=>{
        if(pendingTransactionData.length > 0){
            handleClickLink(pendingTransactionData[0].surveyLinkUrl);
            pendingTransaction([]);
        }
    },[handleClickLink,pendingTransactionData,pendingTransaction]);
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="d-inline-block mb-0 align-middle">Survey</h3>
                    <div className="icon-wrapper d-inline-block mx-5">
                        <CheckPermissionButton module="surveys" action="add">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/createsurvey")}}>
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </CheckPermissionButton>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text" onClick={()=>{handleClickHelp("Survey/Features/publishsurvey/HowtoPublishYourSurvey.html")}}>
                            <i className="far fa-question-circle"></i>
                            <div className="bg-grey"></div>
                        </Link>
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
                    <div className="table-content-wrapper height-58 overflow-auto">
                        <Table striped>
                            <thead>
                            <tr>
                                <th style={{width:80}}>No</th>
                                <th onClick={()=>{handleClickSort("sryName",1)}}>Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th style={{width:200}} onClick={()=>{handleClickSort("sryStatus",2)}}>Status
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th style={{width:200}}>Created Date</th>
                                <th className="text-center" style={{width:200}}>Total Responses</th>
                                <th className="text-center" style={{width:150}}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data.length > 0 ?
                                    data.map((dataV, dataI)=>{
                                        return (
                                            <tr key={dataI}>
                                                <td>{dataI + 1}</td>
                                                <td>
                                                    <p className="mb-0">{dataV.sryName}</p>
                                                    <p className="mb-0" style={{fontSize:"12px"}}>{dataV.sryStTotalQuestions} Questions</p>
                                                </td>
                                                <td>{dataV.sryStatus === 0 ? "Drafted" : dataV.sryStatus === 1 ? "Published" : dataV.sryStatus === 2 ? "Closed" : null}</td>
                                                <td>{dataV.sryCreatedDate}</td>
                                                <td className="text-center">{dataV.totalResponses}</td>
                                                <td>
                                                    <CheckPermissionButton module="surveys" action="edit">
                                                        <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={()=>{handleClickEdit(dataV.sryId,dataV.sryStatus)}}></i>
                                                    </CheckPermissionButton>
                                                    <CheckPermissionButton module="surveys" action="delete">
                                                        <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={()=>{handleClickDelete(dataV.sryId)}}></i>
                                                    </CheckPermissionButton>
                                                    {
                                                        dataV.sryStatus === 1 &&
                                                        <CheckPermissionButton module="surveys" action="close">
                                                            <i className="far fa-eye-slash mr-3" data-toggle="tooltip" title="Close" onClick={()=>{handleClickClose(dataV.sryId)}}></i>
                                                        </CheckPermissionButton>
                                                    }
                                                    {
                                                        (dataV.sryStatus === 1 || dataV.sryStatus === 2) &&
                                                        <CheckPermissionButton module="surveys" action="report">
                                                            <i className="far fa-chart-pie mr-3" data-toggle="tooltip" title="Report" onClick={() => {history.push(`/surveyReport?v=${dataV?.id}`)}}></i>
                                                        </CheckPermissionButton>
                                                    }
                                                    {
                                                        dataV.sryStatus === 1 &&
                                                            <CheckPermissionButton module="surveys" action="link">
                                                                <i className="far fa-link" data-toggle="tooltip" title="Link" onClick={()=>{handleClickLink(dataV.sryUrl)}}></i>
                                                            </CheckPermissionButton>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    : <tr><td colSpan={6} className="text-center">No Data Found</td></tr>
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
            <Modal size="lg" isOpen={modalLink} toggle={toggleLink}>
                <ModalHeader toggle={toggleLink}>Published Link</ModalHeader>
                <ModalBody>
                    <h4>Survey Publishing Options</h4>
                    <p className="font-weight-bold">Put javascript snippet below to into your website home page</p>
                    <TextField
                        name="jsLink"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link.jsLink}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="jsLink" iconSelector="copyJsLink"/> }}
                        variant="standard"
                    />
                    <p className="font-weight-bold mt-5">Send Link in Email or Text</p>
                    <TextField
                        name="link"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link.link}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="link" iconSelector="copyLink"/> }}
                        variant="standard"
                    />
                    <p className="font-weight-bold mt-5">Embed in Your Page</p>
                    <TextField
                        name="embedLink"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link.embedLink}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="embedLink" iconSelector="copyEmbedLink"/> }}
                        variant="standard"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleLink()} className="ml-3 publishGTCancel">CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser,
        pendingTransactionData: state.pendingTransaction
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
        pendingTransaction: (data) => {dispatch(setPendingTransactionAction(data))}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ManageSurvey);