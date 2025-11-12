import React, {createRef, useCallback, useEffect, useRef, useState} from "react"
import { connect } from "react-redux"
import { format } from "date-fns"
import {Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap"
import {Button, TextField, Autocomplete, RadioGroup, FormControlLabel, Radio, FormControl, Checkbox, Link} from "@mui/material";
import DropDownControls from "../shared/commonControlls/dropdownControl"
import InputField from "../shared/commonControlls/inputField"
import ConversationBox from "./conversationBox"
import {buyNumber, checkDefaultConversationsNumber, checkInboxForConversation, closedConversations, currentConversationsDetailList, getConversationsClosedList, getConversationsContactList, getConversationsList, getSMSCampaignDetailList, getSMSCampaignList, getSMSCampaignPhoneNumberList, sendConversations, setConversationNumber} from "../../services/smsInboxServices"
import {getConversations, getSmsTemplateDetails, getSmsTemplateSelect, searchForBuyNumber} from "../../services/clientContactService"
import $ from "jquery"
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {userLoggedIn} from "../../actions/userActions";
import {getCountry} from "../../services/commonService";
import {displayFormatNumber, getClientTimeZone} from "../../assets/commonFunctions";
import {closeSmsCampaign, getFreeNumberList, getSmsCampaignNumber} from "../../services/smsCampaignService";
import { setLoader } from "../../actions/loaderActions";
import { websiteTitle } from "../../config/api";
import { setSubUserAction } from "../../actions/subUserActions";

const SMSInbox = ({ replyCount, setReplyCount, user, subUser, globalAlert, confirmDialog, userLoggedIn, setSubUserAction , setLoader }) => {
    const [typeSelected, setTypeSelected] = useState(0)
    const [smsContactSelected, setSmsContactSelected] = useState(null)
    const [campaignSelected, setCampaignSelected] = useState(null)
    const [smsCampaignList, setSmsCampaignList] = useState([])
    const [currentSmsData, setCurrentSmsData] = useState([])
    const [conversationType, setConversationType] = useState(null)
    const [conversations, setConversations] = useState([])
    const [mainConversations, setMainConversations] = useState([])
    const [conversationSelected, setConversationSelected] = useState(null)
    const [templateSelected, setTemplateSelected] = useState(null)
    const [smsContent, setSmsContent] = useState("")
    const [smsCampaignPhoneNumberList, setSmsCampaignPhoneNumberList] = useState([])
    const [contactList, setContactList] = useState([])
    const [contactSelected, setContactSelected] = useState(null)
    const [templateList, setTemplateList] = useState([])
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const [availableConversationNumber, setAvailableConversationNumber] = useState([]);
    const [conversationNumber, setConversationNumber1] = useState("");
    const [currentCampaignSmsStaus, setCurrentCampaignSmsStaus] = useState(false);
    const [currentCampaignId, setCurrentCampaignId] = useState(0);
    const toggleBuyTwilioNo = () => {
        setDataBuyTwilioNo({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
        getFreeNumberList().then((res)=>{
            if(res.status === 200) {
                setAvailableConversationNumber(prev=>{
                    prev = res.result.phoneNumberList;
                    return [...prev];
                })
            }
            setModalBuyTwilioNo(!modalBuyTwilioNo);
        })
    };
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const [defaultYN, setDefaultYN] = useState("Y");
    const [selectFunctionalityType, setSelectFunctionalityType] = useState("");

    const handleSmsContactSelected = (phoneNumber) => {
        setSmsContactSelected(phoneNumber)
        setCampaignSelected(null)
        setCurrentSmsData([]);
        getSMSCampaignList(phoneNumber).then(res => {
            if (res?.status === 200) {
                setSmsCampaignList(res?.result?.smsCampaignList)
            }
        })
    }

    const fetchContactListOnSearch = (searchText) => {
        if (searchText.length > 0) {
            getConversationsContactList(searchText).then((res) => {
                if (res.status === 200) {
                    const contactList = res?.result?.contactList
                    setContactList(contactList)
                }
            })
        } else {
            setContactList([]);
        }
    }

    const fetchCurrentConversationsDetailList = async (payload, index="") => {
        await currentConversationsDetailList(payload).then(res => {
            if (res?.status === 200) {
                const conversationsDetailList = res?.result?.conversationsDetailList
                const currentConversation = []
                conversationsDetailList?.forEach((item) => {
                    currentConversation.push({
                        ...item,
                        content: item?.cvsdMessage,
                        dateTime: item?.cvsdDate,
                        type: item?.chatColor === 'myChat' ? 'self' : 'other'
                    })
                })
                setCurrentSmsData(currentConversation);
                if(index !== ""){
                    setConversations((prev)=>{
                        prev[index].conversationsCount=0;
                        return [...prev];
                    })
                    setMainConversations((prev)=>{
                        prev[index].conversationsCount=0;
                        return [...prev];
                    })
                }
                setTimeout(()=>{
                    $("#conversation-main").animate({ scrollTop: $('#conversation-main')[0].scrollHeight}, 1000);
                },1000);
            } else {
                setCurrentSmsData([]);
            }
        })
    }

    const handleContactSelected = async () => {
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        const payload = {
            cvsdClientId: contactSelected?.emailId,
            cvsMemberNumber: contactSelected?.memberNumber,
            cvsdClientNumber: contactSelected?.clientNumber,
            checkConversationsRows: 0,
            timeZone: timeZone
        }
        await fetchCurrentConversationsDetailList(payload)
        setConversationSelected({
            cvsdClientId: contactSelected?.emailId,
            cvsMemberNumber: contactSelected?.memberNumber,
            cvsdClientNumber: contactSelected?.clientNumber,
            fullName: contactSelected?.value
        })
    }

    const handleConversationSelected = async (conversation, index="") => {
        setConversationSelected(conversation)
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        const payload = {
            cvsdClientId: conversation?.cvsdClientId,
            cvsMemberNumber: conversation?.cvsMemberNumber,
            cvsdClientNumber: conversation?.cvsdClientNumber,
            checkConversationsRows: 0,
            timeZone: timeZone
        }
        await fetchCurrentConversationsDetailList(payload,index)
    }

    const handleCampaignSelected = (campaign, campaignIndex) => {
        setCampaignSelected(campaignIndex);
        const { crEmailId, crSmsId, crReplyNo, smsCampaignStatus } = campaign
        setCurrentCampaignSmsStaus((smsCampaignStatus === "open"));
        const tempGetSmsCampaignDetailList = () => {
            setCurrentCampaignId(crSmsId);
            const apiParams = crReplyNo + "/" + crEmailId + "/" + crSmsId;
            getSMSCampaignDetailList(apiParams).then(res => {
                if (res?.status === 200) {
                    const { smsCampaignDetailList, campaignSmsReplyList, totalConversationsCount, totalSmsCampaignCount, totalSmsInboxCount } = res.result
                    let currentSmsData = []
                    smsCampaignDetailList?.forEach((sms) => {
                        currentSmsData.push({
                            ...sms,
                            displayAs: sms?.sdType,
                            content: sms?.sdDetail,
                            dateTime: sms?.sendDate,
                            type: "self"
                        })
                    })
                    setReplyCount(prev=>({...prev, totalConversationsCount, totalSmsCampaignCount, totalSmsInboxCount}));
                    getSMSCampaignPhoneNumberList().then(res1 => {
                        if (res1?.status === 200) {
                            setSmsCampaignPhoneNumberList(res1?.result?.phoneNumberList)
                        }
                    })
                    campaignSmsReplyList?.forEach((sms) => {
                        currentSmsData.push({
                            ...sms,
                            displayAs: "text",
                            content: sms?.crReply,
                            dateTime: sms?.crDate,
                            type: "other"
                        })
                    })
                    setCurrentSmsData(currentSmsData);
                    setTimeout(()=>{
                        $("#conversation-main").animate({ scrollTop: $('#conversation-main')[0].scrollHeight}, 1000);
                    },1000);
                }
            })
        }
        if(smsCampaignStatus === "open") {
            globalAlert({
                type: "Warning",
                text: "SMS chat is disabled while there is an Open SMS broadcast",
                open: true
            });
            tempGetSmsCampaignDetailList();
        } else {
            tempGetSmsCampaignDetailList();
        }

    }

    const handleConversation = (type, from="") => {
        setConversations(null);
        setMainConversations(null);
        setCurrentSmsData([]);
        setConversationType(type)
        if (type === "closed") {
            getConversationsClosedList().then(res => {
                if (res?.status === 200) {
                    setConversations(res?.result?.conversationsList)
                    setMainConversations(res?.result?.conversationsList)
                }
            })
        } else {
            getConversationsList().then(res => {
                if (res?.status === 200) {
                    if(from === "false"){
                        let s = smsCampaignPhoneNumberList.filter(x => x.phoneNumber === smsContactSelected);
                        setConversations([...res?.result?.conversationsList,{"cvsdClientId": s[0].emailId, "cvsdMessage": "", "cvsdClientNumber": `${s[0].cntCode}${s[0].phoneNumber}`, "cvsMemberNumber": `${user.countryCode}${user.cell !== null && user.cell !== "" ? user.cell: user.phone}`, "cvsdCvsId": 0, "firstName": s[0].firstName, "lastName": s[0].lastName, "conversationsCount": 0}]);
                        setMainConversations([...res?.result?.conversationsList,{"cvsdClientId": s[0].emailId, "cvsdMessage": "", "cvsdClientNumber": `${s[0].cntCode}${s[0].phoneNumber}`, "cvsMemberNumber": `${user.countryCode}${user.cell !== null && user.cell !== "" ? user.cell: user.phone}`, "cvsdCvsId": 0, "firstName": s[0].firstName, "lastName": s[0].lastName, "conversationsCount": 0}]);
                        handleConversationSelected({"cvsdClientId": s[0].emailId, "cvsdMessage": "", "cvsdClientNumber": `${s[0].cntCode}${s[0].phoneNumber}`, "cvsMemberNumber": `${user.countryCode}${user.cell !== null && user.cell !== "" ? user.cell: user.phone}`, "cvsdCvsId": 0, "firstName": s[0].firstName, "lastName": s[0].lastName, "conversationsCount": 0});
                    } else if(from === "true") {
                        let sp = smsCampaignPhoneNumberList.filter(x => x.phoneNumber === smsContactSelected);
                        let sc = res?.result?.conversationsList.filter(x => x.cvsdClientId === sp[0].emailId);
                        setConversations(res?.result?.conversationsList);
                        setMainConversations(res?.result?.conversationsList);
                        handleConversationSelected(...sc);
                    } else {
                        setConversations(res?.result?.conversationsList)
                        setMainConversations(res?.result?.conversationsList)
                    }
                }
            })
        }
    }

    const handleTypeSelected = (type) => {
        setTypeSelected(type)
        if (type === 0) {
            getSMSCampaignPhoneNumberList().then(res => {
                if (res?.status === 200) {
                    setSmsCampaignPhoneNumberList(res?.result?.phoneNumberList)
                }
            })
        }
    }

    useEffect(() => {
        handleTypeSelected(0)
        getSmsTemplateSelect().then(res => {
            if (res.status === 200) {
                let smsTemplateSelect = res?.result?.smsTemplateSelect
                let templateList = []
                smsTemplateSelect.forEach((template) => {
                    templateList.push({
                        ...template,
                        value: template?.sstName,
                        key: template?.sstId
                    })
                })
                setTemplateList(templateList)
            }
        })
        getCountry().then(res => {
            if (res.result.country) {
                let country = [];
                res.result.country.map(x => (
                    country.push({
                        "key": x.iso2,
                        "value": x.cntName,
                        "id": String(x.id),
                        "cntCode": x.cntCode
                    })
                ));
                setCountryBuyTwilioNo(country);
            }
        })
    }, []);
    const replCount = useRef(replyCount);
    const phoneNumberListPolling = useCallback(()=>{
            if(replCount.current.totalSmsInboxCount !== replyCount.totalSmsInboxCount && typeSelected === 0) {
                    replCount.current = replyCount;
            getSMSCampaignPhoneNumberList().then(res => {
                if (res?.status === 200) {
                    setSmsCampaignPhoneNumberList(res?.result?.phoneNumberList)
                }
            })
            if(smsCampaignList.length > 0 && campaignSelected !== null) {
                const { crEmailId, crSmsId, crReplyNo, smsCampaignStatus } = smsCampaignList[campaignSelected];
                setCurrentCampaignSmsStaus((smsCampaignStatus === "open"));
                setCurrentCampaignId(crSmsId);
                const apiParams = crReplyNo + "/" + crEmailId + "/" + crSmsId;
                getSMSCampaignDetailList(apiParams).then(res => {
                    if (res?.status === 200) {
                        const { smsCampaignDetailList, campaignSmsReplyList, totalConversationsCount, totalSmsCampaignCount, totalSmsInboxCount } = res.result
                        let currentSmsData = []
                        smsCampaignDetailList?.forEach((sms) => {
                            currentSmsData.push({
                                ...sms,
                                displayAs: sms?.sdType,
                                content: sms?.sdDetail,
                                dateTime: sms?.sendDate,
                                type: "self"
                            })
                        })
                        setReplyCount(prev=>({...prev, totalConversationsCount:totalConversationsCount, totalSmsCampaignCount:totalSmsCampaignCount, totalSmsInboxCount:totalSmsInboxCount}));
                        getSMSCampaignPhoneNumberList().then(res1 => {
                            if (res1?.status === 200) {
                                setSmsCampaignPhoneNumberList(res1?.result?.phoneNumberList)
                            }
                        })
                        campaignSmsReplyList?.forEach((sms) => {
                            currentSmsData.push({
                                ...sms,
                                displayAs: "text",
                                content: sms?.crReply,
                                dateTime: sms?.crDate,
                                type: "other"
                            })
                        })
                        setCurrentSmsData(currentSmsData);
                        setTimeout(()=>{
                            $("#conversation-main").animate({ scrollTop: $('#conversation-main')[0].scrollHeight}, 1000);
                        },1000);
                    }
                })
            }
                }
    }, [typeSelected, campaignSelected, setReplyCount, smsCampaignList, replyCount]);
    useEffect(()=>{
            phoneNumberListPolling();
    }, [phoneNumberListPolling, replyCount])

    useEffect(() => {
        if((!(conversationSelected && Object.keys(conversationSelected).length === 0 && Object.getPrototypeOf(conversationSelected) === Object.prototype)) && conversationSelected !== null) {
            let interval = setInterval(async () => {
                let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
                const payload = {
                    cvsdClientId: conversationSelected?.cvsdClientId,
                    cvsMemberNumber: conversationSelected?.cvsMemberNumber,
                    cvsdClientNumber: conversationSelected?.cvsdClientNumber,
                    checkConversationsRows: 0,
                    timeZone: timeZone
                }
                await fetchCurrentConversationsDetailList(payload)
            }, 60 * 1000);
            return () => {
                clearInterval(interval);
                interval = null;
            }
        }
    }, [conversationSelected, user.timeZone]);

    const resetAll = () => {
        setConversations([]);
        setMainConversations([]);
        setCurrentSmsData([]);
        setSmsContactSelected(null)
        setConversationType(null)
        setCampaignSelected(null)
        setConversationSelected(null)
        setSmsCampaignList([])
    }

    const handleTemplateSelect = (sstId) => {
        const emailId = conversationSelected?.cvsdClientId || 0;
        setTemplateSelected(sstId)
        getSmsTemplateDetails(sstId, emailId).then(res => {
            if (res?.status === 200) {
                setSmsContent(res?.result?.sstDetails)
            } else {
                setSmsContent("")
            }
        })
    }


    const handleCloseCoversation = () => {
        const payload = {
            cvsEmailId: conversationSelected?.cvsdClientId,
            cvsdClientNo: conversationSelected?.cvsdClientNumber,
            memberPhone: conversationSelected?.cvsMemberNumber,
            subMemberId: subUser.memberId
        }
        $(`button.closeConversation`).hide();
        $(`button.closeConversation`).after(`<div class="lds-ellipsis ml-2"><div></div><div></div><div></div>`);
        closedConversations(payload).then(res => {
            if (res.status === 200) {
                handleConversation("closed")
            }
            $(".lds-ellipsis").remove();
            $(`button.closeConversation`).show();
        })
    }

    const handleSendConversation = () => {
        if(typeof user.conversationsTwilioNumber === "undefined" || user.conversationsTwilioNumber === "" || user.conversationsTwilioNumber === null){
            checkDefaultConversationsNumber().then(res => {
                if (res.status === 200) {
                    if(res.result.defaultConversationsTwilioNumber === ""){
                        toggleBuyTwilioNo();
                    } else {
                        if(res.result.smsId === 0){
                            let requestData = {
                                "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber,
                                "conversationsSubAccountPhoneSId": res.result.defaultConversationsSubAccountPhoneSId,
                                "subMemberId": subUser.memberId,
                                "defaultYN": defaultYN
                            }
                            setConversationNumber(requestData).then(res2 => {
                                if (res2.status === 200) {
                                    if(subUser.memberId > 0) {
                                        sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber}));
                                        setSubUserAction({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                        subUser.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                    } else {
                                        sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                        userLoggedIn({...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                        user.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                    }
                                    handleSendConversation();
                                } else {
                                    globalAlert({
                                        type: "Error",
                                        text: "Something went wrong try again later",
                                        open: true
                                    });
                                }
                                setDefaultYN("Y");
                            })
                        } else {
                            confirmDialog({
                                open: true,
                                title: "Default Chat number has open SMS campaign.\nIf you start chat, it will close the SMS campaign.\n\nAre you sure you want to close SMS campaign?",
                                onConfirm: () => {
                                    let requestData = {
                                        "smsId": [res.result.smsId],
                                        "conversationsTwilioNumber":res.result.defaultConversationsTwilioNumber
                                    }
                                    closeSmsCampaign(requestData).then(res3=>{
                                        if(res3.status === 200) {
                                            let requestData2 = {
                                                "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber,
                                                "conversationsSubAccountPhoneSId": res.result.defaultConversationsSubAccountPhoneSId,
                                                "subMemberId": subUser.memberId,
                                                "defaultYN": defaultYN
                                            }
                                            setConversationNumber(requestData2).then(res4 => {
                                                if (res4.status === 200) {
                                                    if(subUser.memberId > 0) {
                                                        sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber}));
                                                        setSubUserAction({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                                        subUser.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                                    } else {
                                                        sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                                        userLoggedIn({...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                                        user.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                                    }
                                                    handleSendConversation();
                                                } else {
                                                    globalAlert({
                                                        type: "Error",
                                                        text: "Something went wrong try again later",
                                                        open: true
                                                    });
                                                }
                                                setDefaultYN("Y");
                                            })
                                        } else {
                                            globalAlert({
                                                type: "Error",
                                                text: res3.message,
                                                open: true
                                            });
                                        }
                                    });
                                }
                            })
                        }
                    }
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        } else {
            if(typeof smsContent === "undefined" || smsContent === "" || smsContent === null){
                globalAlert({
                    type: "Error",
                    text: `Please enter content`,
                    open: true
                });
                return false;
            }
            const payload = {
                cvsEmailId: conversationSelected?.cvsdClientId,
                sendMessage: smsContent,
                subMemberId: subUser.memberId
            }
            $(`button.sendConversation`).hide();
            $(`button.sendConversation`).after(`<div class="lds-ellipsis"><div></div><div></div><div></div>`);
            sendConversations(payload).then(res => {
                if (res.status === 200) {
                    setSmsContent("");
                    handleConversationSelected(conversationSelected);
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                $(".lds-ellipsis").remove();
                $(`button.sendConversation`).show();
            })
        }
    }

    const handleClickStartChat = () => {
        const tempStartChat = () => {
            checkInboxForConversation(smsContactSelected).then(rest => {
                if (rest.status === 200) {
                    if (rest.result.status) {
                        setTypeSelected(1);
                        handleConversation("inbox","true");
                    } else {
                        setTypeSelected(1);
                        handleConversation("inbox","false");
                    }
                }
            });
        }
        if(!currentCampaignSmsStaus) {
            tempStartChat();
        } else {
            checkDefaultConversationsNumber().then(res => {
                if (res.status === 200) {
                    if(res.result.defaultConversationsTwilioNumber === ""){
                        confirmDialog({
                            open: true,
                            title: "Status of this campaign is Open. If you want to chat close the campaign, or get a dedicated number for chat.\n\nAre you sure you want to close this campaign?",
                            onConfirm: () => {
                                let conversationsTwilioNumber = "";
                                if(user.conversationsTwilioNumber === null || user.conversationsTwilioNumber === "" || (typeof user.conversationsTwilioNumber === "undefined")) {
                                    getSmsCampaignNumber(currentCampaignId).then((res1)=>{
                                        if(res1.status === 200) {
                                            let requestData = {
                                                "conversationsTwilioNumber":  res1.result.phoneNumber, 
                                                "conversationsSubAccountPhoneSId":res1.result.phoneNumberSid, 
                                                "subMemberId": subUser.memberId,
                                                "defaultYN": defaultYN
                                            }
                                            setConversationNumber(requestData).then((res2)=>{
                                                if(res2.status === 200) {
                                                    if(subUser.memberId > 0) {
                                                        sessionStorage.setItem('subUser',JSON.stringify({
                                                            ...subUser,
                                                            "conversationsTwilioNumber": res1.result.phoneNumber
                                                        }));
                                                        setSubUserAction({...subUser, "conversationsTwilioNumber": res1.result.phoneNumber});
                                                        conversationsTwilioNumber=res1.result.phoneNumber;
                                                    } else {
                                                        sessionStorage.setItem('user', JSON.stringify({
                                                            ...user,
                                                            "conversationsTwilioNumber": res1.result.phoneNumber
                                                        }));
                                                        userLoggedIn({...user, "conversationsTwilioNumber": res1.result.phoneNumber});
                                                        conversationsTwilioNumber=res1.result.phoneNumber;
                                                    }
                                                } else {
                                                    globalAlert({
                                                        type: "Error",
                                                        text: "Something went wrong try again later",
                                                        open: true
                                                    });
                                                }
                                                setDefaultYN("Y");
                                            })
                                        }
                                    });
                                } else {
                                    conversationsTwilioNumber=user.conversationsTwilioNumber;
                                }
                                let requestData2 = {
                                    "smsId": [currentCampaignId],
                                    "conversationsTwilioNumber":conversationsTwilioNumber
                                }
                                closeSmsCampaign(requestData2).then(res3=>{
                                    if(res3.status === 200) {
                                        tempStartChat();
                                    } else {
                                        globalAlert({
                                            type: "Error",
                                            text: res3.message,
                                            open: true
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        if(res.result.smsId === 0){
                            let requestData3 = {
                                "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber,
                                "conversationsSubAccountPhoneSId": res.result.defaultConversationsSubAccountPhoneSId,
                                "subMemberId": subUser.memberId,
                                "defaultYN": defaultYN
                            }
                            setConversationNumber(requestData3).then(res4 => {
                                if (res4.status === 200) {
                                    if(subUser.memberId > 0) {
                                        sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber}));
                                        setSubUserAction({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                        subUser.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                    } else {
                                        sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                        userLoggedIn({...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                        user.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                    }
                                    tempStartChat();
                                } else {
                                    globalAlert({
                                        type: "Error",
                                        text: "Something went wrong try again later",
                                        open: true
                                    });
                                }
                                setDefaultYN("Y");
                            })
                        } else {
                            confirmDialog({
                                open: true,
                                title: "Default Chat number has open SMS campaign.\nIf you start chat, it will close the SMS campaign.\n\nAre you sure you want to close SMS campaign?",
                                onConfirm: () => {
                                    let requestData4 = {
                                        "smsId": [res.result.smsId],
                                        "conversationsTwilioNumber":res.result.defaultConversationsTwilioNumber
                                    }
                                    closeSmsCampaign(requestData4).then(res5=>{
                                        if(res5.status === 200) {
                                            let requestData5 = {
                                                "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber,
                                                "conversationsSubAccountPhoneSId": res.result.defaultConversationsSubAccountPhoneSId,
                                                "subMemberId": subUser.memberId,
                                                "defaultYN": defaultYN
                                            }
                                            setConversationNumber(requestData5).then(res6 => {
                                                if (res6.status === 200) {
                                                    if(subUser.memberId > 0) {
                                                        sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber}));
                                                        setSubUserAction({...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                                        subUser.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                                    } else {
                                                        sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                                        userLoggedIn({...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber});
                                                        user.conversationsTwilioNumber=res.result.defaultConversationsTwilioNumber;
                                                    }
                                                    tempStartChat();
                                                } else {
                                                    globalAlert({
                                                        type: "Error",
                                                        text: "Something went wrong try again later",
                                                        open: true
                                                    });
                                                }
                                                setDefaultYN("Y");
                                            })
                                        } else {
                                            globalAlert({
                                                type: "Error",
                                                text: res5.message,
                                                open: true
                                            });
                                        }
                                    });
                                }
                            })
                        }
                    }
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    }

    const getFullName = (firstName, lastName) => {
        let fullName = ""
        if (firstName) {
            fullName = firstName
        }
        if (lastName) {
            if (firstName) {
                fullName += " "
            }
            fullName += lastName
        }
        return fullName
    }
    const handleChangeBuyTwilioNo = (name, value) => {
        setDataBuyTwilioNo(prev => ({ ...prev, [name]: value }));
        if(name === "checkForwardingYesNo" && value === "yes"){
            handleChangeBuyTwilioNo("callForwardingNumber",user.cell);
            let tempIso2 = countryBuyTwilioNo.filter((x)=>{ return x.id === user.country })[0].key;
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
        });
    }
    const saveBuyTwilioNo = () => {
        if(availableConversationNumber.length === 0) {
            let isValid = true;
            if(typeof dataBuyTwilioNo.twilioNumber === "undefined" || dataBuyTwilioNo.twilioNumber === ""){
                globalAlert({
                    type: "Error",
                    text: "Please select number.",
                    open: true
                });
                isValid = false
            }
            if(dataBuyTwilioNo.checkForwardingYesNo === "yes" &&  (typeof dataBuyTwilioNo.callForwardingNumber === "undefined" || dataBuyTwilioNo.callForwardingNumber === "" || dataBuyTwilioNo.callForwardingNumber === null)){
                globalAlert({
                    type: "Error",
                    text: "Please enter forward number.",
                    open: true
                });
                isValid = false
            }
            if (!isValid) {
                return
            }
            confirmDialog({
                open: true,
                title: `Are you sure, you want to buy this ${dataBuyTwilioNo.twilioNumber} number?`,
                onConfirm: () => { confirmSaveBuyTwilioNo() }
            })
        } else {
            if (conversationNumber === "") {
                globalAlert({
                    type: "Error",
                    text: "Please select number",
                    open: true
                });
            } else {
                let cNo = availableConversationNumber.find((e) => (e.scmNumber === conversationNumber));
                let requestData = {
                    "conversationsTwilioNumber": conversationNumber,
                    "conversationsSubAccountPhoneSId": cNo.scmNumberPhoneSid,
                    "subMemberId": subUser.memberId,
                    "defaultYN": defaultYN
                }
                setConversationNumber(requestData).then(res => {
                    if (res.status === 200) {
                        if(subUser.memberId > 0) {
                            sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": conversationNumber}));
                            setSubUserAction({...subUser, "conversationsTwilioNumber": conversationNumber});
                        } else {
                            sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": conversationNumber }));
                            userLoggedIn({...user, "conversationsTwilioNumber": conversationNumber});
                        }
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: "Something went wrong try again later",
                            open: true
                        });
                    }
                    setDefaultYN("Y");
                })
                toggleBuyTwilioNo();
            }
        }
    }
    const confirmSaveBuyTwilioNo = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "memberId":user.memberId,
            "subMemberId":subUser.memberId,
            "subFullName":`${subUser.firstName} ${subUser.lastName}`,
            "fullName":`${user.firstName} ${user.lastName}`,
            "conversationsTwilioNumber":dataBuyTwilioNo.twilioNumber,
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        buyNumber(d).then(res => {
            if (res.status === 200) {
                let tn = "";
                if(typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null){
                    tn = dataBuyTwilioNo.twilioNumber;
                } else {
                    tn = user.twilioNumber;
                }
                if(subUser.memberId > 0) {
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn}));
                    setSubUserAction({...subUser, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn});
                } else {
                    sessionStorage.setItem('user',JSON.stringify({...user, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn}));
                    userLoggedIn({...user, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn});
                }
                toggleBuyTwilioNo();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            setLoader({
                load: false
            });
        });
    }

    const handleClosedConversationSelected = (conversation) => {
        let requestData = {
            "contactEmailId":conversation.cvsdClientId,
            "contactFirstName":conversation.firstName,
            "contactLastName":conversation.lastName,
            "contactPhoneNumber":conversation.cvsdClientNumber,
            "memPhone":user.cell,
            "memFirstName":user.firstName,
            "memLastName":user.lastName
        }
        getConversations(requestData).then(res => {
            if (res?.status === 200) {
                const conversationsDetailList = res?.result?.conversationsDetailList
                const currentConversation = []
                conversationsDetailList?.forEach((item) => {
                    currentConversation.push({
                        ...item,
                        content: item?.cvsdMessage,
                        dateTime: item?.cvsdDate,
                        type: item?.chatColor === 'myChat' ? 'self' : 'other'
                    })
                })
                setCurrentSmsData(currentConversation);
                setTimeout(()=>{
                    $("#conversation-main").animate({ scrollTop: $('#conversation-main')[0].scrollHeight}, 1000);
                },1000);
            } else {
                setCurrentSmsData([]);
            }
        })
    }

    const handleClickFunctionalityType = (value) => {
        setSelectFunctionalityType((prev)=>{
            return prev === value ? "" : value
        })
    }

    const handleChangeSearchConversation = (value) => {
        if(value === ""){
            setConversations(mainConversations);
        } else {
            let t = mainConversations.filter((v)=> v.cvsdClientNumber.toLowerCase().includes(value.toLowerCase()) || v.cvsMemberNumber.toLowerCase().includes(value.toLowerCase()) || v.cvsdMessage.toLowerCase().includes(value.toLowerCase()) || v.firstName.toLowerCase().includes(value.toLowerCase()) || v.lastName.toLowerCase().includes(value.toLowerCase()));
            setConversations(t);
        }
    }

    const renderSMSCampaign = () => {
        return (
            <div className="d-flex border border-1" style={{ minHeight: "calc(100vh - 250px)", maxHeight: "calc(100vh - 250px)" }}>
                <div className="w-25 overflow-auto border-right">
                    {smsCampaignPhoneNumberList?.map((item) => {
                        return (
                            <div className={`d-flex flex-row border-bottom justify-content-between align-items-center pl-4 ${smsContactSelected === item?.phoneNumber ? "contactWrapperSelected text-white" : "contactWrapper"}`}
                                key={item?.phoneNumber}
                                onClick={() => {
                                    handleSmsContactSelected(item?.phoneNumber)
                                }}>
                                <div className="d-flex flex-column">
                                    <span className="mt-1"><b>{getFullName(item?.firstName, item?.lastName)}</b></span>
                                    <span className="mt-1 mb-1">{item?.phoneNumber}</span>
                                </div>
                                {item?.smsCampaignCount > 0 &&
                                    <div className="mr-2 reply-count-div d-flex justify-content-center align-items-center">
                                        <span>{item?.smsCampaignCount}</span>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="w-25 overflow-auto border-right">
                    {smsCampaignList?.map((campaign, index) => {
                        return (
                            <div key={index} className={`pt-2 pl-4 border-bottom ${campaignSelected === index ? "contactWrapperSelected text-white" : "contactWrapper"}`}
                                onClick={() => {
                                    if(campaignSelected !== index) {
                                        handleCampaignSelected(campaign, index)
                                    }
                                }}>
                                <p><b>{campaign?.smsName}</b></p>
                            </div>
                        )
                    })}
                </div>
                <div className="w-50">
                    <div id="conversation-main" className="h-75 overflow-auto">
                        <ConversationBox conversationData={currentSmsData} />
                    </div>
                    {currentSmsData && currentSmsData.length > 0 && <div className="h-25 d-flex border-top justify-content-center align-items-center">
                        <Button variant="contained" color="primary" onClick={() => { handleClickStartChat() }}>START CHAT</Button>
                    </div>}
                </div>
            </div>
        )
    }

    const renderConversations = () => {
        return (
            <div className="d-flex border border-1" style={{ minHeight: "calc(100vh - 250px)", maxHeight: "calc(100vh - 250px)" }}>
                <div className="overflow-auto border-right" style={{ width: "15%" }}>
                    <div className={`py-2 px-3 border-bottom ${conversationType === "inbox" ? "contactWrapperSelected text-white" : "contactWrapper"}`}
                        onClick={() => handleConversation("inbox")}>
                        <span className="mt-1">Inbox</span>
                    </div>
                    <div className={`py-2 px-3 border-bottom ${conversationType === "closed" ? "contactWrapperSelected text-white" : "contactWrapper"}`}
                        onClick={() => handleConversation("closed")}>
                        <span className="mt-1">Closed Conversations</span>
                    </div>
                </div>
                <div className="overflow-auto border-right" style={{ width: "40%" }}>
                    <div className="d-flex align-items-end w-100 py-2 px-2 border-bottom">
                        <div className={`collapse-icon ${selectFunctionalityType === "search" ? "active" : ""}`}>
                            <TextField
                                variant="standard"
                                className="w-100 pr-3"
                                type="text"
                                id="searchConversations"
                                name="searchConversations"
                                label="Search"
                                onChange={(event) => { handleChangeSearchConversation(event?.target?.value) }}
                            />
                        </div>
                        <div>
                            <Link component="a" className={`btn-circle ${selectFunctionalityType === "search" ? "active" : ""}`} onClick={() => {handleClickFunctionalityType("search")}} data-toggle="tooltip" title="Search">
                                <i className="far fa-search"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </div>
                        <div className={`collapse-icon ${selectFunctionalityType === "start" ? "active" : ""}`}>
                            <Autocomplete
                                freeSolo
                                disableClearable
                                options={contactList.length > 0 ? contactList : []}
                                getOptionLabel={(option) => option?.label}
                                onChange={(event, value) => {
                                    setContactSelected(value)
                                }}
                                className="w-100 pr-3 pl-2"
                                renderInput={(params) => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                            className: "flex-nowrap",
                                            endAdornment: <i className="far fa-long-arrow-right" onClick={() => handleContactSelected()}></i>
                                        }}
                                        name="search"
                                        label="Start Conversation"
                                        className="w-100"
                                        onChange={(event) => { fetchContactListOnSearch(event?.target?.value) }}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Link component="a" className={`btn-circle ${selectFunctionalityType === "start" ? "active" : ""}`} onClick={() => {handleClickFunctionalityType("start")}} data-toggle="tooltip" title="Start Conversation">
                                <i className="far fa-edit pl-1"></i>
                                <div className="bg-blue"></div>
                            </Link>
                        </div>
                    </div>
                    {conversations?.map((conversation, index) => {
                        return (
                            <div
                                className={`d-flex flex-column border-bottom p-2 ${conversationSelected?.cvsdCvsId === conversation?.cvsdCvsId ? "contactWrapperSelected text-white" : "contactWrapper"}`}
                                key={index}
                                onClick={() => { conversationType === "inbox" ? handleConversationSelected(conversation, index) : handleClosedConversationSelected(conversation) }}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span><b>{getFullName(conversation?.firstName, conversation?.lastName)}</b></span>
                                    <span className="mt-1 d-flex">
                                        {typeof conversation?.cvsdDate !== "undefined" ? format(new Date(conversation?.cvsdDate), 'MMM d') : ""}
                                        {conversation?.conversationsCount > 0 &&
                                            <div className="reply-count-box d-flex justify-content-center align-items-center">
                                                <span>{conversation?.conversationsCount}</span>
                                            </div>
                                        }
                                    </span>
                                </div>
                                <span>{conversation?.cvsdMessage}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="d-flex flex-column align-content-between" style={{ width: "45%" }}>
                    {currentSmsData.length > 0 &&
                        <div className="d-flex py-4 border-bottom justify-content-center">
                            <span><b>{`${conversationSelected?.fullName ? conversationSelected?.fullName : getFullName(conversationSelected?.firstName, conversationSelected?.lastName)}`}</b>: {conversationSelected?.cvsdClientNumber}</span>
                        </div>
                    }
                    <div id="conversation-main" className="overflow-auto" style={{ height: conversationType === "inbox" ? "calc(100vh - 400px)" : "calc(100vh - 175px)" }}>
                        <ConversationBox conversationData={currentSmsData} />
                    </div>
                    {(currentSmsData && conversationType === "inbox") && <div className="border-top">
                        <div className="p-2 px-4">
                            <DropDownControls
                                id="selectTemplate"
                                name="selectTemplate"
                                label="Select Template"
                                onChange={(name, value) => {
                                    handleTemplateSelect(value)
                                }}
                                value={templateSelected || ""}
                                dropdownList={templateList}
                            />
                            <div className="mt-2">
                                <InputField
                                    type="text"
                                    id="smsContent"
                                    name="smsContent"
                                    label="Content"
                                    onChange={(name, value) => { setSmsContent(value) }}
                                    value={smsContent}
                                    multiline={true}
                                    minRows={4}
                                />
                            </div>
                            <div className="mt-2">
                                <Button variant="contained" color="primary" className="sendConversation" onClick={() => { handleSendConversation() }}>SEND</Button>
                                <Button className="ml-2 closeConversation" variant="contained" color="primary" onClick={() => { handleCloseCoversation() }}>CLOSE CONVERSATION</Button>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        )
    }

    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>SMS Inbox</h3>
                    <div className="d-flex">
                        <div
                            onClick={() => {
                                handleTypeSelected(0)
                                resetAll()
                            }}
                            className="border-top border-left d-flex flex-row"
                            style={{
                                padding: "10px 15px 10px 15px",
                                cursor: "pointer",
                                backgroundColor: `${typeSelected === 0 ? "#eee" : "white"}`
                            }}>
                            <span>SMS Campaign</span>
                            {replyCount?.totalSmsCampaignCount > 0 &&
                                <div className="ml-5 reply-count-div d-flex justify-content-center align-items-center">
                                    <span>{replyCount?.totalSmsCampaignCount}</span>
                                </div>
                            }
                        </div>
                        <div
                            onClick={() => {
                                handleTypeSelected(1)
                                resetAll()
                                handleConversation("inbox")
                            }}
                            className="border-top border-left border-right d-flex flex-row"
                            style={{
                                padding: "10px 15px 10px 15px",
                                cursor: "pointer",
                                backgroundColor: `${typeSelected === 1 ? "#eee" : "white"}`
                            }}>
                            <span>Conversations</span>
                            {replyCount?.totalConversationsCount > 0 &&
                                <div className="ml-5 reply-count-div d-flex justify-content-center align-items-center">
                                    <span>{replyCount?.totalConversationsCount}</span>
                                </div>
                            }
                        </div>
                    </div>
                    {typeSelected === 0 ? renderSMSCampaign() : renderConversations()}
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalBuyTwilioNo} toggle={toggleBuyTwilioNo}>
                <ModalHeader toggle={toggleBuyTwilioNo}>SMS/MMS Number Setup</ModalHeader>
                <ModalBody>
                    {
                        availableConversationNumber.length === 0 ?
                            <>
                                <h6>Hello {user.firstName},</h6>
                                <p>It looks like this is the first time you will be sending SMS/MMS message from {websiteTitle}. Let set your account up for this. In order to send SMS/MMS message you will first need to select a phone number to use to send SMS/MMS from. This phone number can be released in the My Profile section of our Applcation.</p>
                                <p>There is a $2.00 per month cost for this phone number regardless if you send SMS/MMS. </p>
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
                                    <Col xs={3}><Button variant="contained" color="primary" className="mt-3" onClick={()=>{searchBuyTwilioNo()}} >SEARCH</Button></Col>
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
                            </>
                        :
                            <>
                                <div>
                                    <FormControl>
                                        <RadioGroup row={true} name="controlled-radio-buttons-group" >
                                            {
                                                availableConversationNumber.map((v, i)=>{
                                                    return <FormControlLabel value={v.scmNumber} key={i} control={<Radio color="primary" onChange={(e)=>{setConversationNumber1(e.target.value)}} checked={conversationNumber === v.scmNumber}/>} label={v.scmNumber} labelPlacement="right" className="ml-0 mr-2"/>
                                                })
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <div>
                                    <FormControl>
                                        <FormControlLabel control={<Checkbox color="primary" checked={defaultYN === "Y"} onChange={(event)=>{ setDefaultYN(defaultYN === "N" ? "Y" : "N") }}/>} label="Default for SMS Chat" />
                                    </FormControl>
                                </div>
                            </>
                    }

                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=>{saveBuyTwilioNo()}} >SAVE</Button>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleBuyTwilioNo()}} >CANCEL</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

const mapStateToProps = state => {
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

export default connect(mapStateToProps, mapDispatchToProps)(SMSInbox);