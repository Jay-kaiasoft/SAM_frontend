import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {surveyCategoryUrl, surveyReportUrl, surveyTemplateUrl, surveyUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getSurveyAllList = () =>{
    return axiosInterceptors().get(surveyUrl+'/getSurveyAllList').then(res => res)
}
export const getSurveyAllListAuto = () =>{
    return axiosInterceptors().get(surveyUrl+'/getSurveyAllListAuto').then(res => res)
}
export const getSurveyListPages = (data) =>{
    return axiosInterceptors().get(surveyUrl+'/getSurveyListPages?'+easUrlEncoder(data)).then(res => res)
}
export const saveSurveyData = (data) =>{
    return axiosInterceptors().post(surveyUrl+'/saveSurveyData',data).then(res => res)
}
export const deleteSurvey = (data) =>{
    return axiosInterceptors().delete(surveyUrl+'/deleteSurvey', {data:data}).then(res => res)
}
export const getSurveyById = (id) =>{
    return axiosInterceptors().get(surveyUrl+'/getSurveyById/'+easUrlEncoder(id)).then(res => res)
}
export const getSurveyCopy = (subUserId,id) =>{
    return axiosInterceptors().get(surveyUrl+'/getSurveyCopy/'+easUrlEncoder(subUserId)+'/'+easUrlEncoder(id)).then(res => res)
}
export const closeSurvey = (data) =>{
    return axiosInterceptors().post(surveyUrl+'/closeSurvey',data).then(res => res)
}
export const saveSendSurvey = (data) =>{
    return axiosInterceptors().post(surveyUrl+'/saveSendSurvey',data).then(res => res)
}
export const saveSurveyAnswers = (data) =>{
    return axiosInterceptors().post(surveyUrl+'/saveSurveyAnswers',data).then(res => res)
}
export const getPreviewSurveyData = (surveyId,stSessionId)=>{
    return axiosInterceptors().get(surveyUrl + '/getPreviewSurveyData?id='+easUrlEncoder(surveyId)+'&ssSessionId='+easUrlEncoder(stSessionId)).then(res => res);
}
export const checkSurveyNameExists = (data)=>{
    return axiosInterceptors().get(surveyUrl + '/checkSurveyNameExists'+easUrlEncoder(data)).then(res => res);
}
export const getSurveyCategoryList = () =>{
    return axiosInterceptors().get(surveyCategoryUrl+'/getSurveyCategoryList').then(res => res)
}
export const getSurveyCategoryListPages = (data) =>{
    return axiosInterceptors().get(surveyCategoryUrl+'/getSurveyCategoryListPages?'+easUrlEncoder(data)).then(res => res)
}
export const deleteSurveyCategory = (data)=>{
    return axiosInterceptors().delete(surveyCategoryUrl+'/deleteSurveyCategory', {data:data}).then(res => res)
}
export const saveSurveyCategory = (data)=> {
    return axiosInterceptors().post(surveyCategoryUrl + '/saveSurveyCategory', data).then(res => res)
}
export const getSurveyTemplateList = (status) =>{
    return axiosInterceptors().get(surveyTemplateUrl+'/getSurveyTemplateList/'+easUrlEncoder(status)).then(res => res)
}
export const saveSurveyTemplate = (data)=> {
    return axiosInterceptors().post(surveyTemplateUrl + '/saveSurveyTemplate', data).then(res => res)
}
export const deleteSurveyTemplate = (id) =>{
    return axiosInterceptors().delete(surveyTemplateUrl+'/deleteSurveyTemplate/'+easUrlEncoder(id)).then(res => res)
}
export const getSurveyTemplateById = (id) =>{
    return axiosInterceptors().get(surveyTemplateUrl+'/getSurveyTemplateById/'+easUrlEncoder(id)).then(res => res)
}
export const getSurveyTemplateOnlyDataById = (id) =>{
    return axiosInterceptors().get(surveyTemplateUrl+'/getSurveyTemplateOnlyDataById/'+easUrlEncoder(id)).then(res => res)
}
export const getSurveyTemplateCopy = (subUserId,id) =>{
    return axiosInterceptors().get(surveyTemplateUrl+'/getSurveyTemplateCopy/'+easUrlEncoder(subUserId)+'/'+easUrlEncoder(id)).then(res => res)
}
export const getSurveyReportDemographic = (data) => {
    return axiosInterceptors().get(surveyReportUrl + '/getSurveyReportDemographic?' + easUrlEncoder(data)).then(res => res)
}
export const getSurveyReportTechnologyUse = (data) => {
    return axiosInterceptors().get(surveyReportUrl + '/getSurveyReportTechnologyUse?' + easUrlEncoder(data)).then(res => res)
}
export const getSurveyReportQuestionsComboList = (data)=>{
    return axiosInterceptors().get(surveyReportUrl+'/getSurveyReportQuestionsComboList?'+easUrlEncoder(data)).then(res=>res)
}
export const getSurveyReportAnswersComboList = (data) => {
    return axiosInterceptors().get(surveyReportUrl + '/getSurveyReportAnswersComboList?' + easUrlEncoder(data)).then(res => res)
}
export const surveyReportDataBrowser = (data) => {
    return axiosInterceptors().post(surveyReportUrl + '/surveyReportDataBrowser', data).then(res => res)
}
export const getSurveyReportParticipant = (data) => {
    return axiosInterceptors().get(surveyReportUrl + '/getSurveyReportParticipant?' + easUrlEncoder(data)).then(res => res)
}