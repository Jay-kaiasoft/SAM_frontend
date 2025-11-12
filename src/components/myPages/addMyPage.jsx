import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import { Link } from "react-router-dom";
import {Stepper, Step, StepLabel, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Checkbox, styled, MenuItem, Paper, Stack, Menu, alpha, Autocomplete, TextField, Chip} from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import Editor from "../shared/editor/editor";
import $ from 'jquery';
import AddScript from "../shared/commonControlls/addScript";
import {connect} from "react-redux";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
// import {getGroupListCombo} from "../../services/clientContactService";
import history from "../../history";
import {autoSave, getGroupLanguageList, getMyPageById, getMyPagesTags, getPreviewFreeTemplate, publish, saveForLater, sendMyPageEmailPreview} from "../../services/myDesktopService";
import titleize from "titleize";
import html2canvas from "html2canvas";
import {savefullcontent,reloadfirst,loadeverytime,blockedtblocan} from "../shared/editor/js/eas_js";
import {siteURL, staticUrl} from "../../config/api";
import ModalUdf from "../shared/editor/commonComponents/modalUdf";
import ModalButton from "../shared/editor/commonComponents/modalButton";
import ModalCustomForm from "../shared/editor/commonComponents/modalCustomForm";
import ModalSurvey from "../shared/editor/commonComponents/modalSurvey";
import ModalAssessment from "../shared/editor/commonComponents/modalAssessment";
import {QontoStepIcon, QontoConnector, easUrlEncoder, createSmallThumb, validateEmail} from "../../assets/commonFunctions";
import {setLoader} from "../../actions/loaderActions";
import html2pdf from "html-to-pdf-js";
import { KeyboardArrowDown } from '@mui/icons-material';
import ModalOpenAi from '../shared/editor/commonComponents/modalOpenAi';
import ModalImageAi from '../shared/editor/commonComponents/modalImageAi';

function getSteps() {
    return ['1', '2', '3', '4'];
    // return ['1', '2', '3', '4', '5'];
}
const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const AddMyPage = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    let id = queryString.get("v") ? queryString.get("v") : "";
    id = (typeof id !== "undefined" && id !== "") ? id : 0;
    let ftFolderName = queryString.get("ftFolderName") ? queryString.get("ftFolderName") : "";
    AddScript(siteURL+'/externaljs/ckeditor_4_15/ckeditor.js');
    AddScript(siteURL+'/externaljs/jquery.leanModal.min.js');
    AddScript(siteURL+'/externaljs/bootstrap-treeview.js');
    AddScript(siteURL+'/externaljs/dropzone.js');

    function select_template(a, tid, tname) {
        if(tid !== data.tid){
            setData((prev)=>({...prev, allTempData: ""}));
        }
        if(tid === "1" && tname === "demo13"){
            setData((prev) => {
                return {
                    ...prev,
                    tid: tid,
                    tname: "demo14"
                };
            });
        } else {
            setData((prev) => {
                return {
                    ...prev,
                    tid: tid,
                    tname: tname
                };
            });
        }
        $(".emptylayouta").removeClass("active-tmpt");
        $(a?.currentTarget).addClass("active-tmpt");
    }
    const [activeStep, setActiveStep] = useState(0);
    // const [groups, setGroups] = useState([]);
    const steps = getSteps();
    const [data, setData] = useState({
        mpType: 0,
        groupId: 0,
        mpName: "",
        mpTags: "",
        tid: "",
        tname: "",
        mpPublicUrl: "Y"
    });
    const [filterValues, setFilterValues] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState("");
    const [languageList, setLanguageList] = useState([]);
    const [selectedLanguageList, setSelectedLanguageList] = useState([]);
    const [googleTranslationServices, setGoogleTranslationServices] = useState(false);
    const [modalMyPageSetting, setModalMyPageSetting] = useState(false);
    const toggleMyPageSetting = () => setModalMyPageSetting(!modalMyPageSetting);
    const [modalGT, setModalGT] = useState(false);
    const toggleGT = () => setModalGT(!modalGT);
    const [modalAssessmentsTags, setModalAssessmentsTags] = useState(false);
    const toggleAssessmentsTags = useCallback(() => setModalAssessmentsTags(!modalAssessmentsTags),[modalAssessmentsTags]);
    const [modalSurveysTags, setModalSurveysTags] = useState(false);
    const toggleSurveysTags = useCallback(() => setModalSurveysTags(!modalSurveysTags),[modalSurveysTags]);
    const [modalCustomFormsTags, setModalCustomFormsTags] = useState(false);
    const toggleCustomFormsTags = useCallback(() => setModalCustomFormsTags(!modalCustomFormsTags),[modalCustomFormsTags]);
    const [modalButton, setModalButton] = useState(false);
    const toggleButton = useCallback(() => setModalButton(!modalButton),[modalButton]);
    const [modalUDF, setModalUDF] = useState(false);
    const toggleUDF = useCallback(() => setModalUDF(!modalUDF),[modalUDF]);
    const [modalOpenAi, setModalOpenAi] = useState(false);
    const toggleOpenAi = useCallback(() => setModalOpenAi(!modalOpenAi),[modalOpenAi]);
    const [modalImageAi, setModalImageAi] = useState(false);
    const toggleImageAi = useCallback(() => setModalImageAi(!modalImageAi),[modalImageAi]);
    const [modalSendPreviewEmail, setModalSendPreviewEmail] = useState(false);
    const toggleSendPreviewEmail = useCallback(() => {
        if(modalSendPreviewEmail){
            setContactSelected([props.user.email]);
        }
        setModalSendPreviewEmail(!modalSendPreviewEmail)
    },[modalSendPreviewEmail]);
    const [contactSelected, setContactSelected] = useState([props.user.email]);
    const [prevKeyStroke, setPrevKeyStroke] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const radioHandleChange = (event) => {
        const { name, value } = event.target;
        if(name === "mpType" && data.mpType !== value){
            if(typeof window.CKEDITOR !== "undefined") {
                for (let name1 in window.CKEDITOR.instances) {
                    window.CKEDITOR.instances[name1].destroy(true);
                }
            }
        }
        setData((prev) => {
            return { ...prev, [name]: Number(value) };
        });
    }
    const handleChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    }
    // const handleChangeGroup = (groupName) => {
    //     setData((prev) => {
    //         return { ...prev, groupName: groupName };
    //     });
    //     if(document.getElementById("editGroup") !== null) {
    //         document.getElementById("editGroup").setAttribute("data-original-title", groupName);
    //         setTimeout(function() {
    //             document.getElementById("editGroup").setAttribute("title", "");
    //         },500);
    //     }
    // }
    const handleNext = () => {
        if (activeStep === 0) {
            if (data.mpType === 0) {
                props.globalAlert({
                    type: "Error",
                    text: "Select My pages option.",
                    open: true
                });
                return false;
            }
            if(data?.mpType === 3 && id === 0){
                handleChange("mpTags", "Simple Text Email");
            } else if(id === 0){
                handleChange("mpTags", "");
            }
            // if (data.mpType === 1) {
            //     setActiveStep((prevActiveStep) => prevActiveStep + 2);
            //     return false;
            // }
        }
        // else if (activeStep === 1) {
        //     if (data.mpType === 2) {
        //         if (data.groupId === 0) {
        //             props.globalAlert({
        //                 type: "Error",
        //                 text: "Select Group.",
        //                 open: true
        //             });
        //             return false;
        //         }
        //     }
        // }
        else if (activeStep === 1) {
            if (data.mpName === "") {
                props.globalAlert({
                    type: "Error",
                    text: "Page name can not be blank.",
                    open: true
                });
                return false;
            }
            if(data?.mpType === 3 && id === 0){
                select_template("", "15", "demo15");
            }
            if (id !== 0 || ftFolderName !== "" || data?.mpType === 3) {
                setActiveStep((prevActiveStep) => prevActiveStep + 2);
                return false;
            }
        }
        else if (activeStep === 2) {
            if (data.tid === "" && data.tname === "") {
                props.globalAlert({
                    type: "Error",
                    text: "Select empty page layout.",
                    open: true
                });
                return false;
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        // if (activeStep === 2) {
        //     if (data.mpType === 1) {
        //         setActiveStep((prevActiveStep) => prevActiveStep - 2);
        //         return false;
        //     }
        // }
        if (activeStep === 3) {
            if (id !== 0 || ftFolderName !== "" || data?.mpType === 3) {
                setActiveStep((prevActiveStep) => prevActiveStep - 2);
                return false;
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const templateImages = [
        { id: "1", folder_name: "demo13/", image_name: "demo13.jpg" },
        { id: "2", folder_name: "demo1/", image_name: "demo1.jpg" },
        { id: "3", folder_name: "demo2/", image_name: "demo2.jpg" },
        { id: "4", folder_name: "demo3/", image_name: "demo3.jpg" },
        { id: "5", folder_name: "demo4/", image_name: "demo4.jpg" },
        { id: "6", folder_name: "demo5/", image_name: "demo5.jpg" },
        { id: "7", folder_name: "demo6/", image_name: "demo6.jpg" },
        { id: "8", folder_name: "demo7/", image_name: "demo7.jpg" },
        { id: "9", folder_name: "demo8/", image_name: "demo8.jpg" },
        { id: "10", folder_name: "demo9/", image_name: "demo9.jpg" },
        { id: "11", folder_name: "demo10/", image_name: "demo10.jpg" },
        { id: "12", folder_name: "demo11/", image_name: "demo11.jpg" },
        { id: "13", folder_name: "demo12/", image_name: "demo12.jpg" },
    ];
    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin:"0 16px 16px 0 !important",
        cursor:"pointer"
    }));
    const addTag = (tag) => {
        if(data.mpTags === ""){
            setData((prev)=>{ return {...prev, mpTags: tag} })
        } else {
            setData((prev)=>{ return {...prev, mpTags: data.mpTags +", "+tag} })
        }
    }
    const handleClickSave = (isRedirect) => {
        savefullcontent("save");
        if(isRedirect === "yes"){
            $("button.save-for-later").remove();
            $('<div class="lds-ellipsis"><div></div><div></div><div></div>').insertBefore("button.publish");
            $("a.save-for-later").replaceWith('<a class="btn-circle active" data-toggle="tooltip" title="Save And Exit"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>');
        } else {
            $("button.save").hide();
            $('<div class="lds-ellipsis"><div></div><div></div><div></div>').insertBefore("button.save-for-later");
            $("a.save").hide();
            $('<a class="btn-circle active tempSave" data-toggle="tooltip" title="Save"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>').insertBefore("a.save");
        }
        html2canvas(document.querySelector("#mcd"), {
            scrollX: 0,
            scrollY: -window.scrollY
        }).then(async (canvas) => {
            let compressThumbURL = await createSmallThumb(canvas);
            let requestData = {
                "memberId": props.user.memberId,
                "subMemberId": props.subUser.memberId,
                "mpId": typeof data.mpId === "undefined" ? id : data.mpId,
                "mpTemplateLanguage": "",
                "mpTemplateConvertLangList": "",
                "mpAllowConvertLang": "N",
                "mpType": data.mpType,
                "groupId": data.groupId,
                "mpName": data.mpName,
                "mpTags": data.mpTags,
                "mpStage": 1,
                "mpPublicUrl": data.mpPublicUrl,
                "allTempData": $("#all_temp_data").val(),
                "thumbData": compressThumbURL
            }
            saveForLater(requestData).then(res => {
                if (res.status === 200) {
                    props.globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    setData((prev) => {
                        return { 
                            ...prev, 
                            "mpId": res.result.mpId 
                        };
                    });
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                if(isRedirect === "yes"){
                    history.push("/mypages");
                } else {
                    $('div.lds-ellipsis').remove();
                    $("button.save").show();
                    $('a.tempSave').remove();
                    $("a.save").show();
                }
            });
        });
    }
    const handleCallAutoSave = () => {
        savefullcontent();
        html2canvas(document.querySelector("#mcd"), {
            scrollX: 0,
            scrollY: -window.scrollY
        }).then(async (canvas) => {
            let compressThumbURL = await createSmallThumb(canvas);
            let requestData = {
                ...data,
                "memberId": props.user.memberId,
                "subMemberId": props.subUser.memberId,
                "mpId": typeof data.mpId === "undefined" ? id : data.mpId,
                "mpType": data.mpType,
                "groupId": data.groupId,
                "mpName": data.mpName,
                "mpTags": data.mpTags,
                "mpStage": 1,
                "mpPublicUrl": data.mpPublicUrl,
                "allTempData": $("#all_temp_data").val(),
                "thumbData": compressThumbURL
            }
            autoSave(requestData).then(res => {
                if (res.status === 200) {
                    setData((prev) => {
                        return { 
                            ...prev, 
                            "mpId": res.result.mpId 
                        };
                    });
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        });
    }
    function removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/(<([^>]+)>)/ig, '');
    }
    const handleClickSendPreviewEmail = () => {
        toggleSendPreviewEmail();
    }
    const handleCallSendPreviewEmail = () => {
        if(contactSelected.length > 0){
            savefullcontent("save");
            $("button.send-preview-email").hide();
            $("button.send-preview-email").after('<div class="lds-ellipsis send-preview-email-button-temp mr-3"><div></div><div></div><div></div>')
            $("a.send-preview-email").hide();
            $("a.send-preview-email").after('<a id="send-preview-email-temp" class="btn-circle active" data-toggle="tooltip" title="Send Preview Email"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>');
            let requestData = {
                allTempData: $("#all_temp_data").val(),
                selectedGid: data.groupId,
                contactSelected: contactSelected,
                mpType: data.mpType,
            }
            sendMyPageEmailPreview(requestData).then(res => {
                if (res.status === 200) {
                    toggleSendPreviewEmail();
                    props.globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    if(typeof window.CKEDITOR !== "undefined") {
                        for (let name1 in window.CKEDITOR.instances) {
                            window.CKEDITOR.instances[name1].destroy(true);
                        }
                    }
                    setData((prev) => {
                        return { 
                            ...prev
                        };
                    });
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                $("#send-preview-email-temp").remove();
                $("a.send-preview-email").show();
                $(".send-preview-email-button-temp").remove();
                $("button.send-preview-email").show();
            });
        } else {
            props.globalAlert({
                type: "Error",
                text: "Select at least one email.",
                open: true
            });
        }
    }
    const handleClickPublish = () => {
        let all_data = "";
        let strDetails = "";
        let ict = 0;
        $('#templateBody').find('.mojoMcBlock.tpl-block .textTdBlock').unbind("each").each(function() {
            strDetails = $(this).html();
            strDetails = removeTags(strDetails);
            if (strDetails !== "Input Your Content Here.") {
                if (ict === 0) {
                    all_data = strDetails;
                    ict++;
                }
            }
        });
        let requestData = {
            "groupId": (data.groupId === null || data.groupId === "") ? 0 : data.groupId,
            "allTempData": all_data
        }
        getGroupLanguageList(requestData).then(res => {
            if (res.status === 200) {
                if(res.result.msg === "notConvert"){
                    savefullcontent("save");
                    $("button.publish").remove();
                    $('<div class="lds-ellipsis"><div></div><div></div><div></div>').insertAfter("button.save-for-later");
                    $("a.publish").replaceWith('<a class="btn-circle active" data-toggle="tooltip" title="Publish"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>');
                    html2canvas(document.querySelector("#mcd"), {
                        scrollX: 0,
                        scrollY: -window.scrollY
                    }).then(async (canvas) => {
                        let compressThumbURL = await createSmallThumb(canvas);
                        let requestData = {
                            "memberId": props.user.memberId,
                            "subMemberId": props.subUser.memberId,
                            "mpId":id,
                            "mpTemplateLanguage": res?.result?.currentLanguage?.short || "",
                            "mpTemplateConvertLangList": "",
                            "mpAllowConvertLang": "N",
                            "mpType": data.mpType,
                            "groupId": data.groupId,
                            "mpName": data.mpName,
                            "mpTags": data.mpTags,
                            "mpStage": 2,
                            "mpPublicUrl": data.mpPublicUrl,
                            "allTempData": $("#all_temp_data").val(),
                            "thumbData": compressThumbURL
                        }
                        publish(requestData).then(res => {
                            if (res.status === 200) {
                                props.globalAlert({
                                    type: "Success",
                                    text: res.message,
                                    open: true
                                });
                                history.push("/mypages");
                            } else {
                                props.globalAlert({
                                    type: "Error",
                                    text: res.message,
                                    open: true
                                });
                                history.push("/mypages");
                            }
                        });
                    });
                } else {
                    setCurrentLanguage(res?.result?.currentLanguage || "");
                    setLanguageList(res?.result?.languageList || []);
                    toggleGT();
                }
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickPublishGT = () => {
        savefullcontent("save");
        $("button.publishGTSave").remove();
        $('<div class="lds-ellipsis"><div></div><div></div><div></div>').insertBefore("button.publishGTCancel");
        html2canvas(document.querySelector("#mcd"), {
            scrollX: 0,
            scrollY: -window.scrollY
        }).then(async (canvas) => {
            let compressThumbURL = await createSmallThumb(canvas);
            let requestData = {
                "memberId": props.user.memberId,
                "subMemberId": props.subUser.memberId,
                "mpId":id,
                "mpTemplateLanguage": currentLanguage?.short || "",
                "mpTemplateConvertLangList": selectedLanguageList.length > 0 ? selectedLanguageList.join(",") : "",
                "mpAllowConvertLang": googleTranslationServices ? "Y" : "N",
                "mpType": data.mpType,
                "groupId": data.groupId,
                "mpName": data.mpName,
                "mpTags": data.mpTags,
                "mpStage": 2,
                "mpPublicUrl": data.mpPublicUrl,
                "allTempData": $("#all_temp_data").val(),
                "thumbData": compressThumbURL
            }
            publish(requestData).then(res => {
                if (res.status === 200) {
                    props.globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    history.push("/mypages");
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                    history.push("/mypages");
                }
            });
        });
    }
    const handleChangeGoogleTranslationServices = () => {
        setGoogleTranslationServices(!googleTranslationServices);
        if(!googleTranslationServices === false){
            setSelectedLanguageList([]);
        }
    }
    const handleChangeLanguageList = (lan) => {
        selectedLanguageList.includes(lan) ?
            setSelectedLanguageList(selectedLanguageList.filter((v)=>v !== lan))
        :
            setSelectedLanguageList([...selectedLanguageList,lan])
    }
    const handleBackEditor = () => {
        savefullcontent();
        setData((prev)=>({...prev, allTempData: $("#all_temp_data").val()}));
        handleBack();
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                                <p><strong>For Email Marketing</strong></p>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="mpType" id="mpType" name="mpType" value={data.mpType} onChange={radioHandleChange} >
                                        <Row>
                                            {/*<Col md={11}>
                                                <FormControlLabel value={1} control={<Radio color="primary" />} label="Simple Web Page" />
                                            </Col>
                                            <Col md={1}>
                                                <i className="far fa-question-circle" data-toggle="tooltip" title="Does NOT have ability to personalize the message with names and other dynamic content for contact list."></i>
                                            </Col>*/}
                                            <Col md={11}>
                                                <FormControlLabel value={2} control={<Radio color="primary" />} label="Dynamic Personalized Content" />
                                            </Col>
                                            <Col md={1}>
                                                <i className="far fa-question-circle" data-toggle="tooltip" title="Has the ability to personalize the message with names and other dynamic content for contact list."></i>
                                            </Col>
                                            <Col md={11}>
                                                <FormControlLabel value={3} control={<Radio color="primary" />} label="Simple Text Email" />
                                            </Col>
                                            <Col md={1}>
                                                <i className="far fa-question-circle" data-toggle="tooltip" title="Allows personalization with dynamic contact fields, but the email will be rendered in plain text only—no HTML design or additional content blocks are supported."></i>
                                            </Col>
                                        </Row>
                                    </RadioGroup>
                                </FormControl>
                            </Col>
                        </Row>
                    </>
                );
            // case 1:
            //     return (
            //         <>
            //             <Row>
            //                 <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
            //                     <p><strong>Select Contact List</strong></p>
            //                     <p>The selected contact list will be associated with this page for dynamic content rendering in you email campaign.</p>
            //                     <FormControl component="fieldset" className="w-100">
            //                         <RadioGroup aria-label="groupId" name="groupId" value={data.groupId} onChange={radioHandleChange}>
            //                             <Row>
            //                                 {data?.mpType === 3 && <Col xs={12} md={12}>
            //                                     <FormControlLabel value={0} control={<Radio color="primary" />} label="None"
            //                                         sx={{
            //                                             ".MuiFormControlLabel-label": {
            //                                                 fontWeight: "bold",
            //                                             },
            //                                         }}
            //                                     />
            //                                 </Col>}
            //                                 {
            //                                     groups.length > 0 ?
            //                                         groups.map((value,index) => {
            //                                             return (
            //                                                 <Col xs={12} md={4} key={index}>
            //                                                     <FormControlLabel value={value.gId} control={<Radio color="primary" onChange={()=>{handleChangeGroup(value.name)}} />} label={value.name} />
            //                                                 </Col>
            //                                             )
            //                                         })
            //                                     : null
            //                                 }
            //                             </Row>
            //                         </RadioGroup>
            //                     </FormControl>
            //                 </Col>
            //             </Row>
            //         </>
            //     );
            case 1:
                return (
                    <>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                                <FormGroup >
                                {
                                    (data?.mpName === "Opt In" || data?.mpName === "Opt Out" || data?.mpName === "Rejoin Group") && id !== 0 ?
                                        <>
                                            <p className="font-weight-bold">Page Name</p>
                                            <p>{data?.mpName}</p>
                                        </>
                                    :
                                        <InputField type="text" id="mpName" name="mpName" value={data?.mpName || ""} onChange={handleChange} label="Page Name" />
                                }
                                </FormGroup>
                                <FormGroup className="mb-0">
                                    <p><strong>Current Tags : (Click On To Add Tags)</strong></p>
                                    <Stack direction="row" spacing={2} className="stack-wrap">
                                        {
                                            filterValues.map((v,i)=>(
                                                <Item key={i} onClick={()=>{addTag(titleize(v))}}>{titleize(v)}</Item>
                                            ))
                                        }
                                    </Stack>
                                </FormGroup>
                                <FormGroup >
                                    <InputField
                                        id="mpTags"
                                        name="mpTags"
                                        label="Tags (comma separated)"
                                        multiline
                                        fullWidth
                                        minRows={4}
                                        value={data?.mpTags || ""}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel className="m-0" control={<Checkbox color="primary" checked={data.mpPublicUrl === "Y"} onChange={(event)=>{ handleChange("mpPublicUrl",data.mpPublicUrl === "Y" ? "N" : "Y"); }} value="Y" />} label="Public Link" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </>
                );
            case 2:
                return (
                    <>
                        <Row>
                            <Col xs={12} sm={12} md={8} lg={8} xl={8} className="mx-auto">
                                <p><strong>Select Empty Page Layout</strong></p>
                                <Row>
                                    {
                                        templateImages.map((cvalue, i) => {
                                            return (
                                                <Col key={i} xs={6} sm={3} className="mb-4">
                                                    <Link to="#" className={`emptylayouta ${(cvalue.folder_name.replace("/", "") === (data.tname === "demo14" ? "demo13" : data.tname)) ? "active-tmpt" : ""}`} onClick={(a) => select_template(a, cvalue.id, cvalue.folder_name.replace("/", ""))} >
                                                        <img alt="Blank Thumb" className="img-fluid" src={`${siteURL}/templates/${cvalue.folder_name}${cvalue.image_name}`} />
                                                    </Link>
                                                </Col>
                                            );
                                        })
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </>
                );
            case 3:
                return (
                    <Editor data={data} handleBack={handleBack} handleClickSendPreviewEmail={handleClickSendPreviewEmail} toggleMyPageSetting={toggleMyPageSetting} handleClickSave={handleClickSave} handleClickPublish={handleClickPublish} handleClickExportToImage={handleClickExportToImage} handleClickExportToPDF={handleClickExportToPDF} handleClickExportToHTML={handleClickExportToHTML} closeMyPageEditor={closeMyPageEditor} />
                );
            default:
                return 'Unknown step';
        }
    }
    const closeMyPageEditor = ()=>{
        props.confirmDialog({
            open: true,
            title: 'Exit without saving?',
            onConfirm: () => {history.push("/mypages")}
        })
    }
    const handleClickExportToImage = () => {
        props.setLoader({
            load: true,
            text: "Please wait !!!"
        });
        savefullcontent();
        handleClose();
        $("button.export").hide();
        $("button.export").after('<div id="export-button-temp" class="lds-ellipsis"><div></div><div></div><div></div>')
        $("a.export").hide();
        $("a.export").after('<a id="export-temp" class="btn-circle active" data-toggle="tooltip" title="Export To Image"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>');
        html2canvas(document.querySelector("#mcd"), {
            scrollX: 0,
            scrollY: -window.scrollY
        }).then(canvas => {
            try{
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = `${data.mpName.replaceAll(/[^a-zA-Z0-9_]+/gi, "_")}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                $("#export-temp").remove();
                $("a.export").show();
                $("#export-button-temp").remove();
                $("button.export").show();
                props.setLoader({
                    load: false
                });
            } catch (error) {
                props.globalAlert({
                    type: "Error",
                    text: "Something went wrong try again later",
                    open: true
                });
                $("#export-temp").remove();
                $("a.export").show();
                $("#export-button-temp").remove();
                $("button.export").show();
                props.setLoader({
                    load: false
                });
            }
        });
    }
    const handleClickExportToPDF = () => {
        props.setLoader({
            load: true,
            text: "Please wait !!!"
        });
        savefullcontent();
        handleClose();
        $("button.export").hide();
        $("button.export").after('<div id="export-button-temp" class="lds-ellipsis"><div></div><div></div><div></div>')
        $("a.export").hide();
        $("a.export").after('<a id="export-temp" class="btn-circle active" data-toggle="tooltip" title="Export To PDF"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>');
        let allTempData = $("#all_temp_data").val();
        try {
            let opt = {
                filename: `${data.mpName.replaceAll(/[^a-zA-Z0-9_]+/gi, "_")}.pdf`,
                jsPDF: { unit: 'px', format: [$("#mcd").width(), $("#mcd").height()+45], orientation: 'portrait' },
            };
            html2pdf().set(opt).from(allTempData).save();
            $("#export-temp").remove();
            $("a.export").show();
            $("#export-button-temp").remove();
            $("button.export").show();
            props.setLoader({
                load: false
            });
        } catch (error) {
            props.globalAlert({
                type: "Error",
                text: "Something went wrong try again later",
                open: true
            });
            $("#export-temp").remove();
            $("a.export").show();
            $("#export-button-temp").remove();
            $("button.export").show();
            props.setLoader({
                load: false
            });
        }
    }
    const handleClickExportToHTML = () => {
        props.setLoader({
            load: true,
            text: "Please wait !!!"
        });
        savefullcontent();
        handleClose();
        $("button.export").hide();
        $("button.export").after('<div id="export-button-temp" class="lds-ellipsis"><div></div><div></div><div></div>')
        $("a.export").hide();
        $("a.export").after('<a id="export-temp" class="btn-circle active" data-toggle="tooltip" title="Export To HTML"><i class="fad fa-spinner-third fa-spin" style="padding:5px;"></i><div class="bg-blue"></div></a>');
        let allTempData = $("#all_temp_data").val();
        try {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(allTempData);
            link.download = `${data.mpName.replaceAll(/[^a-zA-Z0-9_]+/gi, "_")}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            $("#export-temp").remove();
            $("a.export").show();
            $("#export-button-temp").remove();
            $("button.export").show();
            props.setLoader({
                load: false
            });
        } catch (error) {
            props.globalAlert({
                type: "Error",
                text: "Something went wrong try again later",
                open: true
            });
            $("#export-temp").remove();
            $("a.export").show();
            $("#export-button-temp").remove();
            $("button.export").show();
            props.setLoader({
                load: false
            });
        }
    }
    useEffect(() => {
        getMyPagesTags(3).then(res => {
            if (res.result) {
                setFilterValues(res.result.tags);
            }
        });
    }, []);
    useEffect(()=>{
        if(id){
            getMyPageById(id).then(res => {
                if (res.result && res.result.mypage) {
                    setData(res.result.mypage);
                }
            });
        }
    },[id]);
    useEffect(()=>{
        if(ftFolderName){
            getPreviewFreeTemplate(ftFolderName).then(res => {
                if (res.status === 200 && res.result && res.result.freeTemplate) {
                    setData((prev)=>{ return {...prev, "allTempData": res.result.freeTemplate} });
                }
            })
        }
    },[ftFolderName]);
    useEffect(()=>{
        let interval = null,interval2 = null;
        if(activeStep === 3){
            interval = setInterval(() => {
                if(typeof window.CKEDITOR !== "undefined"){
                    reloadfirst(data.mpType, data.groupId, props.user.memberId);
                    clearInterval(interval);
                    interval = null;
                }
            }, 1000);
            interval2 = setInterval(() => {
                handleCallAutoSave();
            }, 120 * 1000);
        }
        // if(activeStep === 1){
        //     getGroupListCombo().then(
        //         res => {
        //             if (res.result.groupList) {
        //                 let groups = [];
        //                 res.result.groupList.forEach((element) => {
        //                     groups.push({
        //                         gId: element.groupId,
        //                         name: element.groupName
        //                     });
        //                 });
        //                 setGroups(groups);
        //             }
        //         }
        //     );
        // }
        return ()=>{
            clearInterval(interval);
            interval = null;
            clearInterval(interval2);
            interval2 = null;
        }
    },[activeStep,data,props]);
    useEffect(() => {
        try {
            if(activeStep === 3){
                loadeverytime();
                $("#preview-template").find("#templateBody .mojoMcBlock.tpl-block").each(function () {
                    blockedtblocan($(this).attr("id"));
                });
            }
        } catch (error) {}
    },[toggleSurveysTags,toggleAssessmentsTags,toggleCustomFormsTags,toggleButton,toggleUDF,activeStep]);
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="overflow-hidden">
                    <div className="w-100">
                        {
                            activeStep !== 3 ? (
                                <Stepper style={{ width: "50%", margin: "0 auto" }} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            ) : null
                        }
                        <div>
                            {activeStep === steps.length ? (
                                <div>
                                    <Typography>
                                        All steps completed - you&apos;re finished
                                    </Typography>
                                    <Button onClick={handleReset}>
                                        RESET
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    {getStepContent(activeStep)}
                                    <input type="hidden" name="all_temp_data" id="all_temp_data" />
                                    <div className="mt-5 mb-5 text-center">
                                        {activeStep === steps.length - 1 ?
                                            <>
                                                <Button variant="contained" color="primary" onClick={handleBackEditor} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                                                <Button variant="contained" color="primary" onClick={()=>{handleClickSendPreviewEmail()}} className="mr-3 send-preview-email"><i className="far fa-envelope mr-3"></i>SEND PREVIEW EMAIL</Button>
                                                <Button variant="contained" color="primary" onClick={()=>{handleClickSave("no")}} className="mr-3 save"><i className="far fa-save mr-2"></i>SAVE</Button>
                                                <Button variant="contained" color="primary" onClick={()=>{handleClickSave("yes")}} className="mr-3 save-for-later"><i className="far fa-save mr-2"></i>SAVE AND EXIT</Button>
                                                <Button variant="contained" color="primary" onClick={()=>{handleClickPublish()}} className="mr-3 publish"><i className="far fa-envelope-open-text mr-2"></i>PUBLISH</Button>
                                                <Button variant="contained" color="primary" onClick={handleClick} className="mr-3 export" id="customized-button" aria-controls={open ? 'customized-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} endIcon={<KeyboardArrowDown />}><i className="far fa-file-export mr-2"></i>Export</Button>
                                                <StyledMenu
                                                    id="customized-menu"
                                                    MenuListProps={{ 'aria-labelledby': 'customized-button', }}
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={handleClickExportToImage} disableRipple><i className="far fa-file-image mr-2"></i>As Image</MenuItem>
                                                    <MenuItem onClick={handleClickExportToPDF} disableRipple><i className="far fa-file-pdf mr-2"></i>As PDF</MenuItem>
                                                    <MenuItem onClick={handleClickExportToHTML} disableRipple><i className="far fa-file-code mr-2"></i>As HTML</MenuItem>
                                                </StyledMenu>
                                                <Button variant="contained" color="primary" onClick={closeMyPageEditor} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                                            </>
                                            :
                                            <>
                                                {
                                                    activeStep === 0 ?
                                                        <Button variant="contained" color="primary" onClick={closeMyPageEditor} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                                                    : null
                                                }
                                                {
                                                    activeStep !== 0 ?
                                                        <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                                                    : null
                                                }
                                                <Button variant="contained" color="primary" onClick={handleNext} className="mr-3"><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                                            </>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={modalMyPageSetting} toggle={toggleMyPageSetting}>
                <ModalHeader toggle={toggleMyPageSetting}>My Page Settings</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} className="mx-auto">
                            <FormGroup >
                                {
                                    (data?.mpName === "Opt In" || data?.mpName === "Opt Out" || data?.mpName === "Rejoin Group") && id !== 0 ?
                                        <>
                                            <p className="font-weight-bold">Page Name</p>
                                            <p>{data?.mpName}</p>
                                        </>
                                    :
                                        <InputField type="text" name="mpName" value={data?.mpName || ""} onChange={handleChange} label="Page Name" />
                                }
                            </FormGroup>
                            {/* {
                                data.groupId > 0 ?
                                    <FormGroup>
                                        <InputLabel id="groupId-label">Group</InputLabel>
                                        <Select
                                            labelId="groupId-label"
                                            name="groupId"
                                            value={data.groupId}
                                            onChange={(e)=>{handleChange(e.target.name,e.target.value)}}
                                            input={<Input/>}
                                            fullWidth={true}
                                        >
                                            {groups.map((value,index) => (
                                                <MenuItem key={index} value={value.gId} onClick={()=>{handleChangeGroup(value.name)}}>
                                                    {value.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormGroup>
                                : null
                            } */}
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleMyPageSetting()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalGT} toggle={toggleGT}>
                <ModalHeader toggle={toggleGT}>ENABLE TRANSLATION SERVICES</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox color="primary" checked={googleTranslationServices} onChange={()=>{handleChangeGoogleTranslationServices()}} />} label={<><p className="m-0">Yes, allow my members to set their language preference. This service leverages Google Translation Services which requires an additional fee.</p><p className="m-0">Pricing can be viewed <a target="_blank" rel="noreferrer" href={`${staticUrl}/pricing.html`}>here</a></p></>} />
                    </FormGroup>
                    <FormGroup>
                        <p className="m-0"><strong>Current Language : </strong>{currentLanguage?.long || ""}</p>
                    </FormGroup>
                    <FormGroup>
                        <p className="m-0"><strong>Translate To Language :</strong></p>
                    </FormGroup>
                    <Row>
                        {
                            languageList?.length > 0 ?
                                languageList?.map((value,index)=>(
                                    <Col xs={4} key={index}>
                                        <FormControlLabel control={<Checkbox disabled={!googleTranslationServices} onChange={()=>{handleChangeLanguageList(value.short)}} checked={selectedLanguageList.includes(value.short)} color="primary" />} label={value.long} />
                                    </Col>
                                ))
                            : null
                        }
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickPublishGT()}} className="publishGTSave">PUBLISH</Button>
                    <Button variant="contained" color="primary" onClick={()=>toggleGT()} className="ml-3 publishGTCancel">CLOSE</Button>
                </ModalFooter>
            </Modal>
            <ModalAssessment modalAssessmentsTags={modalAssessmentsTags} toggleAssessmentsTags={toggleAssessmentsTags} />
            <ModalSurvey modalSurveysTags={modalSurveysTags} toggleSurveysTags={toggleSurveysTags} />
            <ModalCustomForm modalCustomFormsTags={modalCustomFormsTags} toggleCustomFormsTags={toggleCustomFormsTags} />
            <ModalButton modalButton={modalButton} toggleButton={toggleButton} />
            <ModalUdf modalUDF={modalUDF} toggleUDF={toggleUDF} memberId={props.user.memberId} />
            <ModalOpenAi modalOpenAi={modalOpenAi} toggleOpenAi={toggleOpenAi} />
            <ModalImageAi modalImageAi={modalImageAi} toggleImageAi={toggleImageAi} />
            <Modal isOpen={modalSendPreviewEmail} toggle={toggleSendPreviewEmail}>
                <ModalHeader toggle={toggleSendPreviewEmail}>Send Preview Email</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} className="mx-auto">
                            <p><strong>Send Preview Email to Your Email :</strong></p>
                            <p>{props.user.email}</p>
                            <div>
                                <Autocomplete
                                    freeSolo
                                    multiple
                                    autoSelect={true}
                                    options={[]}
                                    getOptionLabel={(option) => option?.label}
                                    value={contactSelected}
                                    onChange={(event, value,reason) => {
                                        if(reason === "selectOption"){
                                            if(typeof value[value.length-1] === "string"){
                                                if(validateEmail(value[value.length-1])){
                                                    setContactSelected(prev=>{
                                                        return [...prev, value[value.length-1]]
                                                    })
                                                }
                                            } else {
                                                if(validateEmail(value[value.length-1])){
                                                    setContactSelected(prev=>{
                                                        return [...prev, value[value.length-1]]
                                                    })
                                                }
                                            }
                                        } else if(reason === "removeOption"){
                                            setContactSelected(value);
                                        } else {
                                            if(validateEmail(value[value.length-1])){
                                                setContactSelected(prev=>{
                                                    return [...prev, value[value.length-1]]
                                                })
                                            }
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="standard"
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                            id="email"
                                            name="email"
                                            label="Add Other Emails to Send Preview"
                                            className="w-100"
                                            onKeyDown={event => {
                                                if(event.key !== "Enter"){
                                                    setPrevKeyStroke(event.key);
                                                }
                                                if(event.key === "Enter"){
                                                    if(prevKeyStroke !== "ArrowDown" && prevKeyStroke !== "ArrowUp"){
                                                        if(!validateEmail(event.target.value)){
                                                            setTimeout(()=>{
                                                                props.globalAlert({
                                                                    type: "Error",
                                                                    text: "Please enter proper email",
                                                                    open: true
                                                                });
                                                            },300);
                                                            event.defaultMuiPrevented = true;
                                                        }
                                                    }
                                                }
                                            }}
                                            onBlur={event=>{
                                                if(!validateEmail(event.target.value) && event.target.value !== ""){
                                                    props.globalAlert({
                                                        type: "Error",
                                                        text: "Please enter proper email",
                                                        open: true
                                                    });
                                                }
                                            }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return typeof option === "object" ? (
                                                validateEmail(option.clientEmail) ? ( <Chip key={key} variant="default" label={option.clientEmail} {...tagProps} /> ) : ( value.splice(index, 1) )
                                            ) : (
                                                validateEmail(option) ? ( <Chip key={key} variant="default" label={option} {...tagProps} /> ) : ( value.splice(index, 1) )
                                            );
                                        })
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>handleCallSendPreviewEmail()} className='mr-3 send-preview-email'>SEND</Button>
                    <Button variant="contained" color="primary" onClick={()=>toggleSendPreviewEmail()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddMyPage);