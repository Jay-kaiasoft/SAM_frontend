import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import {dateTimeFormat, dateTimeFormatDB, getClientTimeZone} from '../../assets/commonFunctions';
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { getGroupListWithCheckDuplicate } from "../../services/clientContactService";
import { pathOr } from "ramda";
import { getMyPagesList } from "../../services/myDesktopService";
import {checkSpam, sendCampaign, sendEmailPreview} from "../../services/emailCampaignService";
import history from "../../history";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import $ from "jquery";
import Loader from "../shared/loaderV2/loader";
import { domainChecker } from "../../services/profileService";
import PreviewModal from "./previewModal";
const CampaignInformation = lazy(() => import("./campaignInformation"));
const SelectGroupSegment = lazy(() => import("./selectGroupSegment"));
const SelectEmailAndName = lazy(() => import("./selectEmailAndName"));
const SpamCheckRegular = lazy(() => import("./spamCheckRegular"));
const SpamInstructions = lazy(() => import("./spamInstructions"))
const SchedulerRegular = lazy(() => import("./schedulerRegular"))
const PreviewRegular = lazy(() => import("./previewRegular"))
// const SelectContentType = lazy(() => import("./selectContentType"))
const EmailContent = lazy(() => import("./emailContent"))

const RegularCampaign = ({
    step,
    handleNext,
    handleBack,
    globalAlert,
    firstName,
    lastName,
    memberId,
    email,
    timeZone,
    subFirstName,
    subLastName,
    subMemberId,
    subEmail,
    campaignMainType,
    pendingTransaction,
    handleClickModalOpen
}) => {
    const [groups, setGroups] = useState([]);
    const [spamCheckDetails, setSpamCheckDetails] = useState({});
    const [data, setData] = useState({
        campaignMainType: campaignMainType,
        campType: 2,
        schType: 0,
        campaignName: "",
        mailType: "",
        campaignDescription: "",
        fromAddress: "",
        fromName1: subMemberId > 0 ? `${subFirstName} ${subLastName}` : `${firstName} ${lastName}`,
        emailSubject: "",
        textEmail: "",
		pagesList: [],
        sendOnDateTime: dateTimeFormat(new Date()),
        totalMember:0
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
    useEffect(() => {
        getGroupListWithCheckDuplicate().then(
            res => {
                if (res.result.group) {
                    let groups = [];
                    res.result.group.forEach((element) => {
                        groups.push({
                            gId: element.groupId,
                            name: element.groupName,
                            totalMember:element.totalMember,
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


    // const handleChange = (event) => {
    //     if(Number(event.target.value) === 1){
    //         setData((prev) => {
    //             return { ...prev, campType: Number(event.target.value), mpId:0 }
    //         })
    //     } else {
    //         setData((prev) => {
    //             return { ...prev, campType: Number(event.target.value) }
    //         })
    //     }
    // };


    const handleEmailOptionChange = (event) => {
        let { name, value } = event.target;
        handleDataChange(name, Number(value));
    };
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
                    "schType":data.schType,
                    "sendOnDateTime":dateTimeFormatDB(data.sendOnDateTime),
                    "selectedGid":data.groupId,
                    "selectedSid":data?.segId?.length > 0 ? data.segId[0] : 0,
                    "selectedAllSid": data?.segId || [],
                    "allTempData":data.textEmail,
                    "myPageId":data.mpId,
                    "campMainType":data.campaignMainType,
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
            let tempMpType = data?.pagesList?.find(page => page.mpId === data.mpId)?.mpType || 0;
            let requestData = {
                "campName": data.campaignName,
                "allTempData":data.textEmail,
                "myPageId": data.mpId,
                "selectedGid": data.groupId,
                "replyToAdd":data.fromAddress,
                "fromName": data.fromName1,
                "subject": data.subject,
                "fromAdd": data.fromAddress,
                "testingType": 0,
                "subjectB": "",
                "myPageIdB": 0,
                "fromNameB": "",
                "checkSpamYN":"N",
                "contactSelected": contactSelected,
                "mpType": tempMpType
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
    const handleSpamCheck = () => {
        let requestData = {
            "domainName":data.fromAddress.split("@")[1],
            "campName": data.campaignName,
            "allTempData":data.textEmail,
            "myPageId": data.mpId,
            "selectedGid": data.groupId,
            "replyToAdd":data.fromAddress,
            "fromName": data.fromName1,
            "subject": data.subject.replaceAll("##","").replaceAll("_"," "),
            "fromAdd": data.fromAddress,
            "testingType": 0,
            "subjectB": "",
            "allTempDataB":"",
            "myPageIdB": 0,
            "fromNameB": "",
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
        // case 3:
        //     return (
        //         <Suspense fallback={<Loader />}>
        //             <SelectContentType data={data} handleBack={handleBack} handleNext={handleNext} handleChange={handleChange} />
        //         </Suspense>
        //     )
        case 3:
            return (
                <Suspense fallback={<Loader />}>
                    <CampaignInformation handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} />
                </Suspense>
            )
        case 4:
            return (
                <Suspense fallback={<Loader />}>
                    {
                        data.campType === 1 ?
                            <SelectGroupSegment groups={groups} setGroups={setGroups} handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} />
                        :
                            <EmailContent data={data} setData={setData} globalAlert={globalAlert} handleBack={handleBack} handleDataChange={handleDataChange} handleNext={handleNext} />
                    }
                </Suspense>
            )
        case 5:
            return (
                <Suspense fallback={<Loader />}>
                    {
                        data.campType === 1 ?
                            <EmailContent data={data} setData={setData} globalAlert={globalAlert} handleBack={handleBack} handleDataChange={handleDataChange} handleNext={handleNext} />
                        :
                            <SelectGroupSegment groups={groups} setGroups={setGroups} handleBack={handleBack} handleNext={handleNext} data={data} setData={setData} />
                    }
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
                    <SpamCheckRegular data={data} spamCheckDetails={spamCheckDetails} handleBack={handleBack} handleClickModalOpen={handleClickModalOpen} handleNext={handleNext} />
                </Suspense>
            )
        case 9:
            return (
                <Suspense fallback={<Loader />}>
                    <SchedulerRegular data={data} globalAlert={globalAlert} handleBack={handleBack} handleNext={handleNext} handleEmailOptionChange={handleEmailOptionChange} setData={setData} />
                </Suspense>
            )
        case 10:
            return (
                <Suspense fallback={<Loader />}>
                    <PreviewRegular data={data} handleBack={handleBack} handleClickSendCampaign={handleClickSendCampaign} handleClickSendEmailPreview={handleClickSendEmailPreview} />
                    <PreviewModal modalSendPreviewEmail={modalSendPreviewEmail} toggleSendPreviewEmail={toggleSendPreviewEmail} subMemberId={subMemberId} subEmail={subEmail} email={email} contactSelected={contactSelected} setContactSelected={setContactSelected} prevKeyStroke={prevKeyStroke} setPrevKeyStroke={setPrevKeyStroke} globalAlert={globalAlert} handleCallSendPreviewEmail={handleCallSendPreviewEmail} />
                </Suspense>
            );
        default:
            return "Unknown step";
    }
}

const mapStateToProps = (state) => {
    return {
        firstName: pathOr("", ["user", "firstName"], state),
        lastName: pathOr("", ["user", "lastName"], state),
        memberId: pathOr("", ["user", "memberId"], state),
        email: pathOr("", ["user", "email"], state),
        timeZone: pathOr("", ["user", "timeZone"], state),
        subFirstName: pathOr("", ["subUser", "firstName"], state),
        subLastName: pathOr("", ["subUser", "lastName"], state),
        subMemberId: pathOr("", ["subUser", "memberId"], state),
        subEmail: pathOr("", ["subUser", "email"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        pendingTransaction: (data) => {dispatch(setPendingTransactionAction(data))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegularCampaign);