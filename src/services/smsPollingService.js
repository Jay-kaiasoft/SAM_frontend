import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {contactUrl, smsPollingReportUrl, smsPollingUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getSmsPollingList = (data) =>{
    return axiosInterceptors().get(smsPollingUrl+'/getSmsPollingList?'+easUrlEncoder(data)).then(res => res)
}
export const deleteSmsPolling = (data) =>{
    return axiosInterceptors().delete(smsPollingUrl+'/deleteSmsPolling', {data:data}).then(res => res)
}
export const closeSmsPolling = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/closeSmsPolling',data).then(res => res)
}
export const getSmsPollingCategoryList = () =>{
    return axiosInterceptors().get(smsPollingUrl+'/getSmsPollingCategoryList').then(res => res)
}
export const addSmsPollingCategory = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/addSmsPollingCategory',data).then(res => res)
}
export const saveSmsInfo = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveSmsInfo',data).then(res => res)
}
export const saveMemberList = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveMemberList',data).then(res => res)
}
export const saveSmsPollingQuestion = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveSmsPollingQuestion',data).then(res => res)
}
export const deleteSmsPollingQuestion = (data) =>{
    return axiosInterceptors().delete(smsPollingUrl+'/deleteSmsPollingQuestion', {data:data}).then(res => res)
}
export const getSmsPollingContactList = (groupId,data) =>{
    return axiosInterceptors().get(contactUrl+'/getSmsPollingContactList/'+easUrlEncoder(groupId)+'?'+easUrlEncoder(data)).then(res => res)
}
export const getSmsPolling = (id) =>{
    return axiosInterceptors().get(smsPollingUrl+'/getSmsPolling/'+easUrlEncoder(id)).then(res => res)
}
export const getDuplicateSmsPolling = (subMemberId,id) =>{
    return axiosInterceptors().get(smsPollingUrl+'/getDuplicateSmsPolling/'+easUrlEncoder(subMemberId)+'/'+easUrlEncoder(id)).then(res => res)
}
export const saveFinalizeQuestionOrder = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveFinalizeQuestionOrder',data).then(res => res)
}
export const clearQuestionLogicFlow = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/clearQuestionLogicFlow',data).then(res => res)
}
export const saveQuestionLogicFlow = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveQuestionLogicFlow',data).then(res => res)
}
export const saveDemographicLocation = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveDemographicLocation',data).then(res => res)
}
export const saveAndConfirm = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/saveAndConfirm',data).then(res => res)
}
export const publishAndConfirm = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/publishAndConfirm',data).then(res => res)
}
export const finalPublishAndConfirm = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/finalPublishAndConfirm',data).then(res => res)
}
export const buyNumberForSmsPolling = (data) =>{
    return axiosInterceptors().post(smsPollingUrl+'/buyNumberForSmsPolling',data).then(res => res)
}
export const getSmsPollingPhoneList = () => {
    return axiosInterceptors().get(smsPollingUrl + '/getSmsPollingPhoneList').then(res => res)
}
export const deleteSmsPollingNumber = (id) => {
    return axiosInterceptors().delete(smsPollingUrl + `/deleteSmsPollingNumber/${id}`).then(res => res)
}
export const getSmsPollingReportDemographic = (data) =>{
    return axiosInterceptors().get(smsPollingReportUrl+'/getSmsPollingReportDemographic?'+easUrlEncoder(data)).then(res => res)
}
export const smsPollingReportDataBrowser = (data) =>{
    return axiosInterceptors().post(smsPollingReportUrl+'/smsPollingReportDataBrowser',data).then(res => res)
}
export const getSmsPollingReportQuestionsComboList = (data) =>{
    return axiosInterceptors().get(smsPollingReportUrl+'/getSmsPollingReportQuestionsComboList?'+easUrlEncoder(data)).then(res => res)
}
export const getSmsPollingReportAnswersComboList = (data) =>{
    return axiosInterceptors().get(smsPollingReportUrl+'/getSmsPollingReportAnswersComboList?'+easUrlEncoder(data)).then(res => res)
}
export const getSmsPollingReportParticipate = (data) => {
    return axiosInterceptors().get(smsPollingReportUrl + '/getSmsPollingReportParticipate?' + easUrlEncoder(data)).then(res => res)
}