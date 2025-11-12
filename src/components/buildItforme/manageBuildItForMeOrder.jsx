import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import {Link, Tab, Tabs, Stepper, Step, StepLabel} from "@mui/material";
import CustomCard from "../shared/commonControlls/customCard";
import {deleteOrder, getListOrder, getOrderDetails} from "../../services/buildItForMeService";
import history from "../../history";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {QontoConnector, QontoStepIcon, TabPanel, a11yProps} from "../../assets/commonFunctions";
import {siteURL} from "../../config/api";

const ManageBuilditForMeOrder = ({globalAlert,confirmDialog})=>{
    const [data,setData] = useState([]);
    const [orderDetails,setOrderDetails] = useState([]);
    const [modalOrderDetails, setModalOrderDetails] = useState(false);
    const toggleOrderDetails = () => {setModalOrderDetails(!modalOrderDetails);};
    const [value, setValue] = useState(0);
    const steps = ['Draft', 'Paid', 'Assigned', 'Request For Approval', 'Published'];
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(()=>{
        getListOrder().then(res => {
            if (res.status === 200) {
                if(res.result && res.result.buildItForMe){
                    let t = [];
                    res.result.buildItForMe.map((v)=>(
                        t.push({...v,id:v.bfmId,name:v.bfmProjectName})
                    ))
                    setData(t);
                }
            }
        });
        return () => {
            setData([]);
        };
    },[]);
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
    const handleClickEdit = (id) => {
        history.push("/buildbuilditforme?v="+id);
    }
    const handleClickDelete = (id) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete this record?',
            onConfirm: () => {
                deleteOrder(id).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        setData(data.filter((v)=>v.id !== id));
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
    return (
        <>
            {
                data.length === 0 ?
                    (()=>{
                        return (
                            <>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{height: "50vh", paddingTop: "15vh"}}>
                                        <p className="text-center">Create A New Order</p>
                                        <span className="text-center w-100 d-block">
                                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/buildbuilditforme");}}>
                                                <i className="far fa-plus-square"></i>
                                                <div className="bg-green"></div>
                                            </Link>
                                        </span>
                                    </Col>
                                </Row>
                            </>
                        );
                    })()
                :(()=>{
                    return (
                        <>
                            <Row>
                                <CustomCard myData={data} handleClickGetOrderDetails={handleClickGetOrderDetails} handleClickDelete={handleClickDelete} handleClickEdit={handleClickEdit} type="buidItforMeOrder" imgSrc={siteURL+"/img/logo-s.svg"} paddedImg={true}/>
                            </Row>
                        </>
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
        </>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(ManageBuilditForMeOrder);