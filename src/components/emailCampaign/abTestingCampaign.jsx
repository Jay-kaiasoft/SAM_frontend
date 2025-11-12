import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { pathOr } from "ramda";
import {dateTimeFormat, dateTimeFormatDB, getClientTimeZone} from '../../assets/commonFunctions';
import { getGroupListWithCheckDuplicate } from "../../services/clientContactService";
import { getMyPagesList } from "../../services/myDesktopService";
import history from "../../history";
import $ from "jquery";
import 'jquery-ui/ui/widgets/slider.js';
import {checkSpam, sendCampaign, sendEmailPreview} from "../../services/emailCampaignService";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import Loader from "../shared/loaderV2/loader";
import { domainChecker } from "../../services/profileService";
import PreviewModal from "./previewModal";
const SelectGroupSegment = lazy(() => import("./selectGroupSegment"));
const CampaignInformation = lazy(() => import("./campaignInformation"));
const SelectPage = lazy(() => import("./selectPage"));
const SelectEmailAndName = lazy(() => import("./selectEmailAndName"));
const ABTestingType = lazy(() => import("./abTestingType"));
const SpamInstructions = lazy(() => import("./spamInstructions"));
const SpamChecking = lazy(() => import("./spamChecking"));
const Scheduler = lazy(() => import("./scheduler"));
const Preview = lazy(() => import("./preview"));

const ABTestingCampaign = ({
    step,
    handleNext,
    handleBack,
    email,
    firstName,
    lastName,
    globalAlert,
    memberId,
    timeZone,
    subFirstName,
    subLastName,
    subEmail,
    subMemberId,
    campaignMainType,
    pendingTransaction,
    handleClickModalOpen
}) => {
    const [groups, setGroups] = useState([]);
    const [spamCheckDetails, setSpamCheckDetails] = useState({});
    const [data, setData] = useState({
        campaignMainType: campaignMainType,
        campType: 2,
        testingType: 0,
        schType1: 0,
        schType2: 0,
        winnerType: "",
        campaignName: "",
        mailType: "",
        mpId1:0,
        mpId2:0,
        campaignDescription: "",
        fromAddress: subMemberId > 0 ? subEmail : email,
        fromName1: subMemberId > 0 ? `${subFirstName} ${subLastName}` : `${firstName} ${lastName}`,
        fromName2: subMemberId > 0 ? `${subFirstName} ${subLastName}` : `${firstName} ${lastName}`,
        emailSubject: "",
        emailSubject2: "",
        sendOnDateTime1: dateTimeFormat(new Date()),
        sendOnDateTime2: dateTimeFormat(new Date()),
        groupValue: 20,
        totalMember: 0,
        rateType: "OR",
        time: 1,
        timeUnit: "hours",
        incrementalUpdate: false
    });
    const [modalSendPreviewEmail, setModalSendPreviewEmail] = useState(false);
    const toggleSendPreviewEmail = useCallback(() => {
        if(modalSendPreviewEmail){
            setContactSelected([subMemberId > 0 ? subEmail : email]);
        }
        setModalSendPreviewEmail(!modalSendPreviewEmail)
    },[modalSendPreviewEmail]);
    const [contactSelected, setContactSelected] = useState([subMemberId > 0 ? subEmail : email]);
    const [prevKeyStroke, setPrevKeyStroke] = useState("");

    const handleDataChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const timeValues = [];
    for (let index = 1; index <= 24; index++) {
        timeValues.push({
            key: index,
            value: index
        })
    }
    const handleChangeDefaultName = (event) => {
        let { name, value } = event.target;
        handleDataChange(name, Number(value));
    };

    const page1 = data.pagesList?.filter(it => it.mpId === data.mpId1)
    const page2 = data.pagesList?.filter(it => it.mpId === data.mpId2)

    const handleWinnerTypeChange = (event) => {
        let { name, value } = event.target;
        handleDataChange(name, value);
    }

    const handleClickSendCampaign = () => {
        let domainName = data.fromAddress.split("@")[1];
        domainChecker(domainName).then(res1 => {
            if (res1.status === 200) {
                $("button.sendCampaign").hide();
                $("button.sendCampaign").after('<div class="lds-ellipsis ml-3 mr-0"><div></div><div></div><div></div>');
                let requestData = {
                    "memberId": memberId,
                    "subMemberId" : subMemberId,
                    "campType":data.campType,
                    "campName":data.campaignName,
                    "mailType":data.mailType,
                    "campDesc":data.campaignDescription,
                    "fromName":data.fromName1,
                    "subject":data.subject,
                    "fromAdd":data.fromAddress,
                    "replyToAdd":data.fromAddress,
                    "schType":data.schType1,
                    "sendOnDateTime":dateTimeFormatDB(data.sendOnDateTime1),
                    "selectedGid":data.groupId,
                    "selectedSid":data?.segId?.length > 0 ? data.segId[0] : 0,
                    "selectedAllSid": data?.segId || [],
                    "myPageId":data.mpId1,
                    "campMainType":data.campaignMainType,
                    "subjectB":data.subject2,
                    "schTypeB":data.schType2,
                    "sendOnDateTimeB":dateTimeFormatDB(data.sendOnDateTime2),
                    "myPageIdB":data.mpId2,
                    "fromNameB":data.fromName2,
                    "testingType":data.testingType,
                    "selectGroupPer":data.groupValue,
                    "remainGroupPer":100-data.groupValue,
                    "byAutoManual":data.winnerType,
                    "byType":data.rateType,
                    "byNumber":data.time,
                    "byMeasure":data.timeUnit,
                    "incrementalUpdates":data.incrementalUpdate ? "Y" : "N",
                    "timeZone":(typeof timeZone === "undefined" || timeZone === "" || timeZone === null) ? getClientTimeZone() : timeZone
                }
                sendCampaign(requestData).then(res => {
                    if (res.status === 200) {
                        if(res.result.location === "paymentProfile"){
                            pendingTransaction([{
                                "memberId": memberId,
                                "subMemberId" : subMemberId,
                                "cid": res.result.cid,
                                "campId": res.result.campId,
                                "memberList": res.result.memberList,
                                "msg": res.result.msg,
                                "pendingTransactionType": "saveEmailCampaign"
                            }]);
                            history.push("/carddetails");
                        } else {
                            globalAlert({
                                type: "Success",
                                text: res.message,
                                open: true
                            });
                            history.push("/manageemailcampaign");
                        }
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                        $(".lds-ellipsis").remove();
                        $("button.sendCampaign").show();
                    }
                });
            } else if (res1.status === 204) {
                let ds = [];
                if(res1.result.dkim === false){
                    ds.push("DKIM");
                }
                if(res1.result.spf === false){
                    ds.push("SPF");
                }
                if(res1.result.dmarc === false){
                    ds.push("DMARC");
                }
                let msg = `Your domain : ${domainName}\nYour campaign can not be send due to ${ds.join(", ")} is not set.\nPlease <a id="redirectLink" class="cursor-pointer text-blue">Click Here</a> for verify it.`;
                globalAlert({
                    type: "Error",
                    text: msg,
                    open: true
                });
                setTimeout(()=>{
                    $("#redirectLink").click(function(){
                        history.push("/domainemailverification");
                        $(".MuiDialogActions-root button").trigger("click");
                    })
                },1000);
            } else {
                globalAlert({
                    type: "Error",
                    text: res1.message,
                    open: true
                });
            }
        });
    }
    const handleClickSendEmailPreview = () => {
        toggleSendPreviewEmail();
    }
    const handleCallSendPreviewEmail = () => {
        if(contactSelected.length > 0){
            $("button.sendEmail").hide();
            $("button.sendEmail").after('<div class="lds-ellipsis ml-3 mr-0"><div></div><div></div><div></div>');
            let tempMpType = data?.pagesList?.find(page => page.mpId === data.mpId1)?.mpType || 0;
            let tempMpTypeB = data?.pagesList?.find(page => page.mpId === data.mpId2)?.mpType || 0;
            let requestData = {
                "campName": data.campaignName,
                "allTempData":"",
                "myPageId": data.mpId1,
                "selectedGid": data.groupId,
                "replyToAdd":data.fromAddress,
                "fromName": data.fromName1,
                "subject": data.subject,
                "fromAdd": data.fromAddress,
                "testingType": data.testingType,
                "subjectB": data.subject2,
                "myPageIdB": data.mpId2,
                "fromNameB": data.fromName2,
                "checkSpamYN":"N",
                "contactSelected": contactSelected,
                "mpType": tempMpType,
                "mpTypeB": tempMpTypeB
            }
            sendEmailPreview(requestData).then(res => {
                if (res.status === 200) {
                    toggleSendPreviewEmail();
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
                $("button.sendEmail").show();
            });
        } else {
            globalAlert({
                type: "Error",
                text: "Select at least one email.",
                open: true
            });
        }
    }
    useEffect(() => {
        $(function () {
            $("#slider").slider({
                create: function () {
                    let per =  data.groupValue/2;
                    let groupAValue = Math.ceil((data.totalMember * per) / 100);
                    let groupBValue = Math.ceil((data.totalMember * per) / 100);
                    if ((groupAValue + groupBValue) > data.totalMember) {
                        groupBValue=data.totalMember-groupAValue;
                    }
                    const remainingGroupValue = data.totalMember - (groupAValue+groupBValue);
                    setData((prev) => {
                        return {
                            ...prev,
                            remainingGroupValue,
                            groupAValue,
                            groupBValue
                        }
                    })
                },
                slide: function (event, ui) {
                    let per =  ui.value/2;
                    let groupAValue = Math.ceil((data.totalMember * per) / 100);
                    let groupBValue = Math.ceil((data.totalMember * per) / 100);
                    if ((groupAValue + groupBValue) > data.totalMember) {
                        groupBValue=data.totalMember-groupAValue;
                    }
                    const remainingGroupValue = data.totalMember - (groupAValue+groupBValue);
                    setData((prev) => {
                        return {
                            ...prev,
                            groupValue: ui.value,
                            remainingGroupValue,
                            groupAValue,
                            groupBValue
                        }
                    })
                }
            });
        })
    })

    useEffect(() => {
        getGroupListWithCheckDuplicate().then(
            res => {
                if (res.result.group) {
                    let groups = [];
                    res.result.group.forEach((element) => {
                        groups.push({
                            gId: element.groupId,
                            name: element.groupName,
                            totalMember: element.totalMember,
                            lockGroup: element.lockGroup,
                            segmentYN: element.segmentYN,
                            typeEmail: element.typeEmail
                        });
                    });
                    setGroups(groups);
                }
            }
        );
        getMyPagesList(2).then(res => {
            if (res.result) {
                handleDataChange("pagesList", res.result.mypage);
            }
        });
    }, []);

    const handleChange = (event) => {
        setData((prev) => {
            return { ...prev, testingType: Number(event.target.value) }
        })
    };
    const handleSpamCheck = () => {
        let requestData = {
            "domainName":data.fromAddress.split("@")[1],
            "campName": data.campaignName,
            "allTempData":"",
            "myPageId": data.mpId1,
            "selectedGid": data.groupId,
            "replyToAdd":data.fromAddress,
            "fromName": data.fromName1,
            "subject": data.subject.replaceAll("##","").replaceAll("_"," "),
            "fromAdd": data.fromAddress,
            "allTempDataB":"",
            "testingType": data.testingType,
            "subjectB": data.subject2.replaceAll("##","").replaceAll("_"," "),
            "myPageIdB": data.mpId2,
            "fromNameB": data.fromName2,
            "checkSpamYN":"Y"
        }
        checkSpam(requestData).then(res => {
            if (res.status === 200) {
                setSpamCheckDetails(res.result);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    switch (step) {
        case 1:
            return (
                <Suspense fallback={<Loader />}>
                    <SelectGroupSegment groups={groups} setGroups={setGroups} handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} />
                </Suspense>
            )
        case 2:
            return (
                <ABTestingType data={data} globalAlert={globalAlert} handleBack={handleBack} handleChange={handleChange} handleNext={handleNext} />
            )
        case 3:
            return (
                <Suspense fallback={<Loader />}>
                    <CampaignInformation handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} />
                </Suspense>
            )
        case 4:
            return (
                <Suspense fallback={<Loader />}>
                    <SelectPage title={`${data.testingType === 2 || data.testingType === 5 ? "Select A Page Design For Email Marketing Campaign A" : "Select A Page Design For Email Marketing Campaign"}`} handleBack={handleBack} mpId="mpId1" handleNext={handleNext} data={data} setData={setData} />
                </Suspense>
            )
        case 5:
            return (
                <Suspense fallback={<Loader />}>
                    <SelectPage title="Select A Page Design For Email Marketing Campaign B" handleBack={handleBack} mpId="mpId2" handleNext={handleNext} data={data} setData={setData} />
                </Suspense>
            )
        case 6:
            return (
                <Suspense fallback={<Loader />}>
                    <SelectEmailAndName handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} />
                </Suspense>
            )
        case 7:
            return (
                <Suspense fallback={<Loader />}>
                    <SpamInstructions handleBack={handleBack} handleDataChange={handleDataChange} handleNext={handleNext} handleSpamCheck={handleSpamCheck} />
                </Suspense>
            )
        case 8:
            return (
                <Suspense fallback={<Loader />}>
                    <SpamChecking data={data} spamCheckDetails={spamCheckDetails} handleBack={handleBack} handleClickModalOpen={handleClickModalOpen} handleNext={handleNext} />
                </Suspense>
            )
        case 9:
            return (
                <Suspense fallback={<Loader />}>
                    <Scheduler data={data} timeValues={timeValues} globalAlert={globalAlert} handleBack={handleBack} handleChangeDefaultName={handleChangeDefaultName} handleDataChange={handleDataChange} handleNext={handleNext} handleWinnerTypeChange={handleWinnerTypeChange} setData={setData} />
                </Suspense>
            )
        case 10:
            return (
                <Suspense fallback={<Loader />}>
                    <Preview data={data} memberId={memberId} page1={page1} page2={page2} handleBack={handleBack} handleClickSendCampaign={handleClickSendCampaign} handleClickSendEmailPreview={handleClickSendEmailPreview} />
                    <PreviewModal modalSendPreviewEmail={modalSendPreviewEmail} toggleSendPreviewEmail={toggleSendPreviewEmail} subMemberId={subMemberId} subEmail={subEmail} email={email} contactSelected={contactSelected} setContactSelected={setContactSelected} prevKeyStroke={prevKeyStroke} setPrevKeyStroke={setPrevKeyStroke} globalAlert={globalAlert} handleCallSendPreviewEmail={handleCallSendPreviewEmail} />
                </Suspense>
            )
        default:
            return "Unknown Step"
    }
}

const mapStateToProps = (state) => {
    return {
        firstName: pathOr("", ["user", "firstName"], state),
        lastName: pathOr("", ["user", "lastName"], state),
        email: pathOr("", ["user", "email"], state),
        memberId: pathOr("", ["user", "memberId"], state),
        timeZone: pathOr("", ["user", "timeZone"], state),
        subFirstName: pathOr("", ["subUser", "firstName"], state),
        subLastName: pathOr("", ["subUser", "lastName"], state),
        subEmail: pathOr("", ["subUser", "email"], state),
        subMemberId: pathOr("", ["subUser", "memberId"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        pendingTransaction: (data) => {dispatch(setPendingTransactionAction(data))}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ABTestingCampaign);