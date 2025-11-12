import React, {useCallback, useEffect, useRef, useState} from "react";
import { deleteSmsCampaignNumber, getSmsCampaignPhoneList, getSmsCampaignReleasePhoneList } from "../../services/smsCampaignService";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import {userLoggedIn} from "../../actions/userActions";
import SmsSubMember from "./smsSubMember";
import SmsMember from "./smsMember";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import { setConversationNumber } from "../../services/smsInboxServices";
import { Checkbox, FormControlLabel } from "@mui/material";
import { setSubUserAction } from "../../actions/subUserActions";

const SMS = ({globalAlert, user, subUser, userLoggedIn, confirmDialog, setSubUserAction}) => {
    const [smsCampaignPhoneList, setSmsCampaignPhoneList] = useState([])
    const [smsCampaignReleasePhoneList, setSmsCampaignReleasePhoneList] = useState([])
    const defaultYN = useRef("N")

    const displayGetSmsCampaignPhoneList = useCallback(() => {
        getSmsCampaignPhoneList(subUser.memberId).then(res => {
            if (res.status === 200) {
                const responseData = res?.result
                let smsCampaignsPhoneList = responseData?.smsCampaignsPhoneList
                smsCampaignsPhoneList = smsCampaignsPhoneList.map((item) => {
                    return {
                        ...item,
                        isMaster: item?.smsDisplay === "Y" ? true : false
                    }
                })
                setSmsCampaignPhoneList({
                    ...responseData,
                    smsCampaignsPhoneList
                })
            } else {
                globalAlert({
                    open: true,
                    type: "Error",
                    text: res.message
                })
            }
        })
    },[globalAlert,subUser.memberId]);
    const displayGetSmsCampaignReleasePhoneList = useCallback(() => {
        getSmsCampaignReleasePhoneList(subUser.memberId).then(res => {
            if (res.status === 200) {
                const responseData = res?.result
                let smsCampaignsReleasePhoneList = responseData?.smsCampaignsPhoneList
                smsCampaignsReleasePhoneList = smsCampaignsReleasePhoneList.map((item) => {
                    return {
                        ...item,
                        isMaster: item?.smsDisplay === "Y" ? true : false
                    }
                })
                setSmsCampaignReleasePhoneList({
                    ...responseData,
                    smsCampaignsPhoneList:smsCampaignsReleasePhoneList
                })
            } else {
                globalAlert({
                    open: true,
                    type: "Error",
                    text: res.message
                })
            }
        })
    },[globalAlert,subUser.memberId]);
    useEffect(() => {
        displayGetSmsCampaignPhoneList();
        displayGetSmsCampaignReleasePhoneList();
    }, [displayGetSmsCampaignPhoneList, displayGetSmsCampaignReleasePhoneList]);

    const handleDeleteSmsCampaignNumber = (id,scdSmsId,phoneNo) => {
        confirmDialog({
            open: true,
            title: `Any SMS campaign opened with this number will be closed.\nThis action can not be undone.\nOnce you terminate the phone number ${phoneNo}, it is not recoverable.\nWould you like to terminate this number?`,
            onConfirm: () => {
                deleteSmsCampaignNumber(id, scdSmsId).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            open: true,
                            type: "Success",
                            text: res.message
                        })
                        displayGetSmsCampaignPhoneList();
                        if( subUser.memberId > 0) {
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
                })
            }
        })
    }
    const handleSmsCampaignPhoneListCollaplse = (position) => {
        let smsCampaignsPhoneList = smsCampaignPhoneList?.smsCampaignsPhoneList
        if (!smsCampaignsPhoneList[position].isMaster) {
            return
        }
        let i
        for (i = position + 1; i < smsCampaignsPhoneList.length; i++) {
            if (smsCampaignsPhoneList[i].isMaster) {
                break;
            }
            smsCampaignsPhoneList[i] = {
                ...smsCampaignsPhoneList[i],
                smsDisplay: smsCampaignsPhoneList[i].smsDisplay === "Y" ? "N" : "Y"
            }
        }
        setSmsCampaignPhoneList({ ...smsCampaignPhoneList, smsCampaignsPhoneList })
    }
    const handleSmsCampaignReleasePhoneListCollaplse = (position) => {
        let smsCampaignsReleasePhoneList = smsCampaignReleasePhoneList?.smsCampaignsPhoneList
        if (!smsCampaignsReleasePhoneList[position].isMaster) {
            return
        }
        let i
        for (i = position + 1; i < smsCampaignsReleasePhoneList.length; i++) {
            if (smsCampaignsReleasePhoneList[i].isMaster) {
                break;
            }
            smsCampaignsReleasePhoneList[i] = {
                ...smsCampaignsReleasePhoneList[i],
                smsDisplay: smsCampaignsReleasePhoneList[i].smsDisplay === "Y" ? "N" : "Y"
            }
        }
        setSmsCampaignReleasePhoneList({ ...smsCampaignReleasePhoneList, smsCampaignsReleasePhoneList })
    }
    const handleClickSetDefault = (e) => {
        let c = e.target.checked === true ? "Y" : "N";
        defaultYN.current = c;
    }
    const handleClickSwitchToConversation = (twilioNumber,scmNumberPhoneSid) => {
        defaultYN.current = "N";
        confirmDialog({
            open: true,
            title: `Sms campaign will be closed with number.\nAre you sure to switch?`,
            component: <FormControlLabel control={<Checkbox color="primary" onChange={(e)=>{ handleClickSetDefault(e); }}/>} label="Default for SMS Chat" />,
            onConfirm: () => { 
                let requestData = {
                    "conversationsTwilioNumber": twilioNumber,
                    "conversationsSubAccountPhoneSId": scmNumberPhoneSid,
                    "subMemberId": subUser.memberId,
                    "defaultYN": defaultYN.current
                }
                setConversationNumber(requestData).then(res => {
                    if (res.status === 200) {
                        if( subUser.memberId > 0) {
                            setSubUserAction({...subUser, "conversationsTwilioNumber": twilioNumber});
                            sessionStorage.setItem('subUser',JSON.stringify({...subUser, "conversationsTwilioNumber": twilioNumber}));
                        } else {
                            userLoggedIn({...user, "conversationsTwilioNumber": twilioNumber});
                            sessionStorage.setItem('user',JSON.stringify({...user, "conversationsTwilioNumber": twilioNumber}));
                        }
                        displayGetSmsCampaignPhoneList();
                        defaultYN.current = "N";
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
    return (
        subUser.memberId > 0 ?
            <SmsSubMember smsCampaignPhoneList={smsCampaignPhoneList} handleSmsCampaignPhoneListCollaplse={handleSmsCampaignPhoneListCollaplse} handleDeleteSmsCampaignNumber={handleDeleteSmsCampaignNumber} user={user} setToggleBuyTwilioNo={()=>{}} smsCampaignReleasePhoneList={smsCampaignReleasePhoneList} handleSmsCampaignReleasePhoneListCollaplse={handleSmsCampaignReleasePhoneListCollaplse} handleClickSwitchToConversation={()=>{}}/>
        :
            <SmsMember smsCampaignPhoneList={smsCampaignPhoneList} displayGetSmsCampaignPhoneList={displayGetSmsCampaignPhoneList} handleSmsCampaignPhoneListCollaplse={handleSmsCampaignPhoneListCollaplse} handleDeleteSmsCampaignNumber={handleDeleteSmsCampaignNumber} user={user} globalAlert={globalAlert} confirmDialog={confirmDialog} subUser={subUser} userLoggedIn={userLoggedIn} smsCampaignReleasePhoneList={smsCampaignReleasePhoneList} handleSmsCampaignReleasePhoneListCollaplse={handleSmsCampaignReleasePhoneListCollaplse} handleClickSwitchToConversation={handleClickSwitchToConversation} setSubUserAction={setSubUserAction}/>
    )
}

const mapStateToProps = state => {
    return {
        user: state?.user,
        subUser: state?.subUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) },
        confirmDialog: (data) => { dispatch(setConfirmDialogAction(data)) },
        userLoggedIn: (data) => dispatch(userLoggedIn(data)),
        setSubUserAction: (data) => { dispatch(setSubUserAction(data)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SMS);