import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {connect} from "react-redux";
import {siteURL, websiteColor, websiteTitle} from "../../../config/api";
import AddScript from "../../shared/commonControlls/addScript";
import InputField from "../../shared/commonControlls/inputField";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import {Col, FormGroup, Row} from "reactstrap";
import {Button, FormControl, FormControlLabel, InputLabel, Link, MenuItem, Popover, Radio, RadioGroup, Select, Step, StepLabel, Stepper, Typography} from "@mui/material";
import PreviewSurvey from "../previewSurvey";
import SurveyEditor from "../../shared/editor/surveyEditor";
import {savefullcontent, reloadfirst, blockedtblocan, formBlockSetting, loadeverytime, deletePage, addPage} from "../../shared/editor/js/eas_js_survey";
import {hidedsm, removeActive} from "../../shared/editor/js/eas_js_common.js";
import $ from "jquery";
import {generateJSON, objectEquals, removePropertiesFromJson, isPageHasContent, extractQuestionsFromJson, setOldNextPrev} from "../utility";
import history from "../../../history";
import html2canvas from "html2canvas";
import {getSurveyTemplateById, saveSurveyTemplate} from "../../../services/surveyService";
import {setConfirmDialogAction} from "../../../actions/confirmDialogActions";
import LogicFlow from '../logicFlow';
import ModalAssessment from "../../shared/editor/commonComponents/modalAssessment";
import ModalSurvey from "../../shared/editor/commonComponents/modalSurvey";
import ModalCustomForm from "../../shared/editor/commonComponents/modalCustomForm";
import ModalButton from "../../shared/editor/commonComponents/modalButton";
import {createSmallThumb, easUrlEncoder, fontData, QontoConnector, QontoStepIcon} from "../../../assets/commonFunctions";
import {useEdgesState, useNodesState} from "reactflow";
import { CategoryModal } from '../../shared/editor/commonComponentsForEditor';
import ModalOpenAi from '../../shared/editor/commonComponents/modalOpenAi.jsx';
import { v4 as uuidv4 } from 'uuid';
import ModalImageAi from '../../shared/editor/commonComponents/modalImageAi.jsx';
import NumberField from '../../shared/commonControlls/numberField.jsx';
import OpenAI from 'openai/index.mjs';
import DropDownControls from '../../shared/commonControlls/dropdownControl.jsx';
import ModalQuestionAi from '../../shared/editor/commonComponents/modalQuestionAi.jsx';
import Lottie from "lottie-react";
import loaderAnimation from "../../shared/loader/loaderAnimation.json";
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const AddMySurveyTemplates = ({location, globalAlert, user, subUser, confirmDialog}) => {
    AddScript(siteURL+'/externaljs/ckeditor_4_15/ckeditor.js');
    AddScript(siteURL+'/externaljs/jquery.leanModal.min.js');
    AddScript(siteURL+'/externaljs/bootstrap-treeview.js');
    AddScript(siteURL+'/externaljs/dropzone.js');
    AddScript(siteURL+'/externaljs/jquery-ui-timepicker-addon.js');
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const steps = ["1", "2", "3", "4", "5", "6"];
    const [activeStep, setActiveStep] = useState(0);
    const [showPreviewForm, setShowPreviewForm] = useState(false);
    const [data, setData] = useState({"selectedFont": "Arial, Helvetica Neue, Helvetica, sans-serif", "selectedFontSize": "14px", "lineHeight": "14", "textColor": "#000000", "brandBgColor": "#ffffff"});
    const [dataListJson, setDataListJson] = useState({});
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [categoryPageList, setCategoryPageList] = useState([]);
    const [modalAssessmentsTags, setModalAssessmentsTags] = useState(false);
    const toggleAssessmentsTags = useCallback(() => setModalAssessmentsTags(!modalAssessmentsTags),[modalAssessmentsTags]);
    const [modalSurveysTags, setModalSurveysTags] = useState(false);
    const toggleSurveysTags = useCallback(() => setModalSurveysTags(!modalSurveysTags),[modalSurveysTags]);
    const [modalCustomFormsTags, setModalCustomFormsTags] = useState(false);
    const toggleCustomFormsTags = useCallback(() => setModalCustomFormsTags(!modalCustomFormsTags),[modalCustomFormsTags]);
    const [modalButton, setModalButton] = useState(false);
    const toggleButton = useCallback(() => setModalButton(!modalButton),[modalButton]);
    const [modalOpenAi, setModalOpenAi] = useState(false);
    const toggleOpenAi = useCallback(() => setModalOpenAi(!modalOpenAi),[modalOpenAi]);
    const [modalImageAi, setModalImageAi] = useState(false);
    const toggleImageAi = useCallback(() => setModalImageAi(!modalImageAi),[modalImageAi]);
    const [robotAnimation, setRobotAnimation] = useState(false);
    const thumbData = useRef("");
    const clickSaveFirst = useRef("");
    const [checkAllQuestions, setCheckAllQuestions] = useState(false);
    const observerRef = useRef(null);
    const [anchorEls, setAnchorEls] = useState([null,null,null,null,null,null,null,null,null]);
    const [tempQuestions, setTempQuestions] = useState([
        {index:0, value: "Gender", isChecked:false, question: "What is your gender?", options: ["Male", "Female"]},
        {index:1, value: "Age", isChecked:false, question: "In what year were you born? _ _ _ _"},
        {index:2, value: "Marital Status", isChecked:false, question: "What is your marital status?", options:["Now married", "Widowed", "Divorced", "Separated", "Never married"]},
        {index:3, value: "Education", isChecked:false, question: "What is the highest degree or level of school you have completed? If currently enrolled, mark the previous grade or highest degree received.", options: ["No schooling completed", "Nursery school to 8th grade", "9th, 10th or 11th grade", "12th grade, no diploma", "High school graduate - high school diploma or the equivalent (for example: GED)", "Some college credit, but less than 1 year", "1 or more years of college, no degree", "Associate degree (for example: AA, AS)", "Bachelor's degree (for example: BA, AB, BS)", "Master's degree (for example: MA, MS, MEng, MEd, MSW, MBA)", "Professional degree (for example: MD, DDS, DVM, LLB, JD)", "Doctorate degree (for example: PhD, EdD)"]},
        {index:4, value: "Employment Status", isChecked:false, question: "Are you currently...?", options: ["Employed for wages", "Self-employed", "Out of work and looking for work", "Out of work but not currently looking for work", "A homemaker", "A student", "Retired", "Unable to work"]},
        {index:5, value: "Employer Type", isChecked:false, question: "Please describe your work.", options: ["Employee of a for-profit company or business or of an individual, for wages, salary, or commissions", "Employee of a not-for-profit, tax-exempt, or charitable organization", "Local government employee (city, county, etc.)", "State government employee", "Federal government employee", "Self-employed in own not-incorporated business, professional practice, or farm", "Self-employed in own incorporated business, professional practice, or farm", "Working without pay in family business or farm"]},
        {index:6, value: "Housing", isChecked:false, question: " Is this house, apartment, or mobile home:", options: ["Owned by you or someone in this household with a mortgage or loan?", "Owned by you or someone in this household free and clear (without a mortgage or loan)?", "Rented for cash rent?", "Occupied without payment of cash rent?"]},
        {index:7, value: "Household Income", isChecked:false, question: "What is your total household income?", options: ["Less than $10,000", "$10,000 to $19,999", "$20,000 to $29,999", "$30,000 to $39,999", "$40,000 to $49,999", "$50,000 to $59,999", "$60,000 to $69,999", "$70,000 to $79,999", "$80,000 to $89,999", "$90,000 to $99,999", "$100,000 to $149,999", "$150,000 or more"]},
        {index:8, value: "Race", isChecked:false, question: "Please specify your race.", options: ["Hispanic or Latino", "American Indian or Alaska Native", "Asian", "Black or African American", "Native Hawaiian or Other Pacific Islander", "White"]},
    ]);
    const askQuestion = [
        {
            "question": "Tell me what is this survey about?",
            "fieldName": "stSurveyAbout",
            "required": true,
            "errorMessage": "Please enter data"
        },
        {
            "question": "What is the goal or objective of this survey?",
            "fieldName": "stSurveyGoal",
            "required": true,
            "errorMessage": "Please enter data"
        },
        {
            "question": "How many questions do you want to ask?\n\nMy suggestion is :\nShort Surveys (5 to 10)\nMedium Surveys (10 to 20)\nLong Surveys (20 to 40)",
            "fieldName": "stNoOfQuestion",
            "required": true,
            "errorMessage": "Please enter data"
        },
        {
            "question": "Would you like me to add demographic question for your survey?",
            "fieldName": "demographicQuestions",
            "required": false,
        },
        {
            "question": `I found that you have added your brands in ${websiteTitle}.\n\nWould you like to apply your brand theme to the survey?`,
            "fieldName": "askBranding",
            "required": true,
            "errorMessage": "Please select"
        },
        {
            "question": "Select your brand",
            "fieldName": "selectBrand",
            "required": true,
            "errorMessage": "Please select brand"
        },
        {
            "question": "Your selected brand is '{{brandName}}'\n\nSelect your background color",
            "fieldName": "selectBgColor",
            "required": false,
        },
        {
            "question": "Your selected brand is '{{brandName}}'\n\nSelect your text color",
            "fieldName": "selectTextColor",
            "required": false,
        },
        {
            "question": `Your selected brand is '{{brandName}}'\n\nI found that you have added your brand logo in ${websiteTitle}.\n\nWould you like to apply your brand logo in header to the survey?`,
            "fieldName": "selectLogo",
            "required": true,
            "errorMessage": "Please select"
        },
        {
            "question": `Your selected brand is '{{brandName}}'\n\nI found that you have added your brand font family in ${websiteTitle}.\n\nWould you like to apply your brand font family to the survey?`,
            "fieldName": "selectFont",
            "required": true,
            "errorMessage": "Please select"
        }
    ];
    const [askQuestionIndex, setAskQuestionIndex] = useState(-1);
    const [aiStepCompleted, setAiStepCompleted] = useState(false);
    const [typeWriterEffectCompleted, setTypeWriterEffectCompleted] = useState(false);
    const handleEditorPreview = ()=>{
        if(!isPageHasContent("preview")){
            return;
        }
        removeActive("survey");
        togglePreviewForm();
    };
    const handleClearQuestionLogicFlow = ()=>{
        setNodes([]);
        setEdges([]);
        setData((prev)=>{
            let tempStData = {};
            if(typeof prev.stData !== "undefined" && JSON.stringify(prev.stData) !== "{}"){
                let tempSurveysPages = prev.stData.surveysPages.map((val1) => {
                    if(val1.spgType === "Question Page") {
                        val1.surveysQuestions = val1.surveysQuestions.map((val2) => {
                            if (val2.hasOwnProperty("surveysOptions")) {
                                val2.surveysOptions = val2.surveysOptions.map((val3) => {
                                    if (val3.hasOwnProperty("formLink")) {
                                        delete val3.formLink;
                                        delete val3.formName;
                                    }
                                    return val3;
                                })
                            }
                            if (val2.hasOwnProperty("formLinks")) {
                                val2.formLinks = val2.formLinks.map((val3) => {
                                    val3.formLink = "";
                                    return val3;
                                })
                            }
                            return val2;
                        });
                        return val1;
                    } else {
                        return val1;
                    }
                });
                let temp2 = JSON.parse(JSON.stringify(prev.stData));
                tempStData = {...temp2, "surveysPages":tempSurveysPages};
            } else {
                tempStData = generateJSON();
            }
            return {...prev, stData: tempStData, stLogicFlow:{nodes:[], edges: []}};
        });
    }
    const handleNext = () => {
        if(data?.stType === 2 && activeStep === 0){
            setActiveStep((prevActiveStep) => prevActiveStep + 2);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleChange = (name, value) => {
        if(name === "stSurveyGoal" && value !== "Other"){
            setData((prev) => {
                return { ...prev, "stSurveyGoalDescription": "", [name]: value };
            });
        } else {
            setData((prev) => {
                return { ...prev, [name]: value };
            });
        }
    };
    const togglePreviewForm = (toggleFrom="") => {
        for(let name in window.CKEDITOR.instances)
        {
            window.CKEDITOR.instances[name].destroy(true);
        }
        if(toggleFrom === "") {
            if(!showPreviewForm){
                savefullcontent();
                $(".pageTypeMain").fadeOut();
                hidedsm();
                setDataListJson(generateJSON());
            }
        } else {
            setDataListJson(JSON.parse(JSON.stringify(data.stData)));
        }
        setShowPreviewForm(!showPreviewForm);
    };
    const handleClickNextType = (typeNo) => {
        setData((prev)=>{
            prev.stType = typeNo;
            return {...prev};
        })
        if(typeNo === 2){
            setAiStepCompleted(true);
        }
        setTimeout(()=>{
            handleNext();
        },500);
    }
    const handleClickNextSurveyDetail = () => {
        if(typeof data?.stName === "undefined" || data?.stName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter survey name.",
                open: true
            });
            return false;
        }
        if(typeof data?.stSurveyType === "undefined" || data?.stSurveyType === "" || data?.stSurveyType === null || data?.stSurveyType === 0){
            globalAlert({
                type: "Error",
                text: "Please select survey type.",
                open: true
            });
            return false;
        }
        if(data?.stType === 1 && !aiStepCompleted){
            handleClickGo();
        } else {
            let t = tempQuestions.filter(v=>v.isChecked).map(v=>v.value);
            setData((prev)=>{
                prev.demographicQuestions = t;
                return {...prev};
            });
            if(t.length === 0){
                setCategoryPageList([{id:1,catName:"None",color:"#000000"}]);
            } else {
                setCategoryPageList([{id:8,catName:"Demographics",color:websiteColor}]);
            }
            handleNext();
        }
    };
    const removeDemographicQuestions = useCallback(() => {
        if(data.hasOwnProperty("demographicQuestions")){
            setData(prev=>{
                delete prev.demographicQuestions;
                return prev;
            });
        }
    },[data]);
    const handleClickBackEditor = () => {
        removeActive("survey");
        savefullcontent();
        setData((prev)=>({...prev, stData: generateJSON(), stHtml: $("#all_temp_data").val(), tempAigeneratedData: data?.stAigeneratedData}));
        handleBack();
    }
    const handleClickNextEditor = () => {
        if(!isPageHasContent("next")){
            return;
        }
        if(data.hasOwnProperty("stData")){
            removeActive("survey");
            savefullcontent();
            let tempJson = removePropertiesFromJson(generateJSON().surveysPages);
            let currentJson = removePropertiesFromJson(JSON.parse(JSON.stringify(data.stData.surveysPages)));
            if(!objectEquals(tempJson, currentJson)){
                confirmDialog({
                    open: true,
                    title: 'The order of your questions is now set.\nIf you modify your questions, you will need to set the answer logic flow again.\nAre you sure you want to continue?',
                    onConfirm: () => {
                        $("#cntr").css("box-shadow","");
                        removeActive("survey");
                        savefullcontent();
                        handleClearQuestionLogicFlow();
                        let tempSTData = generateJSON();
                        setData((prev)=>({...prev, stData: tempSTData, stHtml: $("#all_temp_data").val(), stLogicFlow:{nodes:[], edges: []}}));
                        tempJson = tempSTData.surveysPages.filter((val)=>{
                            return val.spgType === "Question Page";
                        });
                        tempJson = tempJson.map((val)=>{
                            return {id: parseInt(val.squeCatId), catName: val.squeCatName, color: val.squeCatColor}
                        });
                        setCategoryPageList(tempJson);
                        html2canvas(document.querySelector("#cntr"), {
                            scrollX: 0,
                            scrollY: -window.scrollY
                        }).then(async (canvas) => {
                            let compressThumbURL = await createSmallThumb(canvas);
                            thumbData.current = compressThumbURL;
                        });
                        handleNext();
                    }
                });
            } else {
                $("#cntr").css("box-shadow","");
                removeActive("survey");
                savefullcontent();
                let temp = generateJSON();
                let tempJson = temp.surveysPages.filter((val)=>{
                    return val.spgType === "Question Page";
                });
                tempJson = tempJson.map((val)=>{
                    return {id: parseInt(val.squeCatId), catName: val.squeCatName, color: val.squeCatColor}
                });
                setCategoryPageList(tempJson);
                let tempSurveysPages = temp.surveysPages;
                tempSurveysPages = setOldNextPrev(data.stData.surveysPages,tempSurveysPages);
                delete temp.surveysPages;
                setData((prev)=>{
                    return {...prev, stData: {...temp, "surveysPages":tempSurveysPages}, stHtml: $("#all_temp_data").val()};
                });
                html2canvas(document.querySelector("#cntr"), {
                    scrollX: 0,
                    scrollY: -window.scrollY
                }).then(async (canvas) => {
                    let compressThumbURL = await createSmallThumb(canvas);
                    thumbData.current = compressThumbURL;
                })
                handleNext();
            }
        } else {
            confirmDialog({
                open: true,
                title: 'The order of your questions is now set.\nIf you modify your questions, you will need to set the answer logic flow again.\nAre you sure you want to continue?',
                onConfirm: () => {
                    $("#cntr").css("box-shadow","");
                    removeActive("survey");
                    savefullcontent();
                    handleClearQuestionLogicFlow();
                    let tempSTData = generateJSON();
                    setData((prev)=>({...prev, stData: tempSTData, stHtml: $("#all_temp_data").val()}));
                    let temp = tempSTData.surveysPages;
                    temp = temp.filter((val)=>{
                        return val.spgType === "Question Page";
                    });
                    temp = temp.map((val)=>{
                        return {id: parseInt(val.squeCatId), catName: val.squeCatName, color: val.squeCatColor}
                    });
                    setCategoryPageList(temp);
                    html2canvas(document.querySelector("#cntr"), {
                        scrollX: 0,
                        scrollY: -window.scrollY
                    }).then(async (canvas) => {
                        let compressThumbURL = await createSmallThumb(canvas);
                        thumbData.current = compressThumbURL;
                    })
                    handleNext();
                }
            });
        }
    };
    const handleClickSave = (status) => {
        for(let name in window.CKEDITOR.instances)
        {
            window.CKEDITOR.instances[name].destroy(true);
        }
        if(status === 0){
            $("button.save").remove();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.publish");
        } else if(status === 1){
            $("button.publish").remove();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.save");
        }
        let stTotalQuestions = 0;
        data.stData.surveysPages.map((v)=>(
            v.spgType === "Question Page" ?
                stTotalQuestions+=v.surveysQuestions.length
            : null
        ));
        let questions = extractQuestionsFromJson(data.stData);
        let tempFlow = nodes.map((e1)=>{
            if(e1.hasOwnProperty("data")) {
                questions.forEach((e2)=>{
                    if((e1.data.pageIndex === (e2.spgNumber-1)) && (e1.data.questionIndex === e2.squeDisplayOrder) && e1.data.hasOwnProperty("formLinks")) {
                        if(e1.type !== "Rating") {
                            e1.data.formLinks = e2.surveysOptions.map((val)=>{
                                if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                                    return val?.formLink;
                                } else {
                                    return "";
                                }
                            });
                            e1.data.formNames = e2.surveysOptions.map((val)=>{
                                if(val.hasOwnProperty("formName") && val?.formName !== ""){
                                    return val?.formName;
                                } else {
                                    return "";
                                }
                            });
                        } else {
                            e1.data.formLinks = e2.formLinks.map((val)=>{
                                return val.formLink;
                            })
                            e1.data.formNames = e2.formNames.map((val)=>{
                                return val.formName;
                            })
                        }
                    }
                })
            }
            return e1;
        })
        let requestData = {
            ...data,
            "stId": id,
            "subMemberId": subUser.memberId,
            "stData": JSON.stringify(data.stData),
            "stStatus": status,
            "thumbData": thumbData.current,
            "stLogicFlow": JSON.stringify({nodes:tempFlow, edges: edges}),
            "stCategoryPageList": JSON.stringify(categoryPageList),
            "stTotalQuestions": stTotalQuestions
        }
        saveSurveyTemplate(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/mysurveytemplates");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                history.push("/mysurveytemplates");
            }
        });
    }
    const handleClickSaveFirst = (status) => {
        observerRef.current?.disconnect();
        if(data.hasOwnProperty("stData")){
            removeActive("survey");
            savefullcontent();
            let tempJson = removePropertiesFromJson(generateJSON().surveysPages);
            let currentJson = removePropertiesFromJson(JSON.parse(JSON.stringify(data.stData.surveysPages)));
            if(!objectEquals(tempJson, currentJson)){
                confirmDialog({
                    open: true,
                    title: 'The order of your questions is now set.\nIf you modify your questions, you will need to set the answer logic flow again.\nAre you sure you want to continue?',
                    onConfirm: () => {
                        clickSaveFirst.current="no";
                        $("#cntr").css("box-shadow","");
                        removeActive("survey");
                        savefullcontent();
                        handleClearQuestionLogicFlow();
                        let tempSTData = generateJSON();
                        let temp = tempSTData.surveysPages;
                        temp = temp.filter((val)=>{
                            return val.spgType === "Question Page";
                        });
                        temp = temp.map((val)=>{
                            return {id: parseInt(val.squeCatId), catName: val.squeCatName, color: val.squeCatColor}
                        });
                        for(let name in window.CKEDITOR.instances)
                        {
                            window.CKEDITOR.instances[name].destroy(true);
                        }
                        if(status === 0){
                            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.save");
                            $("button.save").remove();
                        } else if(status === 1){
                            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.publish");
                            $("button.publish").remove();
                        }
                        let stTotalQuestions = 0;
                        tempSTData.surveysPages.map((v)=>(
                            v.spgType === "Question Page" ?
                                stTotalQuestions+=v.surveysQuestions.length
                            : null
                        ));
                        html2canvas(document.querySelector("#cntr"), {
                            scrollX: 0,
                            scrollY: -window.scrollY
                        }).then(async (canvas) => {
                            let compressThumbURL = await createSmallThumb(canvas);
                            let requestData = {
                                ...data,
                                "stHtml": $("#all_temp_data").val(),
                                "stId": id,
                                "subMemberId": subUser.memberId,
                                "stData": JSON.stringify(tempSTData),
                                "stStatus": status,
                                "thumbData": compressThumbURL,
                                "stLogicFlow": JSON.stringify({nodes:[], edges: []}),
                                "stCategoryPageList": JSON.stringify(temp),
                                "stTotalQuestions": stTotalQuestions
                            }
                            saveSurveyTemplate(requestData).then(res => {
                                if (res.status === 200) {
                                    globalAlert({
                                        type: "Success",
                                        text: res.message,
                                        open: true
                                    });
                                    history.push("/mysurveytemplates");
                                } else {
                                    globalAlert({
                                        type: "Error",
                                        text: res.message,
                                        open: true
                                    });
                                    history.push("/mysurveytemplates");
                                }
                            });
                        })
                    }
                })
            } else {
                clickSaveFirst.current="no";
                $("#cntr").css("box-shadow","");
                removeActive("survey");
                savefullcontent();
                let tempSTData = generateJSON();
                let temp = tempSTData.surveysPages;
                temp = temp.filter((val)=>{
                    return val.spgType === "Question Page";
                });
                temp = temp.map((val)=>{
                    return {id: parseInt(val.squeCatId), catName: val.squeCatName, color: val.squeCatColor}
                });
                for(let name in window.CKEDITOR.instances)
                {
                    window.CKEDITOR.instances[name].destroy(true);
                }
                if(status === 0){
                    $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.save");
                    $("button.save").remove();
                } else if(status === 1){
                    $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.publish");
                    $("button.publish").remove();
                }
                let stTotalQuestions = 0;
                tempSTData.surveysPages.map((v)=>(
                    v.spgType === "Question Page" ?
                        stTotalQuestions+=v.surveysQuestions.length
                    : null
                ));
                html2canvas(document.querySelector("#cntr"), {
                    scrollX: 0,
                    scrollY: -window.scrollY
                }).then(async (canvas) => {
                    let compressThumbURL = await createSmallThumb(canvas);
                    let requestData = {
                        ...data,
                        "stHtml": $("#all_temp_data").val(),
                        "stId": id,
                        "subMemberId": subUser.memberId,
                        "stData": JSON.stringify(tempSTData),
                        "stStatus": status,
                        "thumbData": compressThumbURL,
                        "stLogicFlow": JSON.stringify({nodes:nodes, edges: edges}),
                        "stCategoryPageList": JSON.stringify(temp),
                        "stTotalQuestions": stTotalQuestions
                    }
                    saveSurveyTemplate(requestData).then(res => {
                        if (res.status === 200) {
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            history.push("/mysurveytemplates");
                        } else {
                            globalAlert({
                                type: "Error",
                                text: res.message,
                                open: true
                            });
                            history.push("/mysurveytemplates");
                        }
                    });
                })
            }
        } else {
            clickSaveFirst.current="no";
            $("#cntr").css("box-shadow","");
            removeActive("survey");
            savefullcontent();
            handleClearQuestionLogicFlow();
            let tempSTData = generateJSON();
            let temp = tempSTData.surveysPages;
            temp = temp.filter((val)=>{
                return val.spgType === "Question Page";
            });
            temp = temp.map((val)=>{
                return {id: parseInt(val.squeCatId), catName: val.squeCatName, color: val.squeCatColor}
            });
            for(let name in window.CKEDITOR.instances)
            {
                window.CKEDITOR.instances[name].destroy(true);
            }
            if(status === 0){
                $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.save");
                $("button.save").remove();
            } else if(status === 1){
                $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.publish");
                $("button.publish").remove();
            }
            let stTotalQuestions = 0;
            tempSTData.surveysPages.map((v)=>(
                v.spgType === "Question Page" ?
                    stTotalQuestions+=v.surveysQuestions.length
                : null
            ));
            html2canvas(document.querySelector("#cntr"), {
                scrollX: 0,
                scrollY: -window.scrollY
            }).then(async (canvas) => {
                let compressThumbURL = await createSmallThumb(canvas);
                let requestData = {
                    ...data,
                    "stHtml": $("#all_temp_data").val(),
                    "stId": id,
                    "subMemberId": subUser.memberId,
                    "stData": JSON.stringify(tempSTData),
                    "stStatus": status,
                    "thumbData": compressThumbURL,
                    "stLogicFlow": JSON.stringify({nodes:[], edges: []}),
                    "stCategoryPageList": JSON.stringify(temp),
                    "stTotalQuestions": stTotalQuestions
                }
                saveSurveyTemplate(requestData).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        history.push("/mysurveytemplates");
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                        history.push("/mysurveytemplates");
                    }
                });
            })
        }
    }
    const handleClickBackLogicflow = () => {
        let questions = extractQuestionsFromJson(data.stData);
        setNodes((prev)=>{
            prev = prev.map((e1)=>{
                if(e1.hasOwnProperty("data")) {
                    questions.forEach((e2)=>{
                        if((e1.data.pageIndex === (e2.spgNumber-1)) && (e1.data.questionIndex === e2.squeDisplayOrder) && e1.data.hasOwnProperty("formLinks")) {
                            if(e1.type !== "Rating") {
                                e1.data.formLinks =  e2.surveysOptions.map((val)=>{
                                    if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                                        return val?.formLink;
                                    } else {
                                        return "";
                                    }
                                })
                                e1.data.formNames =  e2.surveysOptions.map((val)=>{
                                    if(val.hasOwnProperty("formName") && val?.formName !== ""){
                                        return val?.formName;
                            } else {
                                        return "";
                                    }
                                });
                            } else {
                                e1.data.formLinks = e2.formLinks.map((val)=>{
                                    return val.formLink;
                                })
                                e1.data.formNames = e2.formNames.map((val)=>{
                                    return val.formName;
                                })
                            }
                        }
                    })
                }
                return e1;
            })
            return [...prev];
        });
        handleBack();
    }
    const handleDeletePageClick = (e)=>{
        deletePage(e, setCategoryPageList);
    }
    const handleNextFromCategory = () => {
        handleNext();
    }
    const handleClickGo = async () => {
        setRobotAnimation(true);
        let t = tempQuestions.filter(v=>v.isChecked).map(v=>v.value);
        setData((prev)=>{
            prev.demographicQuestions = t;
            return {...prev};
        });
        if(t.length === 0){
            setCategoryPageList([{id:1,catName:"None",color:"#000000"}]);
        } else {
            setCategoryPageList([{id:8,catName:"Demographics",color:websiteColor}]);
        }
        let prompt = "";
        if(typeof data?.stPrompt === "undefined" && data?.stPrompt !== ""){
            prompt = "The question types are:\n";
            prompt += "- open_ended\n";
            prompt += "- Multiple Choice (Single Answer)\n";
            prompt += "- Multiple Choice (Multiple Answers)\n";
            prompt += "- date_control\n";
            prompt += "- time_control\n";
            prompt += "- email\n";
            prompt += "- phone\n";
            prompt += "- matrix\n";
            prompt += "- rating_box\n";
            prompt += "- rating_symbol\n";
            prompt += "- rating_radio\n";
            prompt += "- yes_no\n";
            prompt += "Survey Format :\n";
            prompt += "Question:\n";
            prompt += "Answers:\n";
            prompt += "QuestionType:\n";
            prompt += "\n\n create survey for " + data?.stSurveyAbout;
            if(typeof data?.stNoOfQuestion !== "undefined" && data?.stNoOfQuestion !== 0 && data?.stNoOfQuestion !== "0" && data?.stNoOfQuestion !== ""){
                prompt += ", "+data?.stNoOfQuestion+" questions only";
            }
            prompt += "\nThis survey's goal is " + data?.stSurveyGoal === "Other" ? data?.stSurveyGoalDescription : data?.stSurveyGoal;
            prompt += "\n\n given in no section and given 'Survey Format' in JSON format and no other information";
            prompt += "\n rating_box type is number 1 to 10 with MinLabel and MaxLabel labels";
            prompt += "\n open_ended, date_control, time_control, email, phone, rating_symbol, rating_radio, yes_no types are no Answers needed";
            handleChange("stPrompt",prompt);
        } else {
            prompt = data?.stPrompt;
            prompt += "\n\n"+ data?.stSurveyAbout;
            prompt += "\n" + data?.stSurveyGoal;
            handleChange("stPrompt",prompt);
        }
        const result = await openai.chat.completions.create({
        	model: "gpt-4o",
        	messages: [{ role: 'user', content: prompt }],
        });
        let start = result.choices[0].message.content.indexOf('```json') + 7;
        let end = result.choices[0].message.content.indexOf('```', start);
        let tempData = result.choices[0].message.content.slice(start, end).trim();
        tempData = JSON.parse(tempData.replaceAll("```json","").replaceAll("```","").replaceAll("\n",""));
        handleChange("tempAigeneratedData",tempData);
        setRobotAnimation(false);
        setAiStepCompleted(true);
        handleNext();
    }
    const handleClick = (event, i) => {
        setAnchorEls(prev=>{
            prev[i] = event.target;
            return [...prev];
        })
      };
    const handleClose = (i) => {
        setAnchorEls(prev=>{
            prev[i] = null;
            return [...prev];
        })
    };
    const handleClickBackQuestion = () => {
        setTypeWriterEffectCompleted(false);
        setAskQuestionIndex((prev)=> prev - 1);
    }
    const handleClickNextQuestion = () => {
        let setHandleNext = "no";
        if(askQuestion[askQuestionIndex].required && (typeof data[askQuestion[askQuestionIndex].fieldName] === "undefined" || data[askQuestion[askQuestionIndex].fieldName] === "")){
            globalAlert({
                type: "Error",
                text: askQuestion[askQuestionIndex].errorMessage,
                open: true
            });
            return false;
        } else if(askQuestion[askQuestionIndex].fieldName === "demographicQuestions" && user?.brandKits?.length === 0){
            setHandleNext = "yes";
        } else if(askQuestion[askQuestionIndex].fieldName === "askBranding" && data?.askBranding === "no"){
            setHandleNext = "yes";
        } else if(askQuestion[askQuestionIndex].fieldName === "selectBrand"){
            if(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandColors === null && user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandLogo === null && JSON.stringify(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandFonts) === "{}"){
                setHandleNext = "yes";
            } else if(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandColors !== null){
                setTypeWriterEffectCompleted(false);
                setAskQuestionIndex((prev)=> prev + 1);
                return false;
            } else if(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandLogo !== null){
                setTypeWriterEffectCompleted(false);
                setAskQuestionIndex((prev)=> prev + 3);
                return false;
            } else if(JSON.stringify(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandFonts) !== "{}"){
                setTypeWriterEffectCompleted(false);
                setAskQuestionIndex((prev)=> prev + 4);
                return false;
            }
        } else if(askQuestion[askQuestionIndex].fieldName === "selectTextColor"){
            if(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandLogo === null && JSON.stringify(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandFonts) === "{}"){
                setHandleNext = "yes";
            } else if(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandLogo !== null){
                setTypeWriterEffectCompleted(false);
                setAskQuestionIndex((prev)=> prev + 1);
                return false;
            } else if(JSON.stringify(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandFonts) !== "{}"){
                setTypeWriterEffectCompleted(false);
                setAskQuestionIndex((prev)=> prev + 2);
                return false;
            }
        } else if(askQuestion[askQuestionIndex].fieldName === "selectLogo" && JSON.stringify(user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandFonts) === "{}"){
            setHandleNext = "yes";
        } else if(askQuestion[askQuestionIndex].fieldName === "selectFont"){
            setHandleNext = "yes";
        }
        setTypeWriterEffectCompleted(false);
        if(setHandleNext === "yes"){
            setAskQuestionIndex(-1);
            handleNext();
        } else {
            setAskQuestionIndex((prev)=> prev + 1);
        }
    }
    const renderDemographicsQuestions = (textAnimation="yes") => {
        return (
            <>
                <RadioGroup
                    row
                    className="w-50 mx-auto pl-4"
                    id="setDemographics" 
                    name="setDemographics"
                    value={data?.setDemographics || ""}
                    onChange={(event) => {
                        handleChange("setDemographics", event.target.value);
                    }}>
                    <FormControlLabel className="mb-0" value={"yes"} control={<Radio color="primary" />} label="Yes" />
                    <FormControlLabel className="mb-0" value={"no"} control={<Radio color="primary" />} label="No" />
                </RadioGroup>
                {
                    data?.setDemographics === "yes" &&
                        <Row className="w-50 mx-auto mt-3">
                            <Col xs={12} className="p-0 mb-3">
                                {
                                    textAnimation === "yes" ?
                                        <Typewriter text={"Please tell me what demographic information would you like me to collect?"} speed={50} />
                                    :
                                        <p>Please tell me what demographic information would you like me to collect?</p>
                                }
                            </Col>
                            {
                                tempQuestions.map((v, i)=>{
                                    return (
                                        <Col xs={6} key={i} className="mb-3 pl-4 fs-16">
                                            <input 
                                                type="checkbox"
                                                className="mr-2"
                                                checked={v.isChecked}  
                                                onChange={()=>{
                                                    setTempQuestions((prev)=>{
                                                        prev[i].isChecked = !prev[i].isChecked;
                                                        return [...prev];
                                                    });
                                                }}
                                            />
                                            <label className="mb-0 cursor-pointer" aria-describedby={`simple-popover-${i}`} onClick={(event)=>{handleClick(event, i)}}>{v.value}</label>
                                            <Popover
                                                id={`simple-popover-${i}`}
                                                open={Boolean(anchorEls[i])}
                                                anchorEl={anchorEls[i]}
                                                onClose={()=>{handleClose(i)}}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <Typography className="p-3"><strong>{v.question}</strong></Typography>
                                                {
                                                    v.hasOwnProperty("options") ?
                                                        <ul className="mr-3">
                                                            {
                                                                v.options.map((option, j)=>{
                                                                    return <li className="list-style-disc" key={j}>{option}</li>
                                                                })
                                                            }
                                                        </ul>
                                                    : null
                                                }
                                            </Popover>
                                        </Col>
                                    );
                                })
                            }
                        </Row>
                }
            </>
        );
    }
    const renderAskBranding = () => {
        return (
            <RadioGroup
                row
                className="w-50 mx-auto pl-4"
                id="askBranding" 
                name="askBranding"
                value={data?.askBranding || ""}
                onChange={(event) => {
                    handleChange("askBranding", event.target.value)
                }}>
                <FormControlLabel className="mb-0" value={"yes"} control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel className="mb-0" value={"no"} control={<Radio color="primary" />} label="No" />
            </RadioGroup>
        );
    }
    const renderSelectBrand = () => {
        let brandData = [];
        user?.brandKits?.forEach((value)=>{
            brandData.push({
                "key": value.brandName,
                "value": value.brandName
            })
        });
        return (
            <div className="w-50 mx-auto">
                <DropDownControls
                    id="selectBrand"
                    name="selectBrand"
                    className="mt-0"
                    onChange={handleChange}
                    value={data?.selectBrand || ""}
                    dropdownList={brandData}
                />
            </div>
        );
    }
    const renderSelectBgColor = () => {
        return (
            <div className="w-50 mx-auto">
                <Row>
                    <RadioGroup className="w-100" row name="brandBgColor" value={data?.brandBgColor || ""} onChange={(e)=>{handleChange(e.target.name,e.target.value);}}>
                        {
                            user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandColors.split(";").map((v1,index)=>(
                                <Col xs={3} className="d-flex justify-content-center" key={index}>
                                    <FormControlLabel className="mr-0" value={v1} control={<Radio color="primary" />} label={<span className="square-box mr-1" style={{backgroundColor:v1,width:"50px"}}></span>} />
                                </Col>
                            ))
                        }
                    </RadioGroup>
                </Row>
            </div>
        );
    }
    const renderSelectTextColor = () => {
        return (
            <div className="w-50 mx-auto">
                <Row>
                    <RadioGroup className="w-100" row name="brandTextColor" value={data?.brandTextColor || ""} onChange={(e)=>{handleChange(e.target.name,e.target.value); handleChange("textColor",e.target.value)}}>
                        {
                            user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandColors.split(";").map((v1,index)=>(
                                <Col xs={3} className="d-flex justify-content-center" key={index}>
                                    <FormControlLabel className="mr-0" value={v1} control={<Radio color="primary" />} label={<span className="square-box mr-1" style={{backgroundColor:v1,width:"50px"}}></span>} />
                                </Col>
                            ))
                        }
                    </RadioGroup>
                </Row>
            </div>
        );
    }
    const renderSelectLogo = () => {
        return (
            <div className="w-50 mx-auto d-flex">
                <div className="w-50">
                    <RadioGroup
                        row
                        className="pl-4"
                        id="selectLogo" 
                        name="selectLogo"
                        value={data?.selectLogo || ""}
                        onChange={(event) => {
                            handleChange("selectLogo", event.target.value)
                        }}>
                        <FormControlLabel className="mb-0" value={"yes"} control={<Radio color="primary" />} label="Yes" />
                        <FormControlLabel className="mb-0" value={"no"} control={<Radio color="primary" />} label="No" />
                    </RadioGroup>
                </div>
                <div className="w-50 text-center">
                    <img src={user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandLogo} alt="Brand Logo" style={{maxWidth:"200px",maxHeight:"100px"}} />
                </div>
            </div>
        );
    }
    const renderSelectFont = () => {
        let brandFont = user?.brandKits?.filter((v) => v.brandName === data?.selectBrand)[0].brandFonts.textSetting;
        let fontName = fontData.filter((v) => v.key === brandFont)[0].value;
        return (
            <div className="w-50 mx-auto d-flex">
                <div className="w-50">
                    <RadioGroup
                        row
                        className="pl-4"
                        id="selectFont" 
                        name="selectFont"
                        value={data?.selectFont || ""}
                        onChange={(event) => {
                            handleChange("selectFont", event.target.value)
                            if(event.target.value === "yes"){
                                handleChange("selectedFont", brandFont);
                            } else {
                                handleChange("selectedFont", "Arial, Helvetica Neue, Helvetica, sans-serif");
                            }
                        }}>
                        <FormControlLabel className="mb-0" value={"yes"} control={<Radio color="primary" />} label="Yes" />
                        <FormControlLabel className="mb-0" value={"no"} control={<Radio color="primary" />} label="No" />
                    </RadioGroup>
                </div>
                <div className="w-50 d-flex align-items-center">
                    Font Family : <span className="ml-2" style={{fontFamily:brandFont}}>{fontName}</span>
                </div>
            </div>
        );
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Col xs={4} className="mx-auto">
                        <FormGroup>
                            <div className="d-flex justify-content-center">
                                <div className={`square-box-ai-main mr-3 ${data?.stType === 1 ? "active" : ""}`} onClick={() => {handleClickNextType(1);}}>
                                    <div className="square-box-ai">
                                        <div className="lottie-main">
                                            <Lottie animationData={loaderAnimation} loop={true} />
                                        </div>
                                    </div>
                                    <p className="text-center">Use AI To Create My Survey</p>
                                </div>
                                <div className={`square-box-ai-main ${data?.stType === 2 ? "active" : ""}`} onClick={() => {handleClickNextType(2);}}>
                                    <div className="square-box-ai">
                                        <i className="far fa-user-edit fa-2x"></i>
                                    </div>
                                    <p className="text-center">I Will Created My Self</p>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup className="text-center mb-5">
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/mysurveytemplates")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                        </FormGroup>
                    </Col>
                );
            case 1:
                return (
                    <div className="d-flex align-items-center justify-content-center h-75">
                        <Col xs={8} className="mx-auto">
                            <div className="d-flex justify-content-center mb-5">
                                <div className="lottie-main">
                                    <Lottie animationData={loaderAnimation} loop={true} />
                                </div>
                            </div>
                            {askQuestionIndex < 1 && <FormGroup className="white-space-pre-line w-50 mx-auto">
                                <Typewriter text={"Hi, I'm Samai!\n\nLet's create an amazing survey together!"} speed={50} askQuestionIndex={askQuestionIndex} setAskQuestionIndex={setAskQuestionIndex} />
                            </FormGroup>}
                            {askQuestionIndex > -1 && <RenderAskQuestion askQuestion={askQuestion} askQuestionIndex={askQuestionIndex} data={data} handleChange={handleChange} handleClickNextQuestion={handleClickNextQuestion} handleClickBackQuestion={handleClickBackQuestion} renderDemographicsQuestions={renderDemographicsQuestions} renderAskBranding={renderAskBranding} renderSelectBrand={renderSelectBrand} renderSelectBgColor={renderSelectBgColor} renderSelectTextColor={renderSelectTextColor} renderSelectLogo={renderSelectLogo} renderSelectFont={renderSelectFont} typeWriterEffectCompleted={typeWriterEffectCompleted} setTypeWriterEffectCompleted={setTypeWriterEffectCompleted} />}
                        </Col>
                    </div>
                );
            case 2:
                return (
                    <SurveyDetails
                        data={data} 
                        handleChange={handleChange}
                        aiStepCompleted={aiStepCompleted}
                        handleBack={handleBack}
                        handleClickNextSurveyDetail={handleClickNextSurveyDetail}
                        globalAlert={globalAlert}
                        renderDemographicsQuestions={renderDemographicsQuestions}
                    />
                );
            case 3:
                return (
                    <>
                        <div className='text-center'>
                            <h4>Would you like to set Default Settings?</h4>
                        </div>
                        <Row>
                            <Col xs={8} className="mx-auto">
                                <Row>
                                    <Col xs={6}>
                                        <FormControl variant="standard" fullWidth>
                                            <InputLabel id="select-font-label">Font</InputLabel>
                                            <Select
                                                labelId="select-font-label"
                                                name="selectedFont"
                                                label="Select Font"
                                                value={data?.selectedFont}
                                                onChange={(event) => { handleChange("selectedFont", event.target.value); }}
                                                fullWidth
                                            >
                                                {
                                                    fontData.map((font, index) => (
                                                        <MenuItem key={index} value={font.key} style={{fontFamily:font.key}}>{font.value}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className='mt-4'>
                                            <InputLabel id="select-font-size-label">Font Size</InputLabel>
                                            <Select
                                                labelId="select-font-size-label"
                                                name="selectedFontSize"
                                                label="Select Font Size"
                                                value={data?.selectedFontSize}
                                                onChange={(event) => { handleChange("selectedFontSize", event.target.value); handleChange("lineHeight", event.target.value.replaceAll("px","")); }}
                                                fullWidth
                                            >
                                                <MenuItem value="9px">9px</MenuItem>
                                                <MenuItem value="10px">10px</MenuItem>
                                                <MenuItem value="11px">11px</MenuItem>
                                                <MenuItem value="12px">12px</MenuItem>
                                                <MenuItem value="13px">13px</MenuItem>
                                                <MenuItem value="14px">14px</MenuItem>
                                                <MenuItem value="15px">15px</MenuItem>
                                                <MenuItem value="16px">16px</MenuItem>
                                                <MenuItem value="17px">17px</MenuItem>
                                                <MenuItem value="18px">18px</MenuItem>
                                                <MenuItem value="19px">19px</MenuItem>
                                                <MenuItem value="20px">20px</MenuItem>
                                                <MenuItem value="22px">22px</MenuItem>
                                                <MenuItem value="24px">24px</MenuItem>
                                                <MenuItem value="26px">26px</MenuItem>
                                                <MenuItem value="28px">28px</MenuItem>
                                                <MenuItem value="30px">30px</MenuItem>
                                                <MenuItem value="32px">32px</MenuItem>
                                                <MenuItem value="34px">34px</MenuItem>
                                                <MenuItem value="36px">36px</MenuItem>
                                                <MenuItem value="38px">38px</MenuItem>
                                                <MenuItem value="40px">40px</MenuItem>
                                                <MenuItem value="42px">42px</MenuItem>
                                                <MenuItem value="44px">44px</MenuItem>
                                                <MenuItem value="46px">46px</MenuItem>
                                                <MenuItem value="48px">48px</MenuItem>
                                                <MenuItem value="50px">50px</MenuItem>
                                                <MenuItem value="52px">52px</MenuItem>
                                                <MenuItem value="54px">54px</MenuItem>
                                                <MenuItem value="56px">56px</MenuItem>
                                                <MenuItem value="58px">58px</MenuItem>
                                                <MenuItem value="60px">60px</MenuItem>
                                                <MenuItem value="62px">62px</MenuItem>
                                                <MenuItem value="64px">64px</MenuItem>
                                                <MenuItem value="66px">66px</MenuItem>
                                                <MenuItem value="68px">68px</MenuItem>
                                                <MenuItem value="70px">70px</MenuItem>
                                                <MenuItem value="72px">72px</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <InputField type="text" className="mt-4" id="lineHeight" name="lineHeight" value={data?.lineHeight || ""} onChange={handleChange} label={"Line Height(in Pixels)"}/>
                                        <div className='mt-4'>
                                            <p className='text-muted'>Style</p>
                                            <div className='d-flex border rounded' style={{width:"max-content"}}>
                                                <div className='px-3 py-2 border-right cursor-pointer' onClick={()=>{handleChange("styleBold",!data?.styleBold)}} style={{backgroundColor:data?.styleBold === true ? "#e0e0e0" : ""}}>
                                                    <i className='far fa-bold'></i>
                                                </div>
                                                <div className='px-3 py-2 border-right cursor-pointer' onClick={()=>{handleChange("styleItalic",!data?.styleItalic)}} style={{backgroundColor:data?.styleItalic === true ? "#e0e0e0" : ""}}>
                                                    <i className='far fa-italic'></i>
                                                </div>
                                                <div className='px-3 py-2 border-right cursor-pointer' onClick={()=>{handleChange("styleUnderline",!data?.styleUnderline)}} style={{backgroundColor:data?.styleUnderline === true ? "#e0e0e0" : ""}}>
                                                    <i className='far fa-underline'></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-4'>
                                            <p className='text-muted'>Text Color</p>
                                            <input type="text" defaultValue={data?.textColor} id="textColor" />
                                        </div>
                                        <div className='mt-4'>
                                            <p className='text-muted'>Background Color</p>
                                            <input type="text" defaultValue={data?.brandBgColor} id="brandBgColor" />
                                        </div>
                                    </Col>
                                    <Col xs={6} className='border rounded p-3' style={{backgroundColor:data?.brandBgColor}}>
                                        <h5 className='mb-5 text-center'>Preview</h5>
                                        <div className='mx-auto' style={{width:"max-content"}}>
                                            <p
                                                style={{
                                                    fontFamily: data?.selectedFont,
                                                    fontSize: data?.selectedFontSize,
                                                    lineHeight: data?.lineHeight + "px",
                                                    fontWeight: data?.styleBold === true ? "bold" : "normal",
                                                    fontStyle: data?.styleItalic === true ? "italic" : "normal",
                                                    textDecoration: data?.styleUnderline === true ? "underline" : "none",
                                                    color: data?.textColor
                                                }}
                                            >
                                                What is your gender?
                                            </p>
                                            <RadioGroup 
                                                aria-label="group" 
                                                name="group" 
                                                sx={{
                                                    "& .MuiFormControlLabel-label": {
                                                        fontFamily: `${data?.selectedFont} !important`,
                                                        fontSize: `${data?.selectedFontSize} !important`,
                                                        lineHeight: `${data?.lineHeight}px !important`,
                                                        fontWeight: `${data?.styleBold ? "bold" : "normal"} !important`,
                                                        fontStyle: `${data?.styleItalic ? "italic" : "normal"} !important`,
                                                        textDecoration: `${data?.styleUnderline ? "underline" : "none"} !important`,
                                                        color: `${data?.textColor} !important`,
                                                    },
                                                }}
                                            >
                                                <FormControlLabel value="Male" control={<Radio color="primary"/>} label="Male" />
                                                <FormControlLabel value="Female" control={<Radio color="primary"/>} label="Female" />
                                            </RadioGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/mysurveytemplates")}} className="mr-3 cancel"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            <Button variant="contained" color="primary" onClick={handleNext}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="addpagemain d-flex align-items-center">
                            <div className="p-3 pageTypeMain">
                                <div><Link component="a" id="addpage" underline="none" color="inherit" className="pageType">New Survey Page</Link></div>
                                <div><Link component="a" id="addlandingpage" underline="none" color="inherit" className="pageType">Content Page</Link></div>
                            </div>
                            <span className="mb-2" style={{width:"min-content"}}>
                                { data?.stSurveyType !== "traditional" && <i className="far fa-plus-square addpage pb-2" title="Add" data-toggle="tooltip"></i> }
                                <i className="far fa-list showhidelist" title="Show/Hide Categories" data-toggle="tooltip"></i>
                            </span>
                            {
                                typeof data?.stData?.pageCounter === "undefined" || data?.stData?.pageCounter === "" ?
                                    <span id="addpagethumb">
                                        <div className="pagethumb active" title={categoryPageList[0].catName} data-toggle="tooltip"><div className="fold" style={{backgroundColor:categoryPageList[0].color}}></div><span>1</span></div>
                                        <div id="thankYouPage" title="Thank You Page" data-toggle="tooltip"><div className="fold"></div><span>END</span></div>
                                    </span>
                                :
                                    <span id="addpagethumb" dangerouslySetInnerHTML={{ __html:data.stData.pageCounter}}></span>
                            }
                            { data?.stSurveyType !== "traditional" && <i className="far fa-trash-alt deletepage" title="Delete" data-toggle="tooltip" onClick={(e)=>{handleDeletePageClick(e)}}></i> }
                        </div>
                        <SurveyEditor data={data} categoryPageList={categoryPageList}/>
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleClickBackEditor} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handleEditorPreview} className="mr-3"><i className="far fa-eye mr-2"></i>PREVIEW</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSaveFirst(0);}} className="mr-3 save"><i className="far fa-save mr-2"></i>SAVE FOR LATER</Button>
                            {checkAllQuestions === true && <Button variant="contained" color="primary" onClick={()=>{handleClickSaveFirst(1);}} className="mr-3 publish"><i className="far fa-envelope-open-text mr-2"></i>PUBLISH</Button>}
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/mysurveytemplates")}} className="mr-3 cancel"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            {checkAllQuestions === false && <Button variant="contained" color="primary" onClick={handleClickNextEditor}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>}
                        </FormGroup>
                    </>
                );
            case 5:
                return (
                    <>
                        <LogicFlow
                            data={data}
                            nodes={nodes}
                            edges={edges}
                            setNodes={setNodes}
                            setEdges={setEdges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            setData={setData}
                            categoryPageList={categoryPageList}
                        />
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleClickBackLogicflow} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handleClearQuestionLogicFlow} className="mr-3"><i className="far fa-broom mr-2"></i>CLEAR ANSWER LOGIC FLOW</Button>
                            <Button variant="contained" color="primary" onClick={()=>{togglePreviewForm("fromLogicFlow");}} className="mr-3"><i className="far fa-eye mr-2"></i>PREVIEW</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(0);}} className="mr-3 save"><i className="far fa-save mr-2"></i>SAVE FOR LATER</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(1);}} className="mr-3 publish"><i className="far fa-envelope-open-text mr-2"></i>PUBLISH</Button>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/mysurveytemplates")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                    </FormGroup>
                </>
            );
            default:
                return 'Unknown step';
        }
    }
    useEffect(()=>{
        if(id){
            setActiveStep(2);
            setAiStepCompleted(true);
            getSurveyTemplateById(id).then(res => {
                if (res.result && res.result.surveyTemplate) {
                    let tempStData = JSON.parse(res.result.surveyTemplate.stData);
                    let t={
                        ...res.result.surveyTemplate,
                        stData: JSON.parse(res.result.surveyTemplate.stData),
                        stLogicFlow:JSON.parse(res.result.surveyTemplate.stLogicFlow),
                        stCategoryPageList: JSON.parse(res.result.surveyTemplate.stCategoryPageList),
                        textColor: tempStData?.settings?.pageSettings?.color,
                        selectedFont: tempStData?.settings?.pageSettings?.fontFamily,
                        selectedFontSize: tempStData?.settings?.pageSettings?.fontSize,
                        lineHeight: tempStData?.settings?.pageSettings?.lineHeight?.replaceAll("px",""),
                        styleBold: (tempStData?.settings?.pageSettings?.fontWeight === "bold" || tempStData?.settings?.pageSettings?.fontWeight >= 700) ? true : false,
                        styleItalic: tempStData?.settings?.pageSettings?.fontStyle === "italic" ? true : false,
                        styleUnderline: tempStData?.settings?.pageSettings?.textDecoration === "underline" ? true : false,
                        brandBgColor: tempStData?.settings?.pageSettings?.backgroundColor
                    };
                    setData(t);
                    setNodes(t.stLogicFlow.nodes);
                    setEdges(t.stLogicFlow.edges);
                    setCategoryPageList(JSON.parse(res.result.surveyTemplate.stCategoryPageList));
                }
            });
        }
        return ()=>{
            setData({});
            setNodes([]);
            setEdges([]);
            setCategoryPageList([]);
            setActiveStep(0);
        }
    },[id, setEdges, setNodes]);
    useEffect(()=>{
        if(activeStep === 4){
            setTimeout(async ()=>{
                if(clickSaveFirst.current === ""){
                    let brandData = {
                        brandBgColor: data?.brandBgColor, 
                        brandTextColor: data?.textColor,
                        selectBrand: data?.selectBrand,
                        selectLogo: data?.selectLogo,
                        selectFont: data?.selectedFont,
                        selectedFontSize: data?.selectedFontSize,
                        lineHeight: data?.lineHeight,
                        styleBold: data?.styleBold,
                        styleItalic: data?.styleItalic,
                        styleUnderline: data?.styleUnderline
                    }
                    await reloadfirst(data?.stSurveyType, data?.demographicQuestions, JSON.stringify(data?.tempAigeneratedData) !== JSON.stringify(data?.stAigeneratedData) ? data?.tempAigeneratedData : [], brandData);
                    removeDemographicQuestions();
                    setData((prev)=>{
                        prev.stAigeneratedData = data?.tempAigeneratedData;
                        prev.tempAigeneratedData = [];
                        return prev;
                    });
                    if(id){
                        let radioTypes = ["gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race"];
                        $('#preview-template').contents().find('.templateBody').each(function(){
                            if(typeof $(this).attr("page-category") !== "undefined"){
                                if(typeof $(this).attr("page-unique-id") === "undefined"){
                                    $(this).attr("page-unique-id",uuidv4());
                                }
                                $(this).contents().find('.mojoMcBlock.frm-block').each(function(){
                                    if(typeof $(this).attr("data-unique-id") === "undefined"){
                                        $(this).attr("data-unique-id",uuidv4());
                                    }
                                    if ($(this).attr("rolefor") === "single_answer" || $(this).attr("rolefor") === "single_answer_checkbox" || $(this).attr("rolefor") === "single_answer_button" || $(this).attr("rolefor") === "single_answer_combo" || radioTypes.includes($(this).attr("rolefor"))) {
                                        $(this).contents().find('div.blockoption div.col-12').each(function(){
                                            if(typeof $(this).attr("unique-id") === "undefined"){
                                                $(this).attr("unique-id",uuidv4());
                                            }
                                        });
                                    }
                                    if ($(this).attr("rolefor") === "image_form"){
                                        $(this).contents().find('div.blockanswer div.row div.col-3').each(function(){
                                            if(typeof $(this).attr("unique-id") === "undefined"){
                                                $(this).attr("unique-id",uuidv4());
                                            }
                                        });
                                    }
                                    if ($(this).attr("rolefor") === "image_with_text_form"){
                                        $(this).contents().find('div.blockanswer div.row div.col-12').each(function(){
                                            if(typeof $(this).attr("unique-id") === "undefined"){
                                                $(this).attr("unique-id",uuidv4());
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            },2000);
        }
    },[activeStep,data?.stSurveyType,data?.demographicQuestions,removeDemographicQuestions]);
    useEffect(() => {
        try {
            loadeverytime();
            if($(".pagethumb.active span").length !== 0) {
                $("#preview-template").find("#templateBody" + $(".pagethumb.active span").html().replaceAll("C", "") + " .mojoMcBlock.frm-block").each(function () {
                    formBlockSetting($(this).attr("id"));
                });
                $("#preview-template").find("#templateBody" + $(".pagethumb.active span").html().replaceAll("C", "") + " .mojoMcBlock.tpl-block").each(function () {
                    blockedtblocan($(this).attr("id"));
                });
            } else {
                $("#preview-template").find("#templateBodyEND").find(".mojoMcBlock.tpl-block").each(function () {
                    blockedtblocan($(this).attr("id"));
                });
            }
        } catch (error) {
        }
    }, [showPreviewForm,toggleSurveysTags,toggleAssessmentsTags,toggleCustomFormsTags,toggleButton]);
    useEffect(()=>{
        if(activeStep === 3){
            $("#textColor").spectrum({
                allowEmpty:true,
                color: data.textColor || "#000000",
                showInput: true,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                showAlpha: true,
                maxSelectionSize: 1000,
                preferredFormat: "hex",
                localStorageKey: "spectrum.homepage",
                change: function(color) {
                    handleChange("textColor", color.toHexString());
                },
                chooseText: "Select",
                palette: []
            });
            $("#brandBgColor").spectrum({
                allowEmpty:true,
                color: data.brandBgColor || "#000000",
                showInput: true,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                showAlpha: true,
                maxSelectionSize: 1000,
                preferredFormat: "hex",
                localStorageKey: "spectrum.homepage",
                change: function(color) {
                    handleChange("brandBgColor", color.toHexString());
                },
                chooseText: "Select",
                palette: []
            });
        }
        if(activeStep === 4){
            const targetNode = document.documentElement;
            observerRef.current = new MutationObserver((mutationsList) => {
                if($(".pagethumb.active span").length !== 0) {
                    let tempValue = false
                    $("#preview-template").find("#templateBody" + $(".pagethumb.active span").html().replaceAll("C", "")).each(function () {
                        if($(this).attr("question-style") === "all") {
                            tempValue = true;
                        }
                    });
                    if(tempValue === true && checkAllQuestions === false){
                        globalAlert({
                            type: "Warning",
                            text: "Answer Logic Flow will not be applied to survey.",
                            open: true
                        });
                    }
                    setCheckAllQuestions(tempValue);
                }
            });
            observerRef.current?.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
            });
            return () => observerRef.current?.disconnect();
        }
    }, [activeStep, checkAllQuestions]);
    return (
        <>
            <Row className="midleMain2">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={4}><h3>Survey Design</h3></Col>
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
                    {(activeStep > 3) && <p><strong>Survey Name : </strong>{data.stName}</p>}
                    {getStepContent(activeStep)}
                    <input type="hidden" name="all_temp_data" id="all_temp_data" />
                </Col>
            </Row>
            {
                showPreviewForm && <PreviewSurvey dataListJson={dataListJson} setDataListJson={setDataListJson} togglePreviewForm={togglePreviewForm} saveMode={false} setFormData={(obj)=>{}}/>
            }
            {   robotAnimation && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
                    <div className="lottie-main-big">
                        <Lottie animationData={loaderAnimation} loop={true} />
                    </div>
                </div>
            }
            <ModalAssessment modalAssessmentsTags={modalAssessmentsTags} toggleAssessmentsTags={toggleAssessmentsTags} />
            <ModalSurvey modalSurveysTags={modalSurveysTags} toggleSurveysTags={toggleSurveysTags} />
            <ModalCustomForm modalCustomFormsTags={modalCustomFormsTags} toggleCustomFormsTags={toggleCustomFormsTags} />
            <ModalButton modalButton={modalButton} toggleButton={toggleButton} />
            <CategoryModal globalAlert={globalAlert} setCategoryPageList={setCategoryPageList} subUser={subUser} addPage={addPage} callFromFirstPage={activeStep === 0 ? "yes" : ""} handleNextFromCategory={handleNextFromCategory}/>
            <ModalOpenAi modalOpenAi={modalOpenAi} toggleOpenAi={toggleOpenAi} />
            <ModalImageAi modalImageAi={modalImageAi} toggleImageAi={toggleImageAi} />
            <ModalQuestionAi stSurveyAbout={data?.stSurveyAbout || ""} stSurveyGoal={data?.stSurveyGoal || ""} stSurveyGoalDescription={data?.stSurveyGoalDescription || ""} stNoOfQuestion={data?.stNoOfQuestion || ""} handleChange={handleChange} />
        </>
    );
}
const Typewriter = ({ text, speed = 100, askQuestionIndex = 0, setAskQuestionIndex = ()=>{}, setTypeWriterEffectCompleted = () => {}}) => {
    const displayedText = useRef("");
    const caret = useRef("");
    useEffect(() => {
        let i = 0;
        displayedText.current.innerHTML="";
        caret.current.classList.remove("d-none");
        function typeWriter() {
            if (i < text.length) {
                displayedText.current.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                if(askQuestionIndex === -1){
                    setAskQuestionIndex((prev)=> prev + 1);
                }
                caret.current.classList.add("d-none");
                setTypeWriterEffectCompleted(true);
            }
        }
        typeWriter();
    }, [text, speed]);
    return <><span ref={displayedText} className="white-space-pre-line"></span><span ref={caret} className="blink-caret"></span></>;
};
const RenderField = ({fieldName, data, handleChange, renderDemographicsQuestions, renderAskBranding, renderSelectBrand, renderSelectBgColor, renderSelectTextColor, renderSelectLogo, renderSelectFont}) => {
    const surveyGoalData = [
        {
            "key": "Data Collection",
            "value": "Data Collection"
        },
        {
            "key": "Decision Making",
            "value": "Decision Making"
        },
        {
            "key": "Understanding Trends or Patterns",
            "value": "Understanding Trends or Patterns"
        },
        {
            "key": "Needs Assessment",
            "value": "Needs Assessment"
        },
        {
            "key": "Feedback Gathering",
            "value": "Feedback Gathering"
        },
        {
            "key": "Evaluating Impact",
            "value": "Evaluating Impact"
        },
        {
            "key": "Segmentation",
            "value": "Segmentation"
        },
        {
            "key": "Other",
            "value": "Other"
        }
    ];
    switch (fieldName) {
        case "stSurveyAbout":
            return (
                <div className="w-50 mx-auto">
                    <InputField type="text" id="stSurveyAbout" name="stSurveyAbout" value={data?.stSurveyAbout || ""} onChange={handleChange} />
                </div>
            );
        case "stSurveyGoal":
            return (
                <div className="w-50 mx-auto">
                    <DropDownControls
                        id="stSurveyGoal"
                        name="stSurveyGoal"
                        className="mt-0"
                        onChange={handleChange}
                        value={data?.stSurveyGoal || ""}
                        dropdownList={surveyGoalData}
                    />
                    {data?.stSurveyGoal === "Other" &&
                        <InputField type="text" id="stSurveyGoalDescription" className="mt-3" name="stSurveyGoalDescription" value={data?.stSurveyGoalDescription || ""} onChange={handleChange} label="Survey goal description" />
                    }
                </div>
            );
        case "stNoOfQuestion":
            return (
                <div className="w-50 mx-auto">
                    <NumberField type="text" id="stNoOfQuestion" name="stNoOfQuestion" value={data?.stNoOfQuestion || ""} onChange={handleChange} format="####################"/>
                </div>
            );
        case "demographicQuestions":
            return (
                renderDemographicsQuestions()
            );
        case "askBranding":
            return (
                renderAskBranding()
            );
        case "selectBrand":
            return (
                renderSelectBrand()
            );
        case "selectBgColor":
            return (
                renderSelectBgColor()
            );
        case "selectTextColor":
            return (
                renderSelectTextColor()
            );
        case "selectLogo":
            return (
                renderSelectLogo()
            );
        case "selectFont":
            return (
                renderSelectFont()
            );
        default:
            return '';
    }
};
const RenderAskQuestion = ({askQuestion, askQuestionIndex, data, handleChange, handleClickNextQuestion, handleClickBackQuestion, renderDemographicsQuestions, renderAskBranding, renderSelectBrand, renderSelectBgColor, renderSelectTextColor, renderSelectLogo, renderSelectFont, typeWriterEffectCompleted, setTypeWriterEffectCompleted}) => {
    return (
        <>
            <FormGroup className="w-50 mx-auto">
                <Typewriter text={askQuestion[askQuestionIndex].question.replaceAll("{{brandName}}",data?.selectBrand)} speed={50} setTypeWriterEffectCompleted={setTypeWriterEffectCompleted} />
            </FormGroup>
            {
                typeWriterEffectCompleted && <>
                    <FormGroup>
                        <RenderField fieldName={askQuestion[askQuestionIndex].fieldName} data={data} handleChange={handleChange} renderDemographicsQuestions={renderDemographicsQuestions} renderAskBranding={renderAskBranding} renderSelectBrand={renderSelectBrand} renderSelectBgColor={renderSelectBgColor} renderSelectTextColor={renderSelectTextColor} renderSelectLogo={renderSelectLogo} renderSelectFont={renderSelectFont} />
                    </FormGroup>
                    <FormGroup className="text-center">
                        {askQuestionIndex !==0 &&
                            <Link component="a" className="btn-circle active" onClick={()=>{handleClickBackQuestion()}}>
                                <i className="far fa-arrow-left"></i>
                                <div className="bg-blue"></div>
                            </Link>
                        }
                        <Link component="a" className="btn-circle active ml-3" onClick={()=>{history.push("/mysurveytemplates")}}>
                            <i className="far fa-times"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle active ml-3" onClick={()=>{handleClickNextQuestion()}}>
                            <i className="far fa-arrow-right"></i>
                            <div className="bg-blue"></div>
                        </Link>
                    </FormGroup>
                </>
            }
        </>
    );
}
const SurveyDetails = ({data, handleChange, aiStepCompleted, handleBack, handleClickNextSurveyDetail, globalAlert, renderDemographicsQuestions}) => {
    const [one, setOne] = useState(false);
    const [two, setTwo] = useState(false);
    const [three, setThree] = useState(false);
    const [four, setFour] = useState(false);
    useEffect(()=>{
        if(typeof data?.stType !== "undefined"){
            if(data?.stType === 1){
                setOne(true);
                setTimeout(()=>{
                    setTwo(true);
                },40 * 65);
            } else {
                setOne(true);
                setTwo(true);
                setThree(true);
                setFour(true);
            }
        }
    },[data]);
    const handleClickNextQuestion = () => {
        if(typeof data?.stName === "undefined" || data?.stName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter survey name.",
                open: true
            });
            return false;
        }
        setThree(true);
        setTimeout(()=>{
            setFour(true);
        },56 * 65);
    }
    return (
        <Row>
            <Col xs={{ offset: 4, size: 4 }}>
                {
                    data?.stType === 1 && <div className="d-flex justify-content-center mb-5 mt-5">
                        <div className="lottie-main">
                            <Lottie animationData={loaderAnimation} loop={true} />
                        </div>
                    </div>
                }
                <FormGroup>
                    {(data?.stType === 1 && one) && <Typewriter text={"What would you like to name this survey?"} speed={50} />}
                    {two && <InputField type="text" id="stName" name="stName" value={data?.stName || ""} onChange={handleChange} label={data?.stType === 1 ? "" : "Survey Name"}/>}
                </FormGroup>
                {(data?.stType === 1 && !three) && <FormGroup className="text-center">
                    <Link component="a" className="btn-circle active ml-3" onClick={()=>{handleClickNextQuestion()}}>
                        <i className="far fa-arrow-right"></i>
                        <div className="bg-blue"></div>
                    </Link>
                </FormGroup>}
                <FormGroup>
                    {(data?.stType === 1 && three) && <Typewriter text={"Do you want provide a short description for this survey?"} speed={50} />}
                    {four && <InputField type="text" id="stDescription" name="stDescription" value={data?.stDescription || ""} onChange={handleChange} label={data?.stType === 1 ? "" : "Survey Description"}/>}
                </FormGroup>
            </Col>
            {(data?.stType === 2) && <Col xs={{ offset: 2, size: 8 }}>
                <p className='w-50 mx-auto mt-3 pl-2'>Would you like me to add demographic question for your survey?</p>
                <div className='pl-2'>
                    {renderDemographicsQuestions("no")}
                </div>
            </Col>}
            {(one && two && three && four) && <Col xs={{ offset: 4, size: 4 }}>
                <FormGroup className="pt-3">
                    <p className="mb-1">Survey Type</p>
                    <RadioGroup
                        name="stSurveyType"
                        value={data?.stSurveyType}
                        onChange={(e)=>{handleChange(e.target.name,e.target.value)}}
                    >
                        <FormControlLabel value="traditional" control={<Radio color="primary" className="mr-2"/>} label="Traditional One Page Survey" className="ml-0 mr-2 mb-0"/>
                        <FormControlLabel value="dynamic" control={<Radio color="primary" className="mr-2"/>} label="Multi-Page Survey & Landing Pages" className="ml-0 mr-2 mb-0"/>
                    </RadioGroup>
                </FormGroup>
                <FormGroup className="text-center mt-3">
                    {!aiStepCompleted && <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>}
                    <Button variant="contained" color="primary" onClick={()=>{history.push("/mysurveytemplates")}} className="mr-3 cancel"><i className="far fa-times mr-2"></i>CANCEL</Button>
                    <Button variant="contained" color="primary" onClick={handleClickNextSurveyDetail}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </FormGroup>
            </Col>}
        </Row>
    );
}
const mapStateToProps = (state) => {
    return {
        user:state.user,
        subUser:state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddMySurveyTemplates);