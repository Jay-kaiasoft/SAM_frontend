import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {CSSTransition} from 'react-transition-group';
import {Button, ButtonGroup,} from "@mui/material";
import PreparePage from './preparePage';
import {setGlobalAlertAction} from '../../actions/globalAlertActions';
import {checkRequire, checkDateRange, checkMustTotalTo, generateSaveAnswerJson, setAnswersToJson, checkEmail, checkPhone, extractQuestionsFromJson} from "./utility";
import {saveAssessmentAnswers} from "../../services/assessmentService";
import SummaryReport from "./summaryReport";
import {validatePhoneFormat} from "../../services/commonService";
import {getHostData} from "../../assets/commonFunctions";
import useWindowSize from "../shared/commonControlls/useWindowSize";
import { websiteTitle } from "../../config/api";
import ProgressBar from "../shared/commonControlls/progessBar"; 
import { setResetQuestionNoAction, setResetQuestionYesAction } from "../../actions/resetQuestion";

const PreviewAssessment = ({togglePreviewForm, dataListJson,setDataListJson, globalAlert, reset, resetQuestionYes, resetQuestionNo, saveMode, asmtId, getCookie=()=>{}, setCookies=()=>{}, setFormData}) => {
    const pageAnimationClass = dataListJson.assessmentsPages.map((e)=>{
        return e.spgTransition;
    });
    const [questionAnimationClass, setQuestionAnimationClass] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnimationClass, setCurrentAnimationClass] = useState(pageAnimationClass[currentPageIndex]);
    const [previousDisabled, setPreviousDisabled] = useState(false);
    const [nextDisabled, setNextDisabled] = useState(true);
    const [showQa, setShowQa] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hostData, setHostData] = useState({});
    const [isDone, setIsDone] = useState(false);
    const [overAll, setOverAll] = useState({});
    const [assAtAnalysis, setAssAtAnalysis] = useState({});
    const [windowWidth,] = useWindowSize();
    const [percentage, setPercentage] = useState(0); 
    const [progessBarColor, setProgressBarColor] = useState("#fff"); 
    const totalQuestions = useRef(extractQuestionsFromJson(dataListJson).length)
    useEffect(() => {
        setTimeout(() => {
            setShowQa(true);
        }, 1000);
        getHostData().then((res)=>{
            setHostData(res.data);
        });
    }, []);
    useEffect(()=>{
        if (dataListJson.assessmentsPages[currentPageIndex].apgType === "Question Page") { 
            if(!isSubmitted){
                setProgressBarColor(dataListJson.assessmentsPages[currentPageIndex].aqueCatColor); 
                let attemptedQuestion = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].aqueNumber; 
                setPercentage((prev)=>{ 
                    prev = Math.round(attemptedQuestion * 100 / totalQuestions.current); 
                    return prev; 
                })
            } else { 
                setPercentage((prev)=>{ 
                    prev = Math.round(100); 
                    return prev; 
                })   
            }
        }
        if(!dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty('questionStyle')){
            setNextDisabled(currentPageIndex === (dataListJson.assessmentsPages.length-1));
            setPreviousDisabled(currentPageIndex === 0);
        } else {
            if(currentPageIndex === (dataListJson.assessmentsPages.length-1)){
                setNextDisabled(currentQuestionIndex === (dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions.length - 1));
            } else{
                setNextDisabled(false);
            }
            if(currentPageIndex === 0){
                setPreviousDisabled(currentQuestionIndex === 0);
            } else{
                setPreviousDisabled(false)
            }
        }
    }, [dataListJson.assessmentsPages, currentPageIndex, currentQuestionIndex, isSubmitted]);
    useEffect(()=>{  
        if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")){
            let temp = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions.map((e)=>{
                return e.queTransition;
            });
            setQuestionAnimationClass(temp);
        }
        return () => {
            setQuestionAnimationClass([]);
        };
    }, [dataListJson.assessmentsPages, currentPageIndex]);
    const handlePreviousClick = async ()=>{
        if (reset.reset === "Yes") { 
            let ansJson = generateSaveAnswerJson(asmtId, dataListJson, currentPageIndex, currentQuestionIndex, getCookie("assessmenteas"), hostData, false, null, reset); 
            saveAssessmentAnswers(ansJson).then(res => { 
                if(getCookie('assessmenteas') === ""){
                    document.cookie = "assessmenteas="+res.result.assessmentsAnswers.asSessionId+"; path=/";
                }
                let newDataListJson = setAnswersToJson(dataListJson, res.result.assessmentsAnswers);
                setDataListJson(prev=>{
                    prev = newDataListJson;
                    return {...prev}
                });
                setOverAll(res.result.overAll);
                setAssAtAnalysis(JSON.parse(res.result.assAtAnalysis));
            }); 
        } 
        resetQuestionNo({ 
            reset: "No" 
        })
        showPrevious();
    }
    const handleNextClick = async (isSubmit=false)=>{
        if(dataListJson.assessmentsPages[currentPageIndex].apgType === "Question Page"){
            let err = checkRequire(dataListJson, currentPageIndex, currentQuestionIndex);
            if(err !== ""){
                globalAlert({
                    type: "Error",
                    text: `Please fill question "${err}"`,
                    open: true
                });
                return;
            }
            err = checkDateRange(dataListJson, currentPageIndex, currentQuestionIndex);
            if(err !== ""){
                globalAlert({
                    type: "Error",
                    text: `Please enter ${err[1] === "date_control"?"date":"time"} between ${err[2]} to ${err[3]} in question "${err[0]}"`,
                    open: true
                });
                return;
            }
            err = checkMustTotalTo(dataListJson, currentPageIndex, currentQuestionIndex);
            if(err !== ""){
                globalAlert({
                    type: "Error",
                    text: `Total must not exceed ${err[1]} in question "${err[0]}"`,
                    open: true
                });
                return;
            }
            err = checkEmail(dataListJson, currentPageIndex, currentQuestionIndex);
            if(err !== ""){
                globalAlert({
                    type: "Error",
                    text: `Please enter valid email address in question "${err}"`,
                    open: true
                });
                return;
            }
            let {id, phoneNumber, questionNumber} = checkPhone(dataListJson, currentPageIndex, currentQuestionIndex);
            if(id === "" && phoneNumber !== ""){
                globalAlert({
                    type: "Error",
                    text: `Please select country in question "${questionNumber}"`,
                    open: true
                });
                return;
            } else if ((typeof id !== "undefined" && id !== "") && (typeof phoneNumber !== "undefined" && phoneNumber !== "")) {
                err = await validatePhoneFormat(id, phoneNumber);
                if(!err){
                    globalAlert({
                        type: "Error",
                        text: `Invalid phone number format or do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct in question "${questionNumber}"`,
                        open: true
                    });
                    return;
                }
            }
            if(saveMode){
                let questionNext = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].next;
                let ansJson = generateSaveAnswerJson(asmtId, dataListJson, currentPageIndex, currentQuestionIndex, getCookie('assessmenteas'), hostData, isSubmit, questionNext, reset);
                saveAssessmentAnswers(ansJson).then(res=>{
                    if(getCookie('assessmenteas') === ""){
                        document.cookie = "assessmenteas="+res.result.assessmentsAnswers.asSessionId+"; path=/";
                    }
                    let newDataListJson = setAnswersToJson(dataListJson, res.result.assessmentsAnswers);
                    setDataListJson(prev=>{
                        prev = newDataListJson;
                        return {...prev}
                    });
                    setOverAll(res.result.overAll);
                    setAssAtAnalysis(JSON.parse(res.result.assAtAnalysis));
                    if(ansJson.asIsComplete === 0)
                        showNext();
                    else {
                        setIsSubmitted(true);
                        setCookies("assessmenteas", "");
                        document.cookie = "assessmenteas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                    }
                });
            } else{
                if(!isSubmit)
                    showNext();
                else {
                    setIsSubmitted(true);
                    setCookies("assessmenteas", "");
                    document.cookie = "assessmenteas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                }
            }
        } else {
            if(!isSubmit)
                showNext();
            else {
                setIsSubmitted(true);
                setCookies("assessmenteas", "");
                document.cookie = "assessmenteas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
            }
        }
        resetQuestionNo({ 
            reset: "No" 
        })
    }
    const showNext = ()=>{
        let radioTypes = ["single_answer", "single_answer_button", "single_answer_checkbox", "single_answer_combo", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race", "yes_no", "image_form", "image_with_text_form"];
        let ratingTypes = ["rating_symbol", "rating_radio", "rating_box"];

        if(dataListJson.assessmentsPages[currentPageIndex].apgType !== "Question Page"){
            setShowQa(false);
            setTimeout(()=>{
                if(dataListJson.assessmentsPages[currentPageIndex].next !== null) {
                    setCurrentPageIndex(dataListJson.assessmentsPages[currentPageIndex].next.pageIndex);
                    if(dataListJson.assessmentsPages[currentPageIndex].next.hasOwnProperty("questionIndex")){
                        setCurrentQuestionIndex(dataListJson.assessmentsPages[currentPageIndex].next.questionIndex)
                    }
                }
                if((currentPageIndex)<dataListJson.assessmentsPages.length-1){
                    setCurrentAnimationClass(pageAnimationClass[currentPageIndex+1]);
                }  
            }, 1000);
        } else {
            setShowQa(false);
            let questionNext = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].next;
            setTimeout(()=>{
                let value = null;
                if(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].hasOwnProperty("value") && radioTypes.includes(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].aqueType)) {
                    if(typeof dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].value === "string") {
                        value = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].value;
                    } else{
                        value = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].value[0];
                    }
                } else if(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].hasOwnProperty("value") && ratingTypes.includes(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].aqueType)) {
                    value = parseInt(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].value);
                }
                let key = "default";
                if(value !== null && questionNext.hasOwnProperty(value)) {
                    key = value;
                }
                if(questionNext[key] !== null){
                    if(questionNext[key].hasOwnProperty("questionIndex")){
                        if(currentPageIndex !== questionNext[key].pageIndex && questionNext[key].questionIndex === 0) {
                            setCurrentAnimationClass(dataListJson.assessmentsPages[questionNext[key].pageIndex].spgTransition);
                        } else {
                            setCurrentAnimationClass(dataListJson.assessmentsPages[questionNext[key].pageIndex].assessmentsQuestions[questionNext[key].questionIndex].queTransition);
                        }
                        setCurrentQuestionIndex(questionNext[key].questionIndex);
                        setCurrentPageIndex(questionNext[key].pageIndex);
                    } else {
                        setCurrentAnimationClass(dataListJson.assessmentsPages[questionNext[key].pageIndex].spgTransition);
                        setCurrentPageIndex(questionNext[key].pageIndex);
                    }
                } else {
                    setIsSubmitted(true);
                    setCookies("assessmenteas", "");
                    document.cookie = "assessmenteas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                }  
            }, 1000);
        }
        setTimeout(()=>{
            setShowQa(true);
        }, 1000);
        setTimeout(()=>{}, 1000);
    }
    const showPrevious = ()=>{
        if(dataListJson.assessmentsPages[currentPageIndex].apgType !== "Question Page"){
            setShowQa(false);
            setTimeout(()=>{
                if(dataListJson.assessmentsPages[currentPageIndex].prev !== null) {
                    setCurrentPageIndex(dataListJson.assessmentsPages[currentPageIndex].prev.pageIndex);
                    if(dataListJson.assessmentsPages[currentPageIndex].next.hasOwnProperty("questionIndex")){
                        setCurrentQuestionIndex(dataListJson.assessmentsPages[currentPageIndex].next.questionIndex)
                    }
                }
                if((currentPageIndex)<dataListJson.assessmentsPages.length-1){
                        setCurrentAnimationClass(pageAnimationClass[currentPageIndex - 1]);
                    }
                }, 1000);
        } else {
            setShowQa(false);
            let questionPrev = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex].prev;
            setTimeout(() => {
                if(questionPrev !== null){
                    setCurrentPageIndex(questionPrev.pageIndex);
                    if(questionPrev.hasOwnProperty("questionIndex")){
                        setCurrentQuestionIndex((_)=>(questionPrev.questionIndex));
                        if(currentPageIndex !== questionPrev.pageIndex && dataListJson.assessmentsPages[questionPrev.pageIndex].assessmentsQuestions.length - 1 === questionPrev.questionIndex) { 
                            setCurrentAnimationClass(dataListJson.assessmentsPages[questionPrev.pageIndex].spgTransition);
                        } else {
                            setCurrentAnimationClass(dataListJson.assessmentsPages[questionPrev.pageIndex].assessmentsQuestions[questionPrev.questionIndex].queTransition);
                        }
                    } else {
                        setCurrentAnimationClass(dataListJson.assessmentsPages[questionPrev.pageIndex].spgTransition);
                    }
                }
            }, 1000);
        }
        setTimeout(()=>{
            setShowQa(true);
        }, 1000);
        setTimeout(()=>{}, 1000);
    }
    const handleClickReset = () => { 
        resetQuestionYes({ 
            reset: "Yes" 
        }) 
    }
    return (
        <div className="preview-form-container">
            <div className="w-75 container"> 
                <div className="row"> 
                    <div className="col-md-12 d-flex justify-content-center"> 
                        <div className="row w-100"> 
                            <div className="col-xl-8 col-md-8 col-sm-12 offset-xl-2 offset-md-2 col-xs-12"> 
                                <div className="px-3">
                                    <ProgressBar color={progessBarColor} percentage={percentage} /> 
                                </div> 
                            </div> 
                        </div> 
                    </div> 
                </div> 
            </div> 
            <div className="form-container" style={dataListJson?.settings?.pageSettings}>
                {
                    togglePreviewForm !== null?
                        <i className="close-button-preview far fa-times" onClick={()=>{togglePreviewForm()}}></i>
                    : null
                }
                <div className="header-main-container">
                {
                    dataListJson.header === "" ?
                        <div className="form-blank-header"></div>
                    :
                        <div className="header-container" style={dataListJson?.settings?.headerSettings}>
                            <div className={`container ${windowWidth > 768 ? "w-75" : "w-100 px-3"}`}>
                                <div className="px-3" dangerouslySetInnerHTML={{ __html: dataListJson.header }}></div>
                            </div>
                        </div>
                }
                </div>
                {
                    !isSubmitted ?
                        <div className="form-main-container">
                            <div className={`container ${windowWidth > 768 ? "w-75" : "w-100 px-3"}`} style={{perspective: 1000}}>
                                <CSSTransition
                                    in={showQa}
                                    timeout={1000}
                                    classNames={currentAnimationClass}
                                    onEntering = {()=>{
                                        if(dataListJson.assessmentsPages[currentPageIndex].apgType === "Question Page") {
                                            if ((currentQuestionIndex === 0 || currentQuestionIndex === dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions.length-1) && dataListJson.assessmentsPages.length > 1) {
                                                setCurrentAnimationClass(questionAnimationClass[1]);
                                            }
                                            if ((currentQuestionIndex === 0 || currentQuestionIndex === dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions.length-1) && dataListJson.assessmentsPages.length === 1) {
                                                setCurrentAnimationClass(questionAnimationClass[1]);
                                            }

                                        }
                                    }}
                                    unmountOnExit
                                >
                                    <PreparePage pageIndex={currentPageIndex} questionIndex={currentQuestionIndex} pageJson={dataListJson} setDataListJson={setDataListJson} setFormData={setFormData}/>
                                </CSSTransition>
                            </div>
                        </div>
                    :
                        dataListJson.thankYou !== "" ?
                            !isDone && saveMode ?
                                <SummaryReport setIsDone={setIsDone} overAll={overAll} assAtAnalysis={assAtAnalysis} />
                            :
                                <div className={`container m-auto py-5 overflow-auto ${windowWidth > 768 ? "w-75" : "w-100 px-3"}`}>
                                    <div className="px-3 py-2" dangerouslySetInnerHTML={{ __html: dataListJson.thankYou.replaceAll("mojoMcBlock ","") }}></div>
                                </div>
                        :
                            <div className="d-flex align-items-center justify-content-center" style={{height: "100vh"}}>
                                <h2>
                                    Thank you for your Responses
                                </h2>
                            </div>
                }
                <div className="footer-container" style={dataListJson?.settings?.footerSettings}>
                    {
                        dataListJson.footer !== "" ?
                            <div className={`container ${windowWidth > 768 ? "w-75" : "w-100 px-3"}`}>
                                <div className="px-3 pb-2" dangerouslySetInnerHTML={{ __html: dataListJson.footer }}></div>
                            </div>
                        : null
                    }
                    {
                        !isSubmitted && <div className={`${dataListJson?.settings?.footerButtonSettings || "text-right"} px-4`}>
                            <ButtonGroup className="pn-btn" variant="contained" color="primary" aria-label="outlined primary button group">
                                <Button onClick={handleClickReset}>RESET</Button>
                                <Button onClick={handlePreviousClick} disabled={previousDisabled} >PREVIOUS</Button>
                                <Button onClick={()=>{handleNextClick(false);}} disabled={nextDisabled} hidden={nextDisabled} >NEXT</Button>
                                {nextDisabled ?
                                    <Button onClick={()=>{handleNextClick(true);}}>SUBMIT</Button>
                                : null }
                            </ButtonGroup>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = (state) => ({ 
    reset: state.resetQuestion, 
})
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }, 
        resetQuestionYes: (data) => { 
            dispatch(setResetQuestionYesAction(data)) 
        }, 
        resetQuestionNo: (data) => { 
            dispatch(setResetQuestionNoAction(data)) 
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewAssessment);