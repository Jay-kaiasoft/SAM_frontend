import React, {useCallback, useEffect, useState} from 'react';
import {Col, Row} from "reactstrap";
import {Button, Link} from "@mui/material";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import { getSurveyReportAnswersComboList, getSurveyReportQuestionsComboList } from '../../../services/surveyService';
import DropDownControlsWithCategory from '../../shared/commonControlls/dropdownControlWithCategory';

const questionType = [
    {
        key: 1,
        value: "All"
    },
    {
        key: 2,
        value: "Option type Question"
    },
    {
        key: 3,
        value: "Text Type Question"
    }
]

const Filter = ({ id, globalAlert, displaySurveyReportDataBrowser }) => {
    const [dataQuestions, setDataQuestions] = useState([]);
    const [dataAnswers, setDataAnswers] = useState([]);
    const [dataQueAnsList, setDataQueAnsList] = useState([{ "queId":"","ans":""}]);
    const [filterDetails, setFilterDetails] = useState({"questionType":1, "controlTypes": ["all"], "questionNumbers": ["all"]});

    const getAnswerList = useCallback((value) => {
        let requestData = `queId=${value}&sryId=${id}`;
        getSurveyReportAnswersComboList(requestData).then(res => {
            if(res.status === 200){
                let t = [{"key": 0, "value": "Select Answer"}]
                if (res?.result?.rows || res?.result?.labels) {
                    const valuesToMap = res?.result?.rows || res?.result?.labels
                    valuesToMap?.forEach(r => {
                        t.push({
                            "key": r,
                            "value": r
                        })
                        res?.result?.[r]?.forEach(item => {
                            t.push({
                                "key": `${r}=${item}`,
                                "value": item,
                                "type": "subItem"
                            })
                        })
                    })
                } else {
                    res?.result?.answers?.map(x => (
                        t.push({
                            "key": x,
                            "value": x
                        })
                    ));
                }
                setDataAnswers((prev)=> {return {...prev, [value]: t}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[id, globalAlert]);
    const handleChangeQuestion = useCallback((value, index) => {
        getAnswerList(value);
        setDataQueAnsList((prev)=>{
            prev[index].queId=value;
            prev[index].ans="";
            return [...prev];
        });
    },[getAnswerList]);
    const handleChangeAnswer = (value, index) => {
        setDataQueAnsList((prev)=>{
            prev[index].ans=value === 0?"":value;
            return [...prev];
        });
    }
    const handleClickAddFilter = () => {
        setDataQueAnsList((prev)=>{
            return [...prev,{ "queId":"","ans":""}];
        });
    }
    const handleClickDeleteFilter = (index) => {
        setDataQueAnsList((prev)=>{
            return prev.filter((v,i)=>{
                return i !== index;
            });
        });
    }
    const handleClickView = () => {
        let queAnsListTemp = dataQueAnsList.filter((e)=>(e.queId !== 0 && e.queId !== ""));
        const requestData = {
            "sryId":id,
            "questionType":filterDetails.questionType,
            "controlTypes": filterDetails.controlTypes.includes("all")?[]:filterDetails.controlTypes,
            "questionNumbers": filterDetails.questionNumbers.includes("all")?[]:filterDetails.questionNumbers,
            "queAnsList": queAnsListTemp,
            "participantId":0
        }
        displaySurveyReportDataBrowser(requestData);
    }
    const displayFilter = useCallback((value, index) => {
        return (
            <Row key={index}>
                <Col xs={12} md={12} lg={10} xl={10} className="mx-auto">
                    <Row>
                        {
                            index === 0 &&
                            <Col xs={12} md={12} lg={12} xl={12} className="mt-3">
                                <hr/>
                                <h4 className="text-center">Drill Down</h4>
                                Question And Answer Drill Down :
                            </Col>
                        }
                        <Col xs={12} md={5} lg={5} xl={5} className="mt-3">
                            <DropDownControls
                                name="question"
                                label="Select Question"
                                onChange={(name,value)=>{handleChangeQuestion(value, index)}}
                                value={value.queId || 0}
                                dropdownList={dataQuestions}
                            />
                        </Col>
                        <Col xs={12} md={5} lg={5} xl={5} className="mt-3">
                            <DropDownControlsWithCategory
                                name="answer"
                                label="Select Answer"
                                onChange={(name,value)=>{handleChangeAnswer(value, index)}}
                                value={value.ans || 0}
                                dropdownList={dataAnswers[value?.queId] || [{key:0, value: "Select Answer"}]}
                            />
                        </Col>
                        <Col xs={12} md={2} lg={2} xl={2} className="mt-3" style={{zIndex:"9"}}>
                            {
                                index !== 0 &&
                                <Link component="a" className="btn-circle mt-3" data-toggle="tooltip" title="Delete" onClick={()=>{handleClickDeleteFilter(index)}}>
                                    <i className="far fa-trash-alt"></i>
                                    <div className="bg-red"></div>
                                </Link>
                            }
                            {
                                index === dataQueAnsList.length-1 &&
                                <Link component="a" className="btn-circle mt-3" data-toggle="tooltip" title="Add" onClick={()=>{handleClickAddFilter()}}>
                                    <i className="far fa-plus-square"></i>
                                    <div className="bg-green"></div>
                                </Link>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    },[dataAnswers, dataQueAnsList, dataQuestions, handleChangeQuestion]);
    useEffect(()=>{
        let requestData = `sryId=${id}`;
        getSurveyReportQuestionsComboList(requestData).then(res => {
            if(res.status === 200){
                if (res.result && res.result.questions) {
                    let t = [{"key": 0, "value": "Select Question"}];
                    let tt = [{"key": "all", "value": "All"}];
                    let i = 1;
                    res.result.questions.forEach((x)=>{
                        t.push({"key": x.queId, "value": x.question});
                        tt.push({"key": x.queId, "value": i++});
                    });
                    setDataQuestions(t);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[id, globalAlert]);
    return (
        <>
            <Row>
                <Col xs={12} md={12} lg={10} xl={10} className="mx-auto">
                    <Row>
                        <Col xs={12} md={12} lg={5} xl={5} className="mb-3 mx-auto">
                            Question Type Filter :
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12} lg={5} xl={5} className="mx-auto">
                            <DropDownControls
                                name="questionType"
                                label="Select Question Type"
                                onChange={(name, value) => {
                                    setFilterDetails((prev) => {
                                        return {
                                            ...prev,
                                            [name]: value
                                        }
                                    })
                                }}
                                value={filterDetails?.questionType}
                                dropdownList={questionType}
                            />
                        </Col>
                        {/*<Col xs={12} md={12} lg={5} xl={5} className="mx-auto">*/}
                        {/*    <DropDownControls*/}
                        {/*        name="controlTypes"*/}
                        {/*        label="Select Control Type"*/}
                        {/*        onChange={(name, value) => {*/}
                        {/*            if(value.includes("all")){*/}
                        {/*                setFilterDetails((prev) => {*/}
                        {/*                    return {*/}
                        {/*                        ...prev,*/}
                        {/*                        [name]: ["all"]*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*                setMultipleControlTypes(false);*/}
                        {/*            } else {*/}
                        {/*                setFilterDetails((prev) => {*/}
                        {/*                    return {*/}
                        {/*                        ...prev,*/}
                        {/*                        [name]: value*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*        value={filterDetails?.controlTypes}*/}
                        {/*        dropdownList={controlType}*/}
                        {/*        multiple={true}*/}
                        {/*        open={multipleControlTypes}*/}
                        {/*        onOpen={()=>{setMultipleControlTypes(true)}}*/}
                        {/*        onClose={()=>{setMultipleControlTypes(false)}}*/}
                        {/*    />*/}
                        {/*</Col>*/}
                        {/*<Col xs={12} md={12} lg={2} xl={2} className="mx-auto">*/}
                        {/*    <DropDownControls*/}
                        {/*        name="questionNumbers"*/}
                        {/*        label="Select Question No"*/}
                        {/*        onChange={(name, value) => {*/}
                        {/*            if(value.includes("all")) {*/}
                        {/*                setFilterDetails((prev) => {*/}
                        {/*                    return {*/}
                        {/*                        ...prev,*/}
                        {/*                        [name]: ["all"]*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*                setQuestionNoOptionsOpen(false);*/}
                        {/*            } else {*/}
                        {/*                setFilterDetails((prev) => {*/}
                        {/*                    return {*/}
                        {/*                        ...prev,*/}
                        {/*                        [name]: value*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*        value={filterDetails?.questionNumbers}*/}
                        {/*        dropdownList={questionNoOptions}*/}
                        {/*        multiple={true}*/}
                        {/*        open={questionNoOptionsOpen}*/}
                        {/*        onOpen={()=>{setQuestionNoOptionsOpen(true)}}*/}
                        {/*        onClose={()=>{setQuestionNoOptionsOpen(false)}}*/}
                        {/*    />*/}
                        {/*</Col>*/}
                    </Row>
                </Col>
            </Row>
            {
                dataQueAnsList.map((value,index)=>(
                    displayFilter(value,index)
                ))
            }
            {
                dataQueAnsList.length > 0 &&
                <Row>
                    <Col xs={12} md={12} lg={10} xl={10} className="mx-auto text-center">
                        <Button className="mt-3" variant="contained" color="primary" onClick={() => { handleClickView() }}>VIEW</Button>
                    </Col>
                </Row>
            }
        </>
    );
}

export default Filter;