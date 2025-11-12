import React, { Suspense, lazy, useState } from "react";
import { connect } from "react-redux";
import {Col, Row, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { Stepper, Step, StepLabel, FormControl, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {QontoConnector, QontoStepIcon} from "../../assets/commonFunctions";
import history from "../../history";
import Loader from "../shared/loaderV2/loader";
const RegularCampaign = lazy(() => import("./regularCampaign"));
const ABTestingCampaign = lazy(() => import("./abTestingCampaign"));

const BuildEmailCampaign = ({globalAlert}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [campaignMainType, selectCampaignMainType] = useState(0);
    const [title, setTitle] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModalOpen = () => setModalOpen(!modalOpen);
    const handleChange = (event) => {
        selectCampaignMainType(Number(event.target.value));
    };
    const handleNext = (stepsToMove) => {
        setActiveStep((prevActiveStep) => prevActiveStep + stepsToMove);
    };

    const handleBack = (stepsToMove) => {
        setActiveStep((prevActiveStep) => prevActiveStep - stepsToMove);
    };

    const handleClickModalOpen = (title) => {
        setTitle(title);
        toggleModalOpen();
    }
    const titleDetails = (title) => {
        title = title.split(" : ")[0];
        switch (title) {
            case "First Word Flag":
                return (
                    <>
                        <p><strong>First Word Flag</strong></p>
                        <p>The first word in a subject line offers a good indication whether the email might be viewed as SPAM. For example, subject lines starting with the word "Hi...", "Hello..." or "Hey..." could be from a friend but, more frequently, these greetings are seen in SPAM emails.</p>
                    </>
                );
            case "First Character Flag":
                return (
                    <>
                        <p><strong>First Character Flag</strong></p>
                        <p>{`The first character in a subject line offers a good indication whether the email might be viewed as SPAM. For example, subject lines starting with a dollar sign or special characters, such as ">...", are frequently seen starting the Subject line of a SPAM email.`}</p>
                    </>
                );
            case "Spam Words":
                return (
                    <>
                        <p><strong>Spam Words</strong></p>
                        <p>When spam words appear in a Subject line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to spam words by deleting the email before opening it.</p>
                    </>
                );
            case "Percent Capital Letters":
                return (
                    <>
                        <p><strong>Percent Capital Letters</strong></p>
                        <p>When the overall percentage of upper case letters to lower case letters becomes too high, there is a greater chance that SPAM filters and/or recipients might react to the email as though it is SPAM.</p>
                    </>
                );
            case "Repeating Capital Letters":
                return (
                    <>
                        <p><strong>Repeating Capital Letters</strong></p>
                        <p>When too many upper case letters occur in sequence (i.e., "SALE"), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Number of Characters":
                return (
                    <>
                        <p><strong>Number of Characters</strong></p>
                        <p>The ideal number of characters in a subject line is typically considered to be between 20 and 35. The main reason for keeping the length of the Subject line within this range is because the software people use to read their email will only display a certain number of characters by default. If the subject line is too long, its text will be truncated.</p>
                    </>
                );
            case "Word/Space Ratio":
                return (
                    <>
                        <p><strong>Word/Space Ratio</strong></p>
                        <p>Spammers have tendency to use blank spaces to catch the recipient's attention. When the ratio of spaces to words becomes too high in a Subject line, there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Gappy Check":
                return (
                    <>
                        <p><strong>Gappy Check</strong></p>
                        <p>Spammers will often use spaces between characters as an attempt to bypass word filters. When the w*o*r*d*s in a Subject line have gaps in them, there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Repetition Check":
                return (
                    <>
                        <p><strong>Repetition Check</strong></p>
                        <p>{`When a series of characters are found in repetition (i.e., ">>>"), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.`}</p>
                    </>
                );
            case "Consecutive Numbers":
                return (
                    <>
                        <p><strong>Consecutive Numbers</strong></p>
                        <p>When a Subject line has significant amount of numbers found in sequence, there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Special Character Flag":
                return (
                    <>
                        <p><strong>Special Character Flag</strong></p>
                        <p>When a Subject line has a greater than expected amount of special characters (i.e., & $ # @ ( )[ ] !), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Punctuation Flag":
                return (
                    <>
                        <p><strong>Punctuation Flag</strong></p>
                        <p>When a Subject line has a greater than expected amount of punctuation (i.e., too many periods .....), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Vulgar Words":
                return (
                    <>
                        <p><strong>Vulgar Words</strong></p>
                        <p>When vulgar words appear in a Subject line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to vulgar words by deleting the email before opening it.</p>
                    </>
                );
            case "Content Spam Words":
                return (
                    <>
                        <p><strong>Spam Words</strong></p>
                        <p>When spam words appear in a Content line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to spam words by deleting the email before opening it.</p>
                    </>
                );
            case "Content Vulgar Words":
                return (
                    <>
                        <p><strong>Vulgar Words</strong></p>
                        <p>When vulgar words appear in a Content line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to vulgar words by deleting the email before opening it.</p>
                    </>
                );
            default:
                return (
                    <>
                        <p><strong>First Word Flag</strong></p>
                        <p>The first word in a subject line offers a good indication whether the email might be viewed as SPAM. For example, subject lines starting with the word "Hi...", "Hello..." or "Hey..." could be from a friend but, more frequently, these greetings are seen in SPAM emails.</p>
                    </>
                );
        }
    }

    const getSteps = () => {
        if (campaignMainType === 1) {
            return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
        }
        if (campaignMainType === 2) {
            return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
        }
        return ["1", "2", "3"];
    }

    const steps = getSteps();

    const handleFirstStepNext = ()=>{
        if(campaignMainType === 0){
            globalAlert({
                type: "Error",
                text: "Please Select a SMS Campaign",
                open: true
            });
        } else if(campaignMainType === 1){
            handleNext(3);
        } else {
            handleNext(1);
        }
    }
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="overflow-hidden">
                    <Row className="d-flex">
                        <h3 className="ml-10" style={{ marginLeft: 40 }}>Email campaign</h3>
                    </Row>
                    <div className="w-100">
                        <Stepper
                            alternativeLabel
                            activeStep={activeStep}
                            connector={<QontoConnector />}
                            className="w-50 mx-auto"
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>{activeStep === 0 ?
                            <Row>
                                <Col xs={10} sm={10} md={6} lg={4} xl={4} className="mx-auto">
                                    <p className="font-size-18"><strong>Choose A Type Of Campaign To Send</strong></p>
                                    <FormControl component="fieldset">
                                        <RadioGroup aria-label="campaignMainType" id="campaignMainType" name="campaignMainType" value={Number(campaignMainType)} onChange={handleChange}>
                                            <Row>
                                                <Col md={12}>
                                                    <FormControlLabel value={1} control={<Radio color="primary" />} label="Regular Campaign" />
                                                </Col>
                                                <Col md={12}>
                                                    <FormControlLabel value={2} control={<Radio color="primary" />} label="A/B Testing Campaign" />
                                                </Col>
                                            </Row>
                                        </RadioGroup>
                                    </FormControl>
                                    <div className="col-12 mt-3 mb-3" align="center">
                                        <>
                                            <Button variant="contained" color="primary" onClick={()=>{history.push("/manageemailcampaign")}} className="mr-3">
                                                <i className="far fa-times mr-2"></i>CANCEL
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={handleFirstStepNext}
                                            >
                                                <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                            </Button>
                                        </>
                                    </div>
                                </Col>
                            </Row> :
                            campaignMainType === 1 ?
                                <Suspense fallback={<Loader />}>
                                    <RegularCampaign step={activeStep} handleNext={(steps) => handleNext(steps)} handleBack={(steps) => handleBack(steps)} campaignMainType={campaignMainType} handleClickModalOpen={handleClickModalOpen} />
                                </Suspense>
                            :
                                <Suspense fallback={<Loader />}>
                                    <ABTestingCampaign step={activeStep} handleNext={(steps) => handleNext(steps)} handleBack={(steps) => handleBack(steps)} campaignMainType={campaignMainType} handleClickModalOpen={handleClickModalOpen} />
                                </Suspense>
                        }</div>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={modalOpen} toggle={toggleModalOpen}>
                <ModalHeader toggle={toggleModalOpen}>Details</ModalHeader>
                <ModalBody>
                    {titleDetails(title)}
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleModalOpen()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}
export default connect(null, mapDispatchToProps)(BuildEmailCampaign);