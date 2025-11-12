import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {assessmentGroupsUrl, assessmentUrl, assessmentCategoryUrl, assessmentTemplateUrl, assessmentReportUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getAssessmentGroupsList = () =>{
    return axiosInterceptors().get(assessmentGroupsUrl+'/getAssessmentGroupsList').then(res => res)
}
export const saveAssessmentGroups = (data) =>{
    return axiosInterceptors().post(assessmentGroupsUrl+'/saveAssessmentGroups',data).then(res => res)
}
export const deleteAssessmentGroups = (data) =>{
    return axiosInterceptors().delete(assessmentGroupsUrl+'/deleteAssessmentGroups',{data:data}).then(res => res)
}
export const getAssessmentListPages = (data) =>{
    return axiosInterceptors().get(assessmentUrl+'/getAssessmentListPages?'+easUrlEncoder(data)).then(res => res)
}
export const saveAssessmentData = (data) =>{
    return axiosInterceptors().post(assessmentUrl+'/saveAssessmentData',data).then(res => res)
}
export const saveSendAssessment = (data) =>{
    return axiosInterceptors().post(assessmentUrl+'/saveSendAssessment',data).then(res => res)
}
export const getAssessmentById = (id) =>{
    return axiosInterceptors().get(assessmentUrl+'/getAssessmentById/'+easUrlEncoder(id)).then(res => res)
}
export const getAssessmentCopy = (subUserId,id) =>{
    return axiosInterceptors().get(assessmentUrl+'/getAssessmentCopy/'+subUserId+'/'+easUrlEncoder(id)).then(res => res)
}
export const deleteAssessment = (data) =>{
    return axiosInterceptors().delete(assessmentUrl+'/deleteAssessment', {data:data}).then(res => res)
}
export const closeAssessment = (data) =>{
    return axiosInterceptors().post(assessmentUrl+'/closeAssessment',data).then(res => res)
}
export const getAssessmentAllList = () =>{
    return axiosInterceptors().get(assessmentUrl+'/getAssessmentAllList').then(res => res)
}
export const getAssessmentAllListAuto = () =>{
    return axiosInterceptors().get(assessmentUrl+'/getAssessmentAllListAuto').then(res => res)
}
export const getPreviewAssessmentData = (id,asSessionId)=>{
    return axiosInterceptors().get(assessmentUrl + '/getPreviewAssessmentData?id='+easUrlEncoder(id)+'&asSessionId='+easUrlEncoder(asSessionId)).then(res => res);
}
export const saveAssessmentAnswers = (data) =>{
    return axiosInterceptors().post(assessmentUrl+'/saveAssessmentAnswers',data).then(res => res)
}
export const checkAssessmentNameExists = (data)=>{
    return axiosInterceptors().get(assessmentUrl + '/checkAssessmentNameExists'+easUrlEncoder(data)).then(res => res);
}
export const getAssessmentCategoryList = () =>{
    return axiosInterceptors().get(assessmentCategoryUrl+'/getAssessmentCategoryList').then(res => res)
}
export const getAssessmentCategoryListPages = (data) =>{
    return axiosInterceptors().get(assessmentCategoryUrl+'/getAssessmentCategoryListPages?'+easUrlEncoder(data)).then(res => res)
}
export const deleteAssessmentCategory = (data)=>{
    return axiosInterceptors().delete(assessmentCategoryUrl+'/deleteAssessmentCategory', {data:data}).then(res => res)
}
export const saveAssessmentCategory = (data)=> {
    return axiosInterceptors().post(assessmentCategoryUrl + '/saveAssessmentCategory', data).then(res => res)
}
export const getAssessmentTemplateList = (status) =>{
    return axiosInterceptors().get(assessmentTemplateUrl+'/getAssessmentTemplateList/'+easUrlEncoder(status)).then(res => res)
}
export const saveAssessmentTemplate = (data)=> {
    return axiosInterceptors().post(assessmentTemplateUrl + '/saveAssessmentTemplate', data).then(res => res)
}
export const deleteAssessmentTemplate = (id) =>{
    return axiosInterceptors().delete(assessmentTemplateUrl+'/deleteAssessmentTemplate/'+easUrlEncoder(id)).then(res => res)
}
export const getAssessmentTemplateById = (id) =>{
    return axiosInterceptors().get(assessmentTemplateUrl+'/getAssessmentTemplateById/'+easUrlEncoder(id)).then(res => res)
}
export const getAssessmentTemplateOnlyDataById = (id) =>{
    return axiosInterceptors().get(assessmentTemplateUrl+'/getAssessmentTemplateOnlyDataById/'+easUrlEncoder(id)).then(res => res)
}
export const getAssessmentTemplateCopy = (subUserId,id) =>{
    return axiosInterceptors().get(assessmentTemplateUrl+'/getAssessmentTemplateCopy/'+subUserId+'/'+easUrlEncoder(id)).then(res => res)
}
export const getAssessmentReportTechnologyUse = (data) => {
    return axiosInterceptors().get(assessmentReportUrl + '/getAssessmentReportTechnologyUse?' + easUrlEncoder(data)).then(res => res)
}
export const getAssessmentReportDemographic = (data) => {
    return axiosInterceptors().get(assessmentReportUrl + '/getAssessmentReportDemographic?' + easUrlEncoder(data)).then(res => res)
}
export const getAssessmentReportQuestionsComboList = (data) => {
    return axiosInterceptors().get(assessmentReportUrl + '/getAssessmentReportQuestionsComboList?' + easUrlEncoder(data)).then(res => res)
}
export const getAssessmentReportAnswersComboList = (data) => {
    return axiosInterceptors().get(assessmentReportUrl + '/getAssessmentReportAnswersComboList?' + easUrlEncoder(data)).then(res => res)
}
export const assessmentReportDataBrowser = (data) => {
    return axiosInterceptors().post(assessmentReportUrl + '/assessmentReportDataBrowser', data).then(res => res)
}
export const getAssessmentReportParticipant = (data) => {
    return axiosInterceptors().get(assessmentReportUrl + '/getAssessmentReportParticipant?' + easUrlEncoder(data)).then(res => res)
}