import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {smsCampaignReportUrl, smsCampaignUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getSmsCampaignList = (data) =>{
    return axiosInterceptors().get(smsCampaignUrl+'/getSmsCampaignList?'+easUrlEncoder(data)).then(res => res)
}
export const deleteSmsCampaign = (data) =>{
    return axiosInterceptors().delete(smsCampaignUrl+'/deleteSmsCampaign',{ data: data }).then(res => res)
}
export const getSmsCampaign = (data) =>{
    return axiosInterceptors().get(smsCampaignUrl+'/getSmsCampaign?'+easUrlEncoder(data)).then(res => res)
}
export const editSmsCampaignSchedule = (data) =>{
    return axiosInterceptors().put(smsCampaignUrl+'/editSmsCampaignSchedule',data).then(res => res)
}
export const saveSmsCampaign = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/saveSmsCampaign',data).then(res => res)
}
export const sendSmsPreview = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/sendSmsPreview',data).then(res => res)
}
export const sendSmsCampaign = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/sendSmsCampaign',data).then(res => res)
}
export const saveSendSmsCampaign = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/saveSendSmsCampaign',data).then(res => res)
}
export const buyNumberForSmsCampaign = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/buyNumberForSmsCampaign',data).then(res => res)
}
export const getSmsCampaignPhoneList = (subMemberId) => {
    return axiosInterceptors().get(smsCampaignUrl + '/getSmsCampaignPhoneList/'+easUrlEncoder(subMemberId)).then(res => res)
}
export const deleteSmsCampaignNumber = (id,scdSmsId) => {
    return axiosInterceptors().delete(smsCampaignUrl + easUrlEncoder(`/deleteSmsCampaignNumber/${id}/${scdSmsId}`)).then(res => res)
}
export const getNumberCheck = (groupId) => {
    return axiosInterceptors().get(smsCampaignUrl + '/getNumberCheck/'+easUrlEncoder(groupId)).then(res => res)
}
export const getScmNumberPhoneSid = () => {
    return axiosInterceptors().get(smsCampaignUrl + '/getScmNumberPhoneSid').then(res => res)
}
export const closeSmsCampaign = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/closeSmsCampaign',data).then(res => res)
}
export const changeSmsCampaignNumber = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/changeSmsCampaignNumber',data).then(res => res)
}
export const checkNumberAssignOrNot = () => {
    return axiosInterceptors().get(smsCampaignUrl + '/checkNumberAssignOrNot').then(res => res)
}
export const getSmsCampaignsReportListPage = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportListPage?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportDashboard = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportDashboard?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportsLinksData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportsLinksData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportsLinksDataDetails = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportsLinksDataDetails?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportsUndeliveredData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportsUndeliveredData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportsNotSentData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportsNotSentData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsSmsReportsDeliveriesData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsSmsReportsDeliveriesData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsMmsReportsDeliveriesData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsMmsReportsDeliveriesData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportsUnsubscribedData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportsUnsubscribedData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportRepliesData = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportRepliesData?' + easUrlEncoder(data)).then(res => res)
}
export const getSmsCampaignsReportDataForPdf = (data) => {
    return axiosInterceptors().get(smsCampaignReportUrl + '/getSmsCampaignsReportDataForPdf?' + easUrlEncoder(data)).then(res => res)
}
export const getFreeNumberList = () => {
    return axiosInterceptors().get(smsCampaignUrl + '/getFreeNumberList/').then(res => res)
}
export const getSmsCampaignNumber = (smsId) => {
    return axiosInterceptors().get(smsCampaignUrl + '/getSmsCampaignNumber/' + smsId).then(res => res)
}
export const getSmsCampaignReleasePhoneList = (subMemberId) => {
    return axiosInterceptors().get(smsCampaignUrl + '/getSmsCampaignReleasePhoneList/'+easUrlEncoder(subMemberId)).then(res => res)
}
export const getSmsCampaignReplyNotification = (lastId) => {
    return axiosInterceptors().get(smsCampaignUrl + '/getSmsCampaignReplyNotification/'+easUrlEncoder(lastId)).then(res => res)
}
export const setCampaignNumber = (data) =>{
    return axiosInterceptors().post(smsCampaignUrl+'/setCampaignNumber',data).then(res => res)
}
export const getUsernamePassword = () => {
    return axiosInterceptors().get(smsCampaignUrl + '/getUsernamePassword').then(res => res)
}