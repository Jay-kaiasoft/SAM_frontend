import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {Box, AppBar, Toolbar, Button, Card, CardActionArea, CardActions, CardContent} from "@mui/material";
import styles from "../../assets/styles/componentStyles.js";
import { siteURL, staticUrl, tokenName, websiteSmallTitleWithExt } from "../../config/api";
import Footer from "../shared/footer/footer.jsx";
import { easUrlEncoder, getClientTimeZone, setBrandColorsToLocal } from "../../assets/commonFunctions";
import { changePlan, getPlanById, getPlanListById } from "../../services/userService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { connect } from "react-redux";
import History from "../../history.js";
import { userLoggedIn } from "../../actions/userActions.js";
import { setSubUserAction } from "../../actions/subUserActions.js";
import { setMenuListAction } from "../../actions/menuListActions.js";
import { setModuleListAction } from "../../actions/moduleListActions.js";
import { setCountrySettingAction } from "../../actions/countrySettingActions.js";
import { getSync } from "../../services/myCalendarServices.js";

const ChoosePlan = ({location, globalAlert, userLoggedIn, setSubUserAction, setMenuListAction, setModuleListAction, setCountrySettingAction}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const [planData, setPlanData] = useState({});
    const [planDetail, setPlanDetail] = useState({});
    const [emailVerificationPrice, setEmailVerificationPrice] = useState("");
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const displaygetPlanListById = useCallback(() => {
        let countryId = 100;
        let planId = 0;
        getPlanListById(countryId, planId).then((res) => {
            if (res.status === 200) {
                setPlanData(res.result.data);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        })
    },[globalAlert]);
    const handleClickPlan = (planId) => {
        let requestData = {
            "encMemberId": queryString.get('v'),
            "encPlanId": easUrlEncoder(planId)
        }
        changePlan(requestData).then((res) => {
            if (res.status === 200) {
                setBrandColorsToLocal(res.result.member.brandKits);
                sessionStorage.setItem("user", JSON.stringify(res.result.member));
                sessionStorage.setItem("subUser", JSON.stringify(res.result.subMember));
                sessionStorage.setItem("menuList", JSON.stringify(res.result.menuList));
                sessionStorage.setItem("moduleList", JSON.stringify(res.result.moduleList));
                sessionStorage.setItem("countrySetting", JSON.stringify(res.result.countrySetting));
                sessionStorage.setItem("isLoggedInUser", "yes");
                userLoggedIn(res.result.member);
                setSubUserAction(res.result.subMember);
                setMenuListAction(res.result.menuList);
                setModuleListAction(res.result.moduleList);
                setCountrySettingAction(res.result.countrySetting);
                History.push("/dashboard");
                let tz = (typeof res.timeZone === "undefined" || res.timeZone === "" || res.timeZone === null) ? getClientTimeZone() : res.timeZone;
                getSync(tz);
                let time = new Date(new Date().getTime() + (60 * 60 * 24 * 1000 * 1));
                document.cookie = `${tokenName}=${res.result.token}; expires=${time}; path=${websiteSmallTitleWithExt}`;
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        })
    }
    const handleClickDetails = (planId) => {
        let requestData = `countryId=100&planId=${planId}`
        getPlanById(requestData).then(res=>{
            if(res.status === 200){
                let temp = '';
                temp += '<div class="row">';
                temp += '<div class="col-6 font-weight-bold">Emails</div><div class="col-6 font-weight-bold">Price/Email</div>';
                res.result.plan.countrySetting.emailVerificationPrice.map((v)=>(
                    temp += '<div class="col-6 text-left">'+v.evpContactTotal+'</div><div class="col-6 text-right">'+res.result.plan.countrySetting.cntyPriceSymbol+v.evpRate+'</div>'
                ));
                temp += '</div>';
                setEmailVerificationPrice(temp);
                setPlanDetail(res.result.plan);
                toggle();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })     
            }
        })
    }

    useEffect(() => {
        displaygetPlanListById();
    }, [displaygetPlanListById]);

    return (
        <>
            <Row className="headerMain">
                <Col className='p-0'>
                    <Box>
                        <AppBar elevation={0} color='transparent' position='static' sx={styles.header}>
                            <Toolbar>
                                <a className="navbar-brand mr-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /></a>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </Col>
            </Row>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        JSON.stringify(planData) !== '{}' ? 
                            <Row className="d-flex justify-content-center align-items-center h-100">
                                {planData.planId.map((value, index)=>{
                                    return (
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3} key={index} className="mb-5">
                                            <Card className="h-100 d-flex flex-column justify-content-between">
                                                <CardActionArea onClick={()=>{handleClickPlan(value)}}>
                                                    <CardContent>
                                                    <div className="text-center"  style={{fontSize:"28px"}}>{planData.planName[index]}</div>
                                                    <div className="text-center" style={{fontSize:"40px"}}>{`${planData.cntyPriceSymbol[index]}${planData.planPrice[index]}`}</div>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions className="d-flex justify-content-end">
                                                <Button size="small" variant="contained" color="primary" onClick={()=>{handleClickDetails(value)}}>DETAILS</Button>
                                            </CardActions>
                                        </Card>
                                    </Col>
                                    )
                                })}
                            </Row>
                        : null
                    }
                </Col>
            </Row>
            <Row className="footerMain">
                <Col>
                    <Footer />
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Plan Details</ModalHeader>
                <ModalBody>
                    {
                        (JSON.stringify(planDetail) !== '{}') ?
                            <Row>
                                <Col sm={9} className="mx-auto">
                                    <p style={{fontSize:"28px"}} className="text-center mb-0">{planDetail.planName}</p>
                                    <p style={{fontSize:"40px"}} className="text-center">{`${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyPlanPrice}`}</p>
                                    <Row>
                                        <Col><strong>EMAIL MARKETING</strong></Col>
                                        <Col>&nbsp;</Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>Contacts Included</Col>
                                        <Col>{planDetail.countrySetting.cntyContactsIncluded === 0 ? "Unlimited" : planDetail.countrySetting.cntyContactsIncluded}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Multi-User</Col>
                                        <Col>{planDetail.countrySetting.cntyMultiUser === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Automation</Col>
                                        <Col>{planDetail.countrySetting.cntyAutomation === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>A/B Testing</Col>
                                        <Col>{planDetail.countrySetting.cntyAbTesting === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>WhiteListing</Col>
                                        <Col>{planDetail.countrySetting.cntyWhiteListing === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Max Number of Emails</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntyCampaignPerPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyCampaignPerPrice
                                            }
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col>Surveys</Col>
                                        <Col>{planDetail.countrySetting.cntySurveyPrice === "0" ? "Free" : planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntySurveyPrice}</Col>
                                    </Row> */}
                                    <Row>
                                        <Col>Surveys Response</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntySurveyPerPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntySurveyPerPrice
                                            }
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col>Assessments</Col>
                                        <Col>{planDetail.countrySetting.cntyAssessmentPrice === "0" ? "Free" : planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyAssessmentPrice}</Col>
                                    </Row> */}
                                    <Row>
                                        <Col>Assessments Response</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntyAssessmentPerPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyAssessmentPerPrice
                                            }
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col>Forms & Landing Pages</Col>
                                        <Col>{planDetail.countrySetting.cntyIndividualPrice === "0" ? "Free" : planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyIndividualPrice}</Col>
                                    </Row> */}
                                    <Row>
                                        <Col>Forms & Landing Pages Response</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntyFormResponse === "0" ?
                                                        "Unlimited"
                                                    :
                                                        planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyFormResponse
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col><strong>SMS MARKETING</strong></Col>
                                        <Col>&nbsp;</Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>SMS</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntySMSPerPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        `${planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntySMSPerPrice} (*Note 2)`
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>SMS Chat</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntySMSConversationsPerPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        `${planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntySMSConversationsPerPrice} (*Note 3)`
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>SMS Inbox</Col>
                                        <Col>{planDetail.countrySetting.cntySmsInbox === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>MMS</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `First ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} Free (*Note 1)`
                                                :
                                                    planDetail.countrySetting.cntyMMSPerPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        `${planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyMMSPerPrice} (*Note 3)`
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col><strong>CRM PLATFORM</strong></Col>
                                        <Col>&nbsp;</Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>Calendar</Col>
                                        <Col>{planDetail.countrySetting.cntyCalendar === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Social Media Posting</Col>
                                        <Col>{planDetail.countrySetting.cntySocialMedia === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Phone Calls</Col>
                                        <Col>
                                            {
                                                planDetail.planName === "Free" ?
                                                    `No`
                                                :
                                                    planDetail.countrySetting.cntyCallPerMinPrice === "0" ?
                                                        "Unlimited"
                                                    :
                                                        `${planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyCallPerMinPrice} (per min)`
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>Zoom Conferences</Col>
                                        <Col>{planDetail.countrySetting.cntyZoomConferences === "Y" ? "Yes" : "No"}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Support</Col>
                                        <Col>{planDetail.countrySetting.cntySupport}</Col>
                                    </Row>
                                    <Row>
                                        <Col>{`Additional ${planDetail.countrySetting.cntyAdditionalContacts} Contacts`}</Col>
                                        <Col>{planDetail.countrySetting.cntyAdditionalContactsPrice === "0" ? "N/A" : planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyAdditionalContactsPrice}</Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col><strong>ADD ON SERVICES</strong></Col>
                                        <Col>&nbsp;</Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>Domain Warmup</Col>
                                        <Col>{planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cntyWarmupPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Email Verification</Col>
                                        <Col className="cursor-pointer"><span data-toggle="tooltip" data-html={true} data-template="<div class='tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>" title={emailVerificationPrice}>View Charges</span></Col>
                                    </Row>
                                    <Row>
                                        <Col>10DLC Registration</Col>
                                        <Col>{planDetail.countrySetting.cntyPriceSymbol+planDetail.countrySetting.cnty10DLCPrice}</Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col sm={12}>{`Note 1 : Pay as you Go pricing includes a ${planDetail.countrySetting.cntyPriceSymbol}${planDetail.countrySetting.cntyFirstInvFreeAmt} credit to try the product out for free.`}</Col>
                                        <Col sm={12}>Note 2 : United States Only. Inbound and Outbound SMS, 160 Character per text.</Col>
                                        <Col sm={12}>Note 3 : SMS Charges May Apply.</Col>
                                        <Col sm={12}>{`Note 4 : Language Translation is ${planDetail.countrySetting.cntyTranslateCharCharge} Cents Per Character.`}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        : null
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" className="mr-3" color="primary" onClick={()=>{handleClickPlan(planDetail.planId)}}>CHANGE TO THIS PLAN</Button>
                    <Button variant="contained" color="primary" onClick={toggle}>CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        setSubUserAction: (data) => {
            dispatch(setSubUserAction(data))
        },
        setMenuListAction: (data) => {
            dispatch(setMenuListAction(data))
        },
        setModuleListAction: (data) => {
            dispatch(setModuleListAction(data))
        },
        setCountrySettingAction: (data) => {
            dispatch(setCountrySettingAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ChoosePlan);