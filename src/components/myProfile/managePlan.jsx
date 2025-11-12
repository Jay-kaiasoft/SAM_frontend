import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import { getPlanById, getPlanListById, updatePlan } from "../../services/userService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { Button, Card, CardActionArea, CardActions, CardContent } from "@mui/material";
import { userLoggedIn } from "../../actions/userActions";
import { setCountrySettingAction } from "../../actions/countrySettingActions";
import { checkAuthorized } from "../../services/commonService";
import history from "../../history";

const ManagePlan = ({
    confirmDialog,
    globalAlert,
    user,
    userLoggedIn,
    countrySetting
}) => {
    const [planData, setPlanData] = useState({});
    const [planDetail, setPlanDetail] = useState({});
    const [upgradePlan, setUpgradePlan] = useState(false);
    const [emailVerificationPrice, setEmailVerificationPrice] = useState("");
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const displaygetPlanListById = useCallback(() => {
        let countryId = 100;
        let planId = user?.planVisibility === "Private" ? user.planId : 0;
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
    },[globalAlert])

    const handleClickPlan = (planId) => {
        checkAuthorized().then(res => {
            if (res.status === 200) {
                confirmDialog({
                    open: true,
                    title: "Are you sure upgrade this plan?",
                    onConfirm: () => {
                        const payload = {
                            "encPlanId": planId
                        }
                        updatePlan(payload).then(res1 => {
                            if (res1.status === 200) {
                                globalAlert({
                                    type: "Success",
                                    text: res1.message,
                                    open: true
                                })
                                let requestData = `countryId=100&planId=${planId}`
                                getPlanById(requestData).then(res2=>{
                                    if(res2.status === 200){
                                        userLoggedIn({...user, "encPlanId": planId, "planId": res2.result.plan.countrySetting.cntyPlanId});
                                        sessionStorage.setItem('user',JSON.stringify({...user, "encPlanId": planId, "planId": res2.result.plan.countrySetting.cntyPlanId}));
                                        countrySetting(res2.result.plan.countrySetting);
                                        sessionStorage.setItem('countrySetting',JSON.stringify(res2.result.plan.countrySetting));
                                        setUpgradePlan(false);
                                        if(modal === true){
                                            toggle();
                                        }
                                    } else {
                                        globalAlert({
                                            type: "Error",
                                            text: res2.message,
                                            open: true
                                        })     
                                    }
                                })
                            } else {
                                globalAlert({
                                    type: "Error",
                                    text: res1.message,
                                    open: true
                                })
                            }
                        })
                    }
                });
            } else {
                confirmDialog({
                    open: true,
                    title: 'Your credit card is not available. Please add it.',
                    onConfirm: () => {
                        history.push("/carddetails");
                    }
                });
            }
        });
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
    }, [displaygetPlanListById])

    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mb-5'>{upgradePlan === true ? "Upgrade Plan" : "Manage Plan"}</h3>
                </Col>
            </Row>
            <Row>
                {
                    (JSON.stringify(planData) !== '{}') ?
                        upgradePlan ?
                            <>
                                {
                                    planData.planId.map((value, index)=>{
                                        return (
                                            <Col xs={12} sm={12} md={3} lg={3} xl={3} key={index} className="mb-5">
                                                <Card className="h-100 d-flex flex-column justify-content-between">
                                                    {
                                                        user.encPlanId === value ?
                                                            <CardContent>
                                                                {
                                                                    user.encPlanId === value ?
                                                                        <div className="plan-selected">Selected</div>
                                                                    :
                                                                        <div className="plan-select">&nbsp;</div>
                                                                }
                                                                <div className="text-center"  style={{fontSize:"28px"}}>{planData.planName[index]}</div>
                                                                <div className="text-center" style={{fontSize:"40px"}}>{`${planData.cntyPriceSymbol[index]}${planData.planPrice[index]}`}</div>
                                                            </CardContent>
                                                        :
                                                            <CardActionArea onClick={()=>{handleClickPlan(value)}}>
                                                                <CardContent>
                                                                    {
                                                                        user.encPlanId === value ?
                                                                            <div className="plan-selected">Selected</div>
                                                                        :
                                                                            <div className="plan-select">&nbsp;</div>
                                                                    }
                                                                    <div className="text-center"  style={{fontSize:"28px"}}>{planData.planName[index]}</div>
                                                                    <div className="text-center" style={{fontSize:"40px"}}>{`${planData.cntyPriceSymbol[index]}${planData.planPrice[index]}`}</div>
                                                                </CardContent>
                                                            </CardActionArea>
                                                    }
                                                    <CardActions className="d-flex justify-content-end">
                                                        <Button size="small" variant="contained" color="primary" onClick={()=>{handleClickDetails(value)}}>DETAILS</Button>
                                                    </CardActions>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button variant="contained" color="primary" onClick={()=>{setUpgradePlan(false)}}>CANCEL</Button>
                                </Col>
                            </>
                        :
                            planData.planId.map((value, index)=>(
                                user.encPlanId === value ?
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3} key={index} className="mx-auto">
                                        <Card>
                                            <CardContent>
                                                {
                                                    user.encPlanId === value ?
                                                        <div className="plan-selected">Selected</div>
                                                    :
                                                        <div className="plan-select">&nbsp;</div>
                                                }
                                                <div className="text-center"  style={{fontSize:"28px"}}>{planData.planName[index]}</div>
                                                <div className="text-center" style={{fontSize:"40px"}}>{`${planData.cntyPriceSymbol[index]}${planData.planPrice[index]}`}</div>
                                            </CardContent>
                                            <CardActions className="d-flex justify-content-end">
                                                <Button size="small" variant="contained" color="primary" onClick={()=>{handleClickDetails(value)}}>DETAILS</Button>
                                            </CardActions>
                                        </Card>
                                        {user?.planVisibility === "Public" && <div className="text-center">
                                            <Button variant="contained" className="mt-5" color="primary" onClick={()=>{setUpgradePlan(true)}}>CHANGE PLAN</Button>
                                        </div>}
                                    </Col>
                                : null
                            ))
                    : null
                }
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
                    { user.encPlanId !== planDetail.planId && <Button variant="contained" className="mr-3" color="primary" onClick={()=>{handleClickPlan(planDetail.planId)}}>CHANGE TO THIS PLAN</Button>}
                    <Button variant="contained" color="primary" onClick={toggle}>CLOSE</Button>
                </ModalFooter>
            </Modal>
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
        },
        userLoggedIn: (data) => dispatch(userLoggedIn(data)),
        countrySetting: (data) => dispatch(setCountrySettingAction(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagePlan)