import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import { Col, Row } from "reactstrap";
import { Button, Drawer } from '@mui/material';
import {MoveToInbox, StarBorder, KeyboardArrowRight} from '@mui/icons-material';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import EmailCampaign from './journeys/emailCampaign';
import EmailLinkClicked from "./journeys/emailLinkClicked"
import { dateTimeFormatDB } from '../../assets/commonFunctions';
import SmsCampaign from './journeys/smsCampaign';

const TriggerComponent = ({
    triggerModal,
    setTriggerModal,
    handleClickSubmitTrigger,
    activeNodeData,
    id,
    globalAlert
}) => {
    const [showMore, setShowMore] = useState(false)
    const [nextButtonClicked, setNextButtonClicked] = useState(false)
    const [data, setData] = useState({})
    useEffect(() => {
        setData({
            ...activeNodeData?.data,
            value: activeNodeData?.data?.value || "1",
            duration: activeNodeData?.data?.duration || "day",
            sendDateTime: dateTimeFormatDB(new Date()),
        })
    }, [activeNodeData?.data])
    useEffect(()=>{
        if(id !== 0) {
            setNextButtonClicked(true);
        }
    }, [id])
    const amStartingActions = [
        {
            name: "Send Campaign",
            amStartConditions: ["Email Campaign"]
            // amStartConditions: ["Email Campaign", "SMS Campaign", "Social Media Campaign"]
        },
        // {
        //     name: "Link Clicked",
        //     amStartConditions: ["Email Link Clicked", "SMS Link Clicked", "Social Media Link Clicked"]
        // },
        // {
        //     name: "Subscribe To Email"
        // },
        // {
        //     name: "Unsubscribe To Email"
        // },
        // {
        //     name: "Email Open"
        // }
    ]
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleNext = () => {
        if (data?.amStartingActionIndex === "" || data?.amStartingActionIndex === null) {
            globalAlert({
                type: "Error",
                text: "Please Select Starting Point",
                open: true
            })
            return
        } else {
            if (data?.amStartingActionIndex !== "" && amStartingActions[Number(data?.amStartingActionIndex)]?.amStartConditions && (data?.amStartConditionIndex === "" || data?.amStartConditionIndex === null)) {
                globalAlert({
                    type: "Error",
                    text: "Please select Starting Point Type",
                    open: true
                })
                return
            }
        }
        setNextButtonClicked(true)
    };
    const journeyToShow = () => {
        if (data?.selectedAction === "Send Campaign") {
            if (data?.selectedTriggerType === "Email Campaign") {
                return <EmailCampaign data={data} setData={setData} triggerModal={triggerModal} setTriggerModal={setTriggerModal} handleClickSubmitTrigger={handleClickSubmitTrigger} id={id} />
            } else if (data?.selectedTriggerType === "SMS Campaign") {
                return <SmsCampaign data={data} setData={setData} triggerModal={triggerModal} setTriggerModal={setTriggerModal} handleClickSubmitTrigger={handleClickSubmitTrigger} />
            }
        } else if (data?.selectedAction === "Link Clicked") {
            if (data?.selectedTriggerType === "Email Link Clicked") {
                return <EmailLinkClicked data={data} setData={setData} triggerModal={triggerModal} setTriggerModal={setTriggerModal} handleClickSubmitTrigger={handleClickSubmitTrigger} />
            }
        }
    }
    if ((data?.amStartingActionIndex === "" || typeof data?.amStartingActionIndex === "undefined" || data?.amStartingActionIndex === null || !nextButtonClicked || (amStartingActions[Number(data?.amStartConditionIndex)]?.amStartConditions && data?.selectedTriggerType === "") ) ) {
        return (
            <Drawer open={triggerModal} anchor={'right'} className="ComponentSidebarWrapper">
                <div className='cross-icon-container'>
                    <i className="far fa-times fa-lg" onClick={() => { setTriggerModal(!triggerModal) }}></i>
                </div>
                <div className='starting-point-container'>
                    <Row>
                        <Col xl={10} className="mx-auto">
                            <p className='heading-style'>Select Starting Point</p>
                            {amStartingActions.map((actionValue, index) => {
                                return (
                                    <Fragment key={index}>
                                        <div
                                            onClick={() => {
                                                if (data?.amStartingActionIndex === index || data?.amStartingActionIndex === null) {
                                                    setShowMore(!showMore)
                                                }
                                                else {
                                                    setShowMore(true)
                                                }
                                                handleDataChange("amStartingActionIndex", index)
                                                handleDataChange("selectedAction", actionValue.name)
                                                handleDataChange("amStartConditionIndex", null)
                                                handleDataChange("selectedTriggerType", "")
                                            }}
                                            className={`${data?.amStartingActionIndex === index ? "pointLabelContainerSelected" : "pointLabelContainer"}`}
                                        >
                                            <span><MoveToInbox className='mr-4' />{actionValue.name}</span>
                                            {actionValue.amStartConditions && (data?.amStartingActionIndex === index && showMore ? <i className="far fa-angle-up"></i> : <i className="far fa-angle-down"></i>)}
                                        </div>
                                        {data?.amStartingActionIndex === index && showMore ?
                                            <div className='subPointsContainer'>
                                                {actionValue?.amStartConditions?.map((triggerType, index) => {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className={`${data?.amStartConditionIndex === index ? "subPointLabelContainerSelected" : "subPointLabelContainer"}`}
                                                            onClick={() => {
                                                                handleDataChange("amStartConditionIndex", index)
                                                                handleDataChange("selectedTriggerType", triggerType)
                                                            }}
                                                        ><StarBorder className='mr-4' />{triggerType}</span>
                                                    )
                                                })}
                                            </div> : null}
                                    </Fragment>
                                )
                            })}
                        </Col>
                    </Row>
                    <Button size="small" onClick={() => { handleNext() }} >
                        NEXT
                        <KeyboardArrowRight />
                    </Button>
                </div>
            </Drawer>
        );
    } else {
        return (
            <>
                {journeyToShow()}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        firstName: pathOr("", ["user", "firstName"], state),
        lastName: pathOr("", ["user", "lastName"], state),
        email: pathOr("", ["user", "email"], state)
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TriggerComponent);