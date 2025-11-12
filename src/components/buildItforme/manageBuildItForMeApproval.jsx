import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Button, Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import CustomCard from "../shared/commonControlls/customCard";
import FilterMyPages from "../shared/commonControlls/filterMyPages";
import {approveRequest, getListRequestForApproval, getOrderDetails, getRequestForApprovalTags, rejectRequest} from "../../services/buildItForMeService";
import {Step, StepLabel, Stepper, Tab, Tabs, TextField} from "@mui/material";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import $ from 'jquery';
import {siteURL} from "../../config/api";
import {QontoConnector, QontoStepIcon, TabPanel, a11yProps} from "../../assets/commonFunctions";

const ManageBuilditForMeApproval = ({globalAlert})=>{
    const [data,setData] = useState([]);
    const [orderDetails,setOrderDetails] = useState([]);
    const [modalOrderDetails, setModalOrderDetails] = useState(false);
    const toggleOrderDetails = () => {setModalOrderDetails(!modalOrderDetails);};
    const [value, setValue] = useState(0);
    const steps = ['Draft', 'Paid', 'Assigned', 'Request For Approval', 'Published'];
    const [modalReject, setModalReject] = useState(false);
    const toggleReject = () => {setModalReject(!modalReject);};
    const [dataReject,setDataReject] = useState({});
    const [sendDataReject,setSendDataReject] = useState(false);
    const [filterValues, setFilterValues] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleTextAreaChange = (event)=>{
        setDataReject((prev)=>{
            return {...prev, [event.target.name]: event.target.value};
        });
    }
    const handleChangeSelectedFilter = (filterName) => {
        if(selectedFilter.includes(filterName)){
            setSelectedFilter(selectedFilter.filter(x => x !== filterName));
        } else {
            setSelectedFilter([...selectedFilter,filterName]);
        }
    }
    const handleClickGetOrderDetails = (id) => {
        getOrderDetails(id).then(res => {
            if (res.status === 200) {
                if(res.result && res.result.orderDetails){
                    setOrderDetails(res.result.orderDetails);
                    toggleOrderDetails();
                }
            }
        });
    }
    const handleClickView = (id) => {
        window.open(siteURL+"/viewtemplate?bmpId="+id);
    }
    const handleClickApprove = (id) => {
        let requestData = {
            "mpId":id
        }
        $(".waiting").addClass("d-flex");
        approveRequest(requestData).then(res => {
            if (res.status === 200) {
                $(".waiting").removeClass("d-flex");
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setData((prev)=>{
                    return prev.filter((v)=>{ return v.mpId !== id});
                });
            } else {
                $(".waiting").removeClass("d-flex");
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickReject = (id) => {
        setDataReject({mpId:id});
        toggleReject();
    }
    const handleClickRejectModal = () => {
        if(typeof dataReject.note === "undefined" || dataReject.note === ""){
            globalAlert({
                type: "Error",
                text: "Please Enter Reason.",
                open: true
            });
            return false;
        }
        setSendDataReject(true);
        rejectRequest(dataReject).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setData((prev)=>{
                    return prev.filter((v)=>{ return v.mpId !== dataReject.mpId});
                });
                toggleReject();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                setSendDataReject(false);
            }
        });
    }
    useEffect(()=>{
        getRequestForApprovalTags().then(res => {
            if (res.result && res.result.requestForApprovalTags) {
                setFilterValues(res.result.requestForApprovalTags);
            }
        });
        getListRequestForApproval().then(res => {
            if (res.status === 200) {
                if(res.result && res.result.requestForApproval){
                    let t = [];
                    res.result.requestForApproval.map((v)=>(
                        t.push({...v,id:v.mpId,name:v.mpName})
                    ))
                    setData(t);
                }
            }
        });
    },[]);
    useEffect(()=> {
        getListRequestForApproval().then(res => {
            if (res.result) {
                if (selectedFilter.length > 0) {
                    setData([]);
                    res.result.requestForApproval.filter((value) => (
                        (value.mpTags !== null && value.mpTags !== "") ?
                            selectedFilter.map((filter) => (
                                value.mpTags.toLowerCase().split(", ").includes(filter) === true ?
                                    setData((prev) => {
                                        let t = 0;
                                        prev.map((p) => (
                                            t = p.mpId === value.mpId ? 1 : 0
                                        ))
                                        if (t === 0)
                                            return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                        else
                                            return [...prev];
                                    })
                                    : null
                            ))
                            : null
                    ))
                } else {
                    let t = [];
                    res.result.requestForApproval.map((v) => (
                        t.push({...v, id: v.mpId, name: v.mpName})
                    ))
                    setData(t);
                }
            }
        });
        return () => {
            setData([]);
        };
    },[selectedFilter]);
    return (
        <>
            {
                data.length === 0 ?
                    (()=>{
                        return (
                            <>
                                <Row>
                                    <Col md={2}>
                                        <FilterMyPages filterValues={filterValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
                                    </Col>
                                    <Col xs={10} sm={10} md={10} lg={10} xl={10} style={{height: "50vh", paddingTop: "15vh"}}>
                                        <div>
                                            <p className="text-center">
                                                No Data Available
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        );
                    })()
                :(()=>{
                    return (
                            <Row>
                                <Col md={2}>
                                    <FilterMyPages filterValues={filterValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
                                </Col>
                                <Col md={10}>
                                    <Row>
                                        <CustomCard myData={data} handleClickGetOrderDetails={handleClickGetOrderDetails} handleClickApprove={handleClickApprove} handleClickReject={handleClickReject} handleClickView={handleClickView} type="buidItforMeApproval" folderName="mypage"/>
                                    </Row>
                                </Col>
                            </Row>
                    );
                })()
            }
            <Modal size="xl" isOpen={modalOrderDetails} toggle={toggleOrderDetails}>
                <ModalHeader toggle={toggleOrderDetails}>Order Details</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={12} className="text-center">{orderDetails.bfmProjectName}</Col>
                        <Col xs={12} className="text-center">{orderDetails.bfmPublishStatus}</Col>
                        <Col xs={12} className="text-center">
                            <Stepper alternativeLabel activeStep={orderDetails.bfmPublishStatusId} connector={<QontoConnector />}>
                                {
                                    steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                        </Step>
                                    ))
                                }
                            </Stepper>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Tabs
                                color="black"
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Order Details" {...a11yProps(0)} />
                                <Tab label="Order History" {...a11yProps(1)} />
                            </Tabs>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TabPanel value={value} index={0}>
                                <div className="table-content-wrapper">
                                    <Table striped className="table-layout-fixed order-details">
                                        <thead>
                                        <tr>
                                            <th width="40%">Name</th>
                                            <th>Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>What is the name of this project?</td>
                                            <td>{orderDetails.bfmProjectName}</td>
                                        </tr>
                                        <tr>
                                            <td>What industry is your business in?</td>
                                            <td>{orderDetails.bfmYourBusiness}</td>
                                        </tr>
                                        <tr>
                                            <td>What is your website address, if you have one?</td>
                                            <td>{orderDetails.bfmWebsite}</td>
                                        </tr>
                                        <tr>
                                            <td>Tell us about your company. What do you do? Who is your target audience?</td>
                                            <td>{orderDetails.bfmAboutYourCompany}</td>
                                        </tr>
                                        <tr>
                                            <td>What is your main goal with this email template campaign?</td>
                                            <td>{orderDetails.bfmMainGoalWithEt}</td>
                                        </tr>
                                        <tr>
                                            <td>Tell us what images, art work or text area MUST include. Example - inclusive, different ethnic people</td>
                                            <td>{orderDetails.bfmWantIncluded}</td>
                                        </tr>
                                        <tr>
                                            <td>Is there anything else you would like to communicate to the team?</td>
                                            <td>{orderDetails.bfmCommunicateToTeam}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Tell us what images, art work or text area MUST include. Example -
                                                inclusive, different ethnic people Is there anything else you would like to
                                                communicate to the team?
                                                Tell us what images, art work or text area MUST NOT be in the template.
                                                Example – a busy template, brown and black colors
                                            </td>
                                            <td>{orderDetails.bfmNotWantIncluded}</td>
                                        </tr>
                                        <tr>
                                            <td>Choose Your Package</td>
                                            <td>{orderDetails.packLabel}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <div className="table-content-wrapper">
                                    <Table striped className="table-layout-fixed">
                                        <thead>
                                        <tr>
                                            <th width="5%">No</th>
                                            <th width="35%">Status</th>
                                            <th width="10%">Date</th>
                                            <th>Reason</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            typeof orderDetails.logs !== "undefined" && orderDetails.logs.length > 0 ?
                                                orderDetails.logs.map((v,i)=>{
                                                    return <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td>{v.blogType}</td>
                                                        <td>{v.blogDate}</td>
                                                        <td>{v.blogNotes}</td>
                                                    </tr>
                                                })
                                                :
                                                <tr>
                                                    <td colSpan="4" align="center"> No Records Found.</td>
                                                </tr>
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                            </TabPanel>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleOrderDetails()}} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalReject} toggle={toggleReject}>
                <ModalHeader toggle={toggleReject}>Reason</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <TextField
                            id="note"
                            name="note"
                            label="Enter Reason"
                            multiline
                            value={dataReject.note}
                            onChange={handleTextAreaChange}
                            fullWidth
                            minRows={4}
                            variant="standard"
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-2" disabled={sendDataReject} onClick={()=> {handleClickRejectModal()}} >{sendDataReject ? <i className="fad fa-spinner-third fa-spin white mx-3"></i> : "REJECT" }</Button>
                    <Button variant="contained" color="primary" onClick={()=> {toggleReject()}} >CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ManageBuilditForMeApproval);
