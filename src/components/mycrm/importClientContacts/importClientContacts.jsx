import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Stepper, Step, StepLabel} from "@mui/material";
import ImportMethod from "./importMethod"
import UploadFile from "./uploadFile";
import DataTable from "./dataTable";
import ImportFinish from "./importFinish";
import FieldMappingComponent from "./fieldMapping";
import { resetStore } from "../../../actions/importContactActions";
import {QontoConnector, QontoStepIcon} from "../../../assets/commonFunctions";
import { cancelUpload } from "../../../services/clientContactService";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { pathOr } from "ramda";
import OptIn from "./optIn";
import EmailVerification from "./emailVerification";

function getSteps() {
    return ["Select an import method", "Select File", "import table", "Field Mapping", "done","t1","t2"];
}

const ImportClientContacts = ({ resetStore, globalAlert, filePath, transId }) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        let requestData = {
            "filePath" : filePath,
            "transId" : transId || 0
        }
        cancelUpload(requestData).then(resp => {
            if (resp.status === 200) {
                resetStore();
                setActiveStep(0);
                globalAlert({
                    type: "Success",
                    text: resp ? resp.message : "Success",
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: resp ? resp.message : "Error",
                    open: true
                });
            }
        })
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <ImportMethod
                            onBackPress={() => { }}
                            onNextPress={handleNext}
                            setActiveStep={setActiveStep}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <UploadFile
                            onBackPress={handleBack}
                            onProcessPress={handleNext}
                            onCancelPress={handleReset}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <DataTable
                            onBackPress={handleBack}
                            onNextPress={handleNext}
                            onCancelPress={handleReset}
                        />
                    </>
                );
            case 3:
                return (
                    <>
                        <FieldMappingComponent
                            onBackPress={handleBack}
                            onNextPress={handleNext}
                            onCancelPress={handleReset}
                        />
                    </>
                )
            case 4:
                return (
                    <>
                        <EmailVerification
                            onBackPress={handleBack}
                            onNextPress={handleNext}
                            onCancelPress={handleReset}
                        />
                    </>
                )
            case 5:
                return (
                    <>
                        <OptIn
                            onBackPress={handleBack}
                            onNextPress={handleNext}
                            onCancelPress={handleReset}
                        />
                    </>
                )
            case 6:
                return (
                    <>
                        <ImportFinish
                            onBackPress={handleBack}
                            onCancelPress={handleReset}
                        />
                    </>
                )
            default:
                return "Unknown step";
        }
    }
    return (
        <Row className="midleMain">
            <Col>
                <div>
                    <h3>Import Client Contacts</h3>
                </div>
                <div>
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
                </div>
                <div>
                    {getStepContent(activeStep)}
                </div>
            </Col>
        </Row>
    )
}
const mapStateToProps = (state) => {
    return {
        filePath: pathOr("", ["importContact", "filePath"], state),
        transId: pathOr("", ["importContact", "importContactData", "transId"], state)
    }
}
const mapDispatchToProps = dispatch => {
    return {
        resetStore: () => { dispatch(resetStore()) },
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportClientContacts);