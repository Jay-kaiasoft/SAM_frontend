import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Col, Row, Table, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import ReactFlow, {useNodesState, useEdgesState, Controls} from 'reactflow';
import { getAutomationList, deleteAutomation, stopAutomationById, startAutomationById, copyAutomationById } from '../../services/automationService';
import { IconButton, InputAdornment, Link, MenuItem, Select, TextField, Pagination, Button } from '@mui/material';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { connect } from 'react-redux';
import { setConfirmDialogAction } from '../../actions/confirmDialogActions';
import SearchIcon from "@mui/icons-material/Search";
import history from "../../history";
import {dateTimeFormat, getClientTimeZone, handleClickHelp, searchIconTransparent} from "../../assets/commonFunctions";
import { nodeTypes, edgeTypes } from './util';

const ManageAutomation = ({
    user,
    globalAlert,
    confirmDialog
}) => {
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("id,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [search, setSearch] = useState("");
    const [searchSend, setSearchSend] = useState("");
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [automationList, setAutomationList] = useState([])
    const [totalData, setTotalData] = useState(0)
    const [previewModal, setPreviewModal] = useState(false)
    const [amJSON, setAmJSON] = useState("")
    const togglePreviewModal = useCallback(()=>{
        setPreviewModal(prev=>!prev)
    }, []);
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
        setSearchSend(search)
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
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        const newTableCheckBoxValueList = []
        automationList.forEach(element => {
            if (!flag)
                newTableCheckBoxValueList.push(element.amId)
        });
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }
    const tableCheckBox = (id) => {
        let checkLength = 0;
        if (tableCheckBoxValueList.includes(id)) {
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
            checkLength = tableCheckBoxValueList.length-1;
            
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList, id]);
            checkLength = tableCheckBoxValueList.length+1;
        }
        if (automationList.length !== checkLength) {
            setMainTablecheckBoxValue(false)
        } else {
            setMainTablecheckBoxValue(true)
        }
    }
    const automationDelete = (id) => {
        deleteAutomation({amIds:id}).then((res)=>{
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayAutomationList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });

    }
    const handleClickDeleteGroup = () => {
        if(tableCheckBoxValueList.length > 0) {
            confirmDialog({
                open: true,
                title: "Are you sure you want to delete automations?",
                onConfirm: ()=>{
                    automationDelete(tableCheckBoxValueList);
                }
            });
        } else {
            globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
        }
    }
    const handleClickDeleteSingle = (id) => {
        confirmDialog({
            open: true,
            title: "Are you sure you want to delete automation?",
            onConfirm: ()=>{
                automationDelete([id]);
            }
        });
    }
    const handleClickEdit = (id, flag) => {
        if (flag && tableCheckBoxValueList.length === 0) {
            globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
            return false;
        }
        let checkData = automationList.filter((v)=> v.amId === id);
        if(checkData[0].saveStatus === "Publish"){
            confirmDialog({
                open: true,
                title: "Please ensure to save your changes and Re-Publish your automation.",
                onConfirm: ()=>{
                    history.push("/buildautomation?v="+id);
                }
            });
        } else {
            history.push("/buildautomation?v="+id);
        }
    }
    const handleClickReport = (id, status) => {
        if(status === "Draft"){
            globalAlert({
                type: "Success",
                text: "You can not show drafted automation report",
                open: true
            });
        } else {
            history.push("/emailcampaignautomationreport?v="+id);
        }
    }
    const handleClickStop = (id) => {
        stopAutomationById(id).then((res)=>{
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayAutomationList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickRestart = (id) => {
        startAutomationById(id).then((res)=>{
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayAutomationList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickCopy = (id) => {
        copyAutomationById(id).then((res)=>{
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayAutomationList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const displayAutomationList = useCallback(() => {
        setAutomationList([])
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}&timeZone=${timeZone}`;
        getAutomationList(data).then((res) => {
            if (res.status === 200) {
                setAutomationList(res.result.automationList)
                setTotalPages(res.result.getTotalPages);
                setTotalData(res.result.totalRecords)
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [searchSend, selectedPage, perPage, sort, globalAlert])
    useEffect(() => {
        displayAutomationList()
    }, [displayAutomationList, searchSend, selectedPage, perPage, sort])
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Automation</h3>
                    <div className="top-button">
                        <div className="icon-wrapper">
                                <Link component="a" className="btn-circle" onClick={() => { history.push("/buildautomation") }} data-toggle="tooltip" title="Add">
                                    <i className="far fa-plus-square"></i>
                                    <div className="bg-green"></div>
                                </Link>
                                {
                                    tableCheckBoxValueList.length < 2 ?
                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit" onClick={() => { handleClickEdit(tableCheckBoxValueList[0], true) }} >
                                            <i className="far fa-pencil-alt"></i>
                                            <div className="bg-blue"></div>
                                        </Link>
                                    : null
                                }
                                <Link id="deleteCamp" component="a" className="btn-circle" data-toggle="tooltip" title="Delete" onClick={handleClickDeleteGroup}>
                                    <i className="far fa-trash-alt"></i>
                                    <div className="bg-red"></div>
                                </Link>
                                <Link component="a" className="btn-circle" onClick={() => { handleClickHelp("Automation/Automation/Email/AutomationEmail.html") }} data-toggle="tooltip" title="Help">
                                    <i className="far fa-question-circle"></i>
                                    <div className="bg-grey"></div>
                                </Link>
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
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch} >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                    variant="standard"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="table-content-wrapper height-58 overflow-auto">
                        <Table striped>
                            <thead>
                                <tr>
                                    <th className="text-center" width="3%">
                                        <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()} />
                                    </th>
                                    <th key={0} onClick={() => { handleClickSort("id", 0) }} className="text-center" width="5%">Id
                                        <span>
                                            {typeof sortBox[0] !== "undefined"
                                                ? (sortBox[0] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i>)
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th key={1} onClick={() => { handleClickSort("amName", 1) }} width="15%">Name
                                        <span>
                                            {typeof sortBox[1] !== "undefined"
                                                ? (sortBox[1] === true
                                                    ? <i className="fad fa-sort-up ml-1"></i>
                                                    : <i className="fad fa-sort-down ml-1"></i>)
                                                : <i className="fad fa-sort ml-1"></i>}
                                        </span>
                                    </th>
                                    <th width="10%">Start Condition</th>
                                    <th width="12%">Schedule On</th>
                                    <th width="5%">Status</th>
                                    <th width="5%">Execution</th>
                                    <th width="10%">Created</th>
                                    <th width="10%">Start</th>
                                    <th width="10%">Estimated Finish</th>
                                    <th className="text-center" width="15%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {automationList.length > 0 ?
                                    automationList?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td align="center">
                                                    <Input type="checkbox" checked={tableCheckBoxValueList.includes(item.amId)} onChange={() => tableCheckBox(item.amId)} />
                                                </td>
                                                <td align='center'>{item.amId}</td>
                                                <td className="cursor-pointer" data-toggle="tooltip" title={item.amName}>{item.amName.length > 20 ? item.amName.substring(0, 20)+"..." : item.amName}</td>
                                                <td>{item.amStartCondition}</td>
                                                <td></td>
                                                <td>{item.saveStatus}</td>
                                                <td>
                                                    {item.saveStatus === "Draft" ? "-" : item.saveStatus === "Publish" ? item.automationCampaignStatus : ""}
                                                </td>
                                                <td>{dateTimeFormat(item.createdDateTime)}</td>
                                                <td>{item.saveStatus === "Draft" ? "-" : item.sendDateTime !== null ? dateTimeFormat(item.sendDateTime) : ""}</td>
                                                <td>{item.saveStatus === "Draft" ? "-" : item.estimatedCompletionDateTime !== null ? dateTimeFormat(item.estimatedCompletionDateTime) : ""}</td>
                                                <td align="right">
                                                    {(item.saveStatus === "Publish" && item.automationCampaignStatus === "Running") && <i className="fas fa-stop mr-3" data-toggle="tooltip" title="Stop" onClick={()=>{handleClickStop(item.amId)}}></i>}
                                                    {(item.automationCampaignStatus !== null && item.automationCampaignStatus === "Stop") && <i className="fas fa-play mr-3" data-toggle="tooltip" title="Restart" onClick={()=>{handleClickRestart(item.amId)}}></i>}
                                                    {!(item.saveStatus === "Publish" && item.automationCampaignStatus === "Running") && <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={()=>{handleClickEdit(item.amId, false)}}></i>}
                                                    <i className="far fa-clone mr-3" data-toggle="tooltip" title="Copy" onClick={()=>{handleClickCopy(item.amId)}}></i>
                                                    <i className="far fa-eye mr-3" data-toggle="tooltip" title="Preview" onClick={()=>{ setAmJSON(item.amJSON); togglePreviewModal(); }} ></i>
                                                    <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={()=>{handleClickDeleteSingle(item.amId)}}></i>
                                                    {/* <i className="far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={()=>{}}></i> */}
                                                    <i className="far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={()=>{handleClickReport(item.amId, item.saveStatus)}}></i>
                                                </td>
                                            </tr>
                                        )
                                    })
                                :
                                    <tr>
                                        <td colSpan={11} className="text-center">No Automation Found.</td>
                                    </tr>
                                }
                            </tbody>
                        </Table>
                    </div>
                    <Row className="mt-3">
                        <Col xs={6}><span className="align-middle pt-2">{`Showing ${automationList.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + automationList.length - 1} of ${totalData} entries`}</span></Col>
                        <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                    </Row>
                </Col>
            </Row>
            <PreviewModal previewModal={previewModal} togglePreviewModal={togglePreviewModal} amJSON={amJSON}/>
        </>
    );
}

const PreviewModal = ({previewModal, togglePreviewModal, amJSON}) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    useEffect(()=>{
        if(amJSON !== "") {
            let tempNodes = [];
            JSON.parse(amJSON).nodes.forEach(node => {
                tempNodes.push({
                    ...node,
                    "data":{
                        ...node.data,
                        hideEditDeleteBtn: true
                    }
                })
            });
            setNodes(prevState => {
                prevState=tempNodes;
                return [...prevState];
            });
            setEdges(prevState => {
                prevState=JSON.parse(amJSON).edges;
                return [...prevState];
            });
        }
    }, [amJSON, setNodes, setEdges]);
    return (
        <Modal isOpen={previewModal} toggle={togglePreviewModal} size='xl'>
            <ModalHeader>Preview</ModalHeader>
            <ModalBody className='m-4'>
            <div style={{ display: "flex", flexDirection: `${window.innerWidth < 540 ? 'column-reverse' : 'unset'}`, width: "100%" }} className="flowChartWrapper dndflow">
                <div className="reactflow-wrapper1" ref={reactFlowWrapper}>
                    <ReactFlow
                        panOnScroll={true}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodes={nodes}
                        edges={edges}
                        key="edges"
                    >
                        <Controls/>
                    </ReactFlow>
                </div>
            </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={()=>togglePreviewModal()} >CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAutomation);