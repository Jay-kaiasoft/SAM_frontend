import React, {useState, useEffect, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {Col, FormGroup, Row} from "reactstrap";
import {Button, FormControlLabel, Link, Radio, RadioGroup, Step, StepLabel, Stepper, TextField, InputLabel, Input, InputAdornment, Menu, MenuItem} from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import FormEditor from "../shared/editor/formEditor";
import $ from "jquery";
import PreviewForm from "./previewForm";
import AddScript from "../shared/commonControlls/addScript";
import {savefullcontent, loadeverytime, formBlockSetting, reloadfirst, blockedtblocan, deletePage} from "../shared/editor/js/eas_js_form";
import {hidedsm, removeActive} from "../shared/editor/js/eas_js_common.js";
import {extractQuestionsFromJson, generateJSON, isPageHasContent} from "./utility";
import html2canvas from "html2canvas";
import history from "../../history";
import {checkCustomFormNameExists, getCustomFormDataById, saveCustomFormData} from "../../services/customFormService";
import {siteURL} from "../../config/api";
import {getDomainEmailList} from "../../services/profileService";
import ModalAssessment from "../shared/editor/commonComponents/modalAssessment";
import ModalSurvey from "../shared/editor/commonComponents/modalSurvey";
import ModalCustomForm from "../shared/editor/commonComponents/modalCustomForm";
import ModalButton from "../shared/editor/commonComponents/modalButton";
import CopyLink from "../shared/commonControlls/copyLink";
import {createSmallThumb, easUrlEncoder, QontoConnector, QontoStepIcon} from "../../assets/commonFunctions";
import ModalOpenAi from "../shared/editor/commonComponents/modalOpenAi.jsx";
import ModalImageAi from "../shared/editor/commonComponents/modalImageAi.jsx";
import FormToGroupMapping from "../shared/commonControlls/formToGroupMapping.jsx";

const CreateForm = ({user,subUser,globalAlert,location}) => {
    AddScript(siteURL+'/externaljs/ckeditor_4_15/ckeditor.js');
    AddScript(siteURL+'/externaljs/jquery.leanModal.min.js');
    AddScript(siteURL+'/externaljs/bootstrap-treeview.js');
    AddScript(siteURL+'/externaljs/dropzone.js');
    AddScript(siteURL+'/externaljs/jquery-ui-timepicker-addon.js');
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const steps = ["1","2","3","4"];
    const [activeStep, setActiveStep] = useState(0);
    const [showPreviewForm, setShowPreviewForm] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
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
        } catch (error) {}
    }, [showPreviewForm,toggleSurveysTags,toggleAssessmentsTags,toggleCustomFormsTags,toggleButton]);
    const togglePreviewForm = () => {
        for(let name in window.CKEDITOR.instances)
        {
            window.CKEDITOR.instances[name].destroy(true);
        }
        savefullcontent();
        $(".pageTypeMain").fadeOut();
		hidedsm();
        setDataListJson(generateJSON());
        setShowPreviewForm(!showPreviewForm);
    }
    const [data, setData] = useState({
        cfFormName: "",
        cfFormMetaKeyWord: "",
        cfFormMetaDescription: "",
        cfSendNotificationConfirmation:"N",
        cfSendNotificationEmail: user.email,
        cfFormType: "",
        cfFormToGroupYN: ""
    });
    const [dataListJson, setDataListJson] = useState({});
    const [link, setLink] = useState({});
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        if(event.target.textContent !== "") {
            handleChange("cfSendNotificationEmail", event.target.textContent);
        }
        setAnchorEl(null);
    };
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
    }
    const handleClickNextFirst = () => {
        if(typeof data.cfFormName === "undefined" || data.cfFormName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter Form Name.",
                open: true
            });
            return false;
        }
        if(data.cfSendNotificationConfirmation === "Y" && (typeof data.cfSendNotificationEmail === "undefined" || data.cfSendNotificationEmail === "")){
            globalAlert({
                type: "Error",
                text: "Please Select a From Address.",
                open: true
            });
            return false;
        }
        if(typeof data.cfFormType === "undefined" || data.cfFormType === ""){
            globalAlert({
                type: "Error",
                text: "Please select Form Type.",
                open: true
            });
            return false;
        }
        let requestData = `?customFormName=${encodeURIComponent(data?.cfFormName)}&customFormId=${id}`;
        checkCustomFormNameExists(requestData).then(res => {
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
    }
    const handleClickNextSecond = () => {
        if(!isPageHasContent("next")){
            return;
        }
        $("#cntr").css("box-shadow","");
        for(let name in window.CKEDITOR.instances)
        {
            window.CKEDITOR.instances[name].destroy(true);
        }
        removeActive("form");
        savefullcontent();
        html2canvas(document.querySelector("#cntr"), {
            scrollX: 0,
            scrollY: -window.scrollY
        }).then(async (canvas) => {
            let compressThumbURL = await createSmallThumb(canvas);
            handleChange("thumbData", compressThumbURL);
            handleChange("cfFormData", generateJSON());
            handleChange("cfFormHtml", $("#all_temp_data").val());
            handleNext();
        });
    }
    const handleClickBackSecond = () => {
        removeActive("form");
        savefullcontent();
        setData((prev)=>({...prev, cfFormData: generateJSON(), cfFormHtml: $("#all_temp_data").val()}));
        handleBack();
    }
    const handleClickSave = (status) => {
        if(typeof data?.cfFormToGroupYN === "undefined" || data?.cfFormToGroupYN === ""){
            globalAlert({
                type: "Error",
                text: "Please select.",
                open: true
            });
            return false;
        }
        if(typeof data?.cfFormToGroupYN !== "undefined" && data?.cfFormToGroupYN === "Yes"){
            if(typeof data?.cfGroupId === "undefined" || data?.cfGroupId === ""){
                globalAlert({
                    type: "Error",
                    text: "Please select Group.",
                    open: true
                });
                return false;
            }
            if((typeof data?.cfMapping?.Email === "undefined" || data?.cfMapping?.Email === "") && (typeof data?.cfMapping?.phoneNumber === "undefined" || data?.cfMapping?.phoneNumber === "")){
                globalAlert({
                    type: "Error",
                    text: "Please select Email or Mobile.",
                    open: true
                });
                return false;
            }
        }
        if(status === 0){
            $("button.saveAndDraft").remove();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertBefore("button.saveAndPublish");
        } else if(status === 1){
            $("button.saveAndPublish").remove();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.saveAndDraft");
        }
        let requestData = {
            "cfId": id,
            "subMemberId": subUser.memberId,
            "cfFormName": data.cfFormName,
            "cfFormMetaKeyWord": data.cfFormMetaKeyWord,
            "cfFormMetaDescription": data.cfFormMetaDescription,
            "cfFormData": JSON.stringify(data?.cfFormData),
            "cfFormStatus": status,
            "cfSendNotificationConfirmation":data.cfSendNotificationConfirmation,
            "cfSendNotificationEmail": data.cfSendNotificationEmail,
            "cfFormType":data.cfFormType,
            "cfTinyUrl": "",
            "cfFormHtml": data?.cfFormHtml,
            "thumbData": data?.thumbData,
            "cfFormToGroupYN": data?.cfFormToGroupYN,
            "cfGroupId": data?.cfGroupId,
            "cfMapping": JSON.stringify(data?.cfMapping)
        }
        saveCustomFormData(requestData).then(res => {
            if (res.status === 200) {
                if(res.result.customFormLinkUrl === ""){
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    history.push("/myforms");
                } else {
                    let jsLink = `<script type="text/javascript" src="${siteURL}/svscript.js?entid=${res.result.customFormLinkUrl.split("/").pop()}&~t~=customform"></script>`;
                    let embedLink = `<iframe src="${res.result.customFormLinkUrl}" style="border:none;" height="100%" width="100%"></iframe>`;
                    setLink({"link":res.result.customFormLinkUrl,"jsLink":jsLink,"embedLink":embedLink});
                    handleNext();
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                history.push("/myforms");
            }
        });
    }
    const handleDeletePageClick = (e)=>{
        deletePage(e);
    }
    const handlePreview = ()=>{
        if(!isPageHasContent("preview")){
            return;
        }
        removeActive("form");
        togglePreviewForm();
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Col xs={4} className="mx-auto">
                        <FormGroup >
                            <InputField type="text" id="cfFormName" name="cfFormName" value={data?.cfFormName || ""} onChange={handleChange} label="Form Name" />
                        </FormGroup>
                        {/*<FormGroup >*/}
                        {/*    <InputField type="text" id="cfFormMetaKeyWord" name="cfFormMetaKeyWord" value={data?.cfFormMetaKeyWord || ""} onChange={handleChange} label="Form Meta KeyWord" />*/}
                        {/*</FormGroup>*/}
                        {/*<FormGroup >*/}
                        {/*    <InputField type="text" id="cfFormMetaDescription" name="cfFormMetaDescription" value={data?.cfFormMetaDescription || ""} onChange={handleChange} label="Form Meta Description" />*/}
                        {/*</FormGroup>*/}
                        <FormGroup>
                            <p className="mb-1">Do you want email notification on every submission?</p>
                            <RadioGroup
                                row
                                name="cfSendNotificationConfirmation"
                                value={data?.cfSendNotificationConfirmation}
                                onChange={(e)=>{handleChange(e.target.name,e.target.value)}}
                            >
                                <FormControlLabel value="Y" control={<Radio color="primary" className="mr-2"/>} label="Yes" className="ml-0 mr-2 mb-0"/>
                                <FormControlLabel value="N" control={<Radio color="primary" className="mr-2"/>} label="No" className="ml-0 mr-2 mb-0"/>
                            </RadioGroup>
                        </FormGroup>
                        {
                            data.cfSendNotificationConfirmation === "Y" &&
                            <FormGroup className="mt-3">
                                <InputLabel htmlFor="fromAddress">From Address</InputLabel>
                                <Input
                                    id="fromAddress"
                                    value={data?.cfSendNotificationEmail || ""}
                                    disabled={true}
                                    label="From Address"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Button
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                color="primary"
                                                variant="contained"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                                style={{marginTop: -5}}
                                            >
                                                <span className="">VERIFIED EMAIL</span>
                                                <i className="fas fa-caret-down ml-1"></i>
                                            </Button>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                {
                                                    emailList.length > 0 ?
                                                        emailList.map((it,i) => {
                                                            return (
                                                                <MenuItem onClick={handleClose} key={i}>{it.email}</MenuItem>
                                                            )
                                                        })
                                                    :
                                                        <MenuItem>No verified email found</MenuItem>
                                                }
                                            </Menu>
                                        </InputAdornment>
                                    }
                                />
                            </FormGroup>
                        }
                        <FormGroup>
                            <p className="mb-1">Form Type</p>
                            <RadioGroup
                                name="cfFormType"
                                value={data?.cfFormType}
                                onChange={(e)=>{handleChange(e.target.name,e.target.value)}}
                            >
                                <FormControlLabel value="traditional" control={<Radio color="primary" className="mr-2"/>} label="Traditional One Page Form" className="ml-0 mr-2 mb-0"/>
                                <FormControlLabel value="dynamic" control={<Radio color="primary" className="mr-2"/>} label="Multi-Page Form & Landing Pages" className="ml-0 mr-2 mb-0"/>
                            </RadioGroup>
                        </FormGroup>
                        <FormGroup className="text-center mb-5">
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/myforms")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            <Button variant="contained" color="primary" onClick={handleClickNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </Col>
                );
            case 1:
                return (
                    <>
                        <div className="addpagemain d-flex align-items-center">
                            <div className="p-3 pageTypeMain" style={{top:"50px"}}>
                                <div><Link component="a" id="addpage" underline="none" color="inherit" className="pageType">New Form Page</Link></div>
                                <div><Link component="a" id="addlandingpage" underline="none" color="inherit" className="pageType">Content Page</Link></div>
                            </div>
                            { data?.cfFormType !== "traditional" && <span className="mb-2" style={{width:"min-content"}}><i className="far fa-plus-square addpage" title="Add" data-toggle="tooltip"></i></span>}
                            {
                                typeof data?.cfFormData?.pageCounter === "undefined" || data?.cfFormData?.pageCounter === "" ?
                                    <span id="addpagethumb">
                                        <div className="pagethumb active" title="New Form Page" data-toggle="tooltip"><div className="fold"></div><span>1</span></div>
                                        <div id="thankYouPage" title="Thank You Page" data-toggle="tooltip"><div className="fold"></div><span>END</span></div>
                                    </span>
                                :
                                    <span id="addpagethumb" dangerouslySetInnerHTML={{ __html:data.cfFormData.pageCounter}}></span>
                            }
                            { data?.cfFormType !== "traditional" && <i className="far fa-trash-alt deletepage" title="Delete" data-toggle="tooltip" onClick={(e)=> {
                                handleDeletePageClick(e)
                            }}></i>}
                        </div>
                        <FormEditor data={data} handleBack={handleBack} />
                        <FormGroup className="text-center mb-4 mt-3">
                            <Button variant="contained" color="primary" onClick={handleClickBackSecond} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" onClick={handlePreview} className="mr-3"><i className="far fa-eye mr-2"></i>PREVIEW</Button>
                            {/* <Button variant="contained" color="primary" onClick={()=>{handleClickSave(0)}} className="mr-3 saveAndDraft"><i className="far fa-save mr-2"></i>SAVE FOR LATER</Button>
                            <Button variant="contained" color="primary" onClick={()=>{handleClickSave(1)}} className="mr-3 saveAndPublish"><i className="far fa-envelope-open-text mr-2"></i>PUBLISH</Button> */}
                            <Button variant="contained" color="primary" onClick={handleClickNextSecond} className="mr-3"><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/myforms")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                        </FormGroup>
                    </>
                );
            case 2:
                return (
                    <Row>
                        <Col xs={12}>
                            <FormGroup className="w-25 mx-auto">
                                <p className="mb-1">Would like to import form data to group?</p>
                                <RadioGroup
                                    row
                                    name="cfFormToGroupYN"
                                    value={data?.cfFormToGroupYN || ""}
                                    onChange={(e)=>{handleChange(e.target.name,e.target.value)}}
                                >
                                    <FormControlLabel value="Yes" control={<Radio color="primary" className="mr-2"/>} label="Yes" className="ml-0 mr-2 mb-0"/>
                                    <FormControlLabel value="No" control={<Radio color="primary" className="mr-2"/>} label="No" className="ml-0 mr-2 mb-0"/>
                                </RadioGroup>
                            </FormGroup>
                            {
                                data?.cfFormToGroupYN === "Yes" &&
                                    <FormToGroupMapping questionAll={extractQuestionsFromJson(data?.cfFormData)} data={data} setData={setData} />
                            }
                            <FormGroup className="text-center mb-4 mt-3">
                                <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                                <Button variant="contained" color="primary" onClick={()=>{handleClickSave(0)}} className="mr-3 saveAndDraft"><i className="far fa-save mr-2"></i>SAVE FOR LATER</Button>
                                <Button variant="contained" color="primary" onClick={()=>{handleClickSave(1)}} className="mr-3 saveAndPublish"><i className="far fa-envelope-open-text mr-2"></i>PUBLISH</Button>
                                <Button variant="contained" color="primary" onClick={()=>{history.push("/myforms")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                );
            case 3:
                return (
                    <Col xs={8} className="mx-auto">
                        <h4>Form Publishing Options</h4>
                        <p className="font-weight-bold">Put javascript snippet below to into your website home page</p>
                        <TextField
                            variant="standard"
                            name="jsLink"
                            multiline
                            fullWidth
                            minRows={2}
                            value={link.jsLink}
                            readOnly={true}
                            onFocus={event => event.target.select()}
                            InputProps={{endAdornment: <CopyLink elementName="jsLink" iconSelector="copyJsLink"/> }}
                        />
                        <p className="font-weight-bold mt-5">Send Link in Email or Text</p>
                        <TextField
                            variant="standard"
                            name="link"
                            multiline
                            fullWidth
                            minRows={2}
                            value={link.link}
                            readOnly={true}
                            onFocus={event => event.target.select()}
                            InputProps={{endAdornment: <CopyLink elementName="link" iconSelector="copyLink"/> }}
                        />
                        <p className="font-weight-bold mt-5">Embed in Your Page</p>
                        <TextField
                            variant="standard"
                            name="embedLink"
                            multiline
                            fullWidth
                            minRows={2}
                            value={link.embedLink}
                            readOnly={true}
                            onFocus={event => event.target.select()}
                            InputProps={{endAdornment: <CopyLink elementName="embedLink" iconSelector="copyEmbedLink"/> }}
                        />
                        <FormGroup className="text-center mb-4 mt-3 bold">
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/myforms")}}><i className="far fa-check mr-2"></i>DONE</Button>
                        </FormGroup>
                    </Col>
                );
            default:
                return 'Unknown step';
        }
    }
    const displayGetDomainEmailList = () => {
        getDomainEmailList(1).then(res => {
            if (res.result.domainEmail) {
                setEmailList(res.result.domainEmail);
            }
        });
    }
    useEffect(()=>{
        displayGetDomainEmailList();
    },[]);
    useEffect(()=>{
        if(id){
            getCustomFormDataById(id).then(res => {
                if (res.result && res.result.customForm) {
                    let t={...res.result.customForm, cfFormData:JSON.parse(res.result.customForm.cfFormData), cfMapping:JSON.parse(res.result.customForm.cfMapping)}
                    setData(t);
                }
            });
        }
    },[id]);
    useEffect(()=>{
        if(activeStep === 1){
            setTimeout(()=>{
                reloadfirst(data?.cfFormType);
            },2000);
        }
    },[activeStep,data?.cfFormType]);
    return (
        <>
            <Row className="midleMain2">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={4}><h3>{activeStep === 1 ? "Form Designer" : "Forms & Landing Pages"}</h3></Col>
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
                    {activeStep !== 0 && <p><strong>Form Name : </strong>{data.cfFormName}</p>}
                    {getStepContent(activeStep)}
                    <input type="hidden" name="all_temp_data" id="all_temp_data" />
                </Col>
            </Row>
            {
                showPreviewForm && <PreviewForm dataListJson={dataListJson} setDataListJson={setDataListJson} togglePreviewForm={togglePreviewForm} saveMode={false}/>
            }
            <ModalAssessment modalAssessmentsTags={modalAssessmentsTags} toggleAssessmentsTags={toggleAssessmentsTags} />
            <ModalSurvey modalSurveysTags={modalSurveysTags} toggleSurveysTags={toggleSurveysTags} />
            <ModalCustomForm modalCustomFormsTags={modalCustomFormsTags} toggleCustomFormsTags={toggleCustomFormsTags} />
            <ModalButton modalButton={modalButton} toggleButton={toggleButton} />
            <ModalOpenAi modalOpenAi={modalOpenAi} toggleOpenAi={toggleOpenAi} />
            <ModalImageAi modalImageAi={modalImageAi} toggleImageAi={toggleImageAi} />
        </>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        subUser:state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);