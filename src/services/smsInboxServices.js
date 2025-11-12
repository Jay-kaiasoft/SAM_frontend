import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import { smsInboxUrl } from "../config/api"
import {easUrlEncoder} from "../assets/commonFunctions";

export const getAllReplyCount = () => {
    return axiosInterceptors().get(smsInboxUrl + '/getAllReplyCount').then(res => res)
}
export const getSMSCampaignPhoneNumberList = () => {
    return axiosInterceptors().get(smsInboxUrl + '/getSMSCampaignPhoneNumberList').then(res => res)
}
export const getSMSCampaignList = (phoneNumber) => {
    return axiosInterceptors().get(smsInboxUrl + '/getSMSCampaignList/' + easUrlEncoder(phoneNumber)).then(res => res)
}
export const getSMSCampaignDetailList = (data) => {
    return axiosInterceptors().get(smsInboxUrl + '/getSMSCampaignDetailList/' + easUrlEncoder(data)).then(res => res)
}
export const getConversationsList = () => {
    return axiosInterceptors().get(smsInboxUrl + '/getConversationsList').then(res => res)
}
export const getConversationsClosedList = () => {
    return axiosInterceptors().get(smsInboxUrl + '/getConversationsClosedList').then(res => res)
}
export const getConversationsContactList = (contact) => {
    return axiosInterceptors().get(smsInboxUrl + '/getConversationsContactList/' + easUrlEncoder(contact)).then(res => res)
}
export const currentConversationsDetailList = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/currentConversationsDetailList', data).then(res => res)
}
export const sendConversations = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/sendConversations', data).then(res => res)
}
export const closedConversations = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/closedConversations', data).then(res => res)
}
export const buyNumber = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/buyNumber', data).then(res => res)
}
export const checkInboxForConversation = (clientNumber) => {
    return axiosInterceptors().get(smsInboxUrl + '/checkInboxForConversation/' + easUrlEncoder(clientNumber)).then(res => res)
}
export const changeSmsConversationsNumber = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/changeSmsConversationsNumber', data).then(res => res)
}
export const deleteSmsConversationsNumber = (memberId) => {
    return axiosInterceptors().delete(smsInboxUrl + '/deleteSmsConversationsNumber/'+easUrlEncoder(memberId)).then(res => res)
}

export const setConversationNumber = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/setConversationNumber', data).then(res => res)
}

export const campaignCloseConversation = (data) => {
    return axiosInterceptors().post(smsInboxUrl + '/campaignCloseConversation', data).then(res => res)
}
export const checkDefaultConversationsNumber = () => {
    return axiosInterceptors().get(smsInboxUrl + '/checkDefaultConversationsNumber').then(res => res)
}
export const checkConversationsNumberStatus = (value) => {
    return axiosInterceptors().get(smsInboxUrl + '/checkConversationsNumberStatus?flag='+value).then(res => res)
}
export const getConversationsNumber = () => {
    return axiosInterceptors().get(smsInboxUrl + '/getConversationsNumber').then(res => res)
}