import React from "react";
import { connect } from "react-redux";
import { Button, Drawer, MobileStepper } from '@mui/material';
import { Col, Row } from "reactstrap";
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import WorkflowDetails from "../screens/workflowDetails";

const EmailLinkClicked = ({
    data,
    setData,
    triggerModal,
    setTriggerModal,
    handleClickSubmitTrigger,
    globalAlert
}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 1;
    const handleNext = () => {
        if (activeStep === 0 && !data?.name) {
            globalAlert({
                type: "Error",
                text: "Please Enter Name of Workflow",
                open: true
            })
            return
        }
        handleClickSubmitTrigger(data);
        setTriggerModal(false);
        setActiveStep(0)
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    return (
        <Drawer open={triggerModal} anchor={'right'} className="ComponentSidebarWrapper">
            <div className='cross-icon-container'>
                <i className="far fa-times fa-lg" onClick={() => { setTriggerModal(!triggerModal) }}></i>
            </div>
            <div className='starting-point-container'>
                <Row>
                    <Col>
                        {activeStep === 0 && <WorkflowDetails data={data} handleDataChange={handleDataChange} title="Enter Email Link Clicked Details" />}
                    </Col>
                </Row>
                <MobileStepper
                    variant="text"
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        activeStep !== maxSteps - 1 ?
                            <Button size="small" onClick={() => { handleNext() }} >
                                NEXT
                                <KeyboardArrowRight />
                            </Button> :
                            <Button size="small" onClick={() => { handleNext() }} >
                                FINISH
                            </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />BACK
                        </Button>
                    }
                />
            </div>
        </Drawer>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(null, mapDispatchToProps)(EmailLinkClicked);