import React, { Suspense, createRef, lazy, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {Tabs, Tab, ClickAwayListener} from '@mui/material';
import { Row, Col } from 'reactstrap';
import {Person, Lock, Security, CreditCard, Apps, WorkspacePremiumRounded} from '@mui/icons-material';
import { withRouter, Link } from "react-router-dom";
import History from "../../history";
import {a11yProps, PopoverTooltip, TabPanel} from "../../assets/commonFunctions";
import Loader from '../shared/loaderV2/loader.jsx';
const ApiSettings = lazy(() => import('./apiSettings.jsx'));
const EmailSignatures = lazy(() => import('./emailSignatures.jsx'));
const MemberInformation = lazy(() => import("./memberInformation.jsx"));
const ChangePassword = lazy(() => import("./changePassword.jsx"));
const SecurityQuestions = lazy(() => import("./securityQuestions.jsx"));
const CommunicationPreferences = lazy(() => import("./communicationPreferences.jsx"));
const ManageApps = lazy(() => import("./manageApps.jsx"));
const CreditCardDetails = lazy(() => import("./creditCardDetails.jsx"));
const Account = lazy(() => import("./account/account.jsx"));
const ManagePlan = lazy(() => import('./managePlan.jsx'));
const SMS = lazy(() => import("./SMS.jsx"));
const EmailCampaignFooter = lazy(() => import("./emailCampaignFooter.jsx"));
const MyBrandKit = lazy(() => import("./myBrandKit"));

const MyProfileTab = (props) => {
    const tabUser = [
        {
            tabname: "/memberinfo",
            tabIcon: <Person data-toggle="tooltip" title="Member Information"/>,
            tabPanel: <MemberInformation />,
            tabTitle: "Member Information"
        },
        {
            tabname: "/mybrandkit",
            tabIcon: <WorkspacePremiumRounded data-toggle="tooltip" title="My Brand"/>,
            tabPanel: <MyBrandKit />,
            tabTitle: "My Brand"
        }, 
        {
            tabname: "/changepassword",
            tabIcon: <Lock data-toggle="tooltip" title="Change Password"/>,
            tabPanel: <ChangePassword />,
            tabTitle: "Change Password"
        }, 
        {
            tabname: "/securityquestions",
            tabIcon: <Security data-toggle="tooltip" title="Security"/>,
            tabPanel: <SecurityQuestions />,
            tabTitle: "Security"
        }, 
        {
            tabname: "/communication",
            tabIcon: <i className="far fa-phone-volume" data-toggle="tooltip" title="Communication Preferences" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <CommunicationPreferences />,
            tabTitle: "Communication Preferences"
        }, 
        {
            tabname: "/account",
            tabIcon: <i className="far fa-file-invoice" data-toggle="tooltip" title="Billing" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <Account />,
            tabTitle: "Billing"
        }, 
        {
            tabname: "/carddetails",
            tabIcon: <CreditCard data-toggle="tooltip" title="Credit Card Details"/>,
            tabPanel: <CreditCardDetails />,
            tabTitle: "Credit Card Details"
        }, 
        {
            tabname: "/manageapps",
            tabIcon: <Apps data-toggle="tooltip" title="Manage Apps"/>,
            tabPanel: <ManageApps />,
            tabTitle: "Manage Apps"
        }, 
        {
            tabname: "/manageplan",
            tabIcon: <i className="far fa-calendar-alt" data-toggle="tooltip" title="Manage Plan" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <ManagePlan />,
            tabTitle: "Manage Plan"
        },
        {
            tabname: "/sms",
            tabIcon: <i className="far fa-comment-alt-lines" data-toggle="tooltip" title="SMS" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <SMS/>,
            tabTitle: "SMS"
        },
        {
            tabname: "/apisettings",
            tabIcon: <i className="far fa-plug" data-toggle="tooltip" title="API Settings" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <ApiSettings/>,
            tabTitle: "API Settings"
        },
        {
            tabname: "/emailsignatures",
            tabIcon: <i className="far fa-signature" data-toggle="tooltip" title="Email Signatures" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <EmailSignatures/>,
            tabTitle: "Email Signatures"
        }
    ];
    const tabSubUser = [
        {
            tabname: "/memberinfo",
            tabIcon: <Person data-toggle="tooltip" title="Member Information"/>,
            tabPanel: <MemberInformation />,
            tabTitle: "Member Information"
        },
        {
            tabname: "/mybrandkit",
            tabIcon: <WorkspacePremiumRounded data-toggle="tooltip" title="My Brand"/>,
            tabPanel: <MyBrandKit />,
            tabTitle: "My Brand"
        },
        {
            tabname: "/changepassword",
            tabIcon: <Lock data-toggle="tooltip" title="Change Password"/>,
            tabPanel: <ChangePassword />,
            tabTitle: "Change Password"  
        }, 
        {
            tabname: "/securityquestions",
            tabIcon: <Security data-toggle="tooltip" title="Security"/>,
            tabPanel: <SecurityQuestions />,
            tabTitle: "Security"
        },
        {
            tabname: "/sms",
            tabIcon: <i className="far fa-comment-alt-lines" data-toggle="tooltip" title="SMS" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <SMS/>,
            tabTitle: "SMS"
        }
    ];
    if(props.countrySetting.cntyWhiteListing === "Y"){
        tabUser.push({
            tabname: "/emailcampaignfooter",
            tabIcon: <i className="far fa-file-signature" data-toggle="tooltip" title="Email Campaign Footer" style={{width:22, textAlign:"center"}}></i>,
            tabPanel: <EmailCampaignFooter/>,
            tabTitle: "Email Campaign Footer"
        });
    }
    const tabNameToIndex = props.subUser.memberId === 0 ? tabUser : tabSubUser;
    const [value, setValue] = React.useState(0);
    let tabRef = useRef([]);
    const [showPopper, setShowPopper] = useState(false);
    const [arrowRef, setArrowRef] = useState(null);
    
    const handleChange = (event, newValue) => {
        History.push(`/${tabNameToIndex[newValue]}`);
        setValue(newValue);
    };
    const handleClickAway = () => {
        setShowPopper(false);
    };

    useEffect(() => {
        setShowPopper(true);
    }, []);
    useEffect(() => {
        const pathname = props.history.location.pathname;
        tabNameToIndex.map((v,i)=>(
            v.tabname === pathname && setValue(i)
        ))
        if(tabRef.current.length === 0){
            tabRef.current = Array(tabNameToIndex.length)
            .fill(null)
            .map(() => createRef());
        }
    }, [props.history.location.pathname, tabNameToIndex]);

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
                                tabNameToIndex.map((v, i) => (
                                    <Tab
                                        key={i}
                                        ref={tabRef.current[i]}
                                        component={Link}
                                        to={v.tabname}
                                        icon={v.tabIcon}
                                        onClick={handleClickAway}
                                        {...a11yProps(i)}
                                    />
                                ))
                            }
                        </Tabs>
                        {tabRef.current.length > 0 && 
                            tabNameToIndex.map((v, i) => (
                                <PopoverTooltip key={i} tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={i} showText={v.tabTitle}/>
                            ))
                        }
                    </div>
                </ClickAwayListener>
            </Col>
            <Col className="overflow-hidden">
                {
                    tabNameToIndex.map((v,i)=>(
                        <TabPanel key={i} value={value} index={i}>
                            <Suspense fallback={<Loader />}>
                                {v.tabPanel}
                            </Suspense>
                        </TabPanel>
                    ))
                }
            </Col>
        </Row>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        countrySetting: state.countrySetting,
        subUser: state.subUser
    }
}
export default connect(mapStateToProps)(withRouter(MyProfileTab));