import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Col, FormGroup, Row } from "reactstrap";
import { Autocomplete, Button, Chip, FormControl, FormControlLabel, FormLabel, Link, Radio, RadioGroup, Tab, Tabs, TextField } from "@mui/material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InputField from "../shared/commonControlls/inputField";
import NumberField from "../shared/commonControlls/numberField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { getCalling, getContact, getConversations, getGroupUDF, getIncomingSMS, getOutgoingSMS, getSendEmails, getSMSPolling, getSmsTemplateDetails, getSmsTemplateSelect, searchForBuyNumber, sendCalling, updateContact, zoomOauth, addZoomMeeting, getZoomAuthentication } from "../../services/clientContactService";
import { buyNumber, sendConversations, closedConversations, currentConversationsDetailList, setConversationNumber, checkDefaultConversationsNumber } from "../../services/smsInboxServices";
import { dateFormat, dateFormatContactHistory, getClientTimeZone, getInitials, timeFormat, validateEmail } from "../../assets/commonFunctions";
import { checkAuthorized, countryToStateName, getCountry, getLanguage, validatePhoneFormat } from "../../services/commonService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import { userLoggedIn } from "../../actions/userActions";
import { TabPanel, a11yProps } from "../../assets/commonFunctions";
import $ from "jquery"
import { websiteTitle, zoomUrl } from "../../config/api";
import { setLoader } from "../../actions/loaderActions";
import { closeSmsCampaign, getFreeNumberList } from "../../services/smsCampaignService";
import ModalConversation from "./components/modalConversation";
import ModalNumberList from "./components/modalNumberList";
import ModalBuyTwilioNo from "./components/modalBuyTwilioNo";
import ModalCalling from "./components/modalCalling";
import History from "../../history";
import ModalSendEmail from "./components/modalSendEmail";
import { setSubUserAction } from "../../actions/subUserActions";

const EditContact = ({ selectedTab, setSelectedTabl, emailId, groupId, globalAlert, confirmDialog, displayGroupSegmentDetails, user, subUser, userLoggedIn, setLoader, setSubUserAction }) => {
    const [value, setValue] = useState(0);
    const [data, setData] = useState([]);
    const [dataConversation, setDataConversation] = useState([]);
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({ "areaCode": 0, "countryCode": "US", "checkForwardingYesNo": "no" });
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [country, setCountry] = useState([]);
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const [state, setState] = useState([]);
    const [language, setLanguage] = useState([]);
    const [contactUdf, setContactUdf] = useState([]);
    const [createNewUdfCount, setCreateNewUdfCount] = useState([]);
    const [udfCount, setUdfCount] = useState(0);
    const [udfNames, setUdfNames] = useState([]);
    const [tags, setTags] = useState([]);
    const [modalConversation, setModalConversation] = useState(false);
    const [freeNumber, setFreeNumber] = useState([]);
    const toggleConversation = () => setModalConversation(!modalConversation);
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setDataBuyTwilioNo({ "areaCode": 0, "countryCode": "US", "checkForwardingYesNo": "no" });
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
        setModalBuyTwilioNo(!modalBuyTwilioNo);
    };
    const [modalCalling, setModalCalling] = useState(false);
    const toggleCalling = () => setModalCalling(!modalCalling);
    const [callingData, setCallingData] = useState({});
    const [conversationCharacterCount, setConversationCharacterCount] = useState(0);
    const [conversationSMSCount, setConversationSMSCount] = useState(1);
    const [conversationTemplateList, setConversationTemplateList] = useState([]);
    const [dataCurrentConversations, setDataCurrentConversations] = useState([]);
    const [clear, setClear] = useState(0);
    const inputRefs = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef(), createRef()]);
    const numberRefs = useRef([createRef(), createRef()]);
    const createNewUdfInputRefs = useRef([]);
    let contactInputRefsCount = 7;
    const inputRefsConversation = useRef([createRef()]);
    const dropDownRefsConversation = useRef([createRef()]);
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const [modalNumberList, setModalNumberList] = useState(false);
    const toggleNumberList = () => {
        setModalNumberList(!modalNumberList);
        setSelectRadioNumber(0);
        setSelectedFreeNumber("");
        setSelectedUsedNumber("");
    };
    const [selectRadioNumber, setSelectRadioNumber] = useState(0);
    const [usedNumber, setUsedNumber] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [defaultYN, setDefaultYN] = useState("Y");
    const [selectedFreeNumber, setSelectedFreeNumber] = useState("");
    const [selectedUsedNumber, setSelectedUsedNumber] = useState("");
    const [modalSendEmail, setModalSendEmail] = useState(false);
    const toggleModalSendEmail = () => setModalSendEmail(!modalSendEmail);
    const handleChange = (event, newValue) => {
        if (newValue === 1) {
            let isValid = true;
            for (let i = 0; i < inputRefs.current.length; i++) {
                const valid = inputRefs.current[i].current.validate()
                if (!valid) {
                    isValid = false
                }
            }
            for (let i = 0; i < numberRefs.current.length; i++) {
                const valid = numberRefs.current[i].current.validateNumber()
                if (!valid) {
                    isValid = false
                }
            }
            for (let i = 0; i < dropDownRefs.current.length; i++) {
                const valid = dropDownRefs.current[i].current.validateDropDown()
                if (!valid) {
                    isValid = false
                }
            }
            if (!isValid) {
                return
            }
        }
        setValue(newValue);
    };
    const updateContactHandleChange = (name, value) => {
        if (name === "email") {
            let t = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (t !== null) {
                value = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)[0];
            }
        }
        if (name === "firstName") {
            setData((prev) => ({ ...prev, [name]: value, "fullName": `${value} ${typeof data?.lastName !== "undefined" && data?.lastName !== null ? data?.lastName : ""}` }));
        } else if (name === "lastName") {
            setData((prev) => ({ ...prev, [name]: value, "fullName": `${typeof data.firstName !== "undefined" && data.firstName !== null ? data.firstName : ""} ${value}` }));
        } else {
            setData((prev) => ({ ...prev, [name]: value }));
        }
    }
    const udfNameHandleChange = (name, value) => {
        setUdfNames(prev => ({ ...prev, [name]: value }))
    }
    const handleChangeConversation = (name, value) => {
        if (name === "sendMessage") {
            setConversationCharacterCount(value.length);
            setConversationSMSCount(Math.ceil(value.length / 160) === 0 ? 1 : Math.ceil(value.length / 160));
        }
        if (name === "sstId") {
            if (value === "") {
                setDataConversation(prev => ({ ...prev, [name]: value, "sendMessage": "" }))
                setConversationCharacterCount(0);
                setConversationSMSCount(1);
            } else {
                getSmsTemplateDetails(value, emailId).then(res => {
                    if (res.result) {
                        setDataConversation(prev => ({ ...prev, "sendMessage": res.result.sstDetails }))
                        setConversationCharacterCount(res.result.sstDetails.length);
                        setConversationSMSCount(Math.ceil(res.result.sstDetails.length / 160) === 0 ? 1 : Math.ceil(res.result.sstDetails.length / 160));
                    }
                })
            }
        }
        setDataConversation(prev => ({ ...prev, [name]: value }))
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
    const fetchData = async() => {
        let tempCountry = [];
        await getCountry().then(res => {
            if (res.result.country) {
                let country = []
                res.result.country.map(x => (
                    country.push({
                        "key": x.cntName,
                        "value": x.cntName,
                        "id": String(x.id)
                    })
                ));
                tempCountry = country;
                setCountry(country);
                country = []
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
        await getLanguage().then(res => {
            if (res.result.language) {
                let language = []
                res.result.language.map(x => (
                    language.push({
                        "key": x.lgName,
                        "value": x.lgLongName
                    })
                ));
                setLanguage(language)
            }
        })
        await getContact(emailId).then(res => {
            if (res.status === 200) {
                let tempData = {};
                if (typeof res.result.fullName === "undefined" || res.result.fullName === "" || res.result.fullName === null) {
                    if ((typeof res.result.firstName === "undefined" || res.result.firstName === "" || res.result.firstName === null) && (typeof res.result.lastName === "undefined" || res.result.lastName === "" || res.result.lastName === null)) {
                        tempData = {...res.result, "optInType": ""};
                    } else {
                        tempData = { ...res.result, fullName: `${res.result.firstName} ${res.result.lastName}`, "optInType": "" };
                    }
                } else {
                    tempData = {...res.result, "optInType": ""};
                }
                if (res.result.tags !== "" && res.result.tags !== null) {
                    setTags(res.result.tags.split(","));
                }
                if (typeof res.result.country !== "undefined" && res.result.country !== "" && res.result.country !== null) {
                    changeCountry(res.result.country);
                } else {
                    tempData = {...tempData, "country": tempCountry.filter((v) => (v.id === user.country))[0]?.value }
                    changeCountry(tempCountry.filter((v) => (v.id === user.country))[0]?.value);
                }
                setData(tempData);
            }
        })
    }
    const changeCountry = (countryName) => {
        countryToStateName(countryName).then(res => {
            if (res.result.state) {
                let state = [];
                res.result.state.map(x => (
                    state.push({
                        "key": x.stateLong,
                        "value": x.stateLong
                    })
                ));
                setState(state);
            }
        });
    }
    const createNewUdf = () => {
        let count = 0;
        if (udfCount < 10) {
            count = udfCount + 1;
            setCreateNewUdfCount([...createNewUdfCount, count])
            setUdfCount(count);
        } else {
            globalAlert({
                type: "Error",
                text: "Add 10 personalization fields only.",
                open: true
            });
        }
    }
    const addNewUdfBlock = (count, index) => {
        return (
            <Row key={count}>
                <Col xs={5}>
                    <FormGroup className='mb-4'>
                        <InputField
                            ref={ref => { createNewUdfInputRefs.current[index] = ref; }}
                            type="text"
                            id={`udfName${count}`}
                            name={`udfName${count}`}
                            label={"UDF Name"}
                            onChange={udfNameHandleChange}
                            validation={"required"}
                            value={udfNames[`udfName${count}`] || ""}
                        />
                    </FormGroup>
                </Col>
                <Col xs={1}> </Col>
                <Col xs={5}>
                    <FormGroup className='mb-4'>
                        <InputField
                            ref={inputRefs.current[contactInputRefsCount++]}
                            type="text"
                            id={`udf${count}`}
                            name={`udf${count}`}
                            label={"UDF Value"}
                            onChange={updateContactHandleChange}
                            value={data[`udf${count}`] || ""}
                        />
                    </FormGroup>
                </Col>
                <Col xs={1} className="mt-4 text-right"><i className="far fa-trash-alt red" onClick={() => { deleteUdf(count) }}></i></Col>
            </Row>
        );
    }
    const deleteUdf = (count) => {
        for (let i = count; i <= udfCount; i++) {
            let name = `udf${i}`;
            let value = data[`udf${i + 1}`] ? data[`udf${i + 1}`] : "";
            setData(prev => ({ ...prev, [name]: value }))
            let udfName = `udfName${i}`;
            let udfValue = udfNames[`udfName${i + 1}`] ? udfNames[`udfName${i + 1}`] : "";
            setUdfNames(prev => ({ ...prev, [udfName]: udfValue }))
        }
        let c = [];
        for (let i = (contactUdf.length + 1); i < udfCount; i++) {
            c.push(i);
        }
        setCreateNewUdfCount(c);
        setUdfCount(udfCount - 1);
    }
    const updateUdf = async () => {
        if (value === 0) {
            let isValid = true;
            for (let i = 0; i < dropDownRefs.current.length; i++) {
                const valid = dropDownRefs.current[i].current.validateDropDown()
                if (!valid) {
                    isValid = false
                }
            }
            if ((typeof data.email === "undefined" || data.email === "" || data.email === null) && (typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null)) {
                isValid = false;
                globalAlert({
                    type: "Error",
                    text: `Please Enter Email Or Mobile Number`,
                    open: true
                });
                return;
            } else if (typeof data.email !== "undefined" && data.email !== "" && data.email !== null) {
                if (!validateEmail(data.email)) {
                    globalAlert({
                        type: "Error",
                        text: "Please enter proper email",
                        open: true
                    });
                    return false;
                }
            }
            let cntId = country.find((val) => (data.country === val.value)).id;
            if (typeof data.phoneNumber !== "undefined" && data.phoneNumber !== "" && data.phoneNumber !== null) {
                let isValidPh = await validatePhoneFormat(cntId, data.phoneNumber);
                if (!isValidPh) {
                    globalAlert({
                        type: "Error",
                        text: `Invalid mobile number format or Do not put a national prefix on your mobile number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                        open: true
                    });
                    return;
                }
            }
            if (typeof data.phone !== "undefined" && data.phone !== "" && data.phone !== null) {
                let isValidPh = await validatePhoneFormat(cntId, data.phone);
                if (!isValidPh) {
                    globalAlert({
                        type: "Error",
                        text: `Invalid phone number format or Do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                        open: true
                    });
                    return;
                }
            }
            if(data.optInType === "both"){
                if((typeof data.email === "undefined" || data.email === "" || data.email === null) && (typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null)) {
                    isValid = false;
                    globalAlert({
                        type: "Error",
                        text: "Please enter email and mobile number",
                        open: true
                    });
                    return false;
                } else if(typeof data.email === "undefined" || data.email === "" || data.email === null) {
                    isValid = false;
                    globalAlert({
                        type: "Error",
                        text: "Please enter email",
                        open: true
                    });
                    return false;
                } else if(typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null){
                    isValid = false;
                    globalAlert({
                        type: "Error",
                        text: "Please enter mobile number",
                        open: true
                    });
                    return false;
                }
            } else if(data.optInType === "email" && (typeof data.email === "undefined" || data.email === "" || data.email === null)) {
                isValid = false;
                globalAlert({
                    type: "Error",
                    text: "Please enter email",
                    open: true
                });
                return false;
            } else if(data.optInType === "sms" && (typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null)) {
                isValid = false;
                globalAlert({
                    type: "Error",
                    text: "Please enter mobile number",
                    open: true
                });
                return false;
            }
            if((data.optInType === "both" || data.optInType === "sms") && (typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null)) {
                isValid = false;
                checkAuthorized().then(res => {
                    if (res.status === 200) {
                        toggleBuyTwilioNo();
                    } else {
                        confirmDialog({
                            open: true,
                            title: 'Your credit card is not available. Please add it.',
                            onConfirm: () => {
                                History.push("/carddetails");
                            }
                        })
                    }
                })
            }
            if (!isValid) {
                return
            }
        }
        if (value === 1) {
            let isValid = true;
            for (let i = 0; i < createNewUdfInputRefs.current.length; i++) {
                const valid = createNewUdfInputRefs.current[i].validate()
                if (!valid) {
                    isValid = false
                }
            }
            if (!isValid) {
                return
            }
        }
        data["groupId"] = groupId;
        if (tags.length > 0) {
            data["tags"] = tags.join(",");
        }
        if (createNewUdfCount.length > 0) {
            data["udfs"] = [];
            createNewUdfCount.map((value) => (
                data["udfs"].push({
                    "id": 0,
                    "udfLabel": value,
                    "udf": udfNames[`udfName${value}`]
                })
            ))
        }
        $(`button.updateUdf`).hide();
        $(`button.updateUdf`).after(`<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>`);
        updateContact(emailId, data).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setSelectedTabl(selectedTab);
                displayGroupSegmentDetails();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.updateUdf`).show();
        });
    }
    const handleClickConversation = () => {
        setValue(0);
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < numberRefs.current.length; i++) {
            const valid = numberRefs.current[i].current.validateNumber()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if ((typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Please enter mobile number.",
                open: true
            });
            isValid = false
        } else if ((typeof data.countryCode === "undefined" || data.countryCode === "" || data.countryCode === null) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Please select country.",
                open: true
            });
            isValid = false
        } else if ((typeof user.countryCode === "undefined" || user.countryCode === "" || user.countryCode === null) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Please set country to your profile.",
                open: true
            });
            isValid = false
        } else if ((typeof user.conversationsTwilioNumber === "undefined" || user.conversationsTwilioNumber === "" || user.conversationsTwilioNumber === null) && isValid === true) {
            handleCheckConversationsNumber();
            isValid = false
        }
        if (!isValid) {
            return
        }
        setIsLoad(true);
        toggleConversation();
    }
    const handleCheckConversationsNumber = () => {
        checkDefaultConversationsNumber().then(res => {
            if (res.status === 200) {
                if (res.result.defaultConversationsTwilioNumber === "") {
                    getFreeNumberList().then((res2) => {
                        if (res2.status === 200) {
                            setFreeNumber(prev => {
                                prev = res2.result.phoneNumberList;
                                return [...prev];
                            });
                            setUsedNumber(prev => {
                                prev = res2.result.usedPhoneNumberList;
                                return [...prev];
                            });
                            if (res2.result.phoneNumberList.length === 0 && res2.result.usedPhoneNumberList.length === 0) {
                                toggleBuyTwilioNo();
                            } else {
                                toggleNumberList();
                            }
                        }
                    });
                } else {
                    if (res.result.smsId === 0) {
                        let requestData = {
                            "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber,
                            "conversationsSubAccountPhoneSId": res.result.defaultConversationsSubAccountPhoneSId,
                            "subMemberId": subUser.memberId,
                            "defaultYN": defaultYN
                        }
                        setConversationNumber(requestData).then(res3 => {
                            if (res3.status === 200) {
                                if(subUser.memberId > 0){
                                    sessionStorage.setItem('subUser', JSON.stringify({ ...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                    setSubUserAction({ ...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber });
                                    subUser.conversationsTwilioNumber = res.result.defaultConversationsTwilioNumber;
                                } else {
                                    sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                    userLoggedIn({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber });
                                    user.conversationsTwilioNumber = res.result.defaultConversationsTwilioNumber;
                                }
                                handleClickConversation();
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
                                    "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber
                                }
                                closeSmsCampaign(requestData).then(res4 => {
                                    if (res4.status === 200) {
                                        let requestData2 = {
                                            "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber,
                                            "conversationsSubAccountPhoneSId": res.result.defaultConversationsSubAccountPhoneSId,
                                            "subMemberId": subUser.memberId,
                                            "defaultYN": defaultYN
                                        }
                                        setConversationNumber(requestData2).then(res5 => {
                                            if (res5.status === 200) {
                                                if(subUser.memberId > 0){
                                                    sessionStorage.setItem('subUser', JSON.stringify({ ...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                                    setSubUserAction({ ...subUser, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber });
                                                    subUser.conversationsTwilioNumber = res.result.defaultConversationsTwilioNumber;
                                                } else {
                                                    sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber }));
                                                    userLoggedIn({ ...user, "conversationsTwilioNumber": res.result.defaultConversationsTwilioNumber });
                                                    user.conversationsTwilioNumber = res.result.defaultConversationsTwilioNumber;
                                                }
                                                handleClickConversation();
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
                                            text: res4.message,
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
    const handleClickZoom = () => {
        if (typeof data.email === "undefined" || data.email === "" || data.email === null) {
            globalAlert({
                type: "Error",
                text: `Please Enter Email First`,
                open: true
            });
            return;
        } else {
            setLoader({
                load: true,
                text: "Please wait !!!"
            })
            getZoomAuthentication().then((res) => {
                if (res.status === 200) {
                    let requestData = {
                        "emailIds": [emailId],
                        "subMemberId": subUser.memberId
                    }
                    if (!res.result.zoom) {
                        let x = window.innerWidth / 2 - 600 / 2;
                        let y = window.innerHeight / 2 - 700 / 2;
                        window.open(zoomUrl + '/zoomLogin', "zoomWindow", "width=600,height=700,left=" + x + ",top=" + y);
                        window.zoomSuccess = function (data) {
                            zoomOauth(data).then(res => {
                                if (res.status === 200) {
                                    globalAlert({
                                        type: "Success",
                                        text: res.message,
                                        open: true
                                    });
                                    addZoomMeeting(requestData).then((res) => {
                                        if (res.status === 200) {
                                            setLoader({
                                                load: false
                                            });
                                            window.open(res.result.joinUrl, "_blank");
                                        }
                                    })
                                }
                            });
                        }
                        window.zoomError = function () {
                            setLoader({
                                load: false
                            });
                            globalAlert({
                                type: "Error",
                                text: "Something went wrong!!!",
                                open: true
                            });
                        }
                    } else {
                        addZoomMeeting(requestData).then((res) => {
                            if (res.status === 200) {
                                setLoader({
                                    load: false
                                });
                                window.open(res.result.joinUrl, "_blank");
                            }
                        })
                    }
                }
            });
        }
    }
    const sendConversation = () => {
        let isValid = true;
        for (let i = 0; i < inputRefsConversation.current.length; i++) {
            const valid = inputRefsConversation.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let data = {
            "cvsEmailId": emailId,
            "sendMessage": dataConversation.sendMessage,
            "subMemberId": subUser.memberId
        }
        sendConversations(data).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setDataConversation([]);
                setConversationSMSCount(1);
                setConversationCharacterCount(0);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const closeConversation = () => {
        let d = {
            "cvsEmailId": emailId,
            "subMemberId": subUser.memberId,
            "cvsdClientNo": data.countryCode + data.phoneNumber,
            "memberPhone": user.countryCode + user.cell
        }
        closedConversations(d).then(res => {
            if (res.status === 200) {
                toggleConversation();
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
        });
    }
    const fetchCurrentConversationsDetailList = (payload) => {
        currentConversationsDetailList(payload).then(res => {
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
                setDataCurrentConversations(currentConversation);
                setIsLoad(false);
                setTimeout(() => {
                    $(".conversation-list").animate({ scrollTop: $('.conversation-list')[0].scrollHeight }, 1000);
                }, 1000);
            } else {
                setDataCurrentConversations([]);
                setIsLoad(false);
            }
        })
    }
    const callCurrentConversations = useCallback(() => {
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        let d = {
            cvsdClientId: emailId,
            cvsMemberNumber: user.countryCode + user.cell,
            cvsdClientNumber: data.countryCode + data.phoneNumber.replaceAll("-", "").slice(-10),
            checkConversationsRows: 0,
            timeZone: timeZone
        }
        fetchCurrentConversationsDetailList(d);
    }, [data, user, emailId]);
    const stopCurrentConversations = (clear) => {
        clearInterval(clear);
        setClear(0);
        setDataCurrentConversations([]);
        setIsLoad(false);
        setDataConversation([]);
        setConversationSMSCount(1);
        setConversationCharacterCount(0);
    }
    const searchBuyTwilioNo = () => {
        let d = {
            "areaCode": dataBuyTwilioNo.areaCode ? dataBuyTwilioNo.areaCode : 0,
            "countryCode": dataBuyTwilioNo.countryCode ? dataBuyTwilioNo.countryCode : "US"
        }
        searchForBuyNumber(d).then(res => {
            if (res.status === 200) {
                if (res.result.searchNumber.length > 0) {
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
        let isValid = true;
        if (typeof dataBuyTwilioNo.twilioNumber === "undefined" || dataBuyTwilioNo.twilioNumber === "") {
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
    }
    const confirmSaveBuyTwilioNo = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "memberId": user.memberId,
            "subMemberId": subUser.memberId,
            "subFullName": `${subUser.firstName} ${subUser.lastName}`,
            "fullName": `${user.firstName} ${user.lastName}`,
            "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber,
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        buyNumber(d).then(res => {
            if (res.status === 200) {
                let tn = "";
                if (typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null) {
                    tn = dataBuyTwilioNo.twilioNumber;
                } else {
                    tn = user.twilioNumber;
                }
                if (subUser.memberId > 0) {
                    setSubUserAction({ ...subUser, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn });
                    sessionStorage.setItem('subUser', JSON.stringify({ ...subUser, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn }));
                } else {
                    userLoggedIn({ ...user, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn });
                    sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn }));
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
    const handleClickCalling = () => {
        setValue(0);
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < numberRefs.current.length; i++) {
            const valid = numberRefs.current[i].current.validateNumber()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if ((typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Please enter mobile number.",
                open: true
            });
            isValid = false
        } else if ((typeof data.countryCode === "undefined" || data.countryCode === "" || data.countryCode === null) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Please select country.",
                open: true
            });
            isValid = false
        } else if ((typeof user.countryCode === "undefined" || user.countryCode === "" || user.countryCode === null) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Please set country to your profile.",
                open: true
            });
            isValid = false
        } else if ((user.cell.replaceAll("-", "").slice(-10) === data.phoneNumber.replaceAll("-", "").slice(-10)) && isValid === true) {
            globalAlert({
                type: "Error",
                text: "Sender and receiver number are same.",
                open: true
            });
            isValid = false
        } else if ((typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null) && isValid === true) {
            toggleBuyTwilioNo();
            isValid = false
        }
        if (!isValid) {
            return
        }
        // toggleCalling();
        let d = {
            "memberId": user.memberId,
            "subMemberId": subUser.memberId,
            "emailId": emailId,
            "memCallCode": user.countryCode,
            "clientCallCode": data.countryCode
        }
        sendCalling(d).then(res => {
            if (res.status === 200) {
                setCallingData(res.result);
                toggleCalling();
            } else {
                if(modalCalling){
                    toggleCalling();
                }
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleChangeSelectNumberType = (value) => {
        setSelectedFreeNumber("");
        setSelectedUsedNumber("");
        setSelectRadioNumber(value);
        if (value === 3) {
            toggleNumberList();
            toggleBuyTwilioNo();
        }
    }
    const handleChangeFreeNumberList = () => {
        let fd = "";
        if (selectedFreeNumber !== "") {
            fd = freeNumber.filter((v) => { return v.scmNumber === selectedFreeNumber })[0];
        } else {
            fd = usedNumber.filter((v) => { return v.scmNumber === selectedUsedNumber })[0];
        }
        let requestData = {
            "conversationsTwilioNumber": fd.scmNumber,
            "conversationsSubAccountPhoneSId": fd.scmNumberPhoneSid,
            "subMemberId": subUser.memberId,
            "defaultYN": defaultYN
        }
        setConversationNumber(requestData).then(res => {
            if (res.status === 200) {
                if (subUser.memberId > 0) {
                    sessionStorage.setItem('subUser', JSON.stringify({ ...subUser, "conversationsTwilioNumber": fd.scmNumber }));
                    setSubUserAction({ ...subUser, "conversationsTwilioNumber": fd.scmNumber });
                } else {
                    sessionStorage.setItem('user', JSON.stringify({ ...user, "conversationsTwilioNumber": fd.scmNumber }));
                    userLoggedIn({ ...user, "conversationsTwilioNumber": fd.scmNumber });
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
        })
        setDefaultYN("Y");
        toggleNumberList();
    }
    const handleChangeUsedNumberList = () => {
        confirmDialog({
            open: true,
            title: `This number is being used in SMS Campaign, are you sure you want to use this number in SMS Chat? SMS Campaign will be closed.`,
            onConfirm: () => {
                let ud = usedNumber.filter((v) => { return v.scmNumber === selectedUsedNumber })[0];
                let requestData = {
                    "smsId": [ud.smsId],
                    "conversationsTwilioNumber": ud.scmNumber
                }
                closeSmsCampaign(requestData).then(res => {
                    if (res.status === 200) {
                        handleChangeFreeNumberList();
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const handleClickSendEmail = () => {
        if (typeof data.email === "undefined" || data.email === "" || data.email === null) {
            globalAlert({
                type: "Error",
                text: "Please enter email.",
                open: true
            });
            return false;
        }
        toggleModalSendEmail();
    }
    useEffect(() => {
        fetchData();
        getGroupUDF(groupId).then(res => {
            if (res.status === 200) {
                setContactUdf(res.result.udfs);
                setUdfCount(res.result.udfs.length);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
        getSmsTemplateSelect().then(res => {
            if (res.status === 200) {
                let template = [];
                template.push({
                    "key": "",
                    "value": "Select Template"
                });
                res.result.smsTemplateSelect.map(x => (
                    template.push({
                        "key": x.sstId,
                        "value": x.sstName
                    })
                ));
                setConversationTemplateList(template);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailId, globalAlert, groupId]);
    useEffect(() => {
        if (modalConversation === true) {
            if (clear === 0)
                setClear(setInterval(callCurrentConversations, 3000));
        } else {
            stopCurrentConversations(clear);
        }
    }, [modalConversation, clear, callCurrentConversations]);
    return (
        <div className="tableContactBox mb-5">
            <Row className="mb-2">
                <Col xs={6}>
                    <i className="fad fa-long-arrow-left mr-3 fa-2x" onClick={() => { setSelectedTabl(selectedTab) }}></i>
                    <h4 className="d-inline-block align-top">Contact Detail</h4>
                </Col>
                <Col xs={6} className="text-right">
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Call" onClick={()=>{handleClickCalling()}}>
                        <i className="far fa-phone-volume"></i>
                        <div className="bg-blue"></div>
                    </Link>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="SMS Chat" onClick={() => { handleClickConversation() }}>
                        <i className="far fa-comment-alt-lines"></i>
                        <div className="bg-blue"></div>
                    </Link>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Email" onClick={() => { handleClickSendEmail() }}>
                        <i className="far fa-envelope"></i>
                        <div className="bg-blue"></div>
                    </Link>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Zoom Meeting" onClick={()=>{handleClickZoom()}}>
                        <i className="far fa-video"></i>
                        <div className="bg-blue"></div>
                    </Link>
                </Col>
            </Row>
            <div className="borderBottomContactBox"></div>
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Personal Details" {...a11yProps(0)} />
                        <Tab label="Personalization Fields" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        <div className="divImg">{getInitials(data?.firstName, data?.lastName)}</div>
                        <Row className="mt-3">
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[0]}
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        onChange={updateContactHandleChange}
                                        value={data?.firstName || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <DropDownControls
                                        ref={dropDownRefs.current[0]}
                                        id="country"
                                        name="country"
                                        label="Country"
                                        onChange={(e, v) => { updateContactHandleChange(e, v); changeCountry(v); }}
                                        validation={"required"}
                                        value={data?.country || ""}
                                        dropdownList={country}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[1]}
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        onChange={updateContactHandleChange}
                                        value={data?.lastName || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <DropDownControls
                                        ref={dropDownRefs.current[1]}
                                        id="stateProvRegion"
                                        name="stateProvRegion"
                                        label="State/Prov/Region"
                                        onChange={updateContactHandleChange}
                                        value={data?.stateProvRegion || ""}
                                        dropdownList={state}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[2]}
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        label="Full Name"
                                        onChange={updateContactHandleChange}
                                        value={data?.fullName || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[3]}
                                        type="text"
                                        id="streetAddress1"
                                        name="streetAddress1"
                                        label="Street Address1"
                                        onChange={updateContactHandleChange}
                                        value={data?.streetAddress1 || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className="mb-0" component="fieldset">
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup row aria-label="gender" name="gender" value={data?.gender || ""} onChange={(e) => { updateContactHandleChange(e.target.name, e.target.value) }}>
                                        <FormControlLabel className="mb-0" value="Male" control={<Radio color="primary" />} label="Male" />
                                        <FormControlLabel className="mb-0" value="Female" control={<Radio color="primary" />} label="Female" />
                                    </RadioGroup>
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[4]}
                                        type="text"
                                        id="streetAddress2"
                                        name="streetAddress2"
                                        label="Street Address2"
                                        onChange={updateContactHandleChange}
                                        value={data?.streetAddress2 || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <NumberField
                                        ref={numberRefs.current[0]}
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        label="Mobile Number"
                                        onChange={updateContactHandleChange}
                                        value={data?.phoneNumber || ""}
                                        format="####################"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[5]}
                                        type="text"
                                        id="city"
                                        name="city"
                                        label="City"
                                        onChange={updateContactHandleChange}
                                        value={data?.city || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <NumberField
                                        ref={numberRefs.current[1]}
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        label="Phone"
                                        onChange={updateContactHandleChange}
                                        value={data?.phone || ""}
                                        format="####################"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[7]}
                                        type="text"
                                        id="zipPostalCode"
                                        name="zipPostalCode"
                                        label="Zip / Post Code "
                                        onChange={updateContactHandleChange}
                                        value={data?.zipPostalCode || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[6]}
                                        type="text"
                                        id="email"
                                        name="email"
                                        label="Email"
                                        onChange={updateContactHandleChange}
                                        value={data?.email || ""}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <DropDownControls
                                        ref={dropDownRefs.current[2]}
                                        id="usDefaultLanguage"
                                        name="usDefaultLanguage"
                                        label="Language"
                                        onChange={updateContactHandleChange}
                                        value={data?.usDefaultLanguage || ""}
                                        dropdownList={language}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup className='mb-4'>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={new Date(data?.birthday) || null}
                                            label="Date Of Birth (MM/DD/YYYY)"
                                            inputFormat="MM/dd/yyyy"
                                            onChange={(Value) => {
                                                updateContactHandleChange("birthday", dateFormat(Value))
                                            }}
                                            slotProps={{ textField: { variant: "standard", className: "w-100" } }}
                                            maxDate={new Date()}
                                        />
                                    </LocalizationProvider>
                                </FormGroup>
                            </Col>
                        </Row>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Row>
                            {
                                contactUdf.length > 0 ?
                                    <>
                                        {
                                            contactUdf.map((value, index) => {
                                                return (
                                                    <Col key={index} xs={6}>
                                                        <FormGroup className='mb-4'>
                                                            <InputField
                                                                ref={inputRefs.current[contactInputRefsCount++]}
                                                                type="text"
                                                                id={`udf${value.udfLabel}`}
                                                                name={`udf${value.udfLabel}`}
                                                                label={value.udf}
                                                                onChange={updateContactHandleChange}
                                                                value={data[`udf${value.udfLabel}`] || ""}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                );
                                            })
                                        }
                                    </>
                                    :
                                    <Col xs={12} className="mb-3">No Data Found.</Col>
                            }
                            <Col xs={12} className="mb-3">
                                <Button variant="contained" color="primary" onClick={() => { createNewUdf() }} >ADD PERSONALIZATION FIELDS</Button>
                            </Col>
                            {
                                createNewUdfCount.length > 0 ?
                                    <>
                                        <Col xs={12} className="mt-4">{createNewUdfCount.map((count, index) => (addNewUdfBlock(count, index)))}</Col>
                                        <Col xs={12} className="mb-4 text-center"><Button variant="contained" color="primary" onClick={() => { updateUdf() }} >SAVE</Button></Col>
                                    </>
                                    :
                                    null
                            }
                        </Row>
                    </TabPanel>
                    <Row>
                        <Col xs={12} className="mb-4 px-5">
                            <Autocomplete
                                multiple
                                options={[]}
                                value={tags}
                                freeSolo
                                onChange={(event, newValue) => {
                                    setTags(newValue);
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip variant="default" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        name="tags"
                                        label="Tags"
                                    />
                                )}
                            />
                            <span className="d-flex mt-2 font-size-12 text-secondary">(Press enter to add Tags)</span>
                        </Col>
                        <Col xs={12} className="mb-4 px-5">
                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">If you want to send Opt In message, please select option below</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="optInType"
                                    value={data?.optInType || ""}
                                    onChange={(e)=>{updateContactHandleChange(e.target.name, e.target.value);}}
                                >
                                    <FormControlLabel className="mb-0" value="email" control={<Radio />} label="Email" />
                                    <FormControlLabel className="mb-0" value="sms" control={<Radio />} label="SMS" />
                                    <FormControlLabel className="mb-0" value="both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            </FormControl>
                        </Col>
                        <Col xs={12} className="mb-4 text-center">
                            <Button variant="contained" color="primary" onClick={() => { updateUdf() }} className="mr-3 updateUdf" >UPDATE</Button>
                            <Button variant="contained" color="primary" onClick={() => { setSelectedTabl(selectedTab) }} >CANCEL</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="borderBottomContactBox"></div>
            <ContactHistory emailId={emailId} user={user} subUser={subUser} firstName={data?.firstName} lastName={data?.lastName} phoneNumber={data?.phoneNumber} countryCode={data?.countryCode} />
            <ModalConversation
                conversationCharacterCount={conversationCharacterCount}
                conversationSMSCount={conversationSMSCount}
                conversationTemplateList={conversationTemplateList}
                dataConversation={dataConversation}
                dataCurrentConversations={dataCurrentConversations}
                dropDownRefsConversation={dropDownRefsConversation}
                inputRefsConversation={inputRefsConversation}
                isLoad={isLoad}
                modalConversation={modalConversation}
                closeConversation={closeConversation}
                handleChangeConversation={handleChangeConversation}
                sendConversation={sendConversation}
                toggleConversation={toggleConversation}
            />
            <ModalBuyTwilioNo
                countryBuyTwilioNo={countryBuyTwilioNo}
                dataBuyTwilioNo={dataBuyTwilioNo}
                dataSearchTwilioNo={dataSearchTwilioNo}
                dropDownRefsBuyTwilioNo={dropDownRefsBuyTwilioNo}
                inputRefsBuyTwilioNo={inputRefsBuyTwilioNo}
                modalBuyTwilioNo={modalBuyTwilioNo}
                msgSearchTwilioNo={msgSearchTwilioNo}
                user={user}
                handleChangeBuyTwilioNo={handleChangeBuyTwilioNo}
                saveBuyTwilioNo={saveBuyTwilioNo}
                searchBuyTwilioNo={searchBuyTwilioNo}
                toggleBuyTwilioNo={toggleBuyTwilioNo}
            />
            <ModalNumberList
                defaultYN={defaultYN}
                freeNumber={freeNumber}
                modalNumberList={modalNumberList}
                selectRadioNumber={selectRadioNumber}
                selectedFreeNumber={selectedFreeNumber}
                selectedUsedNumber={selectedUsedNumber}
                setSelectedFreeNumber={setSelectedFreeNumber}
                setSelectedUsedNumber={setSelectedUsedNumber}
                usedNumber={usedNumber}
                handleChangeFreeNumberList={handleChangeFreeNumberList}
                handleChangeSelectNumberType={handleChangeSelectNumberType}
                handleChangeUsedNumberList={handleChangeUsedNumberList}
                setDefaultYN={setDefaultYN}
                toggleNumberList={toggleNumberList}
            />
            {modalCalling && 
                <ModalCalling 
                    modalCalling={modalCalling}
                    toggleCalling={toggleCalling}
                    callingData={callingData}
                    to={data.countryCode + data.phoneNumber.replaceAll("-", "").slice(-10)}
                    from={user.twilioNumber}
                />
            }
            <ModalSendEmail
                modalSendEmail={modalSendEmail}
                toggleModalSendEmail={toggleModalSendEmail}
                user={user}
                email={user.email}
                subMemberId={subUser.memberId}
                subEmail={subUser.email}
                groupId={groupId}
                globalAlert={globalAlert}
                emailId={emailId}
            />
        </div>
    );
}
export const ContactHistory = ({ emailId, user, subUser, firstName, lastName, phoneNumber, countryCode }) => {
    const [valueContactHistory, setValueContactHistory] = useState(0);
    const handleChangeContactHistory = (event, newValue) => {
        setValueContactHistory(newValue);
    };
    const dataSMSConversations = {
        "contactEmailId": emailId,
        "contactFirstName": firstName,
        "contactLastName": lastName,
        "contactPhoneNumber": phoneNumber ? countryCode + phoneNumber : "",
        "memPhone": user.countryCode + user.cell,
        "memFirstName": user.firstName,
        "memLastName": user.lastName
    }
    const dataCalling = {
        "emailId": emailId,
        "firstName": firstName,
        "lastName": lastName,
        "subMemberId": subUser.memberId
    }
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Tabs
                        color="black"
                        value={valueContactHistory}
                        onChange={handleChangeContactHistory}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Emails" {...a11yProps(0)} />
                        <Tab label="Outgoing SMS" {...a11yProps(1)} />
                        <Tab label="Incoming SMS" {...a11yProps(2)} />
                        <Tab label="SMS Polling" {...a11yProps(3)} />
                        <Tab label="SMS Conversations" {...a11yProps(4)} />
                        <Tab label="Calling" {...a11yProps(5)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={valueContactHistory} index={0}><ContactHistoryEmails emailId={emailId} /></TabPanel>
                    <TabPanel value={valueContactHistory} index={1}><ContactHistoryOutgoingSMS emailId={emailId} /></TabPanel>
                    <TabPanel value={valueContactHistory} index={2}><ContactHistoryIncomingSMS emailId={emailId} /></TabPanel>
                    <TabPanel value={valueContactHistory} index={3}><ContactHistorySMSPolling emailId={emailId} /></TabPanel>
                    <TabPanel value={valueContactHistory} index={4}><ContactHistorySMSConversations dataSMSConversations={dataSMSConversations} /></TabPanel>
                    <TabPanel value={valueContactHistory} index={5}><ContactHistoryCalling dataCalling={dataCalling} /></TabPanel>
                </Col>
            </Row>
        </>
    );
}
export const ContactHistoryEmails = ({ emailId }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getSendEmails(emailId).then(res => {
            if (res.status === 200) {
                setData(res.result.emailHistory);
            }
        })
    }, [emailId]);
    return (
        <Timeline className="py-0 mb-0">
            {
                data.length > 0 ?
                    data.map((value, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot className="m-0">
                                    <InsertDriveFileIcon />
                                </TimelineDot>
                                {index < (data.length - 1) ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <p className="mb-1">{dateFormatContactHistory(value.sendOnDate)}<span className="ml-2 time-color">{timeFormat(value.sendOnDate)}</span></p>
                                <p>{value.subject}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                    :
                    <p>No Data Found.</p>
            }
        </Timeline>
    );
}
export const ContactHistoryOutgoingSMS = ({ emailId }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getOutgoingSMS(emailId).then(res => {
            if (res.status === 200) {
                setData(res.result.outgoingSmsHistory);
            }
        })
    }, [emailId]);
    return (
        <Timeline className="py-0 mb-0">
            {
                data.length > 0 ?
                    data.map((value, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot className="m-0">
                                    <InsertDriveFileIcon />
                                </TimelineDot>
                                {index < (data.length - 1) ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <p className="mb-1">{dateFormatContactHistory(value.smsSendDate)}<span className="ml-2 time-color">{timeFormat(value.smsSendDate)}</span></p>
                                <p>{value.smsName}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                    :
                    <p>No Data Found.</p>
            }
        </Timeline>
    );
}
export const ContactHistoryIncomingSMS = ({ emailId }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getIncomingSMS(emailId).then(res => {
            if (res.status === 200) {
                setData(res.result.incomingSmsHistory);
            }
        })
    }, [emailId]);
    return (
        <Timeline className="py-0 mb-0">
            {
                data.length > 0 ?
                    data.map((value, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot className="m-0">
                                    <InsertDriveFileIcon />
                                </TimelineDot>
                                {index < (data.length - 1) ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <p className="mb-1">{dateFormatContactHistory(value.crDate)}<span className="ml-2 time-color">{timeFormat(value.crDate)}</span></p>
                                <p>{value.crReply}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                    :
                    <p>No Data Found.</p>
            }
        </Timeline>
    );
}
export const ContactHistorySMSPolling = ({ emailId }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getSMSPolling(emailId).then(res => {
            if (res.status === 200) {
                setData(res.result.smsPollingHistory);
            }
        })
    }, [emailId]);
    return (
        <Timeline className="py-0 mb-0">
            {
                data.length > 0 ?
                    data.map((value, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot className="m-0">
                                    <InsertDriveFileIcon />
                                </TimelineDot>
                                {index < (data.length - 1) ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <p className="mb-1">{dateFormatContactHistory(value.smsSendDate)}<span className="ml-2 time-color">{timeFormat(value.smsSendDate)}</span></p>
                                <p>{value.vHeading}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                    :
                    <p>No Data Found.</p>
            }
        </Timeline>
    );
}
export const ContactHistorySMSConversations = ({ dataSMSConversations }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getConversations(dataSMSConversations).then(res => {
            if (res.status === 200) {
                setData(res.result.conversationsHistory);
            }
        })
    }, [dataSMSConversations]);
    return (
        <Timeline className="py-0 mb-0">
            {
                data.length > 0 ?
                    data.map((value, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot className="m-0">
                                    <InsertDriveFileIcon />
                                </TimelineDot>
                                {index < (data.length - 1) ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <p className="mb-1">{(value.cvsdClientId === 0 || value.cvsdSender === 'm') ? `${value.memFirstName} ${value.memLastName} - ` : `${value.contactFirstName} ${value.contactLastName} - `}{dateFormatContactHistory(value.cvsdDate)}<span className="ml-2 time-color">{timeFormat(value.cvsdDate)}</span></p>
                                <p className="text-white-space">{value.cvsdMessage}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                    :
                    <p>No Data Found.</p>
            }
        </Timeline>
    );
}
export const ContactHistoryCalling = ({ dataCalling }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getCalling(dataCalling).then(res => {
            if (res.status === 200) {
                setData(res.result.callingHistory);
            }
        })
    }, [dataCalling]);
    return (
        <Timeline className="py-0 mb-0">
            {
                data.length > 0 ?
                    data.map((value, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot className="m-0">
                                    <InsertDriveFileIcon />
                                </TimelineDot>
                                {index < (data.length - 1) ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <p className="mb-1">{dateFormatContactHistory(value.cpDate)}<span className="ml-2 time-color">{timeFormat(value.cpDate)}</span></p>
                                <p className="mb-1">{`Calling To ${value.firstName} ${value.lastName}`}</p>
                                <p className="mb-1 font-weight-bold">Duration</p>
                                <p>{`${getInitials(value.firstName, value.lastName)} : ${value.ccDuration}`}</p>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                    :
                    <p>No Data Found.</p>
            }
        </Timeline>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditContact);