import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import Switch from '@mui/material/Switch';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {facebookLogout, facebookOauth, getSocialMediaAuthentication, linkedinLogout, linkedInOauth, twitterLogout, twitterOauth} from "../../services/socialMediaService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import {facebookUrl, googleCalendarUrl, linkedinUrl, outlookCalendarUrl, siteURL, twitterUrl, zoomUrl} from "../../config/api";
import {getCalendarAuthentication, getSync, googleCalendarOauth, googleCalendarRevoke, outlookCalendarOauth, outlookCalendarRevoke} from '../../services/myCalendarServices';
import {getShopifyAuthentication, shopifyLogout, shopifyOauth} from "../../services/shopifyService";
import {getZoomAuthentication, zoomLogout, zoomOauth} from "../../services/clientContactService";
import { getClientTimeZone } from './../../assets/commonFunctions';

const ManageApps = ({ globalAlert, confirmDialog, user }) => {
    const [facebook, setFacebook] = React.useState(false);
    const [twitter, setTwitter] = React.useState(false);
    const [linkedin, setLinkedin] = React.useState(false);
    const [shopify, setShopify] = React.useState(false);
    const [zoom, setZoom] = React.useState(false);
    const [googleCalendar, setGoogleCalendar] = React.useState(false)
    const [outlookCalendar, setOutlookCalendar] = React.useState(false)

    const handleClickGoogleCalendar = (event) => {
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(googleCalendarUrl + '/googleCalendarSignIn', "GoogleCalendarWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.gcSuccess = function (data) {
                googleCalendarOauth(data).then(res => {
                    if (res.status === 200) {
                        setGoogleCalendar(true)
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
            window.gcError = function () {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong!!!",
                    open: true
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect Google Calendar?',
                onConfirm: () => {
                    googleCalendarRevoke().then(res => {
                        if (res.status === 200) {
                            setGoogleCalendar(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
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
    }
    const handleClickOutlookCalendar = (event) => {
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(outlookCalendarUrl + '/outlookCalendarSignIn', "OutlookCalendarWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.ocSuccess = function (data) {
                outlookCalendarOauth(data).then(res => {
                    if (res.status === 200) {
                        setOutlookCalendar(true)
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
                        getSync(tz).then(res => {
                            if (res.status !== 200) {
                                globalAlert({
                                    type: "Error",
                                    text: res.message,
                                    open: true
                                });
                            }
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
            window.ocError = function () {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong!!!",
                    open: true
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect Outlook Calendar?',
                onConfirm: () => {
                    outlookCalendarRevoke().then(res => {
                        if (res.status === 200) {
                            setOutlookCalendar(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
                            getSync(tz).then(res => {
                                if (res.status !== 200) {
                                    globalAlert({
                                        type: "Error",
                                        text: res.message,
                                        open: true
                                    });
                                }
                            });
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
    }

    const handleClickFaceBook = (event) => {
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(facebookUrl + '/facebookLogin', "FacebookWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.fbSuccess = function (data) {
                facebookOauth(data).then(res => {
                    if (res.status === 200) {
                        setFacebook(true);
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
            window.fbError = function () {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong!!!",
                    open: true
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect Facebook?',
                onConfirm: () => {
                    facebookLogout().then(res => {
                        if (res.status === 200) {
                            setFacebook(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
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
    }
    const handleClickTwitter = (event) => {
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(twitterUrl + '/twitterLogin', "TwitterWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.twSuccess = function (data) {
                twitterOauth(data).then(res => {
                    if (res.status === 200) {
                        setTwitter(true);
                    }
                });
            }
            window.twError = function () {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong!!!",
                    open: true
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect Twitter?',
                onConfirm: () => {
                    twitterLogout().then(res => {
                        if (res.status === 200) {
                            setTwitter(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
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
    }
    const handleClickLinkedIn = (event) => {
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(linkedinUrl + '/linkedinLogin', "LinkedinWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.liSuccess = function (data) {
                linkedInOauth(data).then(res => {
                    if (res.status === 200) {
                        setLinkedin(true);
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
            window.liError = function () {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong!!!",
                    open: true
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect LinkedIn?',
                onConfirm: () => {
                    linkedinLogout().then(res => {
                        if (res.status === 200) {
                            setLinkedin(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
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
    }
    const handleClickShopify = (event) => {
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(siteURL + '/shopifyoauthredirect', "ShopifyWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.shpSuccess = function (data) {
                shopifyOauth(data).then(res => {
                    if (res.status === 200) {
                        setShopify(true);
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect Shopify?',
                onConfirm: () => {
                    shopifyLogout().then(res => {
                        if (res.status === 200) {
                            setShopify(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
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
    }

    const handleClickZoom = (event) => {
        // globalAlert({
        //     type: "Success",
        //     text: "This feature is in Beta Testing and will be available shortly.",
        //     open: true
        // });
        // return false;
        if (event.target.checked) {
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(zoomUrl + '/zoomLogin', "zOOMWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.zoomSuccess = function (data) {
                zoomOauth(data).then(res => {
                    if (res.status === 200) {
                        setZoom(true);
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
            window.zoomError = function () {
                globalAlert({
                    type: "Error",
                    text: "Something went wrong!!!",
                    open: true
                });
            }
        } else {
            confirmDialog({
                open: true,
                title: 'Are you sure disconnect Zoom?',
                onConfirm: () => {
                    zoomLogout().then(res => {
                        if (res.status === 200) {
                            setZoom(false);
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
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
    }
    useEffect(() => {
        getSocialMediaAuthentication().then(res => {
            if (res.status === 200) {
                if (res.result.facebook) {
                    setFacebook(true);
                }
                if (res.result.twitter) {
                    setTwitter(true);
                }
                if (res.result.linkedin) {
                    setLinkedin(true);
                }
            }
        });
        getCalendarAuthentication().then(res => {
            if (res.status === 200) {
                if (res.result.googleCalendar) {
                    setGoogleCalendar(true);
                }
                if (res.result.outlookCalendar) {
                    setOutlookCalendar(true);
                }
            }
        });
        getShopifyAuthentication().then(res => {
            if (res.status === 200) {
                if (res.result.shopify) {
                    setShopify(true);
                }
            }
        });
        getZoomAuthentication().then(res=>{
            if (res.status === 200) {
                if (res.result.zoom) {
                    setZoom(true);
                }
            }
        })
    }, []);
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mb-5'>Manage Apps</h3>
                </Col>
            </Row>
            <Row>
                <Col md={10} className="mx-auto">
                    <Row>
                        <Col xs={10} sm={10} md={8} lg={5} xl={5} className="shadow p-5 justify-items-center mx-auto mb-5">
                            <h4 className="separator" style={{color:"#242424"}}>Calendar</h4>
                            <div className='mb-4 d-flex'>
                                <img src={`${siteURL}/img/googlecalendar.png`} alt="Google Calendar" style={{ width: "40px" }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">Google Calendar</h6>
                                <Switch color="primary" checked={googleCalendar} onChange={handleClickGoogleCalendar} name='google' />
                            </div>
                            <div className='d-flex'>
                                <img src={`${siteURL}/img/outlookcalendar.png`} alt="Outlook Calendar" style={{ width: "40px" }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">Outlook Calendar</h6>
                                <Switch color="primary" checked={outlookCalendar} onChange={handleClickOutlookCalendar} name='outlook' />
                            </div>
                        </Col>
                        <Col xs={10} sm={10} md={8} lg={5} xl={5} className="shadow p-5 justify-items-center mx-auto mb-5">
                            <h4 className="separator" style={{color:"#242424"}}>Social Media</h4>
                            <div className='mb-4 d-flex'>
                                <FacebookIcon color="primary" style={{ fontSize: 40 }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">Facebook</h6>
                                <Switch color="primary" checked={facebook} onChange={handleClickFaceBook} name='facebook' />
                            </div>
                            <div className='mb-4 d-flex'>
                                <img src={`${siteURL}/img/twitter-x.svg`} alt="Twitter" style={{ width: "40px", padding:"5px" }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">Twitter</h6>
                                <Switch color="primary" checked={twitter} onChange={handleClickTwitter} name='twitter' />
                            </div>
                            <div className='d-flex'>
                                <LinkedInIcon color="primary" style={{ fontSize: 40 }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">LinkedIn</h6>
                                <Switch color="primary" checked={linkedin} onChange={handleClickLinkedIn} name='linkedin' />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10} sm={10} md={8} lg={5} xl={5} className="shadow p-5 justify-items-center mx-auto mb-5">
                            <h4 className="separator" style={{color:"#242424"}}>Meetings</h4>
                            <div className='d-flex'>
                                <img src={`${siteURL}/img/zoomus-icon.svg`} alt="Shopify" style={{ width: "40px" }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">Zoom</h6>
                                <Switch color="primary" checked={zoom} onChange={handleClickZoom} name='zoom' />
                            </div>
                        </Col>
                        <Col xs={10} sm={10} md={8} lg={5} xl={5} className="shadow p-5 justify-items-center mx-auto mb-5">
                            <h4 className="separator" style={{color:"#242424"}}>E-Commerce</h4>
                            <div className='d-flex'>
                                <img src={`${siteURL}/img/shopify.png`} alt="Shopify" style={{ width: "40px" }} />
                                <h6 className="w-75 pl-4 d-flex align-items-center m-0">Shopify</h6>
                                <Switch color="primary" checked={shopify} onChange={handleClickShopify} name='shopify' />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageApps)