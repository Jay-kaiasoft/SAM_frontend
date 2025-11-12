import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {CSSTransition} from 'react-transition-group';
import {Button, ButtonGroup,} from "@mui/material";
import PreparePage from './preparePage';
import {setGlobalAlertAction} from '../../actions/globalAlertActions';
import {checkRequire, checkDateRange, checkMustTotalTo, generateSaveAnswerJson, setAnswersToJson, checkEmail, checkPhone, checkCaptcha, extractQuestionsFromJson} from "./utility";
import {saveCustomFormAnswer} from "../../services/customFormService";
import $ from 'jquery';
import {validatePhoneFormat} from "../../services/commonService";
import {getHostData} from "../../assets/commonFunctions";
import useWindowSize from "../shared/commonControlls/useWindowSize";
import { websiteColor, websiteTitle } from "../../config/api";
import ProgressBar from "../shared/commonControlls/progessBar";
import { setResetQuestionNoAction, setResetQuestionYesAction } from "../../actions/resetQuestion";

const PreviewForm = ({togglePreviewForm,dataListJson,setDataListJson, globalAlert, reset, resetQuestionYes, resetQuestionNo, saveMode, cfId, getCookie=()=>{}, setCookies=()=>{}, from, otherId}) => {
    const pageAnimationClass = dataListJson.customFormPages.map((e)=>{
        return e.pageTransition;
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
    const totalQuestions = useRef(extractQuestionsFromJson(dataListJson).length);
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
        if (dataListJson.customFormPages[currentPageIndex].pageType === "Question Page") {
            if(!isSubmitted){
                if(dataListJson.customFormPages[currentPageIndex]?.questionStyle === "all" || !dataListJson.customFormPages[currentPageIndex].hasOwnProperty('questionStyle')){
                    attemptedQuestion = 0;
                    for(let i = 0; i < currentPageIndex; i++) {
                        if(dataListJson.customFormPages[i].pageType === "Question Page" && (dataListJson?.customFormPages[i]?.questionStyle === "all" || !dataListJson?.customFormPages[i].hasOwnProperty('questionStyle'))) {
                            attemptedQuestion += dataListJson.customFormPages[i].customFormQuestions.length
                        }
                    }
                } else {
                    attemptedQuestion = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex].queNumber;
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
                    if(dataListJson.customFormPages[i].pageType === "Question Page" && (dataListJson?.customFormPages[i]?.questionStyle === "all" || !dataListJson?.customFormPages[i].hasOwnProperty('questionStyle'))) {
                        attemptedQuestion += dataListJson.customFormPages[i].customFormQuestions.length
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
        if(dataListJson.customFormPages[currentPageIndex]?.questionStyle === "all" || !dataListJson.customFormPages[currentPageIndex].hasOwnProperty('questionStyle')){
            setNextDisabled(currentPageIndex === (dataListJson.customFormPages.length-1));
            setPreviousDisabled(currentPageIndex === 0);
        } else {
            if(currentPageIndex === (dataListJson.customFormPages.length-1)){
                setNextDisabled(currentQuestionIndex === (dataListJson.customFormPages[currentPageIndex].customFormQuestions.length - 1));
            } else{
                setNextDisabled(false);
            }
            if(currentPageIndex === 0){
                setPreviousDisabled(currentQuestionIndex === 0);
            } else{
                setPreviousDisabled(false)
            }
        }
    }, [dataListJson.customFormPages, currentPageIndex, currentQuestionIndex, isSubmitted]);
    useEffect(()=>{  
        if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")){
            let temp = dataListJson.customFormPages[currentPageIndex].customFormQuestions.map((e)=>{
                return e.queTransition;
            });
            setQuestionAnimationClass(temp);
            if(dataListJson.customFormPages[currentPageIndex].questionStyle !== "all"){
                if(whichButtonClicked === "Next" || whichButtonClicked === "")
                    setCurrentQuestionIndex(0);
                else{
                    setCurrentQuestionIndex(dataListJson.customFormPages[currentPageIndex].customFormQuestions.length-1);
            }
        }
        }
        return () => {
            setQuestionAnimationClass([]);
        };
    }, [dataListJson.customFormPages, currentPageIndex, whichButtonClicked]);
    const handlePreviousClick = async ()=>{
		setWhichButtonClicked("Previous");
        if (reset.reset === "Yes") {
            let transType = "";
            if(from === "fromAssessment"){
                transType = "assessment";
            } else if(from === "fromSurvey"){
                transType = "survey";
            } else{
                transType = "customform";
            }
            let ansJson = generateSaveAnswerJson(cfId, dataListJson, currentPageIndex, currentQuestionIndex, getCookie('customformeas'), hostData, false, transType, otherId, reset);
            saveCustomFormAnswer(ansJson).then(res=>{
                if(getCookie('customformeas') === ""){
                    document.cookie = "customformeas="+res.result.customFormAnswers.stSessionId+"; path=/";
                }
                let newDataListJson = setAnswersToJson(dataListJson, res.result.customFormAnswers);
                setDataListJson(prev=>{
                    prev = newDataListJson;
                    return {...prev}
                });
            });
        }
        resetQuestionNo({
            reset: "No"
        })
        showPrevious();
    }
    const handleNextClick = async (isSubmit=false)=>{
		setWhichButtonClicked("Next");
        if(dataListJson.customFormPages[currentPageIndex].pageType === "Question Page"){
            let err = checkRequire(dataListJson, currentPageIndex, currentQuestionIndex);
            if(err !== ""){
                globalAlert({
                    type: "Error",
                    text: `Please answer question "${err}"`,
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
            } else if(id !== "" && phoneNumber !== ""  && questionNumber !== ""){
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
            err = checkCaptcha(dataListJson, currentPageIndex, currentQuestionIndex);
            if(err !== ""){
                globalAlert({
                    type: "Error",
                    text: `Please enter valid captcha in question "${err}"`,
                    open: true
                });
                return;
            }
            if(saveMode){
                let transType = "";
                if(from === "fromAssessment"){
                    transType = "assessment";
                } else if(from === "fromSurvey"){
                    transType = "survey";
                } else{
                    transType = "customform";
                }
                let ansJson = generateSaveAnswerJson(cfId, dataListJson, currentPageIndex, currentQuestionIndex, getCookie('customformeas'), hostData, isSubmit, transType, otherId, reset);
                saveCustomFormAnswer(ansJson).then(res=>{
                    if(getCookie('customformeas') === ""){
                        document.cookie = "customformeas="+res.result.customFormAnswers.stSessionId+"; path=/";
                    }
                    let newDataListJson = setAnswersToJson(dataListJson, res.result.customFormAnswers);
                    setDataListJson(prev=>{
                        prev = newDataListJson;
                        return {...prev}
                    });
                    if(cfId === 228){
                        ansJson.customFormAnswers.forEach((e1)=>{
                            if(e1.ansQueId === 868){
                                window?.opener?.sessionStorage?.setItem('10DLCBrandName', JSON.parse(e1.ansAnswers).value);
                            }
                            if(e1.ansQueId === 881){
                                window?.opener?.sessionStorage?.setItem('10DLCCampaignType', JSON.parse(e1.ansAnswers).value);
                            }
                        })
                    }
                    if(!isSubmit)
                        showNext();
                    else {
                        setIsSubmitted(true);
                        setCookies("customformeas", "");
                        document.cookie = "customformeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                    }
                });
            } else{
                if(!isSubmit)
                    showNext();
                else {
                    setIsSubmitted(true);
                    setCookies("customformeas", "");
                    document.cookie = "customformeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                }
            }
        } else {
            if(!isSubmit)
                showNext();
            else {
                if(cfId === 228){
                    window?.opener?.sessionStorage?.setItem('closeModal10DLC', true);
                }                
                setIsSubmitted(true);
                setCookies("customformeas", "");
                document.cookie = "customformeas=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
            }
        }
        resetQuestionNo({
            reset: "No"
        })
    }
    const showNext = ()=>{
        if(currentPageIndex<dataListJson.customFormPages.length-1 && (dataListJson.customFormPages[currentPageIndex].questionStyle === "all" || !dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle"))){
            setShowQa(false);
            setTimeout(()=>{
                setCurrentPageIndex(currentPageIndex+1);
                if((currentPageIndex)<dataListJson.customFormPages.length-1){
                    setCurrentAnimationClass(pageAnimationClass[currentPageIndex+1])
                }  
            }, 1000);
        } else {
            if((currentQuestionIndex + 1) < dataListJson.customFormPages[currentPageIndex].customFormQuestions.length){
                setShowQa(false);
                setTimeout(()=>{
                    setCurrentQuestionIndex(currentQuestionIndex+1);
                    if((currentQuestionIndex + 1) < dataListJson.customFormPages[currentPageIndex].customFormQuestions.length){
                        setCurrentAnimationClass(questionAnimationClass[currentQuestionIndex+1])
                    }  
                }, 1000);
            } else if((currentPageIndex+1) < dataListJson.customFormPages.length){
                if(dataListJson.customFormPages[currentPageIndex+1].hasOwnProperty("questionStyle")){
                    setCurrentQuestionIndex(0);
                }
                setShowQa(false);
                setTimeout(()=>{
                    setCurrentPageIndex(currentPageIndex+1);
                    if((currentPageIndex)<dataListJson.customFormPages.length-1){
                        setCurrentAnimationClass(pageAnimationClass[currentPageIndex+1])
                    }  
                }, 1000);
            }
        }
        setTimeout(()=>{
            setShowQa(true);
        }, 1000);
        setTimeout(()=>{}, 1000);
    }
    const showPrevious = ()=>{
        if(currentPageIndex-1 >= 0 && (dataListJson.customFormPages[currentPageIndex].questionStyle === "all" || !dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle"))){
            setShowQa(false);
            setTimeout(()=>{
                setCurrentPageIndex(currentPageIndex-1);
                if(currentPageIndex - 1 >= 0){
                    setCurrentAnimationClass(pageAnimationClass[currentPageIndex-1])
                }  
            }, 1000);
        } else {
            if(currentQuestionIndex - 1 >= 0){
                setShowQa(false);
                setTimeout(()=>{
                    setCurrentQuestionIndex(currentQuestionIndex-1);
                    if(currentQuestionIndex - 1 >= 0){
                        setCurrentAnimationClass(questionAnimationClass[currentQuestionIndex - 1]);
                    }
                }, 1000);
            } else if(currentPageIndex-1>=0){
                setShowQa(false);
                if(dataListJson.customFormPages[currentPageIndex-1].hasOwnProperty("questionStyle")){
                    setCurrentQuestionIndex(dataListJson.customFormPages[currentPageIndex-1].customFormQuestions.length-1);
                }
                setCurrentPageIndex(currentPageIndex-1);
                setTimeout(()=>{
                    if(currentPageIndex - 1 >= 0){
                        setCurrentAnimationClass(pageAnimationClass[currentPageIndex - 1]);
                    }
                }, 1000);
            }
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
        <div className="preview-form-container" style={{position:`${otherId > 0 ? "relative" : ""}`}}>
            {cfId !== 191 && <div className="w-75 container">
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row w-100">
                            <div className="col-xl-8 col-md-8 col-sm-12 offset-xl-2 offset-md-2 col-xs-12">
                                <div className="px-3">
                                    <ProgressBar color={websiteColor} percentage={percentage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="form-container" style={dataListJson?.settings?.pageSettings}>
                <div className="header-main-container">
                    {
                        togglePreviewForm !== null?
                            <i className="close-button-preview far fa-times" onClick={()=>{togglePreviewForm()}}></i>
                        : null
                    }
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
                                    onEnter={()=>{
                                        $(".form-main-container").addClass("overflow-hidden");     
                                    }}
                                    onEntering = {()=>{
                                        if(dataListJson.customFormPages[currentPageIndex].pageType === "Question Page") {
                                            if (dataListJson.customFormPages[currentPageIndex].questionStyle !== "all" && (currentQuestionIndex === 0 || currentQuestionIndex === dataListJson.customFormPages[currentPageIndex].customFormQuestions.length-1) && dataListJson.customFormPages.length > 1) {
                                                setCurrentAnimationClass(questionAnimationClass[1]);
                                            }
                                            if (dataListJson.customFormPages[currentPageIndex].questionStyle !== "all" && (currentQuestionIndex === 0 || currentQuestionIndex === dataListJson.customFormPages[currentPageIndex].customFormQuestions.length-1) && dataListJson.customFormPages.length === 1) {
                                                setCurrentAnimationClass(questionAnimationClass[1]);
                                            }
                                        }
                                    }}
                                    onEntered = {()=>{
                                        $(".form-main-container").removeClass("overflow-hidden");     
                                    }}
                                    onExiting = {()=>{
                                        $(".form-main-container").addClass("overflow-hidden");     
                                    }}
                                    onExited={()=>{
                                        $(".form-main-container").removeClass("overflow-hidden");     
                                    }}
                                    unmountOnExit
                                >
                                    <PreparePage pageIndex={currentPageIndex} questionIndex={currentQuestionIndex} pageJson={dataListJson} setDataListJson={setDataListJson} cfId={cfId} />
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
                        !isSubmitted && <div className={`${dataListJson?.settings?.footerButtonSettings || "text-right"} px-4`}>
                            <ButtonGroup className="pn-btn" variant="contained" color="primary" aria-label="outlined primary button group">
                                <Button onClick={handleClickReset}>RESET</Button>
                                {
                                    dataListJson.formType !== "traditional" && <Button onClick={handlePreviousClick} disabled={previousDisabled}>PREVIOUS</Button>
                                }
                                {
                                    nextDisabled ?
                                        <Button onClick={()=>{handleNextClick(true);}}>SUBMIT</Button>
                                    :
                                        <Button onClick={() => handleNextClick(false)} disabled={nextDisabled} hidden={nextDisabled}>NEXT</Button>
                                }
                            </ButtonGroup>
                        </div>
                    }
                    {
                        (isSubmitted && togglePreviewForm !== null)?
                            <div className={`${dataListJson?.settings?.footerButtonSettings || "text-right"} px-4`}>
                                <Button variant="contained" color="primary" onClick={()=>{togglePreviewForm();}}>CLOSE</Button>
                            </div>
                        : null
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
export default connect(mapStateToProps, mapDispatchToProps)(PreviewForm);