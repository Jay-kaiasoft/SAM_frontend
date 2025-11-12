import React, { createRef, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Tabs, Tab, ClickAwayListener } from '@mui/material';
import { Row, Col } from 'reactstrap';
import { withRouter, Link } from "react-router-dom";
import History from "../../history";
import { getAllReplyCount } from '../../services/smsInboxServices';
import { a11yProps, PopoverTooltip, TabPanel } from "../../assets/commonFunctions";
import Loader from '../shared/loaderV2/loader';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { connect } from 'react-redux';

const ClientContact = lazy(() => import("./clientContact"))
const SMSInbox = lazy(() => import("./smsInbox"))
const Projects = lazy(() => import("./projects/projects"))

const Mycrm = (props) => {
    const tabNameToIndex = { 0: "clientContact", 1: "projects", 2: "managesmsinbox" };
    // const tabNameToIndex = { 0: "clientContact", 1: "mycalendar", 2: "mypipeline", 3: "mytasks", 4: "managesmsinbox" };
    const [value, setValue] = useState(0);
    const [replyCount, setReplyCount] = useState({});
    let tabRef = useRef([createRef(), createRef(), createRef()]);
    const [showPopper, setShowPopper] = useState(false);
    const [arrowRef, setArrowRef] = useState(null);
    const tabList = [
        {            
            tabTo: "/clientContact",
            tabIcon: <i className="far fa-address-book" data-toggle="tooltip" title="Client Contact" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "Client Contact"
        },
        {
            tabTo: "/projects",
            tabIcon: <i className="far fa-layer-group" data-toggle="tooltip" title="Projects" style={{width:22, textAlign:"center"}}></i>,
            tabTitle: "Projects"
        },    
    ];

    const handleChange = (event, newValue) => {
        if(props.user.planModuleList.includes(tabList[newValue]?.tabTitle)) {
            History.push(`/${tabNameToIndex[newValue]}`);
            setValue(newValue);
        } else {
            noPermission();
        }
    };
    const getAllReplyCountResponse = () => {
        getAllReplyCount().then(res => {
            if (res.status === 200) {
                setReplyCount(res?.result)
            }
        })
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
        const pathname = props.history.location.pathname;
        let tempTabTitle = tabList.find(v => v.tabTo === pathname)?.tabTitle;
        if(props.user.planModuleList.includes(tempTabTitle)) {
            switch (pathname) {
                default:
                    setValue(0);
                    break;
                case "/clientContact":
                    setValue(0);
                    break;
                case "/projects":
                    setValue(1);
                    break;
                // case "/mypipeline":
                //     setValue(2);
                //     break;
                // case "/mytasks":
                //     setValue(3);
                //     break;               
            }
        } else {
            noPermission();
            History.push(`/dashboard`);
        }
    }, [props.history.location.pathname]);
    useEffect(() => {
        setShowPopper(true);
        getAllReplyCountResponse();
        let interval = setInterval(() => {
            getAllReplyCountResponse();
        }, 60 * 1000);
        return () => {
            clearInterval(interval);
            interval = null;
        }
    }, [])

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
                            {/*<Tab component={Link} to="/mypipeline" icon={<i className="far fa-layer-group" data-toggle="tooltip" title="My Pipeline"></i>} {...a11yProps(2)} />*/}
                            {/*<Tab component={Link} to="/mytasks" icon={<i className="far fa-calendar-check" data-toggle="tooltip" title="My Tasks"></i>} {...a11yProps(3)} />*/}
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
                        <ClientContact />
                    </Suspense>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Suspense fallback={<Loader />}>
                        <Projects />
                    </Suspense>
                </TabPanel>
                {/*<TabPanel value={value} index={2}>*/}
                {/*    <TempComponent compName="My Pipeline" />*/}
                {/*</TabPanel>*/}
                {/*<TabPanel value={value} index={3}>*/}
                {/*    <TempComponent compName="My Tasks" />*/}
                {/*</TabPanel>*/}
                <TabPanel value={value} index={2}>
                    <Suspense fallback={<Loader />}>
                        <SMSInbox replyCount={replyCount} setReplyCount={setReplyCount} />
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
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Mycrm));