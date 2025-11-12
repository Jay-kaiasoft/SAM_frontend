import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {connect} from "react-redux";
import {siteURL} from "../../../config/api";
import AddScript from "../../shared/commonControlls/addScript";
import InputField from "../../shared/commonControlls/inputField";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import {Col, FormGroup, Row} from "reactstrap";
import {Button, FormControl, FormControlLabel, InputLabel, Link, MenuItem, Radio, RadioGroup, Select, Step, StepLabel, Stepper} from "@mui/material";
import PreviewAssessment from '../previewAssessment';
import AssessmentEditor from "../../shared/editor/assessmentEditor";
import {savefullcontent, reloadfirst, blockedtblocan, formBlockSetting, loadeverytime, deletePage, addPage} from "../../shared/editor/js/eas_js_assessment";
import {hidedsm, removeActive} from "../../shared/editor/js/eas_js_common.js";
import DemographicQuestionModal from "../../shared/commonControlls/demographicQuestionModal";
import $ from "jquery";
import {generateJSON, objectEquals, removePropertiesFromJson, isPageHasContent, extractQuestionsFromJson, setOldNextPrev} from "../utility";
import history from "../../../history";
import html2canvas from "html2canvas";
import {getAssessmentTemplateById, saveAssessmentTemplate} from "../../../services/assessmentService";
import AssessmentAnalysis from '../assessmentAnalysis';
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

const AddMyAssessmentTemplates = ({location,globalAlert,confirmDialog,subUser}) => {
    AddScript(siteURL+'/externaljs/ckeditor_4_15/ckeditor.js');
    AddScript(siteURL+'/externaljs/jquery.leanModal.min.js');
    AddScript(siteURL+'/externaljs/bootstrap-treeview.js');
    AddScript(siteURL+'/externaljs/dropzone.js');
    AddScript(siteURL+'/externaljs/jquery-ui-timepicker-addon.js');
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const steps = ["1", "2", "3", "4", "5"];
    const [questionModal, setQuestionModal] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [showPreviewForm, setShowPreviewForm] = useState(false);
    const [data, setData] = useState({"selectedFont": "Arial, Helvetica Neue, Helvetica, sans-serif", "selectedFontSize": "14px", "lineHeight": "14", "textColor": "#000000", "brandBgColor": "#ffffff"});
    const [dataListJson, setDataListJson] = useState({});
    const [isQuestionModalOpenedOnce, setIsQuestionModalOpenedOnce] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [analysisJson, setAnalysisJson] = useState({}); 
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
    const thumbData = useRef("");
    const clickSaveFirst = useRef("");
    const handleEditorPreview = ()=>{
        if(!isPageHasContent("preview")){
            return;
        }
        removeActive("assessment");
        togglePreviewForm();
    };
    const handleClearQuestionLogicFlow = ()=>{
        setNodes([]);
        setEdges([]);
        setData((prev)=>{
            let tempAtData = {};
            if(typeof prev.atData !== "undefined" && JSON.stringify(prev.atData) !== "{}"){
                let tempAssessmentsPages = prev.atData.assessmentsPages.map((val1)=>{
                    if(val1.apgType === "Question Page") {
                        val1.assessmentsQuestions = val1.assessmentsQuestions.map((val2) => {
                            if (val2.hasOwnProperty("assessmentsOptions")) {
                                val2.assessmentsOptions = val2.assessmentsOptions.map((val3) => {
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
                let temp2 = JSON.parse(JSON.stringify(prev.atData));
                tempAtData = {...temp2, "assessmentsPages":tempAssessmentsPages};
            } else {
                tempAtData = generateJSON();
            }
            return {...prev, atData: tempAtData, atLogicFlow:{nodes:[], edges: []}};
        });
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
            setDataListJson(JSON.parse(JSON.stringify(data.atData)));
        }
        setShowPreviewForm(!showPreviewForm);
    };
    const toggleQuestionModal = useCallback(()=>{
        setQuestionModal(prev=>!prev);
    }, [setQuestionModal]);
    const handleClickNextFirst = () => {
        if(typeof data?.atName === "undefined" || data?.atName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter assessment name.",
                open: true
            });
            return false;
        }
        if(id === 0 && !isQuestionModalOpenedOnce){
            toggleQuestionModal();
        }else{
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
    const handleClickBackSecond = () => {
        removeActive("assessment");
        savefullcontent();
        setData((prev)=>({...prev, atData: generateJSON(), atHtml: $("#all_temp_data").val()}));
        handleBack();
    }
    const handleClickNextSecond = () => {
        if(!isPageHasContent("next")){
            return;
        }
        if(data.hasOwnProperty("atData")){
            removeActive("assessment");
            savefullcontent();
            let tempJson = removePropertiesFromJson(generateJSON().assessmentsPages);
            let currentJson = removePropertiesFromJson(JSON.parse(JSON.stringify(data.atData.assessmentsPages)));
            if(!objectEquals(tempJson, currentJson)){
                confirmDialog({
                    open: true,
                    title: 'The order of your questions is now set.\nIf you modify your questions, you will need to set the answer logic flow again.\nAre you sure you want to continue?',
                    onConfirm: () => {
                        $("#cntr").css("box-shadow","");
                        removeActive("assessment");
                        savefullcontent();
                        handleClearQuestionLogicFlow();
                        let tempATData = generateJSON();
                        setData((prev)=>({...prev, atData: tempATData, atHtml: $("#all_temp_data").val(), atLogicFlow:{nodes:[], edges: []}}));
                        tempJson = tempATData.assessmentsPages.filter((val)=>{
                            return val.apgType === "Question Page";
                        });
                        tempJson = tempJson.map((val)=>{
                            return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                        });
                        let sum = 0;
                        let tempAnalysisJson = {};
                        tempJson.forEach((val, i) => {
                            sum += val.maxPoints;
                            if(tempAnalysisJson.hasOwnProperty("categoryWise")){
                                tempAnalysisJson.categoryWise.push(
                                    {
                                        catName: val.catName,
                                        index: i,
                                        totalPoints: val.maxPoints,
                                        catColor: val.color,
                                        uniqueId: val.uniqueId,
                                        ranges: []
                                    }
                                );
                            } else {
                                tempAnalysisJson.categoryWise = [
                                    {
                                        catName: val.catName,
                                        index: i,
                                        totalPoints: val.maxPoints,
                                        catColor: val.color,
                                        uniqueId: val.uniqueId,
                                        ranges: []
                                    }
                                ]
                            }
                        });
                        setAnalysisJson((_)=>{
                            return {...tempAnalysisJson, overall: {totalPoints: sum, ranges: []}}
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
                removeActive("assessment");
                savefullcontent();
                let temp = generateJSON();
                let tempJson = temp.assessmentsPages.filter((val)=>{
                    return val.apgType === "Question Page";
                });
                let tempCurrentJson = currentJson;

                tempJson = tempJson.map((val)=>{
                    return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                });
                tempCurrentJson = tempCurrentJson.map((val)=>{
                    return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                });
                let pointDiff = tempCurrentJson.filter((val, i) => {
                    return val.maxPoints !== tempJson[i].maxPoints;
                })
                if(pointDiff.length > 0) {
                let sum = 0;
                let tempAnalysisJson = {};
                tempJson.forEach((val, i) => {
                    sum += val.maxPoints;
                    if(tempAnalysisJson.hasOwnProperty("categoryWise")){
                        tempAnalysisJson.categoryWise.push(
                            {
                                catName: val.catName,
                                index: i,
                                totalPoints: val.maxPoints,
                                catColor: val.color,
                                    uniqueId: val.uniqueId,
                                ranges: []
                            }
                        );
                    } else {
                        tempAnalysisJson.categoryWise = [
                            {
                                catName: val.catName,
                                index: i,
                                totalPoints: val.maxPoints,
                                catColor: val.color,
                                    uniqueId: val.uniqueId,
                                ranges: []
                            }
                        ]
                    }
                });
                setAnalysisJson((_)=>{
                    return {...tempAnalysisJson, overall: {totalPoints: sum, ranges: []}}
                });
                } else {
                    let tempAnalysisJson = analysisJson;
                    
                    if(tempAnalysisJson.hasOwnProperty("categoryWise")) {
                        tempAnalysisJson.categoryWise = tempAnalysisJson.categoryWise.map((val=>{
                            tempJson.forEach((val2)=> {
                                if(val2.uniqueId === val.uniqueId) {
                                    val.catName = val2.catName;
                                    val.catColor = val2.color;
                                }
                            })
                            return val;
                        }))
                    }
                    setAnalysisJson((_)=>{
                        return {...tempAnalysisJson}
                    });
                }
                setCategoryPageList(tempJson); 
                let tempAssessmentsPages = temp.assessmentsPages;
                tempAssessmentsPages = setOldNextPrev(data.atData.assessmentsPages,tempAssessmentsPages);
                delete temp.assessmentsPages;
                setData((prev)=>{
                    return {...prev, atData: {...temp, "assessmentsPages":tempAssessmentsPages}, atHtml: $("#all_temp_data").val()};
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
                    removeActive("assessment");
                    savefullcontent();
                    handleClearQuestionLogicFlow();
                    let tempATData = generateJSON();
                    setData((prev)=>({...prev, atData: tempATData, atHtml: $("#all_temp_data").val()}));
                    let temp = tempATData.assessmentsPages;
                    temp = temp.filter((val)=>{
                        return val.apgType === "Question Page";
                    });
                    temp = temp.map((val)=>{
                        return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                    });
                    let sum = 0;
                    let tempAnalysisJson = {};
                    temp.forEach((val, i) => {
                        sum += val.maxPoints;
                        if(tempAnalysisJson.hasOwnProperty("categoryWise")){
                            tempAnalysisJson.categoryWise.push(
                                {
                                    catName: val.catName,
                                    index: i,
                                    totalPoints: val.maxPoints,
                                    catColor: val.color,
                                    uniqueId: val.uniqueId,
                                    ranges: []
                                }
                            );
                        } else {
                            tempAnalysisJson.categoryWise = [
                                {
                                    catName: val.catName,
                                    index: i,
                                    totalPoints: val.maxPoints,
                                    catColor: val.color,
                                    uniqueId: val.uniqueId,
                                    ranges: []
                                }
                            ]
                        }
                    });
                    setAnalysisJson((_)=>{
                        return {...tempAnalysisJson, overall: {totalPoints: sum, ranges: []}}
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
        let atTotalQuestions = 0;
        data.atData.assessmentsPages.map((v)=>(
            v.apgType === "Question Page" ?
                atTotalQuestions+=v.assessmentsQuestions.length
            : null
        ));
        let questions = extractQuestionsFromJson(data.atData);
        let tempFlow = nodes.map((e1)=>{
            if(e1.hasOwnProperty("data")) {
                questions.forEach((e2)=>{
                    if((e1.data.pageIndex === (e2.apgNumber-1)) && (e1.data.questionIndex === e2.aqueDisplayOrder) && e1.data.hasOwnProperty("formLinks")) {
                        if(e1.type !== "Rating") {
                            e1.data.formLinks = e2.assessmentsOptions.map((val)=>{
                                if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                                    return val?.formLink;
                                } else {
                                    return "";
                                }
                            });
                            e1.data.formNames = e2.assessmentsOptions.map((val)=>{
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
            "atId": id,
            "subMemberId": subUser.memberId,
            "atData": JSON.stringify(data.atData),
            "atStatus": status,
            "thumbData": thumbData.current,
            "atLogicFlow": JSON.stringify({nodes:tempFlow, edges: edges}),
            "atCategoryPageList": JSON.stringify(categoryPageList),
            "atAnalysis": JSON.stringify(analysisJson),
            "atTotalQuestions": atTotalQuestions
        }
        saveAssessmentTemplate(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/myassessmenttemplates");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                history.push("/myassessmenttemplates");
            }
        });
    }
    const handleClickSaveFirst = (status) => {
        if(data.hasOwnProperty("atData")){
            removeActive("assessment");
            savefullcontent();
            let tempJson = removePropertiesFromJson(generateJSON().assessmentsPages);
            let currentJson = removePropertiesFromJson(JSON.parse(JSON.stringify(data.atData.assessmentsPages)));
            if(!objectEquals(tempJson, currentJson)){
                confirmDialog({
                    open: true,
                    title: 'The order of your questions is now set.\nIf you modify your questions, you will need to set the answer logic flow again.\nAre you sure you want to continue?',
                    onConfirm: () => {
                        clickSaveFirst.current="no";
                        $("#cntr").css("box-shadow","");
                        removeActive("assessment");
                        savefullcontent();
                        handleClearQuestionLogicFlow();
                        let tempATData = generateJSON();
                        let temp = tempATData.assessmentsPages;
                        temp = temp.filter((val)=>{
                            return val.apgType === "Question Page";
                        });
                        temp = temp.map((val)=>{
                            return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                        });
                        let sum = 0;
                        let tempAnalysisJson = {};
                        tempJson.forEach((val, i) => {
                            sum += val.maxPoints;
                            if(tempAnalysisJson.hasOwnProperty("categoryWise")){
                                tempAnalysisJson.categoryWise.push(
                                    {
                                        catName: val.catName,
                                        index: i,
                                        totalPoints: val.maxPoints,
                                        catColor: val.color,
                                        uniqueId: val.uniqueId,
                                        ranges: []
                                    }
                                );
                            } else {
                                tempAnalysisJson.categoryWise = [
                                    {
                                        catName: val.catName,
                                        index: i,
                                        totalPoints: val.maxPoints,
                                        catColor: val.color,
                                        uniqueId: val.uniqueId,
                                        ranges: []
                                    }
                                ]
                            }
                        });
                        for(let name in window.CKEDITOR.instances)
                        {
                            window.CKEDITOR.instances[name].destroy(true);
                        }
                        $("button.save").remove();
                        $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.cancel");
						let atTotalQuestions = 0;
				        tempATData.assessmentsPages.map((v)=>(
				            v.apgType === "Question Page" ?
				                atTotalQuestions+=v.assessmentsQuestions.length
				            : null
				        ));
                        html2canvas(document.querySelector("#cntr"), {
                            scrollX: 0,
                            scrollY: -window.scrollY
                        }).then(async (canvas) => {
                            let compressThumbURL = await createSmallThumb(canvas);
                            let requestData = {
				                ...data,
				                "atHtml": $("#all_temp_data").val(),
				                "atId": id,
				                "subMemberId": subUser.memberId,
				                "atData": JSON.stringify(tempATData),
				                "atStatus": status,
				                "thumbData": compressThumbURL,
				                "atLogicFlow": JSON.stringify({nodes:[], edges: []}),
				                "atCategoryPageList": JSON.stringify(temp),
				                "atAnalysis": JSON.stringify({...tempAnalysisJson, overall: {totalPoints: sum, ranges: []}}),
				                "atTotalQuestions": atTotalQuestions
				            }
				            saveAssessmentTemplate(requestData).then(res => {
				                if (res.status === 200) {
				                    globalAlert({
				                        type: "Success",
				                        text: res.message,
				                        open: true
				                    });
				                    history.push("/myassessmenttemplates");
				                } else {
				                    globalAlert({
				                        type: "Error",
				                        text: res.message,
				                        open: true
				                    });
				                    history.push("/myassessmenttemplates");
				                }
				            });
                        })
                    }
                });
            } else {
                clickSaveFirst.current="no";
                $("#cntr").css("box-shadow","");
                removeActive("assessment");
                savefullcontent();
                let tempATData = generateJSON();
                let temp = tempATData.assessmentsPages;
                let tempCurrentJson = currentJson;
                let tempAnalysisJson = {}
                temp = temp.filter((val)=>{
                    return val.apgType === "Question Page";
                });
                temp = temp.map((val)=>{
                    return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                });
                tempCurrentJson = tempCurrentJson.map((val)=>{
                    return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
                });
                let pointDiff = tempCurrentJson.filter((val, i) => {
                    return val.maxPoints !== temp[i].maxPoints;
                })
                if(pointDiff.length > 0) {
                let sum = 0;
                    temp.forEach((val, i) => {
                    sum += val.maxPoints;
                    if(tempAnalysisJson.hasOwnProperty("categoryWise")){
                        tempAnalysisJson.categoryWise.push(
                            {
                                catName: val.catName,
                                index: i,
                                totalPoints: val.maxPoints,
                                catColor: val.color,
                                    uniqueId: val.uniqueId,
                                ranges: []
                            }
                        );
                    } else {
                        tempAnalysisJson.categoryWise = [
                            {
                                catName: val.catName,
                                index: i,
                                totalPoints: val.maxPoints,
                                catColor: val.color,
                                    uniqueId: val.uniqueId,
                                ranges: []
                            }
                        ]
                    }
                        tempAnalysisJson.overall = {totalPoints: sum, ranges: []}
                });
                    setAnalysisJson((_)=>{return {...tempAnalysisJson}})
                } else {
                    tempAnalysisJson = analysisJson;
                    if(tempAnalysisJson.hasOwnProperty("categoryWise")) {
                        tempAnalysisJson.categoryWise = tempAnalysisJson.categoryWise.map((val=>{
                            temp.forEach((val2)=> {
                                if(val2.uniqueId === val.uniqueId) {
                                    val.catName = val2.catName;
                                    val.catColor = val2.color;
                                }
                            })
                            return val;
                        }))
                    }
                    setAnalysisJson((_)=>{
                        return {...tempAnalysisJson}
                    });
                }
				for(let name in window.CKEDITOR.instances)
                {
                    window.CKEDITOR.instances[name].destroy(true);
                }
                $("button.save").remove();
                $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.cancel");
				let atTotalQuestions = 0;
		        tempATData.assessmentsPages.map((v)=>(
		            v.apgType === "Question Page" ?
		                atTotalQuestions+=v.assessmentsQuestions.length
		            : null
		        ));
                html2canvas(document.querySelector("#cntr"), {
                    scrollX: 0,
                    scrollY: -window.scrollY
                }).then(async (canvas) => {
                    let compressThumbURL = await createSmallThumb(canvas);
                    let requestData = {
		                ...data,
		                "atHtml": $("#all_temp_data").val(),
		                "atId": id,
		                "subMemberId": subUser.memberId,
		                "atData": JSON.stringify(tempATData),
		                "atStatus": status,
		                "thumbData": compressThumbURL,
		                "atLogicFlow": JSON.stringify({nodes:nodes, edges: edges}),
		                "atCategoryPageList": JSON.stringify(temp),
		                "atAnalysis": JSON.stringify({...tempAnalysisJson}),
		                "atTotalQuestions": atTotalQuestions
		            }
		            saveAssessmentTemplate(requestData).then(res => {
		                if (res.status === 200) {
		                    globalAlert({
		                        type: "Success",
		                        text: res.message,
		                        open: true
		                    });
		                    history.push("/myassessmenttemplates");
		                } else {
		                    globalAlert({
		                        type: "Error",
		                        text: res.message,
		                        open: true
		                    });
		                    history.push("/myassessmenttemplates");
		                }
		            });
                })
            }
        } else {
        	clickSaveFirst.current="no";
	        $("#cntr").css("box-shadow","");
	        removeActive("assessment");
	        savefullcontent();
	        handleClearQuestionLogicFlow();
            let tempATData = generateJSON();
            let temp = tempATData.assessmentsPages;
            temp = temp.filter((val)=>{
                return val.apgType === "Question Page";
            });
            temp = temp.map((val)=>{
                return {id: parseInt(val.aqueCatId), catName: val.aqueCatName, maxPoints: val.catMaxPoints, color: val.aqueCatColor, uniqueId: val.uniqueId}
            });
            let sum = 0;
            let tempAnalysisJson = {};
            temp.forEach((val, i) => {
                sum += val.maxPoints;
                if(tempAnalysisJson.hasOwnProperty("categoryWise")){
                    tempAnalysisJson.categoryWise.push(
                        {
                            catName: val.catName,
                            index: i,
                            totalPoints: val.maxPoints,
                            catColor: val.color,
                            uniqueId: val.uniqueId,
                            ranges: []
                        }
                    );
                } else {
                    tempAnalysisJson.categoryWise = [
                        {
                            catName: val.catName,
                            index: i,
                            totalPoints: val.maxPoints,
                            catColor: val.color,
                            uniqueId: val.uniqueId,
                            ranges: []
                        }
                    ]
                }
            });
            for(let name in window.CKEDITOR.instances)
	        {
	            window.CKEDITOR.instances[name].destroy(true);
	        }
	        $("button.save").remove();
	        $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.cancel");
	        let atTotalQuestions = 0;
	        tempATData.assessmentsPages.map((v)=>(
	            v.apgType === "Question Page" ?
	                atTotalQuestions+=v.assessmentsQuestions.length
	            : null
	        ));
            html2canvas(document.querySelector("#cntr"), {
                scrollX: 0,
                scrollY: -window.scrollY
            }).then(async (canvas) => {
                let compressThumbURL = await createSmallThumb(canvas);
                let requestData = {
	                ...data,
	                "atHtml": $("#all_temp_data").val(),
	                "atId": id,
	                "subMemberId": subUser.memberId,
	                "atData": JSON.stringify(tempATData),
	                "atStatus": status,
	                "thumbData": compressThumbURL,
	                "atLogicFlow": JSON.stringify({nodes:[], edges: []}),
	                "atCategoryPageList": JSON.stringify(temp),
	                "atAnalysis": JSON.stringify({...tempAnalysisJson, overall: {totalPoints: sum, ranges: []}}),
	                "atTotalQuestions": atTotalQuestions
	            }
	            saveAssessmentTemplate(requestData).then(res => {
	                if (res.status === 200) {
	                    globalAlert({
	                        type: "Success",
	                        text: res.message,
	                        open: true
	                    });
	                    history.push("/myassessmenttemplates");
	                } else {
	                    globalAlert({
	                        type: "Error",
	                        text: res.message,
	                        open: true
	                    });
	                    history.push("/myassessmenttemplates");
	                }
	            });
             });
        }
    }
    const handleClickNextThird = () =>{
        let questions = extractQuestionsFromJson(data.atData);
        let tempNodes = nodes.map((e1)=>{
            if(e1.hasOwnProperty("data")) {
                questions.forEach((e2)=>{
                    if((e1.data.pageIndex === (e2.apgNumber-1)) && (e1.data.questionIndex === e2.aqueDisplayOrder) && e1.data.hasOwnProperty("formLinks")) {
                        if(e1.type !== "Rating") {
                            e1.data.formLinks =  e2.assessmentsOptions.map((val)=>{
                                if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                                    return val?.formLink;
                                } else {
                                    return "";
                                }
                            })
                            e1.data.formNames =  e2.assessmentsOptions.map((val)=>{ 
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
        setNodes([...tempNodes]);
        setData((prev)=>({...prev, atLogicFlow: {nodes: tempNodes, edges: edges}}));
        handleNext();
    }
    const handleClickBackThird = () => {
        let questions = extractQuestionsFromJson(data.atData);
        setNodes((prev)=>{
            prev = prev.map((e1)=>{
                if(e1.hasOwnProperty("data")) {
                    questions.forEach((e2)=>{
                        if((e1.data.pageIndex === (e2.apgNumber-1)) && (e1.data.questionIndex === e2.aqueDisplayOrder) && e1.data.hasOwnProperty("formLinks")) {
                            if(e1.type !== "Rating") {
                                e1.data.formLinks =  e2.assessmentsOptions.map((val)=>{
                                    if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                                        return val?.formLink;
                                    } else {
                                        return "";
                                    }
                                })
                            } else {
                                e1.data.formLinks = e2.formLinks.map((val)=>{
                                    return val.formLink;
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
        setIsQuestionModalOpenedOnce((prev)=>!prev);
        handleNext();
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <DemographicQuestionModal questionModal={questionModal} toggleQuestionModal={toggleQuestionModal} handleNext={handleNext} setData={setData} type="assessment" setIsQuestionModalOpenedOnce={setIsQuestionModalOpenedOnce} setCategoryPageList={setCategoryPageList}/>
                        <Col xs={4} className="mx-auto">
                            <FormGroup >
                                <InputField type="text" id="atName" name="atName" value={data?.atName || ""} onChange={handleChange} label="Assessment Name"/>
                            </FormGroup>
                            <FormGroup className="text-center mb-5">
                                <Button variant="contained" color="primary" onClick={()=>{history.push("/myassessmenttemplates")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                                <Button variant="contained" color="primary" onClick={handleClickNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                            </FormGroup>
                        </Col>
                    </>
                );
            case 1:
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
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/myassessmenttemplates")}} className="mr-3 cancel"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            <Button variant="contained" color="primary" onClick={handleNext}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="addpagemain d-flex align-items-center">
                            <div className="p-3 pageTypeMain">
                                <div><Link component="a" id="addpage" underline="none" color="inherit" className="pageType">New Assessment Page</Link></div>
                                <div><Link component="a" id="addlandingpage" underline="none" color="inherit" className="pageType">Content Page</Link></div>
                            </div>
                            <span className="mb-2" style={{width:"min-content"}}>
                                <i className="far fa-plus-square addpage pb-2" title="Add" data-toggle="tooltip"></i>
                                <i className="far fa-list showhidelist" title="Show/Hide Categories" data-toggle="tooltip"></i>
                            </span>
                            {
                                typeof data?.atData?.pageCounter === "undefined" || data?.atData?.pageCounter === "" ?
                                    <span id="addpagethumb">
                                        <div className="pagethumb active" title={categoryPageList[0].catName} data-toggle="tooltip"><div className="fold" style={{backgroundColor:categoryPageList[0].color}}></div><span>1</span></div>
                                        <div id="thankYouPage" title="Thank You Page" data-toggle="tooltip"><div className="fold"></div><span>END</span></div>
                                    </span>
                                :
                                    <span id="addpagethumb" dangerouslySetInnerHTML={{ __html:data.atData.pageCounter}}></span>
                            }
                            <i className="far fa-trash-alt deletepage" title="Delete" data-toggle="tooltip" onClick={(e)=>{handleDeletePageClick(e)}}></i>
                        </div>
                        <AssessmentEditor data={data} categoryPageList={categoryPageList}/>
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleClickBackSecond} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handleEditorPreview} className="mr-3"><i className="far fa-eye mr-2"></i>PREVIEW</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSaveFirst(0);}} className="mr-3 save"><i className="far fa-save mr-2"></i>SAVE FOR LATER</Button>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/myassessmenttemplates")}} className="mr-3 cancel"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            <Button variant="contained" color="primary" onClick={handleClickNextSecond}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </>
                );
            case 3:
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
                            <Button variant="contained" color="primary" onClick={handleClickBackThird} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handleClearQuestionLogicFlow} className="mr-3"><i className="far fa-broom mr-2"></i>CLEAR ANSWER LOGIC FLOW</Button>
                            <Button variant="contained" color="primary" onClick={()=>{togglePreviewForm("fromLogicFlow");}} className="mr-3"><i className="far fa-eye mr-2"></i>PREVIEW</Button>
                            <Button variant="contained" color="primary" onClick={handleClickNextThird} className="mr-3"><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </>
                );
            case 4:
                return (
                    <Col xs={8} className="mx-auto">
                        <AssessmentAnalysis analysisJson={analysisJson} setAnalysisJson={setAnalysisJson}/>
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(0);}} className="mr-3 save"><i className="far fa-save mr-2"></i>SAVE FOR LATER</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(1);}} className="mr-3 publish"><i className="far fa-envelope-open-text mr-2"></i>PUBLISH</Button>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/myassessmenttemplates")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                        </FormGroup>
                    </Col>
                );
            default:
                return 'Unknown step';
        }
    }
    useEffect(()=>{
        if(id){
            getAssessmentTemplateById(id).then(res => {
                if (res.result && res.result.assessmentTemplate) {
                    let tempAtData = JSON.parse(res.result.assessmentTemplate.atData);
                    let t={
                        ...res.result.assessmentTemplate,
                        atData:JSON.parse(res.result.assessmentTemplate.atData),
                        atLogicFlow:JSON.parse(res.result.assessmentTemplate.atLogicFlow),
                        atAnalysis: JSON.parse(res.result.assessmentTemplate.atAnalysis),
                        atCategoryPageList: JSON.parse(res.result.assessmentTemplate.atCategoryPageList),
                        textColor: tempAtData?.settings?.pageSettings?.color,
                        selectedFont: tempAtData?.settings?.pageSettings?.fontFamily,
                        selectedFontSize: tempAtData?.settings?.pageSettings?.fontSize,
                        lineHeight: tempAtData?.settings?.pageSettings?.lineHeight?.replaceAll("px",""),
                        styleBold: (tempAtData?.settings?.pageSettings?.fontWeight === "bold" || tempAtData?.settings?.pageSettings?.fontWeight >= 700) ? true : false,
                        styleItalic: tempAtData?.settings?.pageSettings?.fontStyle === "italic" ? true : false,
                        styleUnderline: tempAtData?.settings?.pageSettings?.textDecoration === "underline" ? true : false,
                        brandBgColor: tempAtData?.settings?.pageSettings?.backgroundColor
                    };
                    setData(t);
                    setNodes(t.atLogicFlow.nodes);
                    setEdges(t.atLogicFlow.edges);
                    setAnalysisJson(JSON.parse(res.result.assessmentTemplate.atAnalysis));
                    setCategoryPageList(JSON.parse(res.result.assessmentTemplate.atCategoryPageList));
                }
            });
        }
        return ()=>{
            setData({});
            setNodes([]);
            setEdges([]);
            setAnalysisJson({});
            setCategoryPageList([]);
        }
    },[id, setEdges, setNodes]);
    useEffect(()=>{
        if(activeStep === 2){
            setTimeout(()=>{
                if(clickSaveFirst.current === ""){
                    let brandData = {
                        brandBgColor: data?.brandBgColor, 
                        brandTextColor: data?.textColor,
                        selectFont: data?.selectedFont,
                        selectedFontSize: data?.selectedFontSize,
                        lineHeight: data?.lineHeight,
                        styleBold: data?.styleBold,
                        styleItalic: data?.styleItalic,
                        styleUnderline: data?.styleUnderline
                    }
                    reloadfirst(data?.demographicQuestions, brandData);
                    removeDemographicQuestions();
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
    },[activeStep,data?.demographicQuestions,removeDemographicQuestions]);
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
        if(activeStep === 1){
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
    }, [activeStep]);
    return (
        <>
            <Row className="midleMain2">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={4}><h3>Assessment Design</h3></Col>
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
                    {activeStep > 2 && <p><strong>Assessment Name : </strong>{data.atName}</p>}
                    {getStepContent(activeStep)}
                    <input type="hidden" name="all_temp_data" id="all_temp_data" />
                </Col>
            </Row>
            {
                showPreviewForm && <PreviewAssessment dataListJson={dataListJson} setDataListJson={setDataListJson} togglePreviewForm={togglePreviewForm} saveMode={false} setFormData={(obj)=>{}}/>
            }
            <ModalAssessment modalAssessmentsTags={modalAssessmentsTags} toggleAssessmentsTags={toggleAssessmentsTags} />
            <ModalSurvey modalSurveysTags={modalSurveysTags} toggleSurveysTags={toggleSurveysTags} />
            <ModalCustomForm modalCustomFormsTags={modalCustomFormsTags} toggleCustomFormsTags={toggleCustomFormsTags} />
            <ModalButton modalButton={modalButton} toggleButton={toggleButton} />
            <CategoryModal globalAlert={globalAlert} setCategoryPageList={setCategoryPageList} subUser={subUser} addPage={addPage} editorType={"assessment"} callFromFirstPage={activeStep === 0 ? "yes" : ""} handleNextFromCategory={handleNextFromCategory}/>
            <ModalOpenAi modalOpenAi={modalOpenAi} toggleOpenAi={toggleOpenAi} />
            <ModalImageAi modalImageAi={modalImageAi} toggleImageAi={toggleImageAi} />
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
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
export default connect(mapStateToProps, mapDispatchToProps)(AddMyAssessmentTemplates);