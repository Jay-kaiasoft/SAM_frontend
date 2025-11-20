import React, { Suspense, createRef, lazy, useEffect, useRef, useState } from 'react'
import { Tabs, Tab, ClickAwayListener } from '@mui/material';
import { Row, Col } from 'reactstrap';
import { withRouter, Link } from "react-router-dom";
import History from "../../history";
import { a11yProps, PopoverTooltip, TabPanel } from "../../assets/commonFunctions";
import Loader from '../shared/loaderV2/loader';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { connect } from 'react-redux';
const MyPages = lazy(() => import("./myPages"))
const SmsTemplates = lazy(() => import("./smsTemplates"))
const BuildItForMe = lazy(() => import("./buildItForMe"))
const MyForms = lazy(() => import("./myForms"));
const MySurveyTemplates = lazy(() => import("./mySurveyTemplates"));
const MyAssessmentTemplates = lazy(() => import("./myAssessmentTemplates"));
const MyDrive = lazy(() => import("./myDrive"));

const MyDesktop = (props) => {
    const tabNameToIndex = { 0: "mypages", 1: "smstemplates", 2: "builditforme", 3: "myforms", 4: "mysurveytemplates", 5: "myassessmenttemplates", 6: "mydrive" };
    const [value, setValue] = useState(0);
    let tabRef = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const [showPopper, setShowPopper] = useState(false);
    const [arrowRef, setArrowRef] = useState(null);
    const tabList = [
        {
            tabTo: "/mypages",
            tabIcon: <i className="far fa-envelope-open-text" data-toggle="tooltip" title="My Pages Design" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "My Pages Design"
        },
        {
            tabTo: "/smstemplates",
            tabIcon: <i className="far fa-comment-alt-lines" data-toggle="tooltip" title="SMS Templates" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "SMS Templates"
        },
        {
            tabTo: "/builditforme",
            tabIcon: <i className="far fa-pencil-ruler" data-toggle="tooltip" title="Build It For Me" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "Build It For Me"
        },
        {
            tabTo: "/myforms",
            tabIcon: <i className="fab fa-wpforms" data-toggle="tooltip" title="My Forms Design" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "My Forms Design"
        },
        {
            tabTo: "/mysurveytemplates",
            tabIcon: <i className="far fa-clipboard-list" data-toggle="tooltip" title="Survey Design" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "Survey Design"
        },
        {
            tabTo: "/myassessmenttemplates",
            tabIcon: <i className="far fa-clipboard-list-check" data-toggle="tooltip" title="Assessment Design" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "Assessment Design"
        },
        {
            tabTo: "/mydrive",
            tabIcon: <i className="far fa-cloud-download-alt" data-toggle="tooltip" title="My Drive" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "My Drive"
        }
    ];

    const handleChange = (event, newValue) => {
        if(props.user.planModuleList.includes(tabList[newValue]?.tabTitle)) {
            History.push(`/${tabNameToIndex[newValue]}`);
            setValue(newValue);
        } else {
            noPermission();
        }
    };
    const handleClickAway = () => {
        setShowPopper(false);
    };
    const noPermission = () => {
        props.globalAlert({
            type: "Error",
            text: "Your Plan doesn't have this functionality. Please upgrade your plan.",
            open: true
        });
    }

    useEffect(() => {
        setShowPopper(true);
    }, []);
    useEffect(() => {
        const pathname = props.history.location.pathname;
        let tempTabTitle = tabList.find(v => v.tabTo === pathname)?.tabTitle;
        if(props.user.planModuleList.includes(tempTabTitle)) {
            switch (pathname) {
                default:
                    setValue(0);
                    break;
                case "/mypages":
                    setValue(0);
                    break;
                case "/smstemplates":
                    setValue(1);
                    break;
                case "/builditforme":
                    setValue(2);
                    break;
                case "/myforms":
                    setValue(3);
                    break;
                case "/mysurveytemplates":
                    setValue(4);
                    break;
                case "/myassessmenttemplates":
                    setValue(5);
                    break;
                case "/mydrive":
                    setValue(6);
                    break;
            }
        } else {
            noPermission();
            History.push(`/dashboard`);
        }
    }, [props.history.location.pathname]);

    return (
        <Row className="midleMain p-0">
            <Col md={1} className="leftTabs">
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div style={{ position: "relative", height: "100%" }}>
                        <Tabs
                            indicatorColor="primary"
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            className="border-right"
                        >
                            {
                                tabList.map((v, i) => (
                                    <Tab 
                                        key={i}
                                        ref={tabRef.current[i]}
                                        component={Link}
                                        to={props.user.planModuleList.includes(v.tabTitle) ? v.tabTo : "#"}
                                        icon={v.tabIcon}
                                        onClick={handleClickAway}
                                        {...a11yProps(i)}
                                    />
                                ))
                            }
                        </Tabs>
                        {tabRef.current.length > 0 && 
                            tabList.map((v, i) => (
                                <PopoverTooltip key={i} tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={i} showText={v.tabTitle}/>
                            ))
                        }
                    </div>
                </ClickAwayListener>                
            </Col>
            <Col className="rightTabs">
                <TabPanel value={value} index={0}>
                    <Suspense fallback={<Loader />}>
                        <MyPages />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Suspense fallback={<Loader />}>
                        <SmsTemplates />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Suspense fallback={<Loader />}>
                        <BuildItForMe />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Suspense fallback={<Loader />}>
                        <MyForms />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Suspense fallback={<Loader />}>
                        <MySurveyTemplates />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <Suspense fallback={<Loader />}>
                        <MyAssessmentTemplates />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <Suspense fallback={<Loader />}>
                        <MyDrive />
                    </Suspense>
                </TabPanel>
            </Col>
        </Row>
    );
}
const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(MyDesktop));