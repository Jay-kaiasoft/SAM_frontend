import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {emailCampaignAbTestingReportUrl, emailCampaignReportUrl, emailCampaignUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getCampaignList = (data) =>{
    return axiosInterceptors().get(emailCampaignUrl+'/getCampaignList?'+easUrlEncoder(data)).then(res => res)
}
export const deleteCampaign = (data) =>{
    return axiosInterceptors().delete(emailCampaignUrl+'/deleteCampaign', {data:data}).then(res => res)
}
export const pauseCampaign = (data) =>{
    return axiosInterceptors().put(emailCampaignUrl+'/pauseCampaign',data).then(res => res)
}
export const restartCampaign = (data) =>{
    return axiosInterceptors().put(emailCampaignUrl+'/restartCampaign',data).then(res => res)
}
export const getCampaignById = (data) => {
  return axiosInterceptors().get(emailCampaignUrl + "/getCampaignById?" + easUrlEncoder(data)).then((res) => res);
};
export const resendCampaignNotOpened = (data) =>{
    return axiosInterceptors().put(emailCampaignUrl+'/resendCampaignNotOpened',data).then(res => res)
}
export const resendAllCampaign = (data) =>{
    return axiosInterceptors().put(emailCampaignUrl+'/resendAllCampaign',data).then(res => res)
}
export const saveResendCampaign = (data) =>{
    return axiosInterceptors().put(emailCampaignUrl+'/saveResendCampaign',data).then(res => res)
}
export const editCampaignSchedule = (data) =>{
    return axiosInterceptors().put(emailCampaignUrl+'/editCampaignSchedule',data).then(res => res)
}
export const sendCampaign = (data) =>{
    return axiosInterceptors().post(emailCampaignUrl+'/sendCampaign',data).then(res => res)
}
export const saveSendCampaign = (data) =>{
    return axiosInterceptors().post(emailCampaignUrl+'/saveSendCampaign',data).then(res => res)
}
export const sendEmailPreview = (data) =>{
    return axiosInterceptors().post(emailCampaignUrl+'/sendEmailPreview',data).then(res => res)
}
export const getCampaignExists = (campName) =>{
    return axiosInterceptors().get(emailCampaignUrl+'/getCampaignExists/'+easUrlEncoder(campName)).then(res => res)
}
export const checkSpam = (data) =>{
    return axiosInterceptors().post(emailCampaignUrl+'/checkSpam',data).then(res => res)
}
export const campaignLinkClick = (data) =>{
    return axiosInterceptors().post(emailCampaignUrl+'/campaignLinkClick',data).then(res => res)
}
export const viewInBrowser = (data) => {
    return axiosInterceptors().get(emailCampaignUrl + '/viewInBrowser?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportListPage = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportListPage?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportDashboard = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportDashboard?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportProductLinks = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportProductLinks?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportProductLinksClickUser = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportProductLinksClickUser?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportSources = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportSources?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportMembersListPage = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportMembersListPage?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsMemberOpenListPage = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsMemberOpenListPage?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportMembersList = (campId) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportMembersList?campId=' + easUrlEncoder(campId)).then(res => res)
}
export const getEmailCampaignsMemberOpenList = (campId) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsMemberOpenList?campId=' + easUrlEncoder(campId)).then(res => res)
}
export const getEmailCampaignsReportMemberClick = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getEmailCampaignsReportMemberClick?' + easUrlEncoder(data)).then(res => res)
}
export const getCampaignsReportPrint = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getCampaignsReportPrint?' + easUrlEncoder(data)).then(res => res)
}
export const getBouncedEmailReportList = (data) => {
    return axiosInterceptors().get(emailCampaignReportUrl + '/getBouncedEmailReportList?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportDashboardAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportDashboardAB?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportProductLinksAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportProductLinksAB?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportSourcesAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportSourcesAB?' + easUrlEncoder(data)).then(res => res)
}

export const getEmailCampaignsReportMembersListPageAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportMembersListPageAB?' + easUrlEncoder(data)).then(res => res)
}

export const getEmailCampaignsReportMembersBListPageAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportMembersBListPageAB?' + easUrlEncoder(data)).then(res => res)
}

export const getEmailCampaignsReportMembersOListPageAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportMembersOListPageAB?' + easUrlEncoder(data)).then(res => res)
}
export const getEmailCampaignsReportMembersListAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getEmailCampaignsReportMembersListAB?' + easUrlEncoder(data)).then(res => res)
}
export const getCampaignsReportPrintAB = (data) => {
    return axiosInterceptors().get(emailCampaignAbTestingReportUrl + '/getCampaignsReportPrintAB?' + easUrlEncoder(data)).then(res => res)
}
export const setChooseWinner = (data) => {
    return axiosInterceptors().post(emailCampaignAbTestingReportUrl + '/setChooseWinner', data).then(res => res)
}