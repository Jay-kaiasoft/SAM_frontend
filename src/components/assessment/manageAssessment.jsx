import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table, Input, FormGroup} from "reactstrap";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {Button, IconButton, InputAdornment, Link, MenuItem, Select, TextField} from "@mui/material"; 
import history from "../../history";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material" 
import {closeAssessment, deleteAssessment, deleteAssessmentGroups, getAssessmentCopy, getAssessmentGroupsList, getAssessmentListPages, saveAssessmentGroups} from "../../services/assessmentService";
import InputField from "../shared/commonControlls/inputField";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions"; 
import {connect} from "react-redux";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import {siteURL} from "../../config/api";
import CopyLink from "../shared/commonControlls/copyLink";
import { handleClickHelp } from '../../assets/commonFunctions';

const useStyles = {
    root: {
        color: "#ffffff !important",
        "&:hover": {
            backgroundColor: "transparent !important"
        }
    },
    textRoot: {
        color: "#ffffff !important",
        "&:hover:before": {
            borderBottomColor: "#ffffff !important"
        },
        "&:before": {
            borderBottomColor: "#ffffff !important"
        },
        "&:after": {
            borderBottomColor: "#ffffff !important"
        },
        "& input::placeholder": {
            color: "#ffffff !important",
            opacity: 1
        }
    }
};

const ManageAssessment = ({globalAlert,confirmDialog,subUser,pendingTransactionData,pendingTransaction}) => {
    const [mainCheckBox, setMainCheckBox] = useState(false);
    const [clickedGroup, setClickedGroup] = useState({"groupId":0,"groupName":""});
    const [groupCheckBox, setGroupCheckBox] = useState([]);
    const [groupCheckBoxGroupIdList, setGroupCheckBoxGroupIdList] = useState([]);
    const [groupDetails, setGroupDetails] = useState([]);
    const [assessmentDetails, setAssessmentDetails] = useState("");
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    const toggleCreateGroup = () => setModalCreateGroup(!modalCreateGroup);
    const [groupName,setGroupName] = useState("");
    const [editGroupData,setEditGroupData] = useState({"groupId":"","groupName":""});
    const [search,setSearch] = useState("");
    const [selectedPage,setSelectedPage] = useState(0);
    const [searchSend,setSearchSend] = useState("");
    const [perPage,setPerPage] = useState(25);
	const [sort,setSort] = useState("assCreatedDate,desc");
	const [totalAssessment,setTotalAssessment] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([true]);
    const [modalLink, setModalLink] = useState(false);
    const toggleLink = useCallback(() => setModalLink(!modalLink),[modalLink]);
    const [link, setLink] = useState({});
    const inputRefs = useRef([createRef()]);
    const mainCheckBoxClicked = () => {
        let flag = mainCheckBox
        setMainCheckBox(!flag)
        const newGroupCheckBox = []
        const newGroupCheckBoxBoxGroupIdList = []
        groupDetails.forEach(element => {
            newGroupCheckBox.push(!flag)
            if(!flag)
                newGroupCheckBoxBoxGroupIdList.push(element.groupId)
        });
        setGroupCheckBox(newGroupCheckBox)
        setGroupCheckBoxGroupIdList(newGroupCheckBoxBoxGroupIdList);
    }
    const groupCheckBoxClicked = (index,groupId) => {
        const newGroupCheckBox = [...groupCheckBox]
        newGroupCheckBox[index] = !newGroupCheckBox[index]
        setGroupCheckBox(newGroupCheckBox)
        if(!newGroupCheckBox[index]){
            setGroupCheckBoxGroupIdList(groupCheckBoxGroupIdList.filter(x => x !== groupId));
        } else {
            setGroupCheckBoxGroupIdList([...groupCheckBoxGroupIdList,groupId]);
        }
        let length = newGroupCheckBox.filter(function (value) {
            return value === true;
        }).length
        if (length !== groupCheckBox.length) {
            setMainCheckBox(false)
        }
    }
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
    const handleClickCreateGroup = () => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let requestData = {
            "groupId": editGroupData.groupId === "" ? 0 : editGroupData.groupId,
            "groupName":groupName,
            "subMemberId":subUser.memberId
        }
        saveAssessmentGroups(requestData).then(res => {
            if (res.status === 200) {
                toggleCreateGroup();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayGroupDetails();
                setEditGroupData({"groupId":"","groupName":""});
                setGroupName("");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickUpdateGroup = () => {
        if(groupCheckBoxGroupIdList.length > 0) {
            let t = groupDetails.filter((v)=>{ return v.groupId === groupCheckBoxGroupIdList[0] })[0];
            setEditGroupData(t);
            setGroupName(t.groupName);
            toggleCreateGroup();
        } else {
            globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
        }
    }
    const handleClickDeleteGroup = () => {
        if(groupCheckBoxGroupIdList.length > 0) {
            confirmDialog({
                open: true,
                title: 'Are you sure you want to delete selected group?',
                onConfirm: () => {
                    let requestData = {
                        "groupId":groupCheckBoxGroupIdList
                    }
                    deleteAssessmentGroups(requestData).then(res => {
                        if (res.status === 200) {
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            setGroupCheckBoxGroupIdList(groupCheckBoxGroupIdList.filter(x => !groupCheckBoxGroupIdList.includes(x)));
                            setGroupDetails((prev)=>prev.filter(x=>!groupCheckBoxGroupIdList.includes(x.groupId)));
                        } else {
                            globalAlert({
                                type: "Error",
                                text: res.message,
                                open: true
                            });
                        }
                    });
                }
            })
        } else {
            globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
        }
    }
    const handleClickEdit = (assId,assStatus) => {
        if(assStatus === 1 || assStatus === 2){
            confirmDialog({
                open: true,
                title: 'Please ensure to save your changes and Re-Publish your Assessment. Please note the URL will be different and Reporting will be reset.',
                onConfirm: () => {
                    getAssessmentCopy(subUser.memberId,assId).then(res => {
                        if (res.status === 200) {
                            history.push("/createassessment?v="+res.result.assId);
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
            history.push("/createassessment?v="+assId);
        }
    }
    const handleClickDelete = (assId) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete assessment?',
            onConfirm: () => {
                let requestData = {
                    "assId": [assId]
                }
                deleteAssessment(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        displayAssessmentList(clickedGroup.groupId);
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
    const handleClickClose = (assId) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to close assessment?',
            onConfirm: () => {
                let requestData = {
                    "assId": [assId]
                }
                closeAssessment(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        displayAssessmentList(clickedGroup.groupId);
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
        let jsLink = `<script type="text/javascript" src="${siteURL}/svscript.js?entid=${link.split("/").pop()}&~t~=assessment"></script>`;
        let embedLink = `<iframe src="${link}" style="border:none;" height="100%" width="100%"></iframe>`;
        setLink({"link":link,"jsLink":jsLink,"embedLink":embedLink});
        toggleLink();
    },[toggleLink])
    const displayGroupDetails = useCallback(() => {
        getAssessmentGroupsList().then(res => {
            if (res.result) {
                if (res.result.assessmentGroupsList.length > 0) {
                    setGroupDetails(res.result.assessmentGroupsList);
                }
            }
        });
    },[]);
    const displayAssessmentList = useCallback((groupId) => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}&assGroupId=${groupId}`;
        setAssessmentDetails("");
        getAssessmentListPages(data).then(res => {
            if (res.result) {
                setAssessmentDetails(res.result);
                setTotalPages(res.result.getTotalPages);
                setTotalAssessment(res.result.totalAssessment)
            }
        });
    },[perPage,searchSend,selectedPage,sort]);
    const groupNameClicked = useCallback((groupId,groupName,index) => {
        setSelectedPage(0);
        setPerPage(25);
        setSort("assCreatedDate,desc");
        setSearch("");
        setSearchSend("");
        setClickedGroup({"groupId":groupId,"groupName":groupName,"index":index});
        const newGroupCheckBox = [];
        newGroupCheckBox[index] = !newGroupCheckBox[index];
        setGroupCheckBox(newGroupCheckBox);
        setGroupCheckBoxGroupIdList([groupId]);
        displayAssessmentList(groupId);
    },[displayAssessmentList]);
    useEffect(() => {
        displayGroupDetails();
    },[displayGroupDetails]);
    useEffect(()=>{
        if(typeof clickedGroup.groupId !== "undefined" && clickedGroup.groupId !== 0){
            displayAssessmentList(clickedGroup.groupId);
        }
    },[clickedGroup.groupId,selectedPage,perPage,searchSend,sort,displayAssessmentList]);
    useEffect(()=>{
        if(pendingTransactionData.length > 0){
            handleClickLink(pendingTransactionData[0].surveyLinkUrl);
            pendingTransaction([]);
        }
    },[handleClickLink,pendingTransactionData,pendingTransaction]);
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>Manage Assessment</h3>
                <Row>
                    <Col xs={12} lg={3}>
                        <div className="icon-wrapper">
                            <CheckPermissionButton module="assessment group" action="add">
                                <Link component="a" className="btn-circle" onClick={()=>toggleCreateGroup()} data-toggle="tooltip" title="Add">
                                    <i className="far fa-users"></i>
                                    <div className="bg-green"></div>
                                </Link>
                            </CheckPermissionButton>
                            {groupCheckBoxGroupIdList.length > 1 ? null :
                                <CheckPermissionButton module="assessment group" action="edit">
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit" onClick={() => { handleClickUpdateGroup()}}>
                                        <i className="far fa-pencil-alt"></i>
                                        <div className="bg-blue"></div>
                                    </Link>
                                </CheckPermissionButton>
                            }
                            <CheckPermissionButton module="assessment group" action="delete">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete" onClick={() => { handleClickDeleteGroup()}}>
                                    <i className="far fa-trash-alt"></i>
                                    <div className="bg-red"></div>
                                </Link>
                            </CheckPermissionButton>
                        </div>
                        <div className="group-styling py-3">
                            <div className="group-aligment-heading">
                                <Input className="group-name" type="checkbox" checked={mainCheckBox}
                                       onChange={() => mainCheckBoxClicked()}/>
                                <span>Group Name</span>
                            </div>
                        </div>
                        <div className="group-name-list">
                            {groupDetails.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className={clickedGroup.groupId === item.groupId ? "group-aligment selected-class" : "group-aligment"} >
                                            <Input className="group-name" type="checkbox" checked={groupCheckBoxGroupIdList.includes(item.groupId)} onChange={() => groupCheckBoxClicked(index,item.groupId)}/>
                                            <div className="group-name-div" onClick={() => {groupNameClicked(item.groupId,item.groupName,index)}}>
                                                {item.groupName}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Col>
                    <Col xs={12} lg={9}>
                        <>
                            <Row>
                                <Col xs={9}>
                                    <div className="icon-wrapper">
                                        <CheckPermissionButton module="assessment" action="add">
                                            <Link component="a" className="btn-circle" onClick={()=>{history.push("/createassessment")}} data-toggle="tooltip" title="Add">
                                                <i className="far fa-plus-square"></i>
                                                <div className="bg-green"></div>
                                            </Link>
                                        </CheckPermissionButton>
                                        <Link component="a" className="btn-circle" onClick={() => { handleClickHelp("Assessment/Features/CreateAssessment/HowtoCreateYourfirstAssessment.html") }} data-toggle="tooltip" title="Help">
                                            <i className="far fa-question-circle"></i>
                                            <div className="bg-grey"></div>
                                        </Link>
                                    </div>
                                </Col>
                                <Col xs={3} className="text-right">
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
                                </Col>
                            </Row>
                            {
                                typeof assessmentDetails.assessmentList !== "undefined" ?
                                    <>
                                        <div className="group-styling">
                                            <div className="group-aligment-heading">
                                                {`${clickedGroup.groupName} (Group ID : ${clickedGroup.groupId})`}
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
                                                                <IconButton sx={useStyles.root} onClick={handleClickSearch}>
                                                                    <SearchIcon />
                                                                </IconButton>
                                                            </InputAdornment>,
                                                        sx:useStyles.textRoot
                                                    }}
                                                    variant="standard"
                                                />
                                            </div>
                                        </div>
                                        <div className="table-content-wrapper">
                                            <div className="contact-table-div">
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th style={{width: 80}}>No</th>
                                                            <th onClick={() => handleClickSort("assName", 1)}>Name
                                                                <span>
                                                                    {typeof sortBox[1] !== "undefined"
                                                                        ? (sortBox[1] === true
                                                                            ? <i className="fad fa-sort-up ml-1"></i>
                                                                            : <i className="fad fa-sort-down ml-1"></i>)
                                                                        : <i className="fad fa-sort ml-1"></i>}
                                                                </span>
                                                            </th>
                                                            <th style={{width: 130}} onClick={() => handleClickSort("assStatus", 2)}>Status
                                                                <span>
                                                                    {typeof sortBox[2] !== "undefined"
                                                                        ? (sortBox[2] === true
                                                                            ? <i className="fad fa-sort-up ml-1"></i>
                                                                            : <i className="fad fa-sort-down ml-1"></i>)
                                                                        : <i className="fad fa-sort ml-1"></i>}
                                                                </span>
                                                            </th>
                                                            <th style={{width: 130}}>Created Date</th>
                                                            <th className="text-center" style={{width: 140}}>Total Responses</th>
                                                            <th className="text-center" style={{width: 150}}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        assessmentDetails.assessmentList.length > 0 ?
                                                            assessmentDetails.assessmentList.map((dataV, dataI) => {
                                                                return (
                                                                    <tr key={dataI}>
                                                                        <td>{dataI + 1}</td>
                                                                        <td>
                                                                            <p className="mb-0">{dataV.assName}</p>
                                                                            <p className="mb-0" style={{fontSize:"12px"}}>{dataV.assAtTotalQuestions} Questions</p>
                                                                        </td>
                                                                        <td>{dataV.assStatus === 0 ? "Drafted" : dataV.assStatus === 1 ? "Published" : dataV.assStatus === 2 ? "Closed" : null}</td>
                                                                        <td>{dataV.assCreatedDate}</td>
                                                                        <td className="text-center">{dataV.totalResponses}</td>
                                                                        <td>
                                                                            <CheckPermissionButton module="assessment" action="edit">
                                                                                <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={()=>{handleClickEdit(dataV.assId,dataV.assStatus)}}></i>
                                                                            </CheckPermissionButton>
                                                                            <CheckPermissionButton module="assessment" action="delete">
                                                                                <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={()=>{handleClickDelete(dataV.assId)}}></i>
                                                                            </CheckPermissionButton>
                                                                            {
                                                                                dataV.assStatus === 1 &&
                                                                                <CheckPermissionButton module="assessment" action="close">
                                                                                    <i className="far fa-eye-slash mr-3" data-toggle="tooltip" title="Close" onClick={()=>{handleClickClose(dataV.assId)}}></i>
                                                                                </CheckPermissionButton>
                                                                            }
                                                                            {
                                                                                (dataV.assStatus === 1 || dataV.assStatus === 2) &&
                                                                                <CheckPermissionButton module="assessment" action="report">
                                                                                    <i className="far fa-chart-pie mr-3" data-toggle="tooltip" title="Report" onClick={() => { history.push(`/assessmentReport?v=${dataV?.id}`) }}></i>
                                                                                </CheckPermissionButton>
                                                                            }
                                                                            {
                                                                                dataV.assStatus === 1 &&
                                                                                <CheckPermissionButton module="assessment" action="link">
                                                                                    <i className="far fa-link" data-toggle="tooltip" title="Link" onClick={()=>{handleClickLink(dataV.assUrl)}}></i>
                                                                                </CheckPermissionButton>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        :
                                                            <tr><td colSpan={6} className="text-center">No Data Found</td></tr>
                                                    }
                                                    </tbody>
                                                </Table>
                                            </div>
                                            <Row className="mt-3">
                                                <Col xs={6}><span className="align-middle pt-2">{`Showing ${assessmentDetails.assessmentList.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+assessmentDetails.assessmentList.length-1} of ${totalAssessment} entries`}</span></Col>
                                                <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                                            </Row>
                                        </div>
                                    </>
                                :
                                    (typeof assessmentDetails.assessmentList === "undefined" && clickedGroup.groupId === 0) ?
                                        <Row style={{height:"50vh"}} className="row align-items-center">
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                                <p>Please click on a group</p>
                                            </Col>
                                        </Row>
                                    :
                                        null
                            }
                        </>
                    </Col>
                </Row>
            </Col>
            <Modal isOpen={modalCreateGroup} toggle={()=> { toggleCreateGroup();setEditGroupData({"groupId":"","groupName":""});setGroupName(""); }}>
                <ModalHeader toggle={()=> { toggleCreateGroup();setEditGroupData({"groupId":"","groupName":""});setGroupName(""); }}>{ editGroupData.groupId === "" ? "Add" : "Edit" } Group</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="groupName"
                                    name="groupName"
                                    label="Group Name"
                                    onChange={(name,value)=>{setGroupName(value)}}
                                    value={groupName}
                                    validation={"required"}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={handleClickCreateGroup} className="mr-3">{ editGroupData.groupId === "" ? "CREATE" : "SAVE" }</Button>
                    <Button variant="contained" color="primary" onClick={()=> { toggleCreateGroup();setEditGroupData({"groupId":"","groupName":""});setGroupName(""); }}>CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal size="lg" isOpen={modalLink} toggle={toggleLink}>
                <ModalHeader toggle={toggleLink}>Published Link</ModalHeader>
                <ModalBody>
                    <h4>Assessment Publishing Options</h4>
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
        </Row>
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
export default connect(mapStateToProps,mapDispatchToProps)(ManageAssessment);