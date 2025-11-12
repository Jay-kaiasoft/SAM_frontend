import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Col, Row } from "reactstrap";
import { Stepper, Step, StepLabel} from "@mui/material";
import { getGroupListWithCheckDuplicate } from "../../services/clientContactService";
import {getSmsPolling, getSmsPollingCategoryList} from "../../services/smsPollingService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {connect} from "react-redux";
import {easUrlEncoder, QontoConnector, QontoStepIcon} from "../../assets/commonFunctions";
import {useEdgesState, useNodesState} from "reactflow";
import Loader from "../shared/loaderV2/loader";
const SmsInfo = lazy(() => import("./smsInfo"))
const MemberList = lazy(() => import("./memberList"))
const Confirmation = lazy(() => import("./confirmation"))
const WriteQuestions = lazy(() => import("./writeQuestions"))
const QuestionOrdering = lazy(() => import("./questionOrdering"))
const QuestionsFlow = lazy(() => import("./questionsFlow"))

const CreateSmsPolling = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [activeStep, setActiveStep] = React.useState(0);
    const [questionFlowElements, setQuestionFlowElements] = useState([]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [data,setData]=useState({
        iid:0,
        rndHash:"",
        category:[],
        questions:[]
    })

    const handleDataChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };

    useEffect(() => {
        getGroupListWithCheckDuplicate().then(
            res => {
                if (res.result.group) {
                    let groups = [];
                    res.result.group.forEach((element) => {
                        groups.push({
                            gId: element.groupId,
                            name: element.groupName,
                            lockGroup: element.lockGroup
                        });
                    });
                    handleDataChange("groups",groups);
                }
            }
        );
        getSmsPollingCategoryList().then(
            res => {
                if (res.result.smsPollingCategory) {
                    let c = [];
                    res.result.smsPollingCategory.forEach((element) => {
                        c.push({
                            key: element.id,
                            value: element.catName
                        });
                    });
                    handleDataChange("category",c);
                }
            }
        );
    }, []);
    useEffect(()=>{
        if(id !== 0){
            getSmsPolling(id).then(res => {
                if(res.status === 200){
                    if (res.result && res.result.smsPolling) {
                        res.result.smsPolling.groupList = Number(res.result.smsPolling.groupList);
                        setData((prev)=>{ return {...prev, ...res.result.smsPolling}});
                        setData((prevState) => {
                            return {
                                ...prevState,
                                questionFlowJson:res.result.smsPolling.questionFlowJson === null ? "" : JSON.parse(res.result.smsPolling.questionFlowJson),
                                tdetail: prevState.tdetail === null? "": prevState.tdetail
                            }
                        })
                    }
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            })
        }
    },[id,props]);
    const handleNext = (stepsToMove) => {
        setActiveStep((prevActiveStep) => prevActiveStep + stepsToMove);
    };

    const handleBack = (stepsToMove) => {
        setActiveStep((prevActiveStep) => prevActiveStep - stepsToMove);
    };

    const steps = ["1", "2", "3", "4", "5", "6"];

    const getStepContent=(step)=>{
        switch(step){
            case 0:
                return(
                    <Suspense fallback={<Loader />}>
                        <SmsInfo handleNext={handleNext} data={data} handleDataChange={handleDataChange} setData={setData}/>
                    </Suspense>
                );
            case 1:
                return(
                    <Suspense fallback={<Loader />}>
                        <MemberList handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} handleDataChange={handleDataChange}/>
                    </Suspense>
                )
            case 2:
                return(
                    <Suspense fallback={<Loader />}>
                        <WriteQuestions data={data} handleNext={handleNext} handleBack={handleBack} handleDataChange={handleDataChange}/>
                    </Suspense>
                )
            case 3:
                return(
                    <Suspense fallback={<Loader />}>
                        <QuestionOrdering data={data} handleNext={handleNext} handleBack={handleBack} handleDataChange={handleDataChange}/>
                    </Suspense>
                )
            case 4:
                return(
                    <Suspense fallback={<Loader />}>
                        <QuestionsFlow
                            data={data}
                            setData={setData}
                            handleNext={handleNext}
                            handleBack={handleBack}
                            handleDataChange={handleDataChange}
                            questionFlowElements={questionFlowElements}
                            setQuestionFlowElements={setQuestionFlowElements}
                            globalAlert={props.globalAlert}
                            nodes={nodes}
                            setNodes={setNodes}
                            onNodesChange={onNodesChange}
                            edges={edges}
                            setEdges={setEdges}
                            onEdgesChange={onEdgesChange}
                        />
                    </Suspense>
                )
            case 5:
                return(
                    <Suspense fallback={<Loader />}>
                        <Confirmation handleBack={handleBack} data={data} handleDataChange={handleDataChange}/>
                    </Suspense>
                )
            default:
                return"unknown step"
        }
    }

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="overflow-hidden">
                <Row className="d-flex">
                    <Col xs={12} sm={12} md={4} lg={4} xl={4}><h3>SMS Polling</h3></Col>
                    <Col xs={12} sm={12} md={8} lg={8} xl={8} className="pl-0">
                        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} className="w-50 py-1 px-0 mb-1" >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Col>
                </Row>
                <div>
                    {getStepContent(activeStep)}
                </div>
            </Col>
        </Row>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(CreateSmsPolling);