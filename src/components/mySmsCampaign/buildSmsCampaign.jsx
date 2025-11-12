import $ from "jquery";
import 'jquery-ui/ui/widgets/sortable.js';
import React, { createRef, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { connect } from "react-redux";
import { Row, Col, FormGroup, ModalHeader, ModalBody, ModalFooter, Modal } from 'reactstrap';
import { Stepper, Step, StepLabel, Button, Typography, Radio, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';
import { dateTimeFormatDB, displayFormatNumber, easUrlEncoder, getClientTimeZone } from '../../assets/commonFunctions';
import InputField from '../shared/commonControlls/inputField';
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import {getGroupListWithCheckDuplicate, getGroupSmsTotalCount, getGroupUDF, getSegmentList, searchForBuyNumber} from '../../services/clientContactService';
import DropDownControls from "../shared/commonControlls/dropdownControl";
import history from "../../history";
import { buyNumberForSmsCampaign, getFreeNumberList, getNumberCheck, getScmNumberPhoneSid, getSmsCampaign, saveSmsCampaign, sendSmsCampaign, sendSmsPreview } from "../../services/smsCampaignService";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import {getSurveyAllList} from "../../services/surveyService";
import {getAssessmentAllList} from "../../services/assessmentService";
import {getCustomFormLinkList} from "../../services/customFormService";
import {QontoConnector, QontoStepIcon} from "../../assets/commonFunctions";
import {getCountry} from "../../services/commonService";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {userLoggedIn} from "../../actions/userActions";
import { setLoader } from "../../actions/loaderActions";
import { matchVimeoUrl, matchYoutubeUrl } from "../shared/editor/js/eas_js_common.js";
import AddScript from "../shared/commonControlls/addScript";
import { siteURL, websiteTitle } from "../../config/api";
import { filemanager } from "../shared/fileManager/js/filemanager.js";
import { editImage, downloadFileGD, downloadFileDB, downloadFileOD } from "../../services/myDesktopService";
import { ZoomModal } from "../shared/editor/commonComponentsForEditor";
import SelectGroupSegment from "./selectGroupSegment";
import SmsDetails from "./smsDetails";
import Scheduler from "./scheduler";
import Preview from "./preview";
import ModalImageAi from "../shared/editor/commonComponents/modalImageAi.jsx";
import { setSubUserAction } from "../../actions/subUserActions.js";

const innerHeading = {
    fontSize: 18
}
function getSteps() {
    return ['1', '2', '3', '4', '5'];
}

let path = "";
let filename = "";
let imagePath = "";
let pixie6;
function launchPixieEditor() {
    const script = document.createElement('script');
    script.src = siteURL+'/externaljs/pixie/pixie.umd.js';
    script.async = false;
    document.body.appendChild(script);
    $('body').find("#pixie-editor-container").remove();
    $('body').append('<div id="pixie-editor-container"></div>');
    const ui = {
            mode: 'overlay',
        visible: false,
        menubar: {
            items: [
                {
                    type: 'button',
                    icon: [
                        {
                            tag: 'path',
                            attr: {
                                d: 'm11.99 18.54-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z',
                            },
                        },
                    ],
                    align: 'right',
                    position: 0,
                    action: editor => {
                        console.log("onClose Btn");
                        // editor.togglePanel('objects');
                    },
                },
                {
                    type: 'button',
                    icon: [
                        {
                            tag: 'path',
                            attr: {
                                d: 'M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z',
                            },
                        },
                    ],
                    align: 'left',
                    buttonVariant: 'outline',
                    menuItems: [
                        {
                            action: editor => {
                                editor.tools.import.uploadAndReplaceMainImage();
                            },
                            label: 'Background Image',
                        },
                        {
                            action: editor => {
                                editor.tools.import.uploadAndAddImage();
                            },
                            label: 'Overlay Image',
                        },
                        {
                            action: editor => {
                                editor.tools.import.uploadAndOpenStateFile();
                            },
                            label: 'Editor Project File',
                        },
                    ],
                },
            ],
        },
            toolbar: {
                hide: false,
                hideOpenButton: false,
                hideSaveButton: false,
                hideCloseButton: false,
            }
    };
    const config = {
        selector: "#pixie-editor-container",
        baseUrl: siteURL+'/externaljs/pixie/assets',
        ui: {...ui, visible: true},
        onLoad: function() {},
        onSave: function(data, name) {
            let requestData = {
                "imageName": filename,
                "imageData": data,
                "imagePath": imagePath
            }
            editImage(requestData).then(res=>{
                $('.treeview ul li:first-of-type').trigger("click");
                pixie6.close();
            })
        },
        onClose: function() {
            delete window.Pixie;
            document.body.removeChild(script);
        }
    };
    pixie6 = null;
    let interval = setInterval(() => {
        if(typeof window.Pixie !== "undefined"){
            clearInterval(interval);
            interval = null;
            $("#clickLoader").val(false);
            $("#clickLoader").trigger("click");
        }
        pixie6 = new window.Pixie({...config});
        pixie6.setConfig({image: path})
    }, 1000);
}
const BuildSmsCampaign = (props) => {
    AddScript(siteURL+'/externaljs/jquery.leanModal.min.js');
    AddScript(siteURL+'/externaljs/bootstrap-treeview.js');
    AddScript(siteURL+'/externaljs/dropzone.js');
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const steps = getSteps();
    const [activeStep, setActiveStep] = useState(0);
    const [groups, setGroups] = useState([]);
    const [totalSms, setTotalSms] = useState(0);
    const [sms, setSms] = useState([{
        "rowDisplayOrder":1,
        "smsType":"text",
        "smsDetail":""
    }]);
    const [udfFields, setUdfFields] = useState([]);
    const [data, setData] = useState({
        smsName: "",
        groupList: 0,
        groupName: "",
        chkOptOut:0,
        optOutMsg:"Reply STOP to stop",
        segId: 0,
        totalMember: 0,
        scheduleType: 0,
        sendOnDate: dateTimeFormatDB(new Date()),
        scmNumberPhoneSid:"",
        scmId: 0,
        isFlagged: false,
        convertTinyUrlYN: "N"
    });
    const [rowDisplayOrder,setRowDisplayOrder] = useState(2);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoModal, setVideoModal] = useState(false);
    const [surveyLinkList, setSurveyLinkList] = useState([]);
    const [assessmentLinkList, setAssessmentLinkList] = useState([]);
    const [customFormLinkList, setCustomFormLinkList] = useState([]);
    const initSmsCost = props.countrySetting.cntySMSPerPrice;
    const toggleVideoModal =  () => {
        setVideoModal(!videoModal);
        setVideoUrl("");
    }
    const [modalNumberList, setModalNumberList] = useState(false);
    const toggleNumberList = () => {
        setModalNumberList(!modalNumberList);
        setSelectRadioNumber(0);
    };
    const [selectRadioNumber, setSelectRadioNumber] = useState(0);
    const [selectYourNumber, setSelectYourNumber] = useState(true);
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const [buyNumberList, setBuyNumberList] = useState([]);
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setModalBuyTwilioNo(!modalBuyTwilioNo);
        setDataBuyTwilioNo({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
    };
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const [modalImageAi, setModalImageAi] = useState(false);
    const toggleImageAi = useCallback(() => setModalImageAi(!modalImageAi),[modalImageAi]);
    function clickSelectItemCallSmsCampaign(){
        $('#FileManager_sms_sms #files-list li div.thumb-image img').unbind("click").click(function() {
            let sd=$(".drivebox.active").attr("id");
            let itempath = "";
            if(sd==="easdrive") {
                itempath = $(this).attr("item-path");
            } else if(sd==="googledrive") {
                let itemfileid=$(this).attr("item-fileid");
                downloadFileGD(itemfileid).then(res => {
                    if (res.status === 200) {
                        itempath = res.result.imagePath;
                    } else {
                        $("#downloadImageError").trigger("click");
                    }
                })
            } else if(sd==="dropbox") {
                let itemfilepath=$(this).attr("item-filepath");
                let itemname=$(this).attr("item-name");
                downloadFileDB(itemfilepath,itemname).then(res => {
                    if (res.status === 200) {
                        itempath = res.result.downloadPath;
                    } else {
                        $("#downloadImageError").trigger("click");
                    }
                })
            } else if(sd==="onedrive") {
                let itemid=$(this).attr("item-id");
                let itemname=$(this).attr("item-name");
                downloadFileOD(itemid,itemname).then(res => {
                    if (res.status === 200) {
                        itempath = res.result.downloadPath;
                    } else {
                        $("#downloadImageError").trigger("click");
                    }
                })
            }
            setSms((prev)=>([
                ...prev,
                {"rowDisplayOrder":rowDisplayOrder, "smsType":"image", "smsDetail":itempath, "imageUrl":itempath}
            ]));
            setRowDisplayOrder(rowDisplayOrder+1);
            $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        });
        $(".pixie-edit").unbind("click").click(function() {
            path = $(this).attr('item-url');
            filename = $(this).attr('item-file-name');
            filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
            imagePath = path.split("/images/").pop().replace(path.split("/").pop(),"");
            $("#clickLoader").val(true);
            $("#clickLoader").trigger("click");
            launchPixieEditor();
        });
    }
    window.clickSelectItemCallSmsCampaign=clickSelectItemCallSmsCampaign;
    useEffect(() => {
        require('../shared/fileManager/js/filemanager.js');
        require('../shared/editor/css/eas_js.css');
        require('../shared/editor/css/styles.min.css');
        require('../shared/fileManager/css/filemanager.css');
        getSurveyAllList().then(res => {
            if (res.status === 200) {
                if(res.result.surveyList){
                    let l = [];
                    res.result.surveyList.map((v)=>(
                        l.push({name:v.sryName,url:v.sryUrl})
                    ))
                    setSurveyLinkList(l);
                }
            }
        });
        getAssessmentAllList().then(res => {
            if (res.status === 200) {
                if(res.result.assessmentList){
                    let l = [];
                    res.result.assessmentList.map((v)=>(
                        l.push({name:v.assName,url:v.assUrl})
                    ))
                    setAssessmentLinkList(l);
                }
            }
        });
        getCustomFormLinkList().then(res => {
            if (res.status === 200) {
                if(res.result.customFormList){
                    let l = [];
                    res.result.customFormList.map((v)=>(
                        l.push({name:v.cfFormName,url:v.customFormUrl})
                    ))
                    setCustomFormLinkList(l);
                }
            }
        });
        getScmNumberPhoneSid().then(res => {
            if (res.status === 200) {
                if(res.result.scmNumberPhoneSid){
                    setData((prev)=>{return {...prev,scmNumberPhoneSid:res.result.scmNumberPhoneSid}});
                }
            }
        });
        getCountry().then(res => {
            if (res.result.country) {
                let country = [];
                res.result.country.map(x => (
                    country.push({
                        "key": x.iso2,
                        "value": x.cntName,
                        "id": x.id,
                        "cntCode": x.cntCode
                    })
                ));
                setCountryBuyTwilioNo(country);
            }
        })
    }, []);
    useEffect(()=>{
        let temp = 0;
        sms.forEach((element)=>{
            if(element.smsType === "text") {
                temp += (Math.ceil(element.smsDetail.length/160)*initSmsCost);
            } else {
                temp += (1*initSmsCost);
            }
        });
        setTotalSms(temp);
    }, [sms,initSmsCost]);
    useEffect(()=>{
        if(typeof data.groupList !== "undefined" && data.groupList > 0){
            getGroupUDF(data.groupList).then(
                res=>{
                    let temp = [];
                    if(res.result.udfs){
                        res.result.udfs.forEach((e)=>{
                            temp.push({value: e.udf, key: "##"+e.udf+"##"});
                        })
                    }
                    setUdfFields(temp);
                }
            );
        }
    }, [data.groupList]);
    useEffect(()=>{
        let index_start = 0;
        let index_stop = 0;
        $(".msgSortable").sortable({
            helper: "clone",
    		placeholder: "ui-state-highlight",
            revert: true,
            forceHelperSize: true,
    		forcePlaceholderSize: true,
            cursor: 'move',
            start: (event, ui)=>{
                index_start = ui.item.index();
            },
            update: (event, ui)=>{
                index_stop = ui.item.index();
                let e = document.getElementsByClassName("msgSortableItem");
                let picked = e[index_start];
                let swap = e[index_stop];
                setSms((prev)=>{
                    let temp = prev;
                    if(index_start > index_stop){
                        temp.splice(index_stop, 0, prev[index_start]);
                        temp.splice(temp.lastIndexOf(prev[index_start]) + 1, 1);
                        $(picked).after(swap);
                    }
                    else{
                        temp.splice(index_stop + 1, 0, prev[index_start]);
                        temp.splice(temp.indexOf(prev[index_start]), 1);
                        $(picked).before(swap);
                    }
                    temp = temp.map((v,i)=>{
                        return {
                            ...v,
                            rowDisplayOrder:i+1
                        } 
                    });
                    return [...temp];
                });
            }
        });
    });
    const handleTotalCount = useCallback((flagType, id) => {
        let requestData =`flagType=${flagType}&id=${id}`;
        getGroupSmsTotalCount(requestData).then(res => {
            if (res.status === 200) {
                setData((prev)=>{return {...prev, totalMember:parseInt(res.result.totalMember)}});
            }
        });
    },[]);
    const fetchData = async() => {
        let tempGroups = [];
        await getGroupListWithCheckDuplicate().then(
            res => {
                if (res.result.group) {
                    res.result.group.forEach((element) => {
                        tempGroups.push({
                            gId: element.groupId,
                            name: element.groupName,
                            totalMember:element.totalMember,
                            lockGroup: element.lockGroup,
                            segmentYN: element.segmentYN
                        });
                    });
                    setGroups(tempGroups);
                }
            }
        );
        const sid = typeof id !== "undefined" ? id : 0;
        if(sid > 0){
            let timeZone = (typeof props.user.timeZone === "undefined" || props.user.timeZone === "" || props.user.timeZone === null) ? getClientTimeZone() : props.user.timeZone;
            let requestData = `smsId=${sid}&timeZone=${timeZone}`;
            await getSmsCampaign(requestData).then(res => {
                if (res.result) {
                    setData((prev)=>{ return {...prev, ...res.result.smsCampaign}});
                    if(Number(res.result.smsCampaign.groupList) > 0){
                        let tm = handleTotalCount("group",Number(res.result.smsCampaign.groupList));
                        tempGroups.map((v)=>(
                            v.gId === Number(res.result.smsCampaign.groupList) ?
                                setData((prev)=>{ 
                                    prev.totalMember=tm;
                                    prev.groupName=v.name;
                                    return {...prev};
                                })
                            : ""
                        ))
                    }
                    if(Number(res.result.smsCampaign.segId) > 0){
                        let tm = handleTotalCount("groupSegment",Number(res.result.smsCampaign.segId));
                        tempGroups.map((v)=>(
                            v.gId === Number(res.result.smsCampaign.groupList) ?
                                getSegmentList(Number(res.result.smsCampaign.groupList)).then(res1 => {
                                    if (res1.status === 200) {
                                        setData((prev)=>{ 
                                            prev.totalMember=tm;
                                            prev.segmentName=res1.result.filter((x)=> { return x.segId === res.result.smsCampaign.segId} )[0].segName;
                                            return {...prev};
                                        })
                                        let index = tempGroups.findIndex(x => x.gId === Number(res.result.smsCampaign.groupList));
                                        tempGroups[index].segment=res1.result
                                        setGroups(tempGroups);
                                    }
                                })
                            : ""
                        ))
                    }
                    if(typeof res.result.smsDetails !== "undefined" && res.result.smsDetails.length > 0){
                        let t = [];
                        setRowDisplayOrder(res.result.smsDetails.length+1);
                        res.result.smsDetails.map((v)=>(
                            v.sdType === "text" ?
                                t.push({
                                    "rowDisplayOrder":v.sdDisplayOrder,
                                    "smsType":v.sdType,
                                    "smsDetail":v.sdDetail
                                })
                            :
                                t.push({
                                    "rowDisplayOrder":v.sdDisplayOrder,
                                    "smsType":v.sdType,
                                    "smsDetail":v.sdDetail,
                                    "imageUrl":v.sdType === "video" ? ((matchYoutubeUrl(v.sdDetail)!==false) ? matchYoutubeUrl(v.sdDetail,true) : (matchVimeoUrl(v.sdDetail)!==false) ? matchVimeoUrl(v.sdDetail,true) : null) : v.sdDetail
                                })
                        ))
                        setSms(t);
                    }
                }
            })
        }
    }
    useEffect(()=>{
        fetchData();
    },[id]);
    const handleVideoUrl = (name, value)=>{
        if(name === "videoLink")
            setVideoUrl(value);
    }
    const addTextSms = ()=>{
        setSms((prev)=>([
            ...prev,
            {"rowDisplayOrder":rowDisplayOrder, "smsType":"text", "smsDetail":""}
        ]));
        setRowDisplayOrder(rowDisplayOrder+1);
    }
    const handleChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const handleSmsOptionChange = (event) => {
        let { name, value } = event.target;
        handleChange(name, Number(value));
        if (data.scheduleType === 1) {
            setData((prev) => {
                return {
                    ...prev,
                    sendOnDate: dateTimeFormatDB(new Date())
                }
            });
        }
        else if (data.scheduleType === 2) {
            setData((prev) => {
                return {
                    ...prev,
                    sendOnDate: dateTimeFormatDB(new Date())
                }
            });
        }
    };
    const handleNext = () => {
        if (activeStep === 0) {
            if (data.smsName === "") {
                props.globalAlert({
                    type: "Error",
                    text: "Name of SMS can not be blank",
                    open: true
                });
                return false;
            }
        }
        if (activeStep === 1) {
            if (data.groupList === 0 && data.segId === 0) {
                props.globalAlert({
                    type: "Error",
                    text: "Please Select Group/Segment",
                    open: true
                });
                return false;
            }
            if(data.totalMember === 0) {
                props.globalAlert({
                    type: "Error",
                    text: "Selected Group/Segment has no member.",
                    open: true
                });
                return false;
            }
        }
        if (activeStep === 3) {
            if (data.scheduleType === 0) {
                props.globalAlert({
                    type: "Error",
                    text: "Please select scheduler option",
                    open: true
                });
                return false;
            }
        }
        setActiveStep((prevstep) => (prevstep + 1));
    }
    const handleNextThird = () => {
        if(sms.length === 0){
            props.globalAlert({
                type: "Error",
                text: "Please add at least one message",
                open: true
            });
            return false;
        }
        let flag = true;
        sms.forEach((e)=>{
            if(e.smsDetail.length > 0){
                flag = false;
            }
        })
        if(flag){
            props.globalAlert({
                type: "Error",
                text: "Please write something inside at least one message",
                open: true
            });
            return false;
        }
        if(data.chkOptOut === 1 && data.optOutMsg === ""){
            props.globalAlert({
                type: "Error",
                text: "Please write something inside Opt-out message",
                open: true
            });
            return false;
        }
        getNumberCheck(data.groupList).then(res => {
            if (res.status === 200) {
                if(res.result.flag === "1"){
                    handleNext();
                } else if(res.result.flag === "previousnumber"){
                    if(props.user.conversationsTwilioNumber !== "" && props.user.conversationsTwilioNumber !== null) {
                        getFreeNumberList().then((res1)=>{
                            let n = "";
                            if(res1.status === 200) {
                                if(res1.result.phoneNumberList.length !== 0){
                                    n = res1.result.phoneNumberList[0].scmNumber;
                                } else {
                                    n = props.user.twilioNumber;
                                }
                            }
                            if (n === props.user.conversationsTwilioNumber) {
                                props.confirmDialog({
                                    open: true,
                                    title: `This number is being used in SMS chat, are you sure you want to use this number in current SMS Campaign? SMS chat will be closed.`,
                                    onConfirm: () => {
                                        setData((prev) => {
                                            return {...prev, scmNumberPhoneSid: res.result.flag, isFlagged: true}
                                        });
                                        handleNext();
                                    }
                                })
                            } else {
                                setData((prev)=>{return {...prev,scmNumberPhoneSid:res.result.flag}});
                                handleNext();
                            }
                        })
                    } else {
                        setData((prev)=>{return {...prev,scmNumberPhoneSid:res.result.flag}});
                        handleNext();
                    }
                } else {
                    if(res.result.flag === "2"){
                        setSelectYourNumber(false);
                    } else {
                        setBuyNumberList(res.result.phoneNumberList);
                    }
                    toggleNumberList();
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
    const handleBack = () => {
        setActiveStep((prevstep) => (prevstep - 1));
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const handleClickSave = () => {
        $("button.saveForLater").hide();
        $("button.saveForLater").after('<div class="lds-ellipsis mr-3 ml-0"><div></div><div></div><div></div>');
        let requestData = {
            ...data,
            "memberId":props.user.memberId,
            "subMemberId":props.subUser.memberId,
            "smsId":typeof id !== "undefined" ? Number(id) : 0,
            "sendSaveValue":1,
            "smsCampaignDetails":[...sms],
            "timeZone" : (typeof props.user.timeZone === "undefined" || props.user.timeZone === "" || props.user.timeZone === null) ? getClientTimeZone() : props.user.timeZone
        }
        saveSmsCampaign(requestData).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/managesmscampaign");
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.saveForLater").show();
        })
    }
    const handleClickSendPreviewSms = () => {
        let flag = true;
        sms.forEach((e)=>{
            if(e.smsDetail.length > 0){
                flag = false;
            }
        })
        if(flag){
            props.globalAlert({
                type: "Error",
                text: "Please write something inside at least one message",
                open: true
            });
            return false;
        }
        let requestData = [];
        sms.forEach((e)=>{
            requestData.push({...e,"chkOptOut":data.chkOptOut,"optOutMsg":data.optOutMsg})
        });
        $("button.sendPreviewSms").hide();
        $("button.sendPreviewSms").after('<div class="lds-ellipsis mr-3 ml-0"><div></div><div></div><div></div>');
        sendSmsPreview(requestData).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.sendPreviewSms").show();
        });
    }
    const handleClickSend = () => {
        if(data.scmNumberPhoneSid === ""){
            toggleBuyTwilioNo();
        } else {
            handleSendSmsCampaign(0);
        }
    }
    const handleSendSmsCampaign = (scmId) => {
        let requestData = {
            ...data,
            "scmId":scmId,
            "memberId":props.user.memberId,
            "subMemberId":props.subUser.memberId,
            "smsId":typeof id !== "undefined" ? Number(id) : 0,
            "sendSaveValue":2,
            "smsCampaignDetails":[...sms],
            "isClosedConversations":data.isFlagged === true ? "Y" : "N",
            "timeZone" : (typeof props.user.timeZone === "undefined" || props.user.timeZone === "" || props.user.timeZone === null) ? getClientTimeZone() : props.user.timeZone
        }
        $("button.send").hide();
        $("button.send").after('<div class="lds-ellipsis mr-3 ml-0"><div></div><div></div><div></div>');
        sendSmsCampaign(requestData).then(res => {
            if (res.status === 200) {
                if(res.result.conversationsTwilioNumber === "Y"){
                    if(props.subUser.memberId > 0) {
                        sessionStorage.setItem('subUser',JSON.stringify({...props.subUser, "conversationsTwilioNumber": null}));
                        props.setSubUserAction({...props.subUser, "conversationsTwilioNumber": null});
                    } else {
                        sessionStorage.setItem('user',JSON.stringify({...props.user, "conversationsTwilioNumber": null}));
                        props.userLoggedIn({...props.user, "conversationsTwilioNumber": null});
                    }
                }
                if(res.result.location === "paymentProfile"){
                    props.pendingTransaction([{
                        "memberId":props.user.memberId,
                        "subMemberId":props.subUser.memberId,
                        "smsId":res.result.smsId,
                        "emailIds": res.result.emailIds,
                        "rate": res.result.rate,
                        "amt": res.result.amt,
                        "numberOfSms": res.result.numberOfSms,
                        "cid": res.result.cid,
                        "msg":res.message,
                        "pendingTransactionType": "sendSmsCampaign"
                    }]);
                    history.push("/carddetails");
                } else {
                    props.globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    history.push("/managesmscampaign");
                }
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.send").show();
        });
    }
    const handleChangeSelectBuyNumber = (value) => {
        setSelectRadioNumber(value);
        if(value === 1){
            handleClickSave();
        } else if(value === 3){
            setData((prev)=>{return {...prev,scmNumberPhoneSid:""}});
            toggleNumberList();
            handleNext();
        }
    }
    const handleChangeSelectNumberList = (scmNumberPhoneSid, scmNumber) => {
        if(scmNumber === props.user.conversationsTwilioNumber) {
            props.confirmDialog({
                open: true,
                title: `This number is being used in SMS chat, are you sure you want to use this number in current SMS Campaign? SMS chat will be closed.`,
                onConfirm: () => {
                    setData((prev)=>{return {...prev,scmNumberPhoneSid:scmNumberPhoneSid, isFlagged: true}});
                    toggleNumberList();
                    handleNext();
                }
            })
        } else {
            setData((prev)=>{return {...prev,scmNumberPhoneSid:scmNumberPhoneSid, isFlagged: false}});
            toggleNumberList();
            handleNext();
        }
    }
    const handleChangeBuyTwilioNo = (name, value) => {
        setDataBuyTwilioNo(prev => ({ ...prev, [name]: value }));
        if(name === "checkForwardingYesNo" && value === "yes"){
            handleChangeBuyTwilioNo("callForwardingNumber",props.user.cell);
            let tempIso2 = countryBuyTwilioNo.filter((x)=>{ return x.id === parseInt(props.user.country) })[0].key;
            handleChangeBuyTwilioNo("callForwardingCountryCode", tempIso2);
        } else if(name === "checkForwardingYesNo" && value === "no") {
            handleChangeBuyTwilioNo("callForwardingNumber", "");
            handleChangeBuyTwilioNo("callForwardingCountryCode", "");
        }
    }
    const searchBuyTwilioNo = () => {
        let d = {
            "areaCode":dataBuyTwilioNo.areaCode ? dataBuyTwilioNo.areaCode : 0,
            "countryCode":dataBuyTwilioNo.countryCode ? dataBuyTwilioNo.countryCode : "US"
        }
        $("button.searchTwillioNo").hide();
        $("button.searchTwillioNo").after('<div class="lds-ellipsis mt-3"><div></div><div></div><div></div>');
        searchForBuyNumber(d).then(res => {
            if (res.status === 200) {
                if(res.result.searchNumber.length > 0){
                    setDataSearchTwilioNo(res.result.searchNumber);
                    setMsgSearchTwilioNo("");
                } else {
                    setMsgSearchTwilioNo("Phone number not found for this area code");
                }
            } else {
                setMsgSearchTwilioNo("OOPS!! there is some problem arise. Please try again.");
            }
            $(".lds-ellipsis").remove();
            $("button.searchTwillioNo").show();
        });
    }
    const saveBuyTwilioNo = () => {
        let isValid = true;
        if(typeof dataBuyTwilioNo.twilioNumber === "undefined" || dataBuyTwilioNo.twilioNumber === ""){
            props.globalAlert({
                type: "Error",
                text: "Please select number.",
                open: true
            });
            isValid = false
        }
        if(dataBuyTwilioNo.checkForwardingYesNo === "yes" &&  (typeof dataBuyTwilioNo.callForwardingNumber === "undefined" || dataBuyTwilioNo.callForwardingNumber === "" || dataBuyTwilioNo.callForwardingNumber === null)){
            props.globalAlert({
                type: "Error",
                text: "Please enter forward number.",
                open: true
            });
            isValid = false
        }
        if (!isValid) {
            return
        }
        props.confirmDialog({
            open: true,
            title: `Are you sure, you want to buy this ${dataBuyTwilioNo.twilioNumber} number?`,
            onConfirm: () => { confirmSaveBuyTwilioNo() }
        })
    }
    const confirmSaveBuyTwilioNo = () => {
        props.setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "memberId":props.user.memberId,
            "subMemberId":props.subUser.memberId,
            "fullName":`${props.user.firstName} ${props.user.lastName}`,
            "subFullName":`${props.subUser.firstName} ${props.subUser.lastName}`,
            "twilioNumber":dataBuyTwilioNo.twilioNumber,
            "flagType": "build",
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        $("button.saveBuyTwillioNo").hide();
        $("button.saveBuyTwillioNo").after('<div class="lds-ellipsis mr-2"><div></div><div></div><div></div>');  
        buyNumberForSmsCampaign(d).then(res => {
            if (res.status === 200) {
                setData((prev)=>{return {...prev, scmId:parseInt(res.result.scmId)}});
                toggleBuyTwilioNo();
                handleSendSmsCampaign(parseInt(res.result.scmId));
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            } 
            $(".lds-ellipsis").remove();
            $("button.saveBuyTwillioNo").show();
            props.setLoader({
                load: false
            });
        });
    }
    // const showWarningTinyURL = () => {
    //     handleChange("convertTinyUrlYN","N");
    //     props.globalAlert({
    //         type: "Warning",
    //         text: "Link reporting will not be available without a TinyURL.",
    //         open: true
    //     });
    // }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Row>
                        <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                            <p style={innerHeading}><strong>SMS Campaign Information</strong></p>
                            <FormGroup>
                                <InputField
                                    type="text"
                                    id="smsName"
                                    name="smsName"
                                    value={data?.smsName || ""}
                                    onChange={handleChange}
                                    label="Name of SMS"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                );
            case 1:
                return (
                    <SelectGroupSegment data={data} groups={groups} setGroups={setGroups} handleTotalCount={handleTotalCount} setData={setData} globalAlert={props.globalAlert} />
                );
            case 2:
                return (
                    <SmsDetails
                        assessmentLinkList={assessmentLinkList}
                        customFormLinkList={customFormLinkList}
                        data={data}
                        initSmsCost={initSmsCost}
                        sms={sms}
                        surveyLinkList={surveyLinkList}
                        totalSms={totalSms}
                        udfFields={udfFields}
                        user={props.user}
                        videoModal={videoModal}
                        videoUrl={videoUrl}
                        addTextSms={addTextSms}
                        filemanager={filemanager}
                        handleChange={handleChange}
                        handleClickAddVideoLink={handleClickAddVideoLink}
                        handleVideoUrl={handleVideoUrl}
                        setSms={setSms}
                        toggleVideoModal={toggleVideoModal}
                                                        />
                );
            case 3:
                return (
                    <Scheduler data={data} handleSmsOptionChange={handleSmsOptionChange} setData={setData} />
                );
            case 4:
                return (
                    <Preview data={data} />
                );
            default:
                return 'Unknown step';
        }
    };
    const handleClickAddVideoLink = () => {
        if(videoUrl === ""){
            props.globalAlert({
                type: "Error",
                text: "Please enter video link.",
                open: true
            });
            return false;
        }
        let imagePath = "";
        if(matchYoutubeUrl(videoUrl)!==false) {
            imagePath=matchYoutubeUrl(videoUrl,true);
        } else if(matchVimeoUrl(videoUrl)!==false) {
            imagePath=matchVimeoUrl(videoUrl,true);
        }
        if(imagePath!=="") {
            setSms((prev)=>([
                ...prev,
                {"rowDisplayOrder":rowDisplayOrder, "smsType":"video", "smsDetail":videoUrl, "imageUrl":imagePath}
            ]));
            setRowDisplayOrder(rowDisplayOrder+1);
            toggleVideoModal();
        } else {
            props.globalAlert({
                type: "Error",
                text: "Please enter proper video link.",
                open: true
            });
            return false;
        }
    }
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="overflow-hidden">
                    <div className="w-100">
                        <Stepper style={{ width: "50%", margin: "0 auto"}} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            {activeStep === steps.length ? (
                                <div>
                                    <Typography>
                                        All steps completed - you&apos;re finished
                                    </Typography>
                                    <Button onClick={handleReset} className="mr-3">
                                        RESET
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    {getStepContent(activeStep)}
                                    <input type="hidden" name="all_temp_data" id="all_temp_data" />
                                    <div className="mt-5 mb-5 text-center">
                                        {
                                            (() => {
                                                if (activeStep === steps.length - 1) {
                                                    return (<>
                                                        <Button variant="contained" color="primary" onClick={handleBack} className="mr-3">
                                                            <i className="far fa-long-arrow-left mr-2"></i>BACK
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={()=>{handleClickSave()}} className="mr-3 saveForLater">
                                                            <i className="far fa-save mr-2"></i>SAVE
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={()=>{handleClickSend()}} className="mr-3 send">
                                                            <i className="far fa-paper-plane mr-2"></i>SEND
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={()=>{history.push("/managesmscampaign")}} className="mr-3">
                                                            <i className="far fa-times mr-2"></i>CANCEL
                                                        </Button>
                                                    </>);
                                                }
                                                else if (activeStep === 2) {
                                                    return (<>
                                                        <Button variant="contained" color="primary" disabled={activeStep === 0} onClick={handleBack} className="mr-3">
                                                            <i className="far fa-long-arrow-left mr-2"></i>BACK
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={()=>{handleClickSendPreviewSms()}} className="mr-3 sendPreviewSms">
                                                            <i className="far fa-comment-alt-lines mr-2"></i>SEND PREVIEW SMS
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={()=>{handleClickSave()}} className="mr-3 saveForLater">
                                                            <i className="far fa-save mr-2"></i>SAVE FOR LATER
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={handleNextThird} className="mr-3">
                                                            <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                                        </Button>
                                                    </>);
                                                }
                                                else if (activeStep === 0) {
                                                    return (
                                                        <>
                                                            <Button variant="contained" color="primary" onClick={()=>{history.push("/managesmscampaign")}} className="mr-3">
                                                                <i className="far fa-times mr-2"></i>CANCEL
                                                            </Button>
                                                            <Button variant="contained" color="primary" onClick={handleNext} className="mr-3">
                                                                <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                                            </Button>
                                                        </>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <>
                                                            <Button variant="contained" color="primary" disabled={activeStep === 0} onClick={handleBack} className="mr-3">
                                                                <i className="far fa-long-arrow-left mr-2"></i>BACK
                                                            </Button>
                                                            <Button variant="contained" color="primary" onClick={handleNext} className="mr-3">
                                                                <i className="far fa-long-arrow-right mr-2"></i>NEXT
                                                            </Button>
                                                        </>
                                                    );
                                                }
                                            })()
                                        }
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalNumberList} toggle={toggleNumberList}>
                <ModalHeader toggle={toggleNumberList}>Number List</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={11} className="mx-auto">
                            <p>You one of contact(s) used in one of open SMS campaign.</p>
                            <p>You can choose one of the following action to proceed.</p>
                            <RadioGroup row aria-label="selectRadioNumber" id="selectRadioNumber" name="selectRadioNumber" value={selectRadioNumber} onChange={(event) => {handleChangeSelectBuyNumber(Number(event.target.value))}}>
                                <FormControlLabel value={1} control={<Radio color="primary" />} label="Close old SMS campaign" />
                                {(selectYourNumber === true && buyNumberList.length > 0) && <FormControlLabel value={2} control={<Radio color="primary"/>} label="Other used number"/>}
                                <FormControlLabel value={3} control={<Radio color="primary" />} label="New number" />
                            </RadioGroup>
                            {
                                selectRadioNumber === 2 ?
                                    <>
                                        <hr/>
                                        <RadioGroup row aria-label="numberList" name="numberList" >
                                            {
                                                buyNumberList.map((v,i)=>(
                                                    <FormControlLabel key={i} className="mb-0 w-25 mr-0 pr-3" value={v.scmNumberPhoneSid} control={<Radio color="primary" onChange={()=>{handleChangeSelectNumberList(v.scmNumberPhoneSid, v.scmNumber)}}/>} label={v.scmNumber}/>
                                                ))
                                            }
                                        </RadioGroup>
                                    </>
                                : null
                            }
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={toggleNumberList}>CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal size="lg" isOpen={modalBuyTwilioNo} toggle={toggleBuyTwilioNo}>
                <ModalHeader toggle={toggleBuyTwilioNo}>SMS/MMS Number Setup</ModalHeader>
                <ModalBody>
                    <h6>Hello {props.user.firstName},</h6>
                    <p>It looks like this is the first time you will be sending SMS/MMS message from {websiteTitle}. Let set your account up for this. In order to send SMS/MMS message you will first need to select a phone number to use to send SMS/MMS from. This phone number can be released in the My Profile section of our Application.</p>
                    <p>There is a {props.countrySetting.cntyPriceSymbol+Number(props.countrySetting.cntySMSNumberPerPrice).toFixed(2)} per month cost for this phone number regardless if you send SMS/MMS. </p>
                    <p>You can search for phone number by country and certain area code (NPA) or exchange (NXX).</p>
                    <div className="borderBottomContactBox"></div>
                    <Row>
                        <Col xs={1}></Col>
                        <Col xs={4}>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefsBuyTwilioNo.current[0]}
                                    name="countryCode"
                                    label="Select Country"
                                    onChange={handleChangeBuyTwilioNo}
                                    value={dataBuyTwilioNo?.countryCode || "US"}
                                    dropdownList={countryBuyTwilioNo}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={4}>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsBuyTwilioNo.current[0]}
                                    type="text"
                                    id="areaCode"
                                    name="areaCode"
                                    label="Please Enter Your Area Code"
                                    onChange={handleChangeBuyTwilioNo}
                                    value={dataBuyTwilioNo?.areaCode || ""}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={3}><Button variant="contained" color="primary" className="mt-3 searchTwillioNo" onClick={()=>{searchBuyTwilioNo()}} >SEARCH</Button></Col>
                    </Row>
                    <div className="borderBottomContactBox"></div>
                    {
                        dataSearchTwilioNo.length > 0 && msgSearchTwilioNo === "" ?
                            <Row>
                                <RadioGroup className="w-100" row aria-label="twilioNumber" name="twilioNumber" value={dataBuyTwilioNo?.twilioNumber || ""} onChange={(e)=>{handleChangeBuyTwilioNo(e.target.name,e.target.value)}}>
                                    {
                                        dataSearchTwilioNo.map((value,index)=>(
                                            <Col xs={3} key={index}>
                                                <FormControlLabel className="mb-0" value={value.phoneNumber} control={<Radio color="primary" />} label={displayFormatNumber(value.friendlyName,value.countryCode)} />
                                            </Col>
                                        ))
                                    }
                                </RadioGroup>
                                <Col xs={12} className="border-bottom mt-2 mb-3"></Col>
                                <Col xs={12}>
                                    <FormControlLabel control={<Checkbox color="primary" checked={dataBuyTwilioNo.checkForwardingYesNo === "yes"} onChange={(e)=>{handleChangeBuyTwilioNo("checkForwardingYesNo",e.target.checked ? "yes" : "no")}} />} label="Do you want to forward call to this number?" />
                                </Col>
                                {
                                    dataBuyTwilioNo.checkForwardingYesNo === "yes" &&
                                    <>
                                        <Col sx={6}>
                                            <FormGroup className='mb-4'>
                                                <DropDownControls
                                                    ref={dropDownRefsBuyTwilioNo.current[1]}
                                                    name="callForwardingCountryCode"
                                                    label="Select Country"
                                                    onChange={handleChangeBuyTwilioNo}
                                                    value={dataBuyTwilioNo?.callForwardingCountryCode || "US"}
                                                    dropdownList={countryBuyTwilioNo}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sx={6}>
                                            <FormGroup className='mb-4'>
                                                <InputField
                                                    ref={inputRefsBuyTwilioNo.current[1]}
                                                    type="text"
                                                    id="callForwardingNumber"
                                                    name="callForwardingNumber"
                                                    label="Please Enter Your Number"
                                                    onChange={handleChangeBuyTwilioNo}
                                                    value={dataBuyTwilioNo?.callForwardingNumber || ""}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </>
                                }
                            </Row>
                        :
                            <Row>
                                <Col xs={12} className="text-center">{msgSearchTwilioNo}</Col>
                            </Row>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-2 saveBuyTwillioNo" onClick={()=>{saveBuyTwilioNo()}} >SAVE</Button>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleBuyTwilioNo()}} >CANCEL</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickError" data-type="" value="" onClick={()=>{
                props.globalAlert({
                    type: (typeof $("#clickError").attr("data-type") !== "undefined" || $("#clickError").attr("data-type") !== "") ? $("#clickError").attr("data-type") : "Error",
                    text: $("#clickError").val(),
                    open: true
                });
            }}/>
            <input type="hidden" id="clickLoader" value="" onClick={()=>{
                props.setLoader({
                    load: ($("#clickLoader").val() === "true"),
                    text: "Please wait !!!"
                });
            }}/>
            <ZoomModal />
            <ModalImageAi modalImageAi={modalImageAi} toggleImageAi={toggleImageAi} />
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser : state.subUser,
        countrySetting : state.countrySetting
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
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        setSubUserAction: (data) => {
            dispatch(setSubUserAction(data))
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BuildSmsCampaign);
