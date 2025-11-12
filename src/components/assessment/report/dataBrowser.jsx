import React, {useCallback, useEffect, useMemo, useState} from "react";
import { connect } from "react-redux";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import {OptionQuestion, TextQuestion, ContactForm, RenderMatrix, RenderMatrixText, CommentData, TextAnswerData} from "../../shared/chartJsComponent/utilityQuestion";
import { CountryStateList } from "../../shared/chartJsComponent/utilityCountry";
import Filter from "./filter";
import { assessmentReportDataBrowser } from "../../../services/assessmentService";
import Switch from "@mui/material/Switch";

const DataBrowser = ({ globalAlert, id, isAnimated, setIsAnimated = ()=>{} }) => {
    const [data, setData] = useState({});
    const [barChart, setBarChart] = useState(false);
    const [pieChart, setPieChart] = useState(true);
    const [modalCommentData, setModalCommentData] = useState(false); 
    const toggleCommentData = useCallback(() => setModalCommentData(!modalCommentData),[modalCommentData]); 
    const [commentData, setCommentData] = useState({});
    const [modalTextAnswerData, setModalTextAnswerData] = useState(false);
    const toggleTextAnswerData = useCallback(() => setModalTextAnswerData(!modalTextAnswerData),[modalTextAnswerData]);
    const [textAnswerData, setTextAnswerData] = useState({});
    const dataQueAnsList = useMemo(()=>{
        return {
            "assId":id,
            "questionType":1,
            "controlTypes": [],
            "questionNumbers": [],
            "queAnsList":[],
            "participantId": 0
        }
    },[id]);
    const displayAssessmentReportDataBrowser = useCallback((dataQueAnsList) => {
        assessmentReportDataBrowser(dataQueAnsList).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setData(res.result);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }, [globalAlert]);
    const handleClickCommentIcon = (question, optionVal, comments) => { 
        setIsAnimated(false);
        setCommentData({ 
            "name":data?.assessmentName, 
            "question":question, 
            "optionVal":optionVal, 
            "comments":comments
        }); 
        toggleCommentData(); 
    }
    const handleClickMoreTextAnserIcon = (question, answers) => { 
        setIsAnimated(false); 
        setTextAnswerData({ 
            "name":data?.assessmentName, 
            "question":question, 
            "answers":answers 
        }); 
        toggleTextAnswerData(); 
    }
    useEffect(() => {
        displayAssessmentReportDataBrowser(dataQueAnsList);
    }, [displayAssessmentReportDataBrowser,dataQueAnsList]);
    return (
        <>
            <h4>Assessment : {data?.assessmentName}</h4>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header"><h4 className="text-center w-100">Filters</h4></AccordionSummary>
                <AccordionDetails>
                    <Filter id={id} globalAlert={globalAlert} displayAssessmentReportDataBrowser={displayAssessmentReportDataBrowser} />
                </AccordionDetails>
            </Accordion>
            <div className="d-flex justify-content-end my-2 mx-0">
                <div>
                    <h6 className="d-inline-block">Pie Chart</h6>
                    <Switch color="primary" checked={pieChart} onChange={()=>{setPieChart(!pieChart)}} name='pie' />
                </div>
                <div>
                    <h6 className="d-inline-block">Bar Chart</h6>
                    <Switch color="primary" checked={barChart} onChange={()=>{setBarChart(!barChart)}} name='bar' />
                </div>
            </div>
            {
                !(data && Object.keys(data)?.length === 0 && Object.getPrototypeOf(data) === Object.prototype) &&
                <>
                    {
                        data?.questions?.length > 0 ?
                            data?.questions?.map((value, index) => {
                                if (value.queTypeId === 1 || value.queTypeId === 6)
                                    return <OptionQuestion key={index} index={index} value={value} isAnimated={isAnimated} pieChart={pieChart} barChart={barChart} handleClickCommentIcon={handleClickCommentIcon}/>
                                else if (value?.queTypeId === 3)
                                    return <RenderMatrix value={value} key={index} isAnimated={isAnimated} pieChart={pieChart} barChart={barChart}/>
                                else if (value?.queTypeId === 4)
                                    return <ContactForm value={value} key={index} />
                                else if (value?.queTypeId === 5)
                                    return <RenderMatrixText value={value} key={index} />
                                return <TextQuestion key={index} value={value} handleClickMoreTextAnserIcon={handleClickMoreTextAnserIcon} />
                            })
                        : null
                    }
                    {
                        data?.countryList?.length > 0 ?
                            <>
                                <hr/>
                                {data?.countryList?.map((value, index) => (
                                    <CountryStateList key={index} value={value} index={index} isAnimated={isAnimated} />
                                ))}
                            </>
                        : null
                    }
                    <CommentData modalCommentData={modalCommentData} toggleCommentData={toggleCommentData} commentData={commentData} reportType={"Assessment"} />
                    <TextAnswerData modalTextAnswerData={modalTextAnswerData} toggleTextAnswerData={toggleTextAnswerData} textAnswerData={textAnswerData} />
                </>
            }
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(DataBrowser);