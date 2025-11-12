import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { getListPackage, getOrderDetails, placeOrder, saveOrder } from "../../services/buildItForMeService";
import history from "../../history";
import { QontoConnector, QontoStepIcon } from "../../assets/commonFunctions";
import $ from "jquery"
import AdditionalInformation from './additionalInformation';
import AdditionalInformation2 from './additionalInformation2';
import ChoosePackage from './choosePackage';
import OrderSummary from './orderSummary';

const NewEmailTemplate = (props)=>{
    const [activeStep, setActiveStep] = useState(0);
    const [oldBfmAttachmentFile, setOldBfmAttachmentFile] = useState("");
    const [data, setData] = useState({
        bfmProjectName: "",
        bfmYourBusiness: "",
        bfmWebsite: "",
        bfmAboutYourCompany: "",
        bfmMainGoalWithEt: "",
        bfmWantIncluded: "",
        bfmCommunicateToTeam: "",
        bfmNotWantIncluded: "",
        bfmId: 0,
        bfmAttachmentFile: "",
        bfmEmailPackId: 1
    });
    const [listPackages, setListPackages] = useState([]);
    const getSteps = () => ["1", "2", "3", "4"];
    const steps = getSteps();
    const handleTextBoxChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const handleTextAreaChange = (event)=>{
        setData((prev)=>{
            return {...prev, [event.target.name]: event.target.value};
        });
    }
    const handleNext = () => {
        setActiveStep((prevstep) => (prevstep + 1));
    }
    const handleBack = () => {
        setActiveStep((prevstep) => (prevstep - 1));
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const handleNextFirstStep = () => {
        if (data.bfmProjectName === "") {
            props.globalAlert({
                type: "Error",
                text: "Please enter Project Name.",
                open: true
            });
            return false;
        }
        else if(data.bfmYourBusiness === ""){
            props.globalAlert({
                type: "Error",
                text: "Please enter Business Name.",
                open: true
            });
            return false;
        }
        handleNext();
    }
    const handleNextThirdStep = () => {
        saveOrder(data).then(res => {
            if (res.status === 200) {
                setData({...data, bfmId: res.result.bfmId});
                handleNext();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const handleNextFourthStep = () => {
        $("button.placeOrder").hide();
        $("button.placeOrder").after(`<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>`);
        placeOrder(data.bfmId,data).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/builditforme");
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.placeOrder").show();
        });
    }
    useEffect(()=> {
        let bfmId = typeof props.id !== "undefined" ? props.id : 0;
        if (bfmId > 0) {
            getOrderDetails(bfmId).then(res => {
                if (res.status === 200) {
                    if(res.result && res.result.orderDetails){
                        setData(res.result.orderDetails);
                        setOldBfmAttachmentFile(res.result.orderDetails.bfmAttachmentFile);
                    }
                }
            });
        }
    },[props.id]);
    useEffect(()=>{
        getListPackage().then(res => {
            if (res.status === 200) {
                if(res.result && res.result.listPackage){
                    setListPackages(res.result.listPackage);
                }
            }
        });
    },[]);
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <AdditionalInformation data={data} handleTextAreaChange={handleTextAreaChange} handleTextBoxChange={handleTextBoxChange} />;
            case 1:
                return <AdditionalInformation2
                    data={data}
                    id={props.id}
                    user={props.user}
                    globalAlert={props.globalAlert}
                    handleTextAreaChange={handleTextAreaChange}
                    oldBfmAttachmentFile={oldBfmAttachmentFile}
                    setData={setData}
                    setOldBfmAttachmentFile={setOldBfmAttachmentFile}
                />;
            case 2:
                return <ChoosePackage listPackages={listPackages} />;
            case 3:
                return <OrderSummary listPackages={listPackages} />
            default:
                return 'Unknown step';
        }
    }
    return (
    <>
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
            <div>
                {
                    activeStep === steps.length ? (
                        <div>
                            <Typography>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset} className="mr-3">
                                RESET
                            </Button>
                        </div>
                    ):(
                        <div>
                            {getStepContent(activeStep)}
                            <input type="hidden" name="all_temp_data" id="all_temp_data" />
                            <div className="mt-5 mb-5 text-center">
                                {
                                    (()=>{
                                        if(activeStep === 0){
                                            return (
                                                <>
                                                    <Button variant="contained" color="primary" onClick={()=>{history.push("/builditforme")}} className="mr-3">
                                                         <i className="far fa-times mr-2"></i>CANCEL
                                                    </Button>
                                                    <Button variant="contained" color="primary" onClick={handleNextFirstStep} className="mr-3">
                                                            <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                                    </Button>
                                                </>
                                            );
                                        }
                                        else if(activeStep === 1){
                                            return (
                                                <>
                                                    <Button variant="contained" color="primary" onClick={handleBack} className="mr-3">
                                                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                                                    </Button>
                                                    <Button variant="contained" color="primary" onClick={handleNext} className="mr-3">
                                                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                                    </Button>
                                                </>
                                            );
                                        }
                                        else if(activeStep === 2){
                                            return (
                                                <>
                                                    <Button variant="contained" color="primary" onClick={handleBack} className="mr-3">
                                                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                                                    </Button>
                                                    <Button variant="contained" color="primary" onClick={handleNextThirdStep} className="mr-3">
                                                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                                    </Button>
                                                </>
                                            );
                                        }
                                        else if(activeStep === 3){
                                            return (
                                                <>
                                                    <Button variant="contained" color="primary" onClick={handleNextFourthStep} className="mr-3 placeOrder">
                                                        <i className="far fa-cart-arrow-down mr-2"></i>PLACE ORDER
                                                    </Button>
                                                </>
                                            );
                                        }
                                    })()
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    </>
    );
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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewEmailTemplate);
