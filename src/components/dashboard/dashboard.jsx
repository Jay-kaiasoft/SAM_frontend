import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { features } from "./constants";
import { getModuleDetails, getModuleList, myCalendarAppointmentList } from '../../services/dashboard';
import { pathOr } from 'ramda';
import ReactPlayer from 'react-player/youtube';
import { getSubmitRequestCount } from '../../services/supportService';
import History from '../../history';
import Loader from '../shared/loaderV2/loader';
import { websiteColor } from '../../config/api';
import { formatToDays } from '../../assets/commonFunctions';
const EmailCampaigns = lazy(() => import("./emailCampaigns"))
const SmsCampaigns = lazy(() => import("./smsCampaigns"))
const SmsPolling = lazy(() => import("./smsPolling"))
const Surveys = lazy(() => import("./surveys"))
const Assessments = lazy(() => import("./assessments"))
const ClientContacts = lazy(()=>import("./clientContacts"))

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [activeTab2, setActiveTab2] = useState("2");
    const [featuresData, setFeaturesData] = useState([])
    const [featureSelected, setFeatureSelected] = useState(1)
    const [moduleDetails, setModuleDetails] = useState({})
    const [myCalendarData, setMyCalendarData] = useState([]);

    const evaluateFeaturesData = (data) => {
        const evaluatedData = []
        features.forEach((item) => {
            const tempItem = {
                ...item,
                values: []
            }
            item?.values?.forEach((value) => {
                tempItem.values.push({
                    label: value.label,
                    value: pathOr("", value.value, data)
                })
            })
            evaluatedData.push(tempItem)
        })
        setFeaturesData(evaluatedData);
    }
    const getDetailsToShow = () => {
        if (featureSelected === 1) {
            return (
                <Suspense fallback={<Loader />}>
                    <ClientContacts moduleDetails={moduleDetails} />
                </Suspense>
            )
        } else if (featureSelected === 2) {
            return (
                <Suspense fallback={<Loader />}>
                    <EmailCampaigns moduleDetails={moduleDetails} />
                </Suspense>
            )
        } else if (featureSelected === 3) {
            return (
                <Suspense fallback={<Loader />}>
                    <SmsCampaigns moduleDetails={moduleDetails} />
                </Suspense>
            )
        } else if (featureSelected === 4) {
            return (
                <Suspense fallback={<Loader />}>
                    <SmsPolling moduleDetails={moduleDetails} />
                </Suspense>
            )
        } else if (featureSelected === 5) {
            return (
                <Suspense fallback={<Loader />}>
                    <Surveys moduleDetails={moduleDetails} />
                </Suspense>
            )
        } else if (featureSelected === 6) {
            return (
                <Suspense>
                    <Assessments moduleDetails={moduleDetails} />
                </Suspense>
            )
        }
    }
    
    useEffect(() => {
        getModuleList().then(res => {
            if (res.status === 200) {
                evaluateFeaturesData(res.result)
            }
        });
        myCalendarAppointmentList(10).then(res => {
            if (res.status === 200) {
                setMyCalendarData(res.result.appointmentList)
            }
        });
    }, []);
    useEffect(() => {
        if(featureSelected === 7){
            History.push("/managesupportticket");
        } else {
            const apiParams = features[featureSelected - 1].apiParams
            getModuleDetails(apiParams).then(res => {
                if (res.status === 200) {
                    setModuleDetails(res.result)
                }
            })
        }
    }, [featureSelected]);
    useEffect(()=>{
        if(featuresData.length === 6){
            let tempEvaluatedData;
            getSubmitRequestCount().then(res => {
                if (res.status === 200) {
                    tempEvaluatedData = {
                        key: 7,
                        name: "Support Ticket",
                        values: [
                            {
                                label: "Total",
                                value: res.result.totalSrCount
                            },
                            {
                                label: "Open",
                                value: res.result.openSrCount
                            }
                        ],
                        apiParams: "assessment/10",
                        class: "text-blue"
                    }
                } else {
                    tempEvaluatedData = {
                        key: 7,
                        name: "Support Ticket",
                        values: [
                            {
                                label: "Total",
                                value: 0
                            },
                            {
                                label: "Open",
                                value: 0
                            }
                        ],
                        apiParams: "assessment/10",
                        class: "text-blue"
                    }
                }
                setFeaturesData((prev)=>{
                    return [
                        ...prev,
                        tempEvaluatedData
                    ];
                });
            });
        }
    },[featuresData]);
    return (
        <>
            <Row className="midleMain" style={{ "backgroundColor": "#F0F3F9" }}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{paddingLeft:"10px"}}>
                        <div className='d-flex justify-content-between overflow-auto' style={{marginRight:"10px"}}>
                            {featuresData.map((item, index) => {
                                return <div key={index}  className="box-info" style={{ cursor: "pointer", borderTop: `${featureSelected === item.key ? `2px solid ${websiteColor}` : "2px solid transparent"}` }} onClick={() => { setFeatureSelected(item.key) }}>
                                    <div className="box-heading">{item.name}</div>
                                    <div className="box-detail-wrapper">
                                        {
                                            item?.values?.map((it, index2) => {
                                                return <div key={index2} className="box-detail">
                                                    <p className={item.class} dangerouslySetInnerHTML={{__html: `${it.label}`}}/>
                                                    <p className={item.name === "SMS Campaigns" && it.label === "Replies" ? "blink" : ""}>
                                                        {
                                                            item.name === "Client Contacts" && it.label === "Status" ?
                                                                it.value === "up" ?
                                                                    <i className="far fa-long-arrow-up text-green"></i>
                                                                :
                                                                    it.value === "down" ?
                                                                        <i className="far fa-long-arrow-down text-red"></i>
                                                                    :
                                                                        "No Change"
                                                            :
                                                                item.name === "Client Contacts" && (it.label === "Opt Out" || it.label === "Bad") ?
                                                                    <div className="d-flex">
                                                                        <div className="mr-2">
                                                                            <div className={`${item.class} font-weight-bold`}>Email</div>
                                                                            <div>{it?.value?.email}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className={`${item.class} font-weight-bold`}>SMS</div>
                                                                            <div>{it?.value?.sms}</div>
                                                                        </div>
                                                                    </div>
                                                                :
                                                                    it.value
                                                        }
                                                    </p>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            })}
                        </div>
                        <Container fluid={true}>
                            <Row>
                                <Col className="margin-bottom-10 px-0" xs={12} md={4} lg={4}>
                                    <div className="bg-white rounded p-3 d-flex flex-column h-100 db-left-side">
                                        <p className="text-center">My To Do</p>
                                        <Nav className="db-tabs" tabs>
                                            <NavItem className={activeTab === "1" ? "w-50 active" : "w-50"}>
                                                <NavLink className="text-center" onClick={() => { setActiveTab("1"); }}>
                                                    My Calendar
                                                </NavLink>
                                            </NavItem>
                                            {/* <NavItem className={activeTab === "2" ? "w-50 active" : "w-50"}>
                                                <NavLink className="text-center" onClick={() => { setActiveTab("2"); }}>
                                                    My Tasks
                                                </NavLink>
                                            </NavItem> */}
                                        </Nav>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId="1">
                                                <Row className="my-task-header">
                                                    <Col sm={1}></Col>
                                                    <Col xs={6} sm={7}>Title</Col>
                                                    <Col xs={6} sm={3}>Remaining</Col>
                                                    <Col sm={1}></Col>
                                                </Row>
                                                {myCalendarData.map((item, index) => {
                                                    return (
                                                        <Row key={index} className="task-row">
                                                            <Col xs={1} sm={1} className="d-flex justify-content-center align-items-center">{index % 2 === 0 ? <i className="fa fa-check text-red"></i> : <i className="fa fa-check text-orange"></i>}</Col>
                                                            <Col xs={7} sm={7} className="task-title">{item.title}</Col>
                                                            <Col xs={3} sm={3} className="task-duration">{formatToDays(item.remainingTime)}</Col>
                                                            <Col xs={1} sm={1} className="d-flex justify-content-center align-items-center"><i className="fa fa-check-circle"></i></Col>
                                                        </Row>
                                                    )
                                                })}
                                            </TabPane>
                                            {/* <TabPane tabId="2">
                                                    <Row className="my-task-header">
                                                        <Col sm={1}></Col>
                                                        <Col xs={6} sm={7}>Title</Col>
                                                        <Col xs={6} sm={3}>Remaining</Col>
                                                        <Col sm={1}></Col>
                                                    </Row>
                                                    {todos.map((item, index) => {
                                                        return (
                                                            <Row key={index} className="task-row">
                                                                <Col xs={1} sm={1} className="d-flex justify-content-center align-items-center">{index % 2 === 0 ? <i className="fa fa-check text-red"></i> : <i className="fa fa-check text-orange"></i>}</Col>
                                                                <Col xs={7} sm={7} className="task-title">{item.Title}</Col>
                                                                <Col xs={3} sm={3} className="task-duration">{item.Remaining}</Col>
                                                                <Col xs={1} sm={1} className="d-flex justify-content-center align-items-center"><i className="fa fa-check-circle"></i></Col>
                                                            </Row>
                                                        )
                                                    })}
                                            </TabPane> */}
                                        </TabContent>
                                    </div>
                                </Col>
                                <Col className="margin-bottom-10 px-0" xs={12} md={8} lg={8} data-aos="zoom-in-up" data-aos-delay="50">
                                    <div className="bg-white rounded p-3 d-flex flex-column h-100 db-right-side">
                                        {getDetailsToShow()}
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Container fluid={true}>
                            <Row>
                                <Col className="mb-4 px-0" xs={12} md={4} lg={4}>
                                    <div className="bg-white rounded p-3 d-flex flex-column h-100 db-left-side">
                                        <p className="text-center">Recently Added</p>
                                        <Nav className="db-tabs" tabs>
                                            <NavItem className={activeTab2 === "1" ? "w-50 active" : "w-50"}>
                                                <NavLink className="text-center" onClick={() => { setActiveTab2("1") }}>
                                                    Quick Links
                                                </NavLink>
                                            </NavItem>
                                            <NavItem className={activeTab2 === "2" ? "w-50 active" : "w-50"}>
                                                <NavLink className="text-center" onClick={() => { setActiveTab2("2") }}>
                                                    Videos
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={activeTab2}>
                                            <TabPane tabId="1">
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=UVmqM2tScdU' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How To Upload CSV Contacts</h6>
                                                        <p className="mb-0">My CRM</p>
                                                    </Col>
                                                </Row>
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=zBRVS4l3z4I' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How to use our Best-in-class Editor</h6>
                                                        <p className="mb-0">My Desktop</p>
                                                    </Col>
                                                </Row>
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=hb4470Jpnmw' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How to Send Emails</h6>
                                                        <p className="mb-0">Email Campaign</p>
                                                    </Col>
                                                </Row>
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=rdTthFZQI_g' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How to Use SMS Services</h6>
                                                        <p className="mb-0">SMS Services</p>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=UVmqM2tScdU' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How To Upload CSV Contacts</h6>
                                                        <p className="mb-0">My CRM</p>
                                                    </Col>
                                                </Row>
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=zBRVS4l3z4I' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How to use our Best-in-class Editor</h6>
                                                        <p className="mb-0">My Desktop</p>
                                                    </Col>
                                                </Row>
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=hb4470Jpnmw' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How to Send Emails</h6>
                                                        <p className="mb-0">Email Campaign</p>
                                                    </Col>
                                                </Row>
                                                <Row className="my-3 mx-0">
                                                    <Col>
                                                        <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=rdTthFZQI_g' controls={true} width="100%" height="100%" /></div>
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-center">
                                                        <h6>How to Use SMS Services</h6>
                                                        <p className="mb-0">SMS Services</p>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </Col>
                                <Col className="mb-4 px-0" xs={12} md={8} lg={8} data-aos="zoom-in-up" data-aos-delay="50">
                                    <div className="bg-white rounded p-3 d-flex flex-column h-100  db-right-side">
                                        <p className="text-center">How To Videos</p>
                                        {/* <Row className="mb-3">
                                            <Col xs={6}>
                                                <InputGroup size="sm">
                                                    <Input placeholder="Search" />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <InputGroup size="sm">
                                                    <Input placeholder="Filter" />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText><i className="fa fa-caret-down"></i></InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col sm={12} md={6} lg={6}>
                                                <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=UVmqM2tScdU' controls={true} width="100%" height="100%"/></div>
                                                <h5 className="mt-3 mb-5">How To Upload CSV Contacts</h5>
                                            </Col>
                                            <Col sm={12} md={6} lg={6}>
                                                <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=zBRVS4l3z4I' controls={true} width="100%" height="100%"/></div>
                                                <h5 className="mt-3 mb-5">How to use our Best-in-class Editor</h5>
                                            </Col>
                                            <Col sm={12} md={6} lg={6}>
                                                <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=hb4470Jpnmw' controls={true} width="100%" height="100%"/></div>
                                                <h5 className="mt-3 mb-5">How to Send Emails</h5>
                                            </Col>
                                            <Col sm={12} md={6} lg={6}>
                                                <div className="player-wrapper"><ReactPlayer url='https://www.youtube.com/watch?v=rdTthFZQI_g' controls={true} width="100%" height="100%"/></div>
                                                <h5 className="mt-3 mb-5">How to Use SMS Services</h5>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default Dashboard;