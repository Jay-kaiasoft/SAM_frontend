import {groupUrl, contactUrl, groupSegmentUrl, contactImportUrl, quickbookUrl, salesforceUrl, contactHistoryUrl, smsTemplateUrl, baseURL, callingUrl, zoomUrl} from '../config/api';
import axiosInterceptors from '../axiosInterceptor/axiosInterceptors.js';
import {easUrlEncoder} from "../assets/commonFunctions";

export const getGroupSegmentDetails = () =>{
    return axiosInterceptors().get(groupUrl+'/getGroupList').then(res => res)
}
export const getGroupListWithCheckDuplicate = () =>{
    return axiosInterceptors().get(groupUrl+'/getGroupListWithCheckDuplicate').then(res => res)
}
export const getGroupListCombo = () =>{
    return axiosInterceptors().get(groupUrl+'/getGroupListCombo').then(res => res)
}
export const getGroupSmsTotalCount = (data) =>{
    return axiosInterceptors().get(groupUrl+'/getGroupSmsTotalCount?'+easUrlEncoder(data)).then(res => res)
}
export const getGroupById = (groupId) =>{
    return axiosInterceptors().get(groupUrl+'/getGroupById/'+easUrlEncoder(groupId)).then(res => res)
}
export const inviteByUrl = (data) =>{
    return axiosInterceptors().get(groupUrl+'/inviteByUrl?'+easUrlEncoder(data)).then(res => res)
}
export const getInviteByUrlData = (data) =>{
    return axiosInterceptors().post(groupUrl+'/getInviteByUrlData',data).then(res => res)
}
export const getGroupUDF = (groupId) =>{
    return axiosInterceptors().get(groupUrl+'/getGroupUDF/'+easUrlEncoder(groupId)).then(res => res)
}
export const getGroupUDFAuto = (groupId) =>{
    return axiosInterceptors().get(groupUrl+'/getGroupUDFAuto/'+easUrlEncoder(groupId)).then(res => res)
}
export const getContactList = (groupId,data) =>{
    return axiosInterceptors().get(contactUrl+'/getContactList/'+easUrlEncoder(groupId)+'?'+easUrlEncoder(data)).then(res => res)
}
export const getUnsubscribedContactList = (data) =>{
    return axiosInterceptors().get(contactUrl+'/getUnsubscribedContactList?'+easUrlEncoder(data)).then(res => res)
}
export const getUnsubscribedSmsContactList = (data) =>{
    return axiosInterceptors().get(contactUrl+'/getUnsubscribedSmsContactList?'+easUrlEncoder(data)).then(res => res)
}
export const getBadEmailContactList = (data) =>{
    return axiosInterceptors().get(contactUrl+'/getBadEmail?'+easUrlEncoder(data)).then(res => res)
}
export const getBadSMSContactList = (data) =>{
    return axiosInterceptors().get(contactUrl+'/getBadSms?'+easUrlEncoder(data)).then(res => res)
}
export const getDuplicateContactList = (groupId,data) =>{
    return axiosInterceptors().get(contactUrl+'/getDuplicateContactList/'+easUrlEncoder(groupId)+'/?'+easUrlEncoder(data)).then(res => res)
}
export const removeDuplicateContact = (groupId) =>{
    return axiosInterceptors().delete(contactUrl+'/removeDuplicateContact/'+groupId).then(res => res)
}
export const addInviteByUrlContact = (data) => {
    return axiosInterceptors().post(contactUrl + '/addInviteByUrlContact', data).then(res => res)
}
export const addContact = (data) => {
    return axiosInterceptors().post(contactUrl + '/addContact', data).then(res => res)
}
export const deleteBulkContact = (data) =>{
    return axiosInterceptors().delete(contactUrl+'/deleteBulkContact', { data: data }).then(res => res)
}
export const moveContactExistingGroup = (newGroupId,selectionType,data) => {
    return axiosInterceptors().put(contactUrl + '/moveContactExistingGroup/'+easUrlEncoder(newGroupId)+'/'+easUrlEncoder(selectionType), data).then(res => res)
}
export const copyContactNewGroup = (groupId,selectionType,data) => {
    return axiosInterceptors().post(contactUrl + '/copyContactNewGroup/'+easUrlEncoder(groupId)+'/'+easUrlEncoder(selectionType), data).then(res => res)
}
export const getDownloadContactFile = (groupId) => {
    return axiosInterceptors().get(contactUrl + '/getDownloadContactFile/'+easUrlEncoder(groupId)).then(res => res)
}
export const getDownloadNotGroupContactFile = (data) => {
    return axiosInterceptors().get(contactUrl + '/getDownloadNotGroupContactFile/'+easUrlEncoder(data)).then(res => res)
}
export const getContact = (emailId) => {
    return axiosInterceptors().get(contactUrl + '/getContact/'+easUrlEncoder(emailId)).then(res => res)
}
export const updateContact = (emailId,data) => {
    return axiosInterceptors().put(contactUrl + '/updateContact/'+easUrlEncoder(emailId),data).then(res => res)
}
export const getContactNumberList = (searchTerm) => {
    return axiosInterceptors().get(contactUrl + '/getContactNumberList/'+easUrlEncoder(searchTerm)).then(res => res)
}
export const getContactEmailList = (searchTerm) => {
    return axiosInterceptors().get(contactUrl + '/getContactEmailList/'+easUrlEncoder(searchTerm)).then(res => res)
}
export const sendEmailToContact = (data) => {
    return axiosInterceptors().post(contactUrl + '/sendEmailToContact', data).then(res => res)
}
export const getSegmentContactList = (groupId,segmentId,data) =>{
    return axiosInterceptors().get(groupSegmentUrl+'/getSegmentContactList/'+easUrlEncoder(groupId)+'/'+easUrlEncoder(segmentId)+'?'+easUrlEncoder(data)).then(res => res)
}
export const deleteSegment = (data) => {
    return axiosInterceptors().delete(groupSegmentUrl + '/deleteBulkSegment', { data: data }).then(res => res)
}
export const fetchGroupUdfList = (data) => {
    return axiosInterceptors().get(groupUrl + `/getGroupUDFList/${easUrlEncoder(data)}`).then(res => res)
}
export const addSegment = (data) => {
    return axiosInterceptors().post(groupSegmentUrl + '/addSegment', data).then(res => res)
}
export const getSegment = (data) => {
    return axiosInterceptors().get(groupSegmentUrl + `/getSegment/${easUrlEncoder(data)}`).then(res => res)
}
export const updateSegment = (segId, data) => {
    return axiosInterceptors().put(groupSegmentUrl + `/updateSegment/${easUrlEncoder(segId)}`, data).then(res => res)
}
export const getSegmentList = (groupId) => {
    return axiosInterceptors().get(groupSegmentUrl + `/getSegmentList/${easUrlEncoder(groupId)}`).then(res => res)
}
export const getGroupUDFValueList = (data) => {
    return axiosInterceptors().get(groupUrl + `/getGroupUDFValueList/${easUrlEncoder(data)}`).then(res => res)
}
export const getGroupFirstRecords = (groupId) => {
    return axiosInterceptors().get(groupUrl + `/getGroupFirstRecords/${easUrlEncoder(groupId)}`).then(res => res)
}
export const saveGroup = (data) =>{
    return axiosInterceptors().post(groupUrl+'/saveGroup',data).then(res => res)
}
export const deleteBulkGroup = (data) =>{
    return axiosInterceptors().delete(groupUrl+'/deleteBulkGroup', { data: data }).then(res => res)
}
export const sendOptInGroup = (data) =>{
    return axiosInterceptors().post(groupUrl+'/sendOptInGroup',data).then(res => res)
}
export const uploadFile = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/contactImportFile', data).then(res => res)
}
export const importContact = (data) => {
    return axiosInterceptors().post(contactImportUrl, data).then(res => res)
}
export const fetchGroupInformationFromServer = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/headerFieldMapping', data).then(res => res)
}
export const addTempCronContact = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/addTempCronContact', data).then(res => res)
}
export const uploadCellDataOnServer = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/updateImportContact', data).then(res => res)
}
export const cancelUpload = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/cancelUpload', data).then(res => res)
}
export const optOut = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/optOut', data).then(res => res)
}
export const optOutDetails = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/optOutDetails', data).then(res => res)
}
export const sendSubscribeLink = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/sendSubscribeLink', data).then(res => res)
}
export const optInDetails = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/optInDetails', data).then(res => res)
}
export const optIn = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/optIn', data).then(res => res)
}
export const emailVerificationGroup = (data) => {
    return axiosInterceptors().post(contactImportUrl + '/emailVerificationGroup', data).then(res => res)
}
export const connectToQuickbooks = () =>{
    return axiosInterceptors().get(quickbookUrl+'/connectToQuickbooks').then(res => res)
}
export const qbOauth2redirect = (data) =>{
    return axiosInterceptors().get(quickbookUrl+'/oauth2redirect'+data).then(res => res)
}
export const connectToSalesforce = () =>{
    return axiosInterceptors().get(salesforceUrl+'/connectToSalesforce').then(res => res)
}
export const sfOauth2redirect = (data) =>{
    return axiosInterceptors().get(salesforceUrl+'/oauth2redirect'+data).then(res => res)
}
export const getSendEmails = (emailId) =>{
    return axiosInterceptors().get(contactHistoryUrl+'/getSendEmails/'+easUrlEncoder(emailId)).then(res => res)
}
export const getOutgoingSMS = (emailId) =>{
    return axiosInterceptors().get(contactHistoryUrl+'/getOutgoingSMS/'+easUrlEncoder(emailId)).then(res => res)
}
export const getIncomingSMS = (emailId) =>{
    return axiosInterceptors().get(contactHistoryUrl+'/getIncomingSMS/'+easUrlEncoder(emailId)).then(res => res)
}
export const getSMSPolling = (emailId) =>{
    return axiosInterceptors().get(contactHistoryUrl+'/getSMSPolling/'+easUrlEncoder(emailId)).then(res => res)
}
export const getConversations = (data) =>{
    return axiosInterceptors().post(contactHistoryUrl+'/getConversations',data).then(res => res)
}
export const getCalling = (data) =>{
    return axiosInterceptors().post(contactHistoryUrl+'/getCalling',data).then(res => res)
}
export const getSmsTemplateSelect = () =>{
    return axiosInterceptors().get(smsTemplateUrl+'/getSmsTemplateSelect').then(res => res)
}
export const getSmsTemplateDetails = (sstId,emailId) =>{
    return axiosInterceptors().get(smsTemplateUrl+'/getSmsTemplateDetails/'+easUrlEncoder(sstId)+'/'+easUrlEncoder(emailId)).then(res => res)
}
export const searchForBuyNumber = (data) =>{
    return axiosInterceptors().post(baseURL+'/searchForBuyNumber',data).then(res => res)
}
export const sendCalling = (data) =>{
    return axiosInterceptors().post(callingUrl+'/sendCalling',data).then(res => res)
}
export const callingStop = (cpId) =>{
    return axiosInterceptors().get(callingUrl+'/callingStop?cpId='+cpId).then(res => res)
}
export const zoomOauth = (data)=>{
    return axiosInterceptors().get(zoomUrl+'/zoomOauth'+data).then(res => res)
}
export const zoomLogout = ()=>{
    return axiosInterceptors().get(zoomUrl+'/zoomLogout').then(res => res)
}
export const getZoomAuthentication = () => {
    return axiosInterceptors().get(zoomUrl+'/getZoomAuthentication').then(res => res)
}
export const addZoomMeeting = (data) => {
    return axiosInterceptors().post(zoomUrl+"/addZoomMeeting", data).then(res=>res);
}
export const getGroupContactCount = (groupId, segmentId = null) => {
    const url = segmentId
        ? `${groupUrl}/getGroupContactCount/${groupId}?segmentId=${segmentId}`
        : `${groupUrl}/getGroupContactCount/${groupId}`;
    return axiosInterceptors().get(url).then(res => res);
}
export const getGroupFieldsList = (groupId) => {
    return axiosInterceptors().get(groupUrl+'/getGroupFieldsList/'+groupId).then(res => res)
}