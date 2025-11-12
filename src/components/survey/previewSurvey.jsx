import React, { useEffect, useRef, useState } from "react";
import {connect} from "react-redux";
import {CSSTransition} from 'react-transition-group';
import {Button, ButtonGroup,} from "@mui/material";
import PreparePage from './preparePage';
import {setGlobalAlertAction} from '../../actions/globalAlertActions';
import { checkRequire, checkDateRange, checkMustTotalTo, generateSaveAnswerJson, setAnswersToJson, checkEmail, checkPhone, extractQuestionsFromJson } from "./utility";
import {saveSurveyAnswers} from "../../services/surveyService";
import {validatePhoneFormat} from "../../services/commonService";
import {getHostData} from "../../assets/commonFunctions";
import useWindowSize from "../shared/commonControlls/useWindowSize";
import { websiteTitle } from "../../config/api";
import ProgressBar from "../shared/commonControlls/progessBar";
import { setResetQuestionNoAction, setResetQuestionYesAction } from "../../actions/resetQuestion";
const PreviewSurvey = ({togglePreviewForm,dataListJson,setDataListJson, globalAlert, reset, resetQuestionYes, resetQuestionNo, saveMode, sryId, getCookie=()=>{}, setCookies=()=>{}, setFormData}) => {
    const pageAnimationClass = dataListJson.surveysPages.map((e)=>{
        return e.spgTransition;
    });
    const [questionAnimationClass, setQuestionAnimationClass] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnimationClass, setCurrentAnimationClass] = useState(pageAnimationClass[currentPageIndex]);
    const [previousDisabled, setPreviousDisabled] = useState(false);
    const [nextDisabled, setNextDisabled] = useState(true);
    const [showQa, setShowQa] = useState(false);
    const [whichButtonClicked, setWhichButtonClicked] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hostData, setHostData] = useState({});
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
        let attemptedQuestion = 0;
        if (dataListJson.surveysPages[currentPageIndex].spgType === "Question Page") {
            if(!isSubmitted){
                setProgressBarColor(dataListJson.surveysPages[currentPageIndex].squeCatColor);
                if(dataListJson.surveysPages[currentPageIndex]?.questionStyle === "all" || !dataListJson.surveysPages[currentPageIndex].hasOwnProperty('questionStyle')){
                    attemptedQuestion = 0;
                    for(let i = 0; i < currentPageIndex; i++) {
                        if(dataListJson.surveysPages[i].spgType === "Question Page" && (dataListJson?.surveysPages[i]?.questionStyle === "all" || !dataListJson?.surveysPages[i].hasOwnProperty('questionStyle'))) {
                            attemptedQuestion += dataListJson.surveysPages[i].surveysQuestions.length
                        }
                    }
                } else {
                    attemptedQuestion = dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].squeNumber;
                }
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
        } else {
            if(!isSubmitted) {
                attemptedQuestion = 0;
                for(let i = 0; i < currentPageIndex; i++) {
                    if(dataListJson.surveysPages[i].spgType === "Question Page" && (dataListJson?.surveysPages[i]?.questionStyle === "all" || !dataListJson?.surveysPages[i].hasOwnProperty('questionStyle'))) {
                        attemptedQuestion += dataListJson.surveysPages[i].surveysQuestions.length
                    }
                }
                setPercentage((prev)=>{
                    prev = Math.round(attemptedQuestion * 100 / totalQuestions.current);
                    return prev;
                })
            } else  {
                setPercentage((prev)=>{
                    prev = Math.round(100);
                    return prev;
                })  
            }
        }
        if(dataListJson.surveysPages[currentPageIndex]?.questionStyle === "all" || !dataListJson.surveysPages[currentPageIndex].hasOwnProperty('questionStyle')){
            setNextDisabled(currentPageIndex === (dataListJson.surveysPages.length-1));
            setPreviousDisabled(currentPageIndex === 0);
        } else {
            if(currentPageIndex === (dataListJson.surveysPages.length-1)){
                setNextDisabled(currentQuestionIndex === (dataListJson.surveysPages[currentPageIndex].surveysQuestions.length - 1));
            } else{
                setNextDisabled(false);
            }
            if(currentPageIndex === 0){
                setPreviousDisabled(currentQuestionIndex === 0);
            } else{
                setPreviousDisabled(false)
            }
        }
    }, [dataListJson.surveysPages, currentPageIndex, currentQuestionIndex, isSubmitted]);
    useEffect(()=>{  
        if(dataListJson.surveysPages[currentPageIndex].hasOwnProperty("questionStyle")){
            let temp = dataListJson.surveysPages[currentPageIndex].surveysQuestions.map((e)=>{
                return e.queTransition;
            });
            setQuestionAnimationClass(temp);
            if(dataListJson.surveysPages[currentPageIndex].questionStyle !== "all"){
                if(whichButtonClicked === "Next" || whichButtonClicked === "")
                    setCurrentQuestionIndex(0);
                else{
                    setCurrentQuestionIndex(dataListJson.surveysPages[currentPageIndex].surveysQuestions.length-1);
                }
            }
        }
        return () => {
            setQuestionAnimationClass([]);
        };
    }, [dataListJson.surveysPages, currentPageIndex, whichButtonClicked]);
    const handlePreviousClick = async ()=>{
        setWhichButtonClicked("Previous");
        if (reset.reset === "Yes") {
            let ansJson = generateSaveAnswerJson(sryId, dataListJson, currentPageIndex, currentQuestionIndex, getCookie("surveyeas"), hostData, false, reset);
            saveSurveyAnswers(ansJson).then(res => {
                if (getCookie("surveyeas") === "") {
                    document.cookie = "surveyeas=" + res.result.surveysAnswers.ssSessionId + "; path=/";
                }
                let newDataListJson = setAnswersToJson(dataListJson, res.result.surveysAnswers);
                setDataListJson(prev => {
                    prev = newDataListJson;
                    return { ...prev }
                });
            });
        }
        resetQuestionNo({
            reset: "No"
        })
        showPrevious();
    }
    const handleNextClick =async (isSubmit=false)=>{
        setWhichButtonClicked("Next");
        if(dataListJson.surveysPages[currentPageIndex].spgType === "Question Page"){
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
                let ansJson = generateSaveAnswerJson(sryId, dataListJson, currentPageIndex, currentQuestionIndex, getCookie("surveyeas"), hostData, isSubmit, reset);
                saveSurveyAnswers(ansJson).then(res=>{
                    if(getCookie("surveyeas") === ""){
                        document.cookie = "surveyeas="+res.result.surveysAnswers.ssSessionId+"; path=/";
                    }
                    let newDataListJson = setAnswersToJson(dataListJson, res.result.surveysAnswers);
                    setDataListJson(prev=>{
                        prev = newDataListJson;
                        return {...prev}
                    });
                    if(!isSubmit)
                        showNext();
                    else {
                        setIsSubmitted(true);
                        setCookies("surveyeas", "");
                        document.cookie = "surveyeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                    }
                });
            } else{
                if(!isSubmit)
                    showNext();
                else {
                    setIsSubmitted(true);
                    setCookies("surveyeas", "");
                    document.cookie = "surveyeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                }
            }
        } else {
            if(!isSubmit)
                showNext();
            else {
                setIsSubmitted(true);
                setCookies("surveyeas", "");
                document.cookie = "surveyeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
            }
        }
        resetQuestionNo({
            reset: "No"
        })
    }
    const showNext = ()=>{
        let radioTypes = ["single_answer", "single_answer_button", "single_answer_checkbox", "single_answer_combo", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race", "yes_no", "image_form", "image_with_text_form"];
        let ratingTypes = ["rating_symbol", "rating_radio", "rating_box"];
        if(dataListJson.surveysPages[currentPageIndex].spgType !== "Question Page"){
            setShowQa(false);
            setTimeout(()=>{
                if(dataListJson.surveysPages[currentPageIndex].next !== null) {
                    setCurrentPageIndex(dataListJson.surveysPages[currentPageIndex].next.pageIndex);
                    if(dataListJson.surveysPages[currentPageIndex].next.hasOwnProperty("questionIndex")){
                        setCurrentQuestionIndex(dataListJson.surveysPages[currentPageIndex].next.questionIndex)
                    }
                }
                if((currentPageIndex)<dataListJson.surveysPages.length-1){
                    setCurrentAnimationClass(pageAnimationClass[currentPageIndex+1]);
                }  
            }, 1000);
        } else if(dataListJson.surveysPages[currentPageIndex].spgType === "Question Page" && (dataListJson.surveysPages[currentPageIndex]?.questionStyle === "all" && dataListJson.surveysPages[currentPageIndex].hasOwnProperty('questionStyle'))) {
            setShowQa(false);
            setTimeout(()=>{
                setCurrentPageIndex((prev) => { return prev = prev + 1 });
                setCurrentQuestionIndex(0);
                setCurrentAnimationClass(pageAnimationClass[currentPageIndex+1]);
            }, 1000);
        } else {
            setShowQa(false);
            let questionNext = dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].next;
            setTimeout(()=>{
                let value = null;
                if(dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].hasOwnProperty("value") && radioTypes.includes(dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].squeType)) {
                    if(typeof dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].value === "string") {
                        value = dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].value;
                    } else{
                        value = dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].value[0];
                    }
                } else if(dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].hasOwnProperty("value") && ratingTypes.includes(dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].squeType)) {
                    value = parseInt(dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].value);
                }
                let key = "default";
                if(value !== null && questionNext.hasOwnProperty(value)) {
                    key = value;
                }
                if(questionNext[key] !== null){
                    if(questionNext[key].hasOwnProperty("questionIndex")){
                        if(currentPageIndex !== questionNext[key].pageIndex && questionNext[key].questionIndex === 0) {
                            setCurrentAnimationClass(dataListJson.surveysPages[questionNext[key].pageIndex].spgTransition);
                        } else {
                            setCurrentAnimationClass(dataListJson.surveysPages[questionNext[key].pageIndex].surveysQuestions[questionNext[key].questionIndex].queTransition);
                        }
                        setCurrentQuestionIndex(questionNext[key].questionIndex);
                        setCurrentPageIndex(questionNext[key].pageIndex);
                    } else {
                        setCurrentAnimationClass(dataListJson.surveysPages[questionNext[key].pageIndex].spgTransition);
                        setCurrentPageIndex(questionNext[key].pageIndex);
                    }

                } else {
                    setIsSubmitted(true);
                    setCookies("surveyeas", "");
                    document.cookie = "surveyeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                }  
            }, 1000);
        }
        setTimeout(()=>{
            setShowQa(true);
        }, 1000);
        setTimeout(()=>{}, 1000);
    }
    const showPrevious = ()=>{
        if(dataListJson.surveysPages[currentPageIndex].spgType !== "Question Page"){
            setShowQa(false);
            setTimeout(()=>{
                if(dataListJson.surveysPages[currentPageIndex].prev !== null) {
                    setCurrentPageIndex(dataListJson.surveysPages[currentPageIndex].prev.pageIndex);
                    if(dataListJson.surveysPages[currentPageIndex].next.hasOwnProperty("questionIndex")){
                        setCurrentQuestionIndex(dataListJson.surveysPages[currentPageIndex].next.questionIndex)
                    }
                }
                if((currentPageIndex)<dataListJson.surveysPages.length-1){
                    setCurrentAnimationClass(pageAnimationClass[currentPageIndex - 1]);
                }
            }, 1000);
        } else if(dataListJson.surveysPages[currentPageIndex].spgType === "Question Page" && (dataListJson.surveysPages[currentPageIndex]?.questionStyle === "all" && dataListJson.surveysPages[currentPageIndex].hasOwnProperty('questionStyle'))) {
            setShowQa(false);
            setTimeout(()=>{ 
                setCurrentPageIndex((prev) => { return prev = prev - 1 });
                setCurrentQuestionIndex(0);
                setCurrentAnimationClass(pageAnimationClass[currentPageIndex-1]);
            }, 1000);
        } else {
            setShowQa(false);
            let questionPrev = dataListJson.surveysPages[currentPageIndex].surveysQuestions[currentQuestionIndex].prev;
            setTimeout(() => {
                if(questionPrev !== null){
                    setCurrentPageIndex(questionPrev.pageIndex);
                    if(questionPrev.hasOwnProperty("questionIndex")){
                        setCurrentQuestionIndex((_) => (questionPrev.questionIndex));
                        if(currentPageIndex !== questionPrev.pageIndex && dataListJson.surveysPages[questionPrev.pageIndex].surveysQuestions.length - 1 === questionPrev.questionIndex) {
                            setCurrentAnimationClass(dataListJson.surveysPages[questionPrev.pageIndex].spgTransition);
                        } else {
                        setCurrentAnimationClass(dataListJson.surveysPages[questionPrev.pageIndex].surveysQuestions[questionPrev.questionIndex].queTransition);
                        }
                    } else {
                        setCurrentAnimationClass(dataListJson.surveysPages[questionPrev.pageIndex].spgTransition)
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
                    <i className="close-button-preview far fa-times" onClick={()=>{togglePreviewForm()}}></i>:
                    null
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
                                        if(dataListJson.surveysPages[currentPageIndex].spgType === "Question Page") {
                                            if ((currentQuestionIndex === 0 || currentQuestionIndex === dataListJson.surveysPages[currentPageIndex].surveysQuestions.length-1) && dataListJson.surveysPages.length > 1) {
                                                setCurrentAnimationClass(questionAnimationClass[1]);
                                            }
                                            if ((currentQuestionIndex === 0 || currentQuestionIndex === dataListJson.surveysPages[currentPageIndex].surveysQuestions.length-1) && dataListJson.surveysPages.length === 1) {
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
                        !isSubmitted && 
                            <div className={`${dataListJson?.settings?.footerButtonSettings || "text-right"} px-4`}>
                                <ButtonGroup className="pn-btn" variant="contained" color="primary" aria-label="outlined primary button group">
                                    <Button onClick={handleClickReset}>RESET</Button>
                                    <Button onClick={handlePreviousClick} disabled={previousDisabled} >PREVIOUS</Button>
                                    <Button onClick={()=>{handleNextClick(false);}} disabled={nextDisabled} hidden={nextDisabled} >NEXT</Button>
                                    {nextDisabled ? <Button onClick={()=>{handleNextClick(true);}}>SUBMIT</Button> : null }
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
export default connect(mapStateToProps, mapDispatchToProps)(PreviewSurvey);