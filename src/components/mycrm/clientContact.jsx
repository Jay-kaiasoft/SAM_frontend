import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { format } from 'date-fns';
import { Input, Collapse, Popover, PopoverBody, Row, Col } from 'reactstrap';
import { addContact, deleteBulkContact, deleteBulkGroup, getBadEmailContactList, getBadSMSContactList, getContactList, getDuplicateContactList, getGroupById, getGroupSegmentDetails, getGroupUDF, getSegmentContactList, getUnsubscribedContactList, inviteByUrl, removeDuplicateContact, saveGroup, deleteSegment, getSegment, moveContactExistingGroup, getDownloadNotGroupContactFile, getGroupListWithCheckDuplicate, sendSubscribeLink, emailVerificationGroup, getUnsubscribedSmsContactList, sendOptInGroup, searchForBuyNumber, getSegmentList } from "../../services/clientContactService";
import { Link, } from "@mui/material";
import { checkAuthorized, countryToStateName, getCountry, getDisplayLanguage, getLanguage, validatePhoneFormat } from "../../services/commonService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import { siteURL, websiteTitle } from "../../config/api";
import { handleClickHelp, toCamelCase, validateEmail } from "../../assets/commonFunctions";
import { fetchGroupUdfList, getSegmentDetails, setDuplicateSegmentPopUp, setEditSegmentPopUp, setNewSegmentPopUp, setSegmentDetails } from "../../actions/createSegmentActions";
import CreateSegment from "./createSegment";
import EditSegment from "./editSegment";
import DuplicateSegment from "./duplicateSegment";
import EditContact from "./editContact";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import $ from "jquery"
import { setLoader } from "../../actions/loaderActions";
import FullScreenModal from "./components/fullScreenModal";
import ModalCopyContact from "./components/modalCopyContact";
import ModalCreateContact from "./components/modalCreateContact";
import ModalCreateGroup from "./components/modalCreateGroup";
import ModalUpdateGroup from "./components/modalUpdateGroup";
import ModalInviteUrl from "./components/modalInviteUrl";
import ModalExportContact from "./components/modalExportContact";
import ModalMoveContact from "./components/modalMoveContact";
import { Tab0, Tab1, Tab2 } from "./components/tabs";
import { setPendingTransactionAction } from "../../actions/pendingTransactionActions";
import History from "../../history";
import UnsubscribeModal from "./components/unsubscribeModal";
import OptInModal from "./components/optInModal";
import ModalBuyTwilioNo from "./components/modalBuyTwilioNo";
import { buyNumber } from "../../services/smsInboxServices";
import { userLoggedIn } from "../../actions/userActions";
import { setSubUserAction } from "../../actions/subUserActions";
import { resetViewVisitorProfileAction } from "../../actions/viewVisitorProfileActions";

const client = [
    {
        id: 1,
        name: "Ocean Marketing Agency",
        address: "CA 95820"
    },
    {
        id: 2,
        name: "Ematrix",
        address: "CA 95820"
    },
    {
        id: 3,
        name: "Kaiasoft",
        address: "CA 95820"
    }
]

const ClientContact = (props) => {    
    const [clickedClient, setClickedClient] = useState(null);
    const [clientIdList, setClientIdList] = useState([]);


    const [selectedTab, setSelectedTabl] = useState(0);
    const [selectedTabOld, setSelectedTabOld] = useState(0);
    const [isOpen, setIsOpen] = useState([]);
    const [mainCheckBox, setMainCheckBox] = useState(false);
    const [clickedGroup, setClickedGroup] = useState({ "groupId": 0, "groupName": "", "duplicateRecords": "" });
    const [clickedSegment, setClickedSegment] = useState({ "segmentId": 0 });
    const [groupCheckBoxGroupIdList, setGroupCheckBoxGroupIdList] = useState([]);
    const [segmentCheckBoxIdList, setSegmentCheckBoxIdList] = useState([]);
    const [popoverOpen, setPopoverOpen] = useState([]);
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValueGroupIdList, setTableCheckBoxValueGroupIdList] = useState([]);
    const [groupSegmentDetails, setGroupSegmentDetails] = useState([]);
    const [contactDetails, setContactDetails] = useState("");
    const [unsubscribedContactList, setUnsubscribedContactList] = useState([]);
    const [badEmailAndSMSContactList, setBadEmailAndSMSContactList] = useState([]);
    const [languages, setLanguages] = useState("");
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    const toggleCreateGroup = () => { setModalCreateGroup(!modalCreateGroup); setCreateGroupData({}); setCreateUDFNo(0); };
    const [modalUpdateGroup, setModalUpdateGroup] = useState(false);
    const toggleUpdateGroup = () => setModalUpdateGroup(!modalUpdateGroup);
    const [modalInviteUrl, setModalInviteUrl] = useState(false);
    const toggleInviteUrl = () => setModalInviteUrl(!modalInviteUrl);
    const [modalCreateContact, setModalCreateContact] = useState(false);
    const toggleCreateContact = () => { setModalCreateContact(!modalCreateContact); setCreateContactData({ "fullName": "", "usDefaultLanguage": "en", "optInType": "" }); };
    const [modalMoveContact, setModalMoveContact] = useState(false);
    const toggleMoveContact = () => setModalMoveContact(!modalMoveContact);
    const [modalExportContact, setModalExportContact] = useState(false);
    const toggleExportContact = () => setModalExportContact(!modalExportContact);
    const [modalCopyContact, setModalCopyContact] = useState(false);
    const toggleCopyContact = () => setModalCopyContact(!modalCopyContact);
    const [modalUnsubscribe, setModalUnsubscribe] = useState(false);
    const toggleUnsubscribe = () => setModalUnsubscribe(!modalUnsubscribe);
    const [totalContacts, setTotalContacts] = useState(0);
    const totalUDFNo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const dropDownUDF = [{ "key": 0, "value": "User Defined Fields" }, { "key": 1, "value": 1 }, { "key": 2, "value": 2 }, { "key": 3, "value": 3 }, { "key": 4, "value": 4 }, { "key": 5, "value": 5 }, { "key": 6, "value": 6 }, { "key": 7, "value": 7 }, { "key": 8, "value": 8 }, { "key": 9, "value": 9 }, { "key": 10, "value": 10 }];
    const [createUDFNo, setCreateUDFNo] = useState(0);
    const [createGroupData, setCreateGroupData] = useState({});
    const [updateGroupData, setUpdateGroupData] = useState({ "groupId": "", "groupName": "" });
    const [inviteUrlData, setInviteUrlData] = useState("");
    const inputRefsCreateContact = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const dropDownRefsCreateContact = useRef([createRef(), createRef(), createRef()]);
    const numberRefsCreateContact = useRef([createRef(), createRef()]);
    const [createContactData, setCreateContactData] = useState({ "fullName": "", "usDefaultLanguage": "en", "optInType": "" });
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [language, setLanguage] = useState([]);
    const [createContactUdf, setCreateContactUdf] = useState([]);
    let createContactInputRefsCount = 7;
    const clickedToEdit = ["firstName", "lastName", "email", "phoneNumber"];
    const [editEmailId, setEditEmailId] = useState("");
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [sort, setSort] = useState("firstName,asc");
    const [sortBox, setSortBox] = useState([true]);
    const [search, setSearch] = useState("");
    const [searchSend, setSearchSend] = useState("");
    const [totalContactsByGroup, setTotalContactsByGroup] = useState(0);
    const [showTableHead, setShowTableHead] = useState([]);
    const [showDuplicateButtonClicked, setShowDuplicateButtonClicked] = useState("no");
    const [fullscreenModal, setFullScreenModal] = useState(false);
    const [badEmailSmsTab, setBadEmailSmsTab] = useState("badEmail");
    const [unsubscribedEmailSmsTab, setUnsubscribedEmailSmsTab] = useState("unsubscribedEmail");
    const [selectionType, setSelectionType] = useState("selected");
    const [dataUnsubscribe, setDataUnsubscribe] = useState({});
    const [optInTypeButton, setOptInTypeButton] = useState("");
    const [optInType, setOptInType] = useState("");
    const [modalOptIn, setModalOptIn] = useState(false);
    const toggleOptIn = () => {
        setModalOptIn(!modalOptIn);
        if (modalOptIn) {
            setOptInType("");
            setOptInTypeButton("");
        }
    }
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({ "areaCode": 0, "countryCode": "US", "checkForwardingYesNo": "no" });
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setDataBuyTwilioNo({ "areaCode": 0, "countryCode": "US", "checkForwardingYesNo": "no" });
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
        setModalBuyTwilioNo(!modalBuyTwilioNo);
    };
    let createRefArray = [];
    createRefArray.push(createRef());
    for (let i = 0; i < 10; i++) {
        createRefArray.push(createRef());
    }
    const inputRefs = useRef(createRefArray);
    const dropDownRefs = useRef([createRef()]);
    const updateInputRefs = useRef([createRef()]);
    const copyInputRefs = useRef([createRef()]);
    const [intervalForTypeEmail, setIntervalForTypeEmail] = useState("No");
    const groupDataOnly = useRef([]);
    // const [checkLockGroup, setCheckLockGroup] = useState("Yes");
    const toggle = (index) => {
        const index1 = isOpen.indexOf(index);
        if (index1 > -1) {
            const newIsOpen = isOpen.filter(isOpenIndex => isOpenIndex !== index);
            setIsOpen(newIsOpen)
        } else {
            const newIsOpen = [...isOpen, index]
            setIsOpen(newIsOpen)
        }
    }
    const mainCheckBoxClicked = () => {
        let flag = mainCheckBox
        setMainCheckBox(!flag)
        const newGroupCheckBoxBoxGroupIdList = []
        groupSegmentDetails.forEach(element => {
            if (!flag)
                newGroupCheckBoxBoxGroupIdList.push(element.groupId)
        });
        setGroupCheckBoxGroupIdList(newGroupCheckBoxBoxGroupIdList);
    }
    const groupCheckBoxClicked = (groupId) => {
        if (groupCheckBoxGroupIdList.includes(groupId)) {
            setGroupCheckBoxGroupIdList(prevState => (prevState.filter(x => x !== groupId)));
        } else {
            setGroupCheckBoxGroupIdList([...groupCheckBoxGroupIdList, groupId]);
        }
    };
    useEffect(() => {
        if (groupSegmentDetails.length !== groupCheckBoxGroupIdList.length || groupSegmentDetails.length === 0 || groupCheckBoxGroupIdList.length === 0) {
            setMainCheckBox(false);
        } else {
            setMainCheckBox(true);
        }
        return () => {
            setMainCheckBox(false);
        }
    }, [groupSegmentDetails.length, groupCheckBoxGroupIdList.length]);
    const toggleFullscreenModal = () => {
        setFullScreenModal(!fullscreenModal);
    };
    const segmentCheckBoxClicked = (segmentId) => {
        if (segmentCheckBoxIdList.includes(segmentId)) {
            setSegmentCheckBoxIdList(prevState => (prevState.filter(x => x !== segmentId)));
        } else {
            setSegmentCheckBoxIdList([...segmentCheckBoxIdList, segmentId]);
        }
    }
    const unSunbcribedClick = () => {
        setClickedGroup({ "groupId": 0, "groupName": "", "duplicateRecords": "" });
        setSelectedPage(0);
        setPerPage(25);
        setSort("firstName,asc");
        setSearch("");
        setSearchSend("");
        setTableCheckBoxValueGroupIdList([]);
        setMainTablecheckBoxValue(false);
        setSelectedTabOld(selectedTab);
        setSelectedTabl(1);
    }
    const badContactClick = () => {
        setClickedGroup({ "groupId": 0, "groupName": "", "duplicateRecords": "" });
        setSelectedPage(0);
        setPerPage(25);
        setSort("firstName,asc");
        setSearch("");
        setSearchSend("");
        setTableCheckBoxValueGroupIdList([]);
        setMainTablecheckBoxValue(false);
        setSelectedTabOld(selectedTab);
        setSelectedTabl(2)
    }
    const displayContactList = useCallback((groupId) => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setContactDetails("");
        if (showDuplicateButtonClicked === "no") {
            if (groupId !== 0) {
                getContactList(groupId, data).then(res => {
                    if (res.result) {
                        let head = [];
                        res.result.contactHeaderKey.map((value) => (
                            value === "firstName" || value === "lastName" ?
                                !head.includes(value) ? head.push(value) : null
                                :
                                res.result.contact.map((value2) => (
                                    (value2[value] !== "" && value2[value] !== null && value2[value] !== 0) ?
                                        !head.includes(value) ? head.push(value) : null
                                        : null
                                ))
                        ))
                        let t = res.result.contact.filter((v) => { return v.typeEmail === "email" });
                        setIntervalForTypeEmail(t.length > 0 ? "Yes" : "No");
                        setShowTableHead(head);
                        setContactDetails(res.result);
                        setTotalPages(res.result.getTotalPages);
                        setTotalContactsByGroup(res.result.totalContact)
                    }
                });
            } else {
                setContactDetails({ "contact": [] });
            }
        } else if (showDuplicateButtonClicked === "yes") {
            getDuplicateContactList(clickedGroup.groupId, data).then(res => {
                if (res.result) {
                    let head = [];
                    res.result.contactHeaderKey.map((value) => (
                        value === "firstName" || value === "lastName" ?
                            !head.includes(value) ? head.push(value) : null
                            :
                            res.result.contact.map((value2) => (
                                (value2[value] !== "" && value2[value] !== null && value2[value] !== 0) ?
                                    !head.includes(value) ? head.push(value) : null
                                    : null
                            ))
                    ))
                    setShowTableHead(head);
                    setContactDetails(res.result);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact);
                }
            });
        }
    }, [searchSend, selectedPage, perPage, sort, showDuplicateButtonClicked, clickedGroup.groupId]);
    const groupNameClicked = useCallback((groupId, groupName, duplicateRecords, index) => {
        setShowDuplicateButtonClicked("no");
        setSelectedTabOld(0);
        setSelectedTabl(0);
        setSelectedPage(0);
        setPerPage(25);
        setSort("firstName,asc");
        setSearch("");
        setSearchSend("");
        setTableCheckBoxValueGroupIdList([]);
        setMainTablecheckBoxValue(false);
        setClickedGroup({ "groupId": groupId, "groupName": groupName, "duplicateRecords": duplicateRecords, "index": index });
        setClickedSegment({ "segmentId": 0 });
        setGroupCheckBoxGroupIdList([groupId]);
        setSegmentCheckBoxIdList([]);
    }, []);
    const displaySegmentContactList = useCallback((groupId, segmentId) => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setContactDetails("");
        if (showDuplicateButtonClicked === "no") {
            getSegmentContactList(groupId, segmentId, data).then(res => {
                if (res.result) {
                    let head = [];
                    res.result.contactHeaderKey.map((value) => (
                        res.result.contact.map((value2) => (
                            (value2[value] !== "" && value2[value] !== null) ?
                                !head.includes(value) ? head.push(value) : null
                                : null
                        ))
                    ))
                    setShowTableHead(head);
                    setContactDetails(res.result);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact)
                }
            });
        } else if (showDuplicateButtonClicked === "yes") {
            getDuplicateContactList(clickedGroup.groupId, data).then(res => {
                if (res.result) {
                    let head = [];
                    res.result.contactHeaderKey.map((value) => (
                        res.result.contact.map((value2) => (
                            (value2[value] !== "" && value2[value] !== null) ?
                                !head.includes(value) ? head.push(value) : null
                                : null
                        ))
                    ))
                    setShowTableHead(head);
                    setContactDetails(res.result);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact);
                }
            });
        }
    }, [searchSend, selectedPage, perPage, sort, showDuplicateButtonClicked, clickedGroup.groupId]);
    const segmentNameClicked = (groupId, groupName, duplicateRecords, index, segmentId) => {
        setShowDuplicateButtonClicked("no");
        setSelectedTabOld(0);
        setSelectedTabl(0);
        setSelectedPage(0);
        setPerPage(25);
        setSort("firstName,asc");
        setSearch("");
        setSearchSend("");
        setTableCheckBoxValueGroupIdList([]);
        setMainTablecheckBoxValue(false);
        setClickedGroup({ "groupId": groupId, "groupName": groupName, "duplicateRecords": duplicateRecords, "index": index });
        setClickedSegment({ "segmentId": segmentId });
        setGroupCheckBoxGroupIdList([groupId]);
        setSegmentCheckBoxIdList([segmentId]);
    }
    const popOverToggle = (index) => {
        const newPopoverOpen = [...popoverOpen]
        newPopoverOpen[index] = !newPopoverOpen[index]
        setPopoverOpen(newPopoverOpen)
    }
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        const newTableCheckBoxValueGroupIdList = []
        if (selectedTab === 0) {
            contactDetails.contact.forEach(element => {
                if (!flag)
                    newTableCheckBoxValueGroupIdList.push(element.emailId)
            });
        } else if (selectedTab === 1) {
            unsubscribedContactList.forEach(element => {
                if (!flag)
                    newTableCheckBoxValueGroupIdList.push(element.emailId)
            });
        } else if (selectedTab === 2) {
            badEmailAndSMSContactList.forEach(element => {
                if (!flag)
                    newTableCheckBoxValueGroupIdList.push(element.emailId)
            });
        }
        setTableCheckBoxValueGroupIdList(newTableCheckBoxValueGroupIdList);
    }
    const tableCheckBox = (emailId) => {
        let checkLength = 0;
        if (tableCheckBoxValueGroupIdList.includes(emailId)) {
            setTableCheckBoxValueGroupIdList(tableCheckBoxValueGroupIdList.filter(x => x !== emailId));
            checkLength = tableCheckBoxValueGroupIdList.length - 1;
        } else {
            setTableCheckBoxValueGroupIdList([...tableCheckBoxValueGroupIdList, emailId]);
            checkLength = tableCheckBoxValueGroupIdList.length + 1;
        }
        let length = 0;
        if (selectedTab === 0) {
            length = contactDetails.contact.length;
        } else if (selectedTab === 1) {
            length = unsubscribedContactList.length;
        } else if (selectedTab === 2) {
            length = badEmailAndSMSContactList.length;
        }
        if (length !== checkLength) {
            setMainTablecheckBoxValue(false)
        } else {
            setMainTablecheckBoxValue(true)
        }
    }
    const showDuplicateContact = () => {
        setContactDetails("");
        setSelectedPage(0);
        setPerPage(25);
        setSort("firstName,asc");
        setSearch("");
        setSearchSend("");
        setTableCheckBoxValueGroupIdList([]);
        setMainTablecheckBoxValue(false);
        setShowDuplicateButtonClicked("yes");
        if (showDuplicateButtonClicked === "yes") {
            displayContactList(clickedGroup.groupId);
        }
    }
    const deleteDuplicateContact = () => {
        removeDuplicateContact(clickedGroup.groupId).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                displayGroupSegmentDetails();
                displayContactList(clickedGroup.groupId);
            }
            else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    const createGroupHandleChange = (name, value) => {
        if (name === "udf") {
            setCreateUDFNo(value);
        }
        setCreateGroupData(prev => ({ ...prev, [name]: value }))
    }
    const updateGroupHandleChange = (name, value) => {
        setUpdateGroupData(prev => ({ ...prev, [name]: value }))
    }
    const createContactHandleChange = (name, value) => {
        if (name === "email") {
            let t = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (t !== null) {
                value = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)[0];
            }
        }
        if (name === "firstName") {
            setCreateContactData((prev) => ({ ...prev, [name]: value, "fullName": `${value} ${typeof createContactData?.lastName !== "undefined" ? createContactData?.lastName : ""}` }));
        } else if (name === "lastName") {
            setCreateContactData((prev) => ({ ...prev, [name]: value, "fullName": `${typeof createContactData.firstName !== "undefined" ? createContactData.firstName : ""} ${value}` }));
        } else {
            setCreateContactData((prev) => ({ ...prev, [name]: value }));
        }
    }

    const fetchData = useCallback(() => {
        getCountry().then(res => {
            if (res.result.country) {
                let country = []
                res.result.country.map(x => (
                    country.push({
                        "key": x.cntName,
                        "value": x.cntName,
                        "id": x.id
                    })
                ));
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
        getLanguage().then(res => {
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
    }, []);
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
    const displayGroupSegmentDetails = useCallback(async () => {
        let tempGroupData = [];
        await getGroupSegmentDetails().then(res => {
            if (res.result) {
                if (res.result.group.length > 0) {
                    if (groupDataOnly.current.length === 0) {
                        setGroupSegmentDetails(res.result.group);
                        groupDataOnly.current = res.result.group;
                    }
                    tempGroupData = res.result.group;
                }
                if (res.result.totalContact) {
                    setTotalContacts(res.result.totalContact);
                }
            }
        });
        await getGroupListWithCheckDuplicate().then(res => {
            if (res.result) {
                if (res.result.group.length > 0) {
                    let tempNew = [];
                    let tempGD = res.result.group;
                    // let tempCheckLockGroup = tempGD.filter((x) => { return x.lockGroup === "Y" });
                    // setCheckLockGroup(tempCheckLockGroup.length === 0 ? "No" : "Yes");
                    tempGroupData.map((value) => (
                        tempNew.push({ ...value, ...tempGD.filter((x) => { return x.groupId === value.groupId })[0] })
                    ))
                    if (JSON.stringify(groupDataOnly.current) !== JSON.stringify(tempNew)) {
                        setGroupSegmentDetails(tempNew);
                        groupDataOnly.current = tempNew;
                    }
                }
            }
        });
    }, []);
    const displayUnsubscribedContactList = useCallback(() => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setUnsubscribedContactList([]);
        resetValues();
        if (unsubscribedEmailSmsTab === "unsubscribedEmail") {
            getUnsubscribedContactList(data).then(res => {
                if (res.result) {
                    setUnsubscribedContactList(res.result.contact);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact);
                }
            });
        } else {
            getUnsubscribedSmsContactList(data).then(res => {
                if (res.result) {
                    setUnsubscribedContactList(res.result.contact);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact);
                }
            });
        }
    }, [searchSend, selectedPage, perPage, sort, unsubscribedEmailSmsTab]);
    const displayBadEmailAndSMSContactList = useCallback(() => {
        let data = `searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setBadEmailAndSMSContactList([]);
        resetValues();
        if (badEmailSmsTab === "badEmail") {
            getBadEmailContactList(data).then(res => {
                if (res.result) {
                    setBadEmailAndSMSContactList(res.result.contact);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact);
                }
            });
        } else {
            getBadSMSContactList(data).then(res => {
                if (res.result) {
                    setBadEmailAndSMSContactList(res.result.contact);
                    setTotalPages(res.result.getTotalPages);
                    setTotalContactsByGroup(res.result.totalContact);
                }
            });
        }
    }, [searchSend, selectedPage, perPage, sort, badEmailSmsTab]);
    const createContactUdfList = (groupId) => {
        getGroupUDF(groupId).then(res => {
            if (res.status === 200) {
                setCreateContactUdf(res.result.udfs);
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    useEffect(() => {
        let interval = null;
        if (interval === null) {
            displayGroupSegmentDetails();
        }
        interval = setInterval(() => {
            displayGroupSegmentDetails();
        }, 60 * 1000);
        getDisplayLanguage().then(res => {
            if (res.result.language) {
                setLanguages(res.result.language);
            }
        });
        fetchData();
        return () => {
            setLanguages("");
            setGroupSegmentDetails([]);
            setCountry([]);
            clearInterval(interval);
            interval = null;
        }
    }, [displayGroupSegmentDetails, fetchData]);
    const submitFormCreateGroup = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i <= createUDFNo; i++) {
            const valid = inputRefs.current[i].current.validate()
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
        let udfList = [];
        for (let i = 1; i <= createUDFNo; i++) {
            udfList.push({ "id": 0, "udf": createGroupData[`udf` + i] });
        }
        let requestData = {
            "groupId": 0,
            "groupName": createGroupData.groupName,
            "memberId": props.user.memberId,
            "subMemberId": props.subUser.memberId,
            "udfs": udfList
        }
        $(`button.createGroup`).hide();
        $(`button.createGroup`).after(`<div class="lds-ellipsis mr-2"><div></div><div></div><div></div>`);
        saveGroup(requestData).then(res => {
            if (res.status === 200) {
                toggleCreateGroup();
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayGroupSegmentDetails();
            }
            else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.createGroup`).show();
        });
    }
    const updateGroup = () => {
        getGroupById(groupCheckBoxGroupIdList[0]).then(res => {
            if (res.status === 200) {
                setUpdateGroupData({ "groupId": res.result.groupId, "groupName": res.result.groupName });
                toggleUpdateGroup();
            }
            else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const submitFormUpdateGroup = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < updateInputRefs.current.length; i++) {
            const valid = updateInputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let udfList = [];
        let requestData = {
            "groupId": updateGroupData.groupId,
            "groupName": updateGroupData.groupName,
            "memberId": props.user.memberId,
            "subMemberId": props.subUser.memberId,
            "udfs": udfList
        }
        $(`button.updateGroup`).hide();
        $(`button.updateGroup`).after(`<div class="lds-ellipsis mr-2"><div></div><div></div><div></div>`);
        saveGroup(requestData).then(res => {
            if (res.status === 200) {
                toggleUpdateGroup();
                setUpdateGroupData({});
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayGroupSegmentDetails();
            }
            else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.updateGroup`).show();
        });
    }
    const deleteGroup = () => {
        if (groupCheckBoxGroupIdList.length > 0) {
            let groupName = "";
            groupCheckBoxGroupIdList.map((value) => (
                groupName += toCamelCase(groupSegmentDetails.filter(v => v.groupId === value)[0].groupName) + "\n"
            ));
            props.confirmDialog({
                open: true,
                title: 'Delete group(s) will disassociate My Page(s) from "My Desktop".\n You need to edit content before using My Page(s) for campaign.\nSelected group(s) list : \n' + groupName + '\n Are you sure you want to delete selected group(s)?',
                onConfirm: () => {
                    let requestData = {
                        "groupIds": groupCheckBoxGroupIdList
                    }
                    deleteBulkGroup(requestData).then(res => {
                        if (res.status === 200) {
                            props.globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            setClickedGroup({ "groupId": 0, "groupName": "", "duplicateRecords": "" })
                            setGroupCheckBoxGroupIdList(groupCheckBoxGroupIdList.filter(x => !groupCheckBoxGroupIdList.includes(x)));
                            displayGroupSegmentDetails();
                        } else {
                            props.globalAlert({
                                type: "Error",
                                text: res.message,
                                open: true
                            });
                        }
                    });
                }
            })
        } else {
            props.globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
        }
    }
    const clickInviteByUrl = (groupId, index) => {
        popOverToggle(index);
        let requestData = "groupId=" + groupId + "&subMemberId=0&emailId=0";
        inviteByUrl(requestData).then(res => {
            if (res.status === 200) {
                setInviteUrlData(`${siteURL}/inviteurl?q=${res.result.inviteByUrl}`);
                toggleInviteUrl();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const deleteSegmentWithID = (id) => {
        const payload = {
            "segIds": [id]
        }
        deleteSegment(payload).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayGroupSegmentDetails();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const createNewSegment = (groupId, index) => {
        popOverToggle(index);
        const payload = {
            status: true,
            groupId: groupId
        }
        props.setNewSegmentPopUp(payload);
    }
    const editSegment = (segmentId, groupId) => {
        const payload = {
            status: true,
            segmentId: segmentId
        }
        props.fetchGroupUdfList(groupId)
        getSegment(segmentId).then(res => {
            if (res.status === 200) {
                props.setSegmentDetails(res.result)
                props.setEditSegmentPopUp(payload)
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const duplicateSegment = (segId) => {
        props.setDuplicateSegmentPopUp({
            status: true,
            segmentId: segId
        })
    }
    const submitFormCreateContact = async (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < dropDownRefsCreateContact.current.length; i++) {
            const valid = dropDownRefsCreateContact.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if ((typeof createContactData.email === "undefined" || createContactData.email === "" || createContactData.email === null) && (typeof createContactData.phoneNumber === "undefined" || createContactData.phoneNumber === "" || createContactData.phoneNumber === null)) {
            isValid = false;
            props.globalAlert({
                type: "Error",
                text: `Please Enter Email Or Mobile Number`,
                open: true
            });
            return;
        } else if (typeof createContactData.email !== "undefined" && createContactData.email !== "" && createContactData.email !== null) {
            if (!validateEmail(createContactData.email)) {
                props.globalAlert({
                    type: "Error",
                    text: "Please enter proper email",
                    open: true
                });
                return false;
            }
        }
        let cntId = country.find((val) => (createContactData.country === val.value)).id;
        if (typeof createContactData.phoneNumber !== "undefined" && createContactData.phoneNumber !== "" && createContactData.phoneNumber !== null) {
            let isValidPh = await validatePhoneFormat(cntId, createContactData.phoneNumber);
            if (!isValidPh) {
                props.globalAlert({
                    type: "Error",
                    text: `Invalid mobile number format or Do not put a national prefix on your mobile number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
        }
        if (typeof createContactData.phone !== "undefined" && createContactData.phone !== "" && createContactData.phone !== null) {
            let isValidPh = await validatePhoneFormat(cntId, createContactData.phone);
            if (!isValidPh) {
                props.globalAlert({
                    type: "Error",
                    text: `Invalid phone number format or Do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
        }
        if (createContactData.optInType === "both") {
            if ((typeof createContactData.email === "undefined" || createContactData.email === "" || createContactData.email === null) && (typeof createContactData.phoneNumber === "undefined" || createContactData.phoneNumber === "" || createContactData.phoneNumber === null)) {
                isValid = false;
                props.globalAlert({
                    type: "Error",
                    text: "Please enter email and mobile number",
                    open: true
                });
                return false;
            } else if (typeof createContactData.email === "undefined" || createContactData.email === "" || createContactData.email === null) {
                isValid = false;
                props.globalAlert({
                    type: "Error",
                    text: "Please enter email",
                    open: true
                });
                return false;
            } else if (typeof createContactData.phoneNumber === "undefined" || createContactData.phoneNumber === "" || createContactData.phoneNumber === null) {
                isValid = false;
                props.globalAlert({
                    type: "Error",
                    text: "Please enter mobile number",
                    open: true
                });
                return false;
            }
        } else if (createContactData.optInType === "email" && (typeof createContactData.email === "undefined" || createContactData.email === "" || createContactData.email === null)) {
            isValid = false;
            props.globalAlert({
                type: "Error",
                text: "Please enter email",
                open: true
            });
            return false;
        } else if (createContactData.optInType === "sms" && (typeof createContactData.phoneNumber === "undefined" || createContactData.phoneNumber === "" || createContactData.phoneNumber === null)) {
            isValid = false;
            props.globalAlert({
                type: "Error",
                text: "Please enter mobile number",
                open: true
            });
            return false;
        }
        if ((createContactData.optInType === "both" || createContactData.optInType === "sms") && (typeof props.user.twilioNumber === "undefined" || props.user.twilioNumber === "" || props.user.twilioNumber === null)) {
            isValid = false;
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    toggleBuyTwilioNo();
                } else {
                    props.confirmDialog({
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
        if (typeof createContactData.groupId === "undefined") {
            props.globalAlert({
                type: "Error",
                text: "Please choose group",
                open: true
            });
            return false;
        }
        let requestData = {
            ...createContactData,
            "emailId": 0,
            "memberId": props.user.memberId,
            "subMemberId": props.subUser.memberId
        }
        $(`button.addMember`).hide();
        $(`button.addMember`).after(`<div class="lds-ellipsis mr-2"><div></div><div></div><div></div>`);
        addContact(requestData).then(res => {
            if (res.status === 200) {
                toggleCreateContact();
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayGroupSegmentDetails();
                displayContactList(clickedGroup.groupId);
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.addMember`).show();
        });
    }
    const deleteContact = () => {
        let requestData = {
            "emailIds": tableCheckBoxValueGroupIdList
        }
        deleteBulkContact(requestData).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueGroupIdList([]);
                setMainTablecheckBoxValue(false);
                if (selectedTab === 0) {
                    displayGroupSegmentDetails();
                    displayContactList(clickedGroup.groupId);
                } else if (selectedTab === 1) {
                    displayUnsubscribedContactList();
                } else if (selectedTab === 2) {
                    displayBadEmailAndSMSContactList();
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
    const moveContactHandleChange = (newGroupId) => {
        toggleMoveContact();
        let requestData = [];
        tableCheckBoxValueGroupIdList.map((value, index) => (
            requestData.push({ "groupId": clickedGroup.groupId, "emailId": value })
        ));
        moveContactExistingGroup(newGroupId, selectionType, requestData).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueGroupIdList([]);
                setMainTablecheckBoxValue(false);
                displayGroupSegmentDetails();
                displayContactList(clickedGroup.groupId)
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    const handleClickExportNotGroup = (data) => {
        getDownloadNotGroupContactFile(data).then(res => {
            if (res.status === 200) {
                if (res.result.filePath) {
                    window.open(res.result.filePath);
                }
                setTableCheckBoxValueGroupIdList([]);
                setMainTablecheckBoxValue(false);
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const resetValues = () => {
        setTableCheckBoxValueGroupIdList([]);
        setMainTablecheckBoxValue(false);
    }
    const clickedToEditContact = (emailId) => {
        setEditEmailId(emailId);
        setSelectedTabOld(selectedTab);
        setSelectedTabl(3);
    }
    const clickedToEditContactNotGroup = (emailId, groupId, groupName) => {
        setClickedGroup({ "groupId": groupId, "groupName": groupName, "duplicateRecords": "N" });
        setEditEmailId(emailId);
        setSelectedTabOld(selectedTab);
        setSelectedTabl(3);
    }
    const clickedButtonEditContact = () => {
        setEditEmailId(tableCheckBoxValueGroupIdList[0]);
        setSelectedTabOld(selectedTab);
        setSelectedTabl(3);
    }
    const handleChangePagination = (event, value) => {
        setSelectedPage(value - 1);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleClickSort = (name, index) => {
        if (sortBox[index] === true) {
            name += ",desc";
            const newSortBox = [...sortBox];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        } else {
            name += ",asc";
            const newSortBox = [];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        }
        setSelectedPage(0);
        setSort(name);
    }
    const handleClickAddMember = () => {
        toggleCreateContact();
        if (typeof createContactData.country === "undefined" || createContactData.country === "") {
            setCreateContactData((prev) => ({ ...prev, "country": country.filter((v) => (v.id === Number(props.user.country)))[0].value }));
            changeCountry(country.filter((v) => (v.id === Number(props.user.country)))[0].value);
        }
    }
    const handleClickImport = () => {
        History.push('/createimport');
    }
    const handleClickSendSubscribeLink = (groupId, emailId) => {
        let requestData = {
            "groupId": groupId,
            "emailId": emailId
        }
        sendSubscribeLink(requestData).then(res => {
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    const handleClickUnsubscribe = (emailId) => {
        let g = groupSegmentDetails.filter(x => x.groupId === clickedGroup.groupId);
        let c = contactDetails.contact.filter(x => x.emailId === emailId);
        setDataUnsubscribe({ "fullName": c[0].fullName, "email": c[0].email, "phoneNumber": c[0].phoneNumber, "encEmailId": c[0].encEmailId, "groupName": g[0].groupName, "groupId": g[0].groupId, "encGroupId": g[0].encGroupId });
        toggleUnsubscribe();
    }
    const handleClickVerifyGroupContact = () => {
        let g = groupSegmentDetails.filter(x => x.groupId === groupCheckBoxGroupIdList[0]);
        if (g[0].totalMember > 0) {
            let requestData = {
                "groupId": groupCheckBoxGroupIdList[0],
                "subMemberId": props.subUser.memberId
            }
            emailVerificationGroup(requestData).then(res => {
                if (res.status === 200) {
                    if (res.result.hasOwnProperty("error") && res.result.error !== "") {
                        props.globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        })
                    } else {
                        let eta = res.result.eta;
                        let date = format(new Date(Date.now() + (eta * 60 * 1000)), "HH:mm");
                        props.globalAlert({
                            type: "Success",
                            text: `Email Verification submitted. This process is estimate to take ${date} hours. You will receive an email when it is complete`,
                            open: true
                        })
                    }
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    })
                }
            });
        } else {
            props.globalAlert({
                type: "Error",
                text: "Group has no contact to verify.",
                open: true
            });
        }
    }
    const handleClickOptInButton = (value) => {
        setOptInTypeButton(value);
        toggleOptIn();
    }
    const handleClickOptInGroup = () => {
        if (optInType === "") {
            props.globalAlert({
                type: "Error",
                text: "Please select option",
                open: true
            });
            return false;
        }
        let requestData = {
            "emailIds": [],
            "groupId": groupCheckBoxGroupIdList[0],
            "subMemberId": props.subUser.memberId,
            "optInType": optInType
        }
        sendOptInGroup(requestData).then(res => {
            if (res.status === 200) {
                toggleOptIn();
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    const handleClickOptInContact = () => {
        if (optInType === "") {
            props.globalAlert({
                type: "Error",
                text: "Please select option",
                open: true
            });
            return false;
        }
        let count = contactDetails.contact.filter((item) => tableCheckBoxValueGroupIdList.includes(item.emailId) && (typeof item.phoneNumber !== "undefined" && item.phoneNumber !== "" && item.phoneNumber !== null));
        let isValid = true;
        if (count.length > 0 && (optInType === "sms" || optInType === "both") && (typeof props.user.twilioNumber === "undefined" || props.user.twilioNumber === "" || props.user.twilioNumber === null)) {
            isValid = false;
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    toggleBuyTwilioNo();
                } else {
                    props.confirmDialog({
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
        let requestData = {
            "emailIds": tableCheckBoxValueGroupIdList,
            "groupId": 0,
            "subMemberId": props.subUser.memberId,
            "optInType": optInType
        }
        sendOptInGroup(requestData).then(res => {
            if (res.status === 200) {
                toggleOptIn();
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    const handleChangeBuyTwilioNo = (name, value) => {
        setDataBuyTwilioNo(prev => ({ ...prev, [name]: value }));
        if (name === "checkForwardingYesNo" && value === "yes") {
            handleChangeBuyTwilioNo("callForwardingNumber", props.user.cell);
            let tempIso2 = countryBuyTwilioNo.filter((x) => { return x.id === props.user.country })[0].key;
            handleChangeBuyTwilioNo("callForwardingCountryCode", tempIso2);
        } else if (name === "checkForwardingYesNo" && value === "no") {
            handleChangeBuyTwilioNo("callForwardingNumber", "");
            handleChangeBuyTwilioNo("callForwardingCountryCode", "");
        }
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
            props.globalAlert({
                type: "Error",
                text: "Please select number.",
                open: true
            });
            isValid = false
        }
        if (dataBuyTwilioNo.checkForwardingYesNo === "yes" && (typeof dataBuyTwilioNo.callForwardingNumber === "undefined" || dataBuyTwilioNo.callForwardingNumber === "" || dataBuyTwilioNo.callForwardingNumber === null)) {
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
            "memberId": props.user.memberId,
            "subMemberId": props.subUser.memberId,
            "subFullName": `${props.subUser.firstName} ${props.subUser.lastName}`,
            "fullName": `${props.user.firstName} ${props.user.lastName}`,
            "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber,
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x) => { return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        buyNumber(d).then(res => {
            if (res.status === 200) {
                let tn = "";
                if (typeof props.user.twilioNumber === "undefined" || props.user.twilioNumber === "" || props.user.twilioNumber === null) {
                    tn = dataBuyTwilioNo.twilioNumber;
                } else {
                    tn = props.user.twilioNumber;
                }
                if (props.subUser.memberId > 0) {
                    props.setSubUserAction({ ...props.subUser, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn });
                    sessionStorage.setItem('subUser', JSON.stringify({ ...props.subUser, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn }));
                } else {
                    props.userLoggedIn({ ...props.user, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn });
                    sessionStorage.setItem('user', JSON.stringify({ ...props.user, "conversationsTwilioNumber": dataBuyTwilioNo.twilioNumber, "twilioNumber": tn }));
                }
                toggleBuyTwilioNo();
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
            props.setLoader({
                load: false
            });
        });
    }
    const handleClickAddGroup = () => {
        // if(checkLockGroup === "Yes"){
        //     props.globalAlert({
        //         type: "Warning",
        //         text: `You can not add new group because one of your group is locked due to high bounce rate.\n\nPlease validate your group contacts by clicking "Verify Group Contact" icon.`,
        //         open: true
        //     });
        // } else {
        toggleCreateGroup();
        // }
    }
    const handleClickSegment = (groupId, index, type) => {
        if (type === "open") {
            toggle(index);
        } else {
            let tempGroup = groupSegmentDetails.filter((v) => { return v.groupId === groupId });
            if (tempGroup.length > 0 && typeof tempGroup[0].groupSegment === "undefined") {
                getSegmentList(groupId).then(res => {
                    if (res.status === 200) {
                        toggle(index);
                        setGroupSegmentDetails((prev) => {
                            prev.forEach((v, i) => {
                                if (v.groupId === groupId) {
                                    prev[i].groupSegment = res.result;
                                }
                            })
                            return prev;
                        })
                    } else {
                        props.globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            } else {
                toggle(index);
            }
        }
    }
    useEffect(() => {
        let interval = null;
        if (selectedTab === 0) {
            if (clickedSegment.segmentId > 0) {
                displaySegmentContactList(clickedGroup.groupId, clickedSegment.segmentId);
            } else {
                if (interval === null) {
                    displayContactList(clickedGroup.groupId);
                }
                if (intervalForTypeEmail === "Yes") {
                    interval = setInterval(() => {
                        displayContactList(clickedGroup.groupId);
                    }, 30 * 1000);
                }
            }
        } else if (selectedTab === 1) {
            displayUnsubscribedContactList();
        } else if (selectedTab === 2) {
            displayBadEmailAndSMSContactList()
        }
        return () => {
            setShowTableHead([]);
            setContactDetails("");
            setTotalPages(0);
            setTotalContactsByGroup(0);
            setUnsubscribedContactList([]);
            clearInterval(interval);
            interval = null;
        }
    }, [clickedGroup.groupId, clickedSegment.segmentId, displaySegmentContactList, displayContactList, selectedTab, selectedPage, perPage, searchSend, displayUnsubscribedContactList, displayBadEmailAndSMSContactList, badEmailSmsTab, unsubscribedEmailSmsTab, intervalForTypeEmail]);
    useEffect(() => {
        if (props.viewVisitorProfile.isSet === "Yes" && groupSegmentDetails.length > 0) {
            let temp = groupSegmentDetails.find((v) => v.groupId === props.viewVisitorProfile.groupId);
            if (typeof temp !== "undefined") {
                groupNameClicked(temp.groupId, temp.groupName, temp.duplicateRecords, groupSegmentDetails.indexOf(temp));
            }
            setTimeout(() => {
                clickedToEditContact(props.viewVisitorProfile.userId);
                props.resetViewVisitorProfile();
            }, 1000);
        }
    }, [groupSegmentDetails]);

    const handleSelectClient = (data, index) => {
        setClickedClient(data)
        setSelectedTabl(0)
    }

    const handleCheckClient = (id) => {
        if (clientIdList.includes(id)) {
            setClientIdList(prevState => (prevState.filter(x => x !== id)));
        } else {
            setClientIdList([...clientIdList, id]);
        }
    }
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="p-0">
                <h3>Client</h3>
                <Row>
                    <Col xs={12} lg={3}>
                        <div className="icon-wrapper">
                            <CheckPermissionButton module="group" action="add">
                                <Link href="/addclient" component="a" className="btn-circle" data-toggle="tooltip" title="Add">
                                    <i className="far fa-plus-square"></i>
                                    <div className="bg-green"></div>
                                </Link>
                            </CheckPermissionButton>
                            {clientIdList.length > 1 ? null :
                                <CheckPermissionButton module="group" action="edit">
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit"
                                        onClick={() => {
                                            if (clientIdList.length > 0) {
                                                updateGroup()
                                            } else {
                                                props.globalAlert({
                                                    type: "Error",
                                                    text: "You must check one of the checkboxes.",
                                                    open: true
                                                });
                                            }
                                        }}
                                    >
                                        <i className="far fa-pencil-alt"></i>
                                        <div className="bg-blue"></div>
                                    </Link>
                                </CheckPermissionButton>
                            }
                            <CheckPermissionButton module="group" action="delete">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete" onClick={() => { deleteGroup() }} >
                                    <i className="far fa-trash-alt"></i>
                                    <div className="bg-red"></div>
                                </Link>
                            </CheckPermissionButton>
                        </div>
                        <div className="group-styling py-3">
                            <div className="group-aligment-heading">
                                <Input className="group-name" type="checkbox" checked={mainCheckBox}
                                    onChange={() => mainCheckBoxClicked()} />
                                <span>Client Name</span>
                            </div>
                            {/* <div>{totalContacts} Member</div> */}
                        </div>
                        <div className="group-name-list">
                            {client?.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className={`group-aligment ${clickedClient?.id === item.id ? "selected-class" : ""}`} >
                                            <Input className="group-name" type="checkbox" checked={clientIdList.includes(item.id)} onChange={() => handleCheckClient(item.id)} value={item.id} />
                                            <div className="group-name-div" onClick={() => { handleSelectClient(item, index) }}>
                                                {item.name}
                                            </div>
                                        </div>
                                        {item?.groupSegment?.length > 0 ?
                                            <Collapse isOpen={isOpen.includes(index)} className="collapse-wrapper">
                                                {
                                                    item.groupSegment.map((subItem, index2) => {
                                                        return (
                                                            <div key={index2} className={clickedSegment.segmentId === subItem.segId ? "sub-group-aligment selected-class" : "sub-group-aligment"}>
                                                                <Input className="group-name" type="checkbox" checked={segmentCheckBoxIdList.includes(subItem.segId)} onChange={() => segmentCheckBoxClicked(subItem.segId)} />
                                                                <div className="seg-name-div" onClick={() => segmentNameClicked(item.groupId, item.groupName, item.duplicateRecords, index, subItem.segId)}>
                                                                    {subItem.segName}
                                                                </div>
                                                                <div className="collapse-icon-wrapper">
                                                                    <CheckPermissionButton module="segment" action="copy">
                                                                        <i className="far fa-copy green" data-toggle="tooltip" title="Duplicate Segment" onClick={() => duplicateSegment(subItem.segId)}></i>
                                                                    </CheckPermissionButton>
                                                                    <CheckPermissionButton module="segment" action="edit">
                                                                        <i className="far fa-pencil-alt blue" data-toggle="tooltip" title="Edit Segment" onClick={() => editSegment(subItem.segId, item.groupId)}></i>
                                                                    </CheckPermissionButton>
                                                                    <CheckPermissionButton module="segment" action="delete">
                                                                        <i className="far fa-trash-alt purple" data-toggle="tooltip" title="Delete Segment"
                                                                            onClick={() => {
                                                                                props.confirmDialog({
                                                                                    open: true,
                                                                                    title: 'Are you sure you want to delete segment?',
                                                                                    onConfirm: () => { deleteSegmentWithID(subItem.segId) }
                                                                                })
                                                                            }}
                                                                        ></i>
                                                                    </CheckPermissionButton>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Collapse> : null}
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <p>Total Client : {client.length} | Selected: {clientIdList.length} </p>
                        </div>
                    </Col>
                    <Col xs={12} lg={9}>
                        {selectedTab === 0 ?
                            <Tab0
                                selectedClientData={clickedClient}
                                globalAlert={props.globalAlert}
                                confirmDialog={props.confirmDialog}
                                clickedGroup={clickedGroup}
                                clickedToEdit={clickedToEdit}
                                sortBox={sortBox}
                                perPage={perPage}
                                selectedPage={selectedPage}
                                tableCheckBoxValueGroupIdList={tableCheckBoxValueGroupIdList}
                                handleClickAddMember={handleClickAddMember}
                                contactDetails={contactDetails}
                                languages={languages}
                                mainTableCheckBox={mainTableCheckBox}
                                mainTablecheckBoxValue={mainTablecheckBoxValue}
                                search={search}
                                showTableHead={showTableHead}
                                totalContactsByGroup={totalContactsByGroup}
                                totalPages={totalPages}
                                clickedButtonEditContact={clickedButtonEditContact}
                                clickedToEditContact={clickedToEditContact}
                                deleteContact={deleteContact}
                                deleteDuplicateContact={deleteDuplicateContact}
                                handleChangePagination={handleChangePagination}
                                handleChangePerPage={handleChangePerPage}
                                handleChangeSearch={handleChangeSearch}
                                handleClickHelp={handleClickHelp}
                                handleClickSearch={handleClickSearch}
                                handleClickSort={handleClickSort}
                                showDuplicateContact={showDuplicateContact}
                                tableCheckBox={tableCheckBox}
                                toggleExportContact={toggleExportContact}
                                toggleFullscreenModal={toggleFullscreenModal}
                                toggleMoveContact={toggleMoveContact}
                                handleClickImport={handleClickImport}
                                handleClickUnsubscribe={handleClickUnsubscribe}
                                handleClickOptInButton={handleClickOptInButton}
                            /> : null}
                        {
                            selectedTab === 1 ?
                                <Tab1
                                    mainTableCheckBox={mainTableCheckBox}
                                    mainTablecheckBoxValue={mainTablecheckBoxValue}
                                    perPage={perPage}
                                    search={search}
                                    selectedPage={selectedPage}
                                    sortBox={sortBox}
                                    tableCheckBoxValueGroupIdList={tableCheckBoxValueGroupIdList}
                                    totalContactsByGroup={totalContactsByGroup}
                                    totalPages={totalPages}
                                    unsubscribedContactList={unsubscribedContactList}
                                    globalAlert={props.globalAlert}
                                    confirmDialog={props.confirmDialog}
                                    deleteContact={deleteContact}
                                    handleChangePagination={handleChangePagination}
                                    handleChangePerPage={handleChangePerPage}
                                    handleChangeSearch={handleChangeSearch}
                                    handleClickExportNotGroup={handleClickExportNotGroup}
                                    handleClickSearch={handleClickSearch}
                                    handleClickSort={handleClickSort}
                                    tableCheckBox={tableCheckBox}
                                    handleClickSendSubscribeLink={handleClickSendSubscribeLink}
                                    unsubscribedEmailSmsTab={unsubscribedEmailSmsTab}
                                    setUnsubscribedEmailSmsTab={setUnsubscribedEmailSmsTab}
                                /> : null
                        }
                        {
                            selectedTab === 2 ?
                                <Tab2
                                    badEmailAndSMSContactList={badEmailAndSMSContactList}
                                    badEmailSmsTab={badEmailSmsTab}
                                    mainTableCheckBox={mainTableCheckBox}
                                    mainTablecheckBoxValue={mainTablecheckBoxValue}
                                    perPage={perPage}
                                    search={search}
                                    selectedPage={selectedPage}
                                    sortBox={sortBox}
                                    tableCheckBoxValueGroupIdList={tableCheckBoxValueGroupIdList}
                                    totalContactsByGroup={totalContactsByGroup}
                                    totalPages={totalPages}
                                    clickedToEditContactNotGroup={clickedToEditContactNotGroup}
                                    confirmDialog={props.confirmDialog}
                                    deleteContact={deleteContact}
                                    globalAlert={props.globalAlert}
                                    handleChangePagination={handleChangePagination}
                                    handleChangePerPage={handleChangePerPage}
                                    handleChangeSearch={handleChangeSearch}
                                    handleClickExportNotGroup={handleClickExportNotGroup}
                                    handleClickSearch={handleClickSearch}
                                    handleClickSort={handleClickSort}
                                    setBadEmailSmsTab={setBadEmailSmsTab}
                                    tableCheckBox={tableCheckBox}
                                /> : null
                        }
                        {
                            selectedTab === 3 ?
                                <>
                                    <div className="icon-wrapper mb-5"></div>
                                    <EditContact selectedTab={selectedTabOld} setSelectedTabl={setSelectedTabl} displayGroupSegmentDetails={displayGroupSegmentDetails} emailId={editEmailId} groupId={clickedGroup.groupId} />
                                </>
                                : null
                        }
                    </Col>
                </Row>
                <ModalCreateGroup
                    modalCreateGroup={modalCreateGroup}
                    createGroupData={createGroupData}
                    createUDFNo={createUDFNo}
                    dropDownRefs={dropDownRefs}
                    dropDownUDF={dropDownUDF}
                    inputRefs={inputRefs}
                    totalUDFNo={totalUDFNo}
                    createGroupHandleChange={createGroupHandleChange}
                    submitFormCreateGroup={submitFormCreateGroup}
                    toggleCreateGroup={toggleCreateGroup}
                />
                <ModalUpdateGroup
                    modalUpdateGroup={modalUpdateGroup}
                    updateGroupData={updateGroupData}
                    updateInputRefs={updateInputRefs}
                    submitFormUpdateGroup={submitFormUpdateGroup}
                    toggleUpdateGroup={toggleUpdateGroup}
                    updateGroupHandleChange={updateGroupHandleChange}
                />
                <ModalInviteUrl inviteUrlData={inviteUrlData} toggleInviteUrl={toggleInviteUrl} modalInviteUrl={modalInviteUrl} />
                <ModalCreateContact
                    country={country}
                    language={language}
                    state={state}
                    user={props.user}
                    modalCreateContact={modalCreateContact}
                    createContactData={createContactData}
                    inputRefsCreateContact={inputRefsCreateContact}
                    numberRefsCreateContact={numberRefsCreateContact}
                    createContactUdf={createContactUdf}
                    dropDownRefsCreateContact={dropDownRefsCreateContact}
                    createContactInputRefsCount={createContactInputRefsCount}
                    groupSegmentDetails={groupSegmentDetails}
                    createContactUdfList={createContactUdfList}
                    changeCountry={changeCountry}
                    toggleCreateContact={toggleCreateContact}
                    submitFormCreateContact={submitFormCreateContact}
                    createContactHandleChange={createContactHandleChange}
                />
                <ModalMoveContact clickedGroup={clickedGroup} groupSegmentDetails={groupSegmentDetails} modalMoveContact={modalMoveContact} moveContactHandleChange={moveContactHandleChange} toggleMoveContact={toggleMoveContact} />
                <ModalExportContact
                    clickedGroup={clickedGroup}
                    globalAlert={props.globalAlert}
                    resetValues={resetValues}
                    setLoader={props.setLoader}
                    setSelectionType={setSelectionType}
                    toggleCopyContact={toggleCopyContact}
                    toggleMoveContact={toggleMoveContact}
                    modalExportContact={modalExportContact}
                    toggleExportContact={toggleExportContact}
                />
                <ModalCopyContact
                    user={props.user}
                    copyInputRefs={copyInputRefs}
                    modalCopyContact={modalCopyContact}
                    toggleCopyContact={toggleCopyContact}
                    resetValues={resetValues}
                    displayGroupSegmentDetails={displayGroupSegmentDetails}
                    globalAlert={props.globalAlert}
                    clickedGroup={clickedGroup}
                    selectionType={selectionType}
                    tableCheckBoxValueGroupIdList={tableCheckBoxValueGroupIdList}
                />
                <CreateSegment reloadData={() => { displayGroupSegmentDetails() }} />
                <EditSegment reloadData={() => { displayGroupSegmentDetails() }} />
                <DuplicateSegment reloadData={() => { displayGroupSegmentDetails() }} />
            </Col>
            <FullScreenModal
                perPage={perPage}
                selectedPage={selectedPage}
                contactDetails={contactDetails}
                fullscreenModal={fullscreenModal}
                selectedTab={selectedTab}
                totalPages={totalPages}
                clickedToEdit={clickedToEdit}
                sortBox={sortBox}
                search={search}
                showTableHead={showTableHead}
                clickedGroup={clickedGroup}
                editEmailId={editEmailId}
                languages={languages}
                selectedTabOld={selectedTabOld}
                totalContactsByGroup={totalContactsByGroup}
                displayGroupSegmentDetails={displayGroupSegmentDetails}
                setSelectedTabl={setSelectedTabOld}
                handleClickSort={handleClickSort}
                clickedToEditContact={clickedToEditContact}
                toggleFullscreenModal={toggleFullscreenModal}
                handleChangePagination={handleChangePagination}
                handleChangePerPage={handleChangePerPage}
                handleClickSearch={handleClickSearch}
                handleChangeSearch={handleChangeSearch}
            />
            <UnsubscribeModal
                modalUnsubscribe={modalUnsubscribe}
                toggleUnsubscribe={toggleUnsubscribe}
                dataUnsubscribe={dataUnsubscribe}
                globalAlert={props.globalAlert}
                encMemberId={props.user.encMemberId}
                displayContactList={displayContactList}
            />
            <OptInModal
                modalOptIn={modalOptIn}
                toggleOptIn={toggleOptIn}
                optInType={optInType}
                setOptInType={setOptInType}
                optInTypeButton={optInTypeButton}
                handleClickOptIn={optInTypeButton === "group" ? handleClickOptInGroup : handleClickOptInContact}
            />
            <ModalBuyTwilioNo
                countryBuyTwilioNo={countryBuyTwilioNo}
                dataBuyTwilioNo={dataBuyTwilioNo}
                dataSearchTwilioNo={dataSearchTwilioNo}
                dropDownRefsBuyTwilioNo={dropDownRefsBuyTwilioNo}
                inputRefsBuyTwilioNo={inputRefsBuyTwilioNo}
                modalBuyTwilioNo={modalBuyTwilioNo}
                msgSearchTwilioNo={msgSearchTwilioNo}
                user={props.user}
                handleChangeBuyTwilioNo={handleChangeBuyTwilioNo}
                saveBuyTwilioNo={saveBuyTwilioNo}
                searchBuyTwilioNo={searchBuyTwilioNo}
                toggleBuyTwilioNo={toggleBuyTwilioNo}
            />
        </Row>
    );

}

const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser,
        viewVisitorProfile: state.viewVisitorProfile,
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
        setNewSegmentPopUp: (data) => {
            dispatch(setNewSegmentPopUp(data))
        },
        setEditSegmentPopUp: (data) => {
            dispatch(setEditSegmentPopUp(data))
        },
        getSegmentDetails: (data) => {
            dispatch(getSegmentDetails(data))
        },
        setSegmentDetails: (data) => {
            dispatch(setSegmentDetails(data))
        },
        fetchGroupUdfList: (data) => {
            dispatch(fetchGroupUdfList(data))
        },
        setDuplicateSegmentPopUp: (data) => {
            dispatch(setDuplicateSegmentPopUp(data))
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
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
        resetViewVisitorProfile: () => {
            dispatch(resetViewVisitorProfileAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClientContact);