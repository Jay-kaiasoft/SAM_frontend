import React, { createRef, Fragment, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Tabs, Tab, Button, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import { getSubUserPhoneList } from "../../services/userService";
import { deleteSmsPollingNumber, getSmsPollingPhoneList } from "../../services/smsPollingService";
import {TabPanel, a11yProps, checkPopupClose, displayFormatNumber} from "../../assets/commonFunctions";
import {changeSmsConversationsNumber, checkConversationsNumberStatus, checkDefaultConversationsNumber, deleteSmsConversationsNumber, getConversationsNumber} from "../../services/smsInboxServices";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import InputField from "../shared/commonControlls/inputField";
import {searchForBuyNumber} from "../../services/clientContactService";
import {checkAuthorized, getCountry} from "../../services/commonService";
import { changeSmsCampaignNumber, setCampaignNumber } from './../../services/smsCampaignService';
import { connect } from 'react-redux';
import { setLoader } from "../../actions/loaderActions";
import { get10DLCStatus, set10DLCStatus } from "../../services/profileService";
import Loader from "../shared/loaderV2/loader";
import { setPendingTransactionAction } from "../../actions/pendingTransactionActions";
import History from "../../history";
import { tenDLCFormUrl, websiteTitle } from "../../config/api";
import ForwardCallModal from "./forwardCallModal";
import { deleteNumberForwarding } from "../../services/numberForwardingService";
const SmsPollPhoneList = lazy(() => import("./smsPollPhoneList"));
const SmsCampaignPhoneList = lazy(() => import("./smsCampaignPhoneList"));
const SmsConversation = lazy(() => import("./smsConversation"))
const SubUser = lazy(() => import("./subUser"))
const TenDlc = lazy(() => import("./tenDlc"))

const SmsMember = ({globalAlert, user, smsCampaignPhoneList, displayGetSmsCampaignPhoneList, handleSmsCampaignPhoneListCollaplse, handleDeleteSmsCampaignNumber, confirmDialog, subUser, userLoggedIn, setLoader, smsCampaignReleasePhoneList, handleSmsCampaignReleasePhoneListCollaplse, handleClickSwitchToConversation, pendingTransaction, setSubUserAction}) => {
    const [value, setValue] = React.useState(0);
    const [subUserList, setSubUserList] = useState([])
    const [smsPollingPhoneList, setSmsPollingPhoneList] = useState([])
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setModalBuyTwilioNo(!modalBuyTwilioNo);
        setDataBuyTwilioNo({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
    };
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const [defaultConversationsTwilioNumber, setDefaultConversationsTwilioNumber] = useState({});
    const [numberStatus, setNumberStatus] = useState("");
    const [tenDLCStatus, setTenDLCStatus] = useState(false);
    const [tenDLCValue, setTenDLCValue] = useState("No");
    const [tenDLCPrice, setTenDLCPrice] = useState("$0");
    const [countryForwardCall, setCountryForwardCall] = useState([]);
    const [dataForwardCall, setDataForwardCall] = useState({ "cfnForwardingCountryCode": "US" });
    const [modalForwardCall, setModalForwardCall] = useState(false);
    const toggleForwardCall = () => { setModalForwardCall(!modalForwardCall); };
    const [conversationsTwilioNumber, setConversationsTwilioNumber] = useState({});
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const displayGetSmsPollingPhoneList = useCallback(() => {
        getSmsPollingPhoneList().then(res => {
            if (res.status === 200) {
                let smsPollingPhoneList = res?.result?.smsPolling
                smsPollingPhoneList = smsPollingPhoneList.map((item) => {
                    return {
                        ...item,
                        isMaster: item?.smsDisplay === "Y" ? true : false
                    }
                })
                setSmsPollingPhoneList(smsPollingPhoneList)
            } else {
                globalAlert({
                    open: true,
                    type: "Error",
                    text: res.message
                })
            }
        });
    },[globalAlert]);
    const displayConversationsNumber = useCallback(() => {
        if(typeof user.conversationsTwilioNumber !== "undefined" && user.conversationsTwilioNumber !== "" && user.conversationsTwilioNumber !== null){
            getConversationsNumber().then(res => {
                if (res.status === 200) {
                    setConversationsTwilioNumber(res.result);
                } else {
                    globalAlert({
                        open: true,
                        type: "Error",
                        text: res.message
                    })
                }
            });
        } else {
            checkDefaultConversationsNumber().then(res => {
                if (res.status === 200) {
                    setDefaultConversationsTwilioNumber(res.result);
                }
            });
        }
    },[]);
    useEffect(() => {
        getSubUserPhoneList().then(res => {
            if (res.status === 200) {
                setSubUserList(res?.result?.subUserList)
            } else {
                globalAlert({
                    open: true,
                    type: "Error",
                    text: res.message
                })
            }
        });
        displayGetSmsPollingPhoneList();
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
                country = [];             
                res.result.country.map(x => (
                    country.push({
                        "key": x.iso2,
                        "value": x.cntName,
                        "id": String(x.id),
                        "cntCode": x.cntCode
                    })
                ));
                setCountryForwardCall(country);
            }
        });
        displayConversationsNumber();
        get10DLCStatus().then(res => {
            if (res.status === 200) {
                setTenDLCValue(res.result.status);
                setTenDLCStatus(res.result.status === "No" ? false : true);
                setTenDLCPrice(res.result.priceSymbol+res.result.tenDLCPrice);
            }
        });
        let value = "";
        if(typeof user.conversationsTwilioNumber !== "undefined" && user.conversationsTwilioNumber !== "" && user.conversationsTwilioNumber !== null){
            value = "conversations";
        } else if(typeof defaultConversationsTwilioNumber !== "undefined" && defaultConversationsTwilioNumber !== "" && defaultConversationsTwilioNumber !== null) {
            value = "defaultConversations";
        }
        checkConversationsNumberStatus(value).then(res => {
            if (res.status === 200) {
                setNumberStatus(res.result.numberStatus)
                return ;
            }
        });
    }, [globalAlert, displayGetSmsPollingPhoneList, user.conversationsTwilioNumber, displayConversationsNumber]);
    const handleDeleteSmsPollingNumber = (id, phoneNo) => {
        confirmDialog({
            open: true,
            title: `Any SMS Polling opened with this number will be closed.\nThis action can not be undone.\nOnce you terminate the phone number ${phoneNo}, it is not recoverable.\nWould you like to terminate this number?`,
            onConfirm: () => {
                deleteSmsPollingNumber(id).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            open: true,
                            type: "Success",
                            text: res.message
                        });
                        displayGetSmsPollingPhoneList();
                    } else {
                        globalAlert({
                            open: true,
                            type: "Error",
                            text: res.message
                        })
                    }
                })
            }
        })
    }
    const handleSmsPollingPhoneListCollapse = (position) => {
        let smsPollingPhoneListCopy = [...smsPollingPhoneList]
        if (!smsPollingPhoneListCopy[position].isMaster) {
            return
        }
        let i
        for (i = position + 1; i < smsPollingPhoneListCopy.length; i++) {
            if (smsPollingPhoneListCopy[i].isMaster) {
                break;
            }
            smsPollingPhoneListCopy[i] = {
                ...smsPollingPhoneListCopy[i],
                smsDisplay: smsPollingPhoneListCopy[i].smsDisplay === "Y" ? "N" : "Y"
            }
        }
        setSmsPollingPhoneList(smsPollingPhoneListCopy)
    }
    const handleDeleteSmsConversationsNumber = () => {
        confirmDialog({
            open: true,
            title: `Any SMS Conversation opened with this number will be closed.\nThis action can not be undone.\nOnce you terminate the phone number ${user.conversationsTwilioNumber} it is not recoverable.\nWould you like to terminate this number?`,
            onConfirm: () => {
                deleteSmsConversationsNumber(user.memberId).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            open: true,
                            type: "Success",
                            text: res.message
                        });
                        if(subUser.memberId > 0){
                            setSubUserAction({ ...subUser, "twilioNumber": res.result.twilioNumber, "conversationsTwilioNumber": res.result.conversationsTwilioNumber });
                            sessionStorage.setItem('subUser',JSON.stringify({ ...subUser, "twilioNumber": res.result.twilioNumber, "conversationsTwilioNumber": res.result.conversationsTwilioNumber }));
                        } else {
                            userLoggedIn({...user, "twilioNumber": res.result.twilioNumber, "conversationsTwilioNumber": res.result.conversationsTwilioNumber});
                            sessionStorage.setItem('user',JSON.stringify({...user, "twilioNumber": res.result.twilioNumber, "conversationsTwilioNumber": res.result.conversationsTwilioNumber}));
                        }
                    } else {
                        globalAlert({
                            open: true,
                            type: "Error",
                            text: res.message
                        })
                    }
                });
            }
        })
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
            onConfirm: () => { confirmSaveBuyTwilioNoSelection() }
        })
    }
    const confirmSaveBuyTwilioNoSelection = () => {
        if(value === 0){
            confirmSaveBuyTwilioNoCampaign()
        } else if (value === 2){
            confirmSaveBuyTwilioNo()
        } else {
            globalAlert({
                type: "Error",
                text: "OOPS!! Something went wrong. Please try again.",
                open: true
            });
        }
    }
    const confirmSaveBuyTwilioNo = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "conversationsTwilioNumber":dataBuyTwilioNo.twilioNumber,
            "subMemberId":subUser.memberId,
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        changeSmsConversationsNumber(d).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({ ...subUser, "conversationsTwilioNumber": res.result.conversationsTwilioNumber, "twilioNumber": res.result.twilioNumber });
                    sessionStorage.setItem('subUser',JSON.stringify({ ...subUser, "conversationsTwilioNumber": res.result.conversationsTwilioNumber, "twilioNumber": res.result.twilioNumber }));
                } else {
                    userLoggedIn({...user, "conversationsTwilioNumber": res.result.conversationsTwilioNumber, "twilioNumber": res.result.twilioNumber});
                    sessionStorage.setItem('user',JSON.stringify({...user, "conversationsTwilioNumber": res.result.conversationsTwilioNumber, "twilioNumber": res.result.twilioNumber}));
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
    const confirmSaveBuyTwilioNoCampaign = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "fullName":`${user.firstName} ${user.lastName}`,
            "twilioNumber":dataBuyTwilioNo.twilioNumber,
            "subMemberId":subUser.memberId,
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        changeSmsCampaignNumber(d).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({ ...subUser, "twilioNumber": dataBuyTwilioNo.twilioNumber });
                    sessionStorage.setItem('subUser',JSON.stringify({ ...subUser, "twilioNumber": dataBuyTwilioNo.twilioNumber }));
                } else {
                    userLoggedIn({...user, "twilioNumber": dataBuyTwilioNo.twilioNumber});
                    sessionStorage.setItem('user',JSON.stringify({...user, "twilioNumber": dataBuyTwilioNo.twilioNumber}));
                }
                displayGetSmsCampaignPhoneList();
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
    const setToggleBuyTwilioNo = () => {
        confirmDialog({
            open: true,
            title: `Any ${value === 0 ? "SMS campaign" : "SMS Conversation" } opened with this number will be closed.\nAre you sure you want to change?`,
            onConfirm: () => { toggleBuyTwilioNo() }
        });
    }
    const handleClickSwitchToCampaign = () => {
        confirmDialog({
            open: true,
            title: `Switching the number will unset your default number.\nConversations will be closed with number.\nAre you sure to switch?`,
            onConfirm: () => { 
                let d = {
                    "conversationsTwilioNumber":user.conversationsTwilioNumber,
                    "subMemberId":subUser.memberId
                }
                setCampaignNumber(d).then(res => {
                    if (res.status === 200) {
                        if(user.conversationsTwilioNumber === defaultConversationsTwilioNumber){
                            setDefaultConversationsTwilioNumber({});
                        }
                        if(subUser.memberId > 0){
                            setSubUserAction({ ...subUser, "conversationsTwilioNumber": null });
                            sessionStorage.setItem('subUser',JSON.stringify({ ...subUser, "conversationsTwilioNumber": null }));
                        } else {
                            userLoggedIn({...user, "conversationsTwilioNumber": null});
                            sessionStorage.setItem('user',JSON.stringify({...user, "conversationsTwilioNumber": null}));
                        }
                        displayGetSmsCampaignPhoneList();
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
        });
    }
    const handleChangeTenDLC = () => {
        if(tenDLCStatus === false){
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    setLoader({
                        load: true,
                        text: "Please wait !!!"
                    });
                    let closeWindow = window.open(tenDLCFormUrl, "_blank");
                    checkPopupClose(setLoader, setTenDLCStatus, closeWindow, globalAlert, setTenDLCValue);
                } else {
                    confirmDialog({
                        open: true,
                        title: 'Your credit card is not available. Please add it.',
                        onConfirm: () => {
                            pendingTransaction([{
                                "pendingTransactionType": "tenDLC"
                            }]);
                            History.push("/carddetails");
                        }
                    })
                }
            });
        } else if(tenDLCStatus === true) {
            confirmDialog({
                open: true,
                title: `Are you sure, you want to turn off 10DLC?`,
                onConfirm: () => {
                    let requestData = {
                        status : false
                    }
                    set10DLCStatus(requestData).then(res => {
                        if (res.status === 200) {
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            setTenDLCStatus(false);
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
    }
    const handleSetDisplayFunction = () => {
        if(value === 0){
            displayGetSmsCampaignPhoneList();
        } else if(value === 1) {
            displayGetSmsPollingPhoneList();
        } else if(value === 2){
            displayConversationsNumber();
        }
    }
    const handleClickForwardCallSwitch = (condition, numberCallForwarding, cfnTwilioNumber, cfnTwilioPhoneSid) => {
        if(condition){
            if(numberCallForwarding === null){
                handleChangeForwardCall("cfnForwardingNumber", user.cell);
                let tempIso2 = countryForwardCall.filter((x)=>{ return x.id === user.country })[0].key;
                handleChangeForwardCall("cfnForwardingCountryCode", tempIso2);
                handleChangeForwardCall("cfnId", 0);
            } else {
                handleChangeForwardCall("cfnForwardingNumber", numberCallForwarding.cfnForwardingNumber);
                let tempIso2 = countryForwardCall.filter((x)=>{ return x.cntCode === numberCallForwarding.cfnForwardingCountryCode })[0].key;
                handleChangeForwardCall("cfnForwardingCountryCode", tempIso2);
                handleChangeForwardCall("cfnId", numberCallForwarding.cfnId);
            }
            handleChangeForwardCall("cfnTwilioNumber", "+"+cfnTwilioNumber.replaceAll("+",""));
            handleChangeForwardCall("cfnTwilioPhoneSid", cfnTwilioPhoneSid);
            toggleForwardCall();
        } else {
            confirmDialog({
                open: true,
                title: `Are you sure, you want to stop call forwarding?`,
                onConfirm: () => {
                    deleteNumberForwarding(numberCallForwarding.cfnId).then(res => {
                        if (res.status === 200) {
                            handleSetDisplayFunction();
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
    }
    const handleChangeForwardCall = (name, value) => {
        setDataForwardCall(prev => ({ ...prev, [name]: value }));
    }
    const checkCollapse = (isMaster1, isMaster2) => {
        let tempIsMaster2;
        if(typeof isMaster2 === "undefined"){
            tempIsMaster2=true;
        } else {
            tempIsMaster2 = isMaster2;
        }
        return (isMaster1 && (tempIsMaster2 === false)); 
    }
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mt-5'>SMS</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="SMS Campaign Phone List" {...a11yProps(0)} />
                        <Tab label="SMS Poll Phone List" {...a11yProps(1)} />
                        <Tab label="SMS Conversation" {...a11yProps(2)} />
                        <Tab label="Sub User" {...a11yProps(3)} />
                        <Tab label="10DLC" {...a11yProps(4)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={10} lg={10} xl={10} className="mx-auto">
                    <TabPanel value={value} index={0}>
                        <Suspense fallback={<Loader />}>
                            <SmsCampaignPhoneList
                                smsCampaignPhoneList={smsCampaignPhoneList}
                                handleSmsCampaignPhoneListCollaplse={handleSmsCampaignPhoneListCollaplse}
                                handleDeleteSmsCampaignNumber={handleDeleteSmsCampaignNumber}
                                user={user}
                                subUser={subUser}
                                setToggleBuyTwilioNo={setToggleBuyTwilioNo}
                                smsCampaignReleasePhoneList={smsCampaignReleasePhoneList}
                                handleSmsCampaignReleasePhoneListCollaplse={handleSmsCampaignReleasePhoneListCollaplse}
                                handleClickSwitchToConversation={handleClickSwitchToConversation}
                                handleClickForwardCallSwitch={handleClickForwardCallSwitch}
                                checkCollapse={checkCollapse}
                            />
                        </Suspense>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Suspense fallback={<Loader />}>
                            <SmsPollPhoneList
                                smsPollingPhoneList={smsPollingPhoneList}
                                handleSmsPollingPhoneListCollapse={handleSmsPollingPhoneListCollapse}
                                handleDeleteSmsPollingNumber={handleDeleteSmsPollingNumber}
                                handleClickForwardCallSwitch={handleClickForwardCallSwitch}
                                checkCollapse={checkCollapse}
                            />
                        </Suspense>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Suspense fallback={<Loader />}>
                            <SmsConversation
                                defaultConversationsTwilioNumber={defaultConversationsTwilioNumber}
                                numberStatus={numberStatus}
                                user={user}
                                handleClickSwitchToCampaign={handleClickSwitchToCampaign}
                                handleDeleteSmsConversationsNumber={handleDeleteSmsConversationsNumber}
                                setToggleBuyTwilioNo={setToggleBuyTwilioNo}
                                handleClickForwardCallSwitch={handleClickForwardCallSwitch}
                                globalAlert={globalAlert}
                                conversationsTwilioNumber={conversationsTwilioNumber}
                            />
                        </Suspense>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Suspense fallback={<Loader />}>
                            <SubUser subUserList={subUserList} />
                        </Suspense>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Suspense fallback={<Loader />}>
                            <TenDlc
                                tenDLCPrice={tenDLCPrice}
                                tenDLCStatus={tenDLCStatus}
                                tenDLCValue={tenDLCValue}
                                handleChangeTenDLC={handleChangeTenDLC}
                            />
                        </Suspense>
                    </TabPanel>
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalBuyTwilioNo} toggle={toggleBuyTwilioNo}>
                <ModalHeader toggle={toggleBuyTwilioNo}>SMS/MMS Number Setup</ModalHeader>
                <ModalBody>
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
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=>{saveBuyTwilioNo()}} >SAVE</Button>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleBuyTwilioNo()}} >CANCEL</Button>
                </ModalFooter>
            </Modal>
            <ForwardCallModal
                modalForwardCall={modalForwardCall}
                toggleForwardCall={toggleForwardCall}
                dataForwardCall={dataForwardCall}
                handleChangeForwardCall={handleChangeForwardCall}
                countryForwardCall={countryForwardCall}
                subUser={subUser}
                globalAlert={globalAlert}
                displayData={ handleSetDisplayFunction }
            />
        </Fragment>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        setLoader: (data) => {
            dispatch(setLoader(data))
        },
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(SmsMember);