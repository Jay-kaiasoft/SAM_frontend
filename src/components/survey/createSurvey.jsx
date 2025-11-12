import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
import {connect} from "react-redux";
import {Col, FormGroup, Row} from "reactstrap";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import history from "../../history";
import {checkSurveyNameExists, getSurveyById, getSurveyTemplateList, saveSurveyData} from "../../services/surveyService";
import {getCountry} from "../../services/commonService";
import $ from "jquery";
import {siteURL} from "../../config/api";
import {easUrlEncoder, QontoConnector, QontoStepIcon} from "../../assets/commonFunctions";
import Loader from "../shared/loaderV2/loader";
const SurveyInfo = lazy(() => import("./surveyInfo"));
const SelectTemplate = lazy(() => import("./selectTemplate"))
const DemoGraphicLocation = lazy(() => import("../shared/commonControlls/demoGraphicLocation"))
const PublishingOptions = lazy(() => import("./publishingOptions"))

const CreateSurvey = ({subUser,globalAlert,location,pendingTransaction}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const steps = ["1", "2", "3", "4"];
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = useState({"sryStId":0});
    const [link, setLink] = useState({});
    const [myDataTemplate, setMyDataTemplate] = useState([]);
    const [countries, setCountries] = useState([]);
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(true);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const tableCheckBox = (index,id) => {
        if(tableCheckBoxValueList.includes(id)){
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList,id]);
        }
    }
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        const newTableCheckBoxValueList = []
        countries.forEach(element => {
            if(!flag)
                newTableCheckBoxValueList.push(element.id)
        });
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
	const handleTemplateSelected = (sryStId) => {
        setData((prev)=>({...prev, sryStId: sryStId}));
    }
    const handleClickNextFirst = () => {
        if(typeof data.sryName === "undefined" || data.sryName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter survey Title.",
                open: true
            });
            return false;
        }
        let requestData = `?surveyName=${encodeURIComponent(data?.sryName)}&surveyId=${id}`;
        checkSurveyNameExists(requestData).then(res => {
            if (res.status === 200) {
                handleNext();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                return false;
            }
        });
    };
    const handleClickNextSecond = () =>{
        if(typeof data.sryStId === "undefined" || data.sryStId === "" || data.sryStId === 0){
            globalAlert({
                type: "Error",
                text: "Please select a survey.",
                open: true
            });
            return false;
        }
        handleNext();
    };
    const handleClickSave = (status, step) => {
        if(step === 2 && tableCheckBoxValueList.length === 0){
            globalAlert({
                type: "Error",
                text: "Please select one country.",
                open: true
            });
            return false;
        }
        if(status === 0){
            $("button.saveAndDraft").hide();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.saveAndDraft");
        } else if(status === 1){
            $("button.saveAndPublish").hide();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.saveAndDraft");
        }
        let requestData = {
            ...data,
            "sryId": id,
            "sryStatus": status,
            "sryCountryList": tableCheckBoxValueList.join(","),
            "subMemberId": subUser.memberId
        }
        saveSurveyData(requestData).then(res => {
            if (res.status === 200) {
                if(res.result.surveyLinkUrl === ""){
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    history.push("/managesurvey");
                } else {
                    if(res.result.location === "paymentProfile"){
                        pendingTransaction([{
                            "sryId": res.result.sryId,
                            "surveyLinkUrl": res.result.surveyLinkUrl,
                            "pendingTransactionType": "saveSurvey"
                        }]);
                        history.push("/carddetails");
                    } else {
                        let jsLink = `<script type="text/javascript" src="${siteURL}/svscript.js?entid=${res.result.surveyLinkUrl.split("/").pop()}&~t~=survey"></script>`;
                        let embedLink = `<iframe src="${res.result.surveyLinkUrl}" style="border:none;" height="100%" width="100%"></iframe>`;
                        setLink({"link":res.result.surveyLinkUrl,"jsLink":jsLink,"embedLink":embedLink});
                        handleNext();
                    }
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                history.push("/managesurvey");
            }
        });
    };
    const handleClickSaveValidation = (step) => {
        if(step === 0){
            if(typeof data.sryName === "undefined" || data.sryName === ""){
                globalAlert({
                    type: "Error",
                    text: "Please enter survey Title.",
                    open: true
                });
                return false;
            }
        } else if(step === 1){
            if(typeof data.sryStId === "undefined" || data.sryStId === "" || data.sryStId === 0){
                globalAlert({
                    type: "Error",
                    text: "Please select a survey.",
                    open: true
                });
                return false;
            }   
        }
        handleClickSave(0, step);
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Suspense fallback={<Loader />}>
                        <SurveyInfo data={data} handleChange={handleChange} handleClickNextFirst={handleClickNextFirst} handleClickSaveValidation={handleClickSaveValidation} />
                    </Suspense>
                );
            case 1:
                return (
                    <Suspense fallback={<Loader />}>
                        <SelectTemplate myDataTemplate={myDataTemplate} data={data} handleTemplateSelected={handleTemplateSelected} user={subUser} handleBack={handleBack} handleClickNextSecond={handleClickNextSecond} handleClickSaveValidation={handleClickSaveValidation} />
                    </Suspense>
                );
            case 2:
                return (
                    <>
                        <Suspense fallback={<Loader />}>
                            <DemoGraphicLocation mainTablecheckBoxValue={mainTablecheckBoxValue} mainTableCheckBox={mainTableCheckBox} countries={countries} tableCheckBox={tableCheckBox} tableCheckBoxValueList={tableCheckBoxValueList}/>
                        </Suspense>
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(0, 2)}} className="mr-3 saveAndDraft"><i className="far fa-save mr-2"></i>SAVE AND DRAFT</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(1, 2)}} className="mr-3 saveAndPublish"><i className="far fa-envelope-open-text mr-2"></i>SAVE AND PUBLISH</Button>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/managesurvey")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                        </FormGroup>
                    </>
                );
            case 3:
                return (
                    <Suspense fallback={<Loader />}>
                        <PublishingOptions link={link} />
                    </Suspense>
                );
            default:
                return 'Unknown step';
        }
    }
    useEffect(()=>{
        getSurveyTemplateList(1).then(res => {
            if (res.result && res.result.surveyTemplate) {
                setMyDataTemplate(res.result.surveyTemplate);
            }
        });
        getCountry().then(res => {
            if (res.result.country) {
                let c = [];
                let temp = [];
                res.result.country.forEach((x) => {
                    if(x.cntCode !== null){
                        c.push({
                            "id": String(x.id),
                            "countryName": x.cntName,
                            "cntCode":x.cntCode,
                            "iso2":x.iso2
                        });
                        temp.push(String(x.id));
                    }
                });
                setCountries(c);
                setTableCheckBoxValueList((prev)=>(prev.length === 0 ? temp : prev));
            }
        })
        return () => {
            setMyDataTemplate([]);
            setCountries([]);
            setTableCheckBoxValueList([]);
        };
    },[]);
    useEffect(()=>{
        if(id){
            getSurveyById(id).then(res => {
                if (res.result && res.result.survey) {
                    setData(res.result.survey);
                    setTableCheckBoxValueList(res.result.survey.sryCountryList.split(","));
                    setMainTablecheckBoxValue(false);
                }
            });
        }
    },[id]);
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row>
                    <Col xs={4}><h3>Survey</h3></Col>
                    <Col xs={8}>
                        <Stepper className="w-50 p-1 mb-1" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Col>
                </Row>
                {getStepContent(activeStep)}
                <input type="hidden" name="all_temp_data" id="all_temp_data" />
            </Col>
        </Row>
    );
}
const mapStateToProps = (state) => {
    return {
        subUser:state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        pendingTransaction: (data) => {dispatch(setPendingTransactionAction(data))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSurvey);