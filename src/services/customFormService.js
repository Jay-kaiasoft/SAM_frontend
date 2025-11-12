import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {customFormUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getCustomFormLinkList = () =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormLinkList').then(res => res)
}
export const getCustomFormLinkListAuto = () =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormLinkListAuto').then(res => res)
}
export const getCustomFormList = (id) =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormList/'+easUrlEncoder(id)).then(res => res)
}
export const deleteCustomForm = (id) =>{
    return axiosInterceptors().delete(customFormUrl+'/deleteCustomForm/'+easUrlEncoder(id)).then(res => res)
}
export const saveCustomFormData = (data) =>{
    return axiosInterceptors().post(customFormUrl+'/saveCustomFormData',data).then(res => res)
}
export const getCustomFormDataById = (id) =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormDataById/'+easUrlEncoder(id)).then(res => res)
}
export const getCustomFormCopy = (subMemberId,id) =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormCopy/'+easUrlEncoder(subMemberId)+'/'+easUrlEncoder(id)).then(res => res)
}
export const getPreviewCustomFormData = (formId,stSessionId)=>{
    return axiosInterceptors().get(customFormUrl + '/getPreviewCustomFormData?id='+easUrlEncoder(formId)+'&stSessionId='+easUrlEncoder(stSessionId)).then(res => res);
}
export const saveCustomFormAnswer = (data)=>{
    return axiosInterceptors().post(customFormUrl + '/saveCustomFormAnswers', data).then(res => res);
}
export const getCustomFormListPages = (data) =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormListPages?'+easUrlEncoder(data)).then(res => res)
}
export const getCustomFormReport = (data) =>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormReport?'+easUrlEncoder(data)).then(res => res)
}
export const getCustomFormAllDataReport = (id)=>{
    return axiosInterceptors().get(customFormUrl+'/getCustomFormAllDataReport?id='+easUrlEncoder(id)).then(res => res)
}
export const deleteCustomFormAnswers = (data)=>{
    return axiosInterceptors().delete(customFormUrl+'/deleteCustomFormAnswers', {data}).then(res => res)
}
export const checkCustomFormNameExists = (data)=>{
    return axiosInterceptors().get(customFormUrl + '/checkCustomFormNameExists'+easUrlEncoder(data)).then(res => res);
}
export const reportExportFormToGroup = (data)=>{
    return axiosInterceptors().post(customFormUrl + '/reportExportFormToGroup', data).then(res => res);
}