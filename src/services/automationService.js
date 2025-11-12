import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import { automationUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const addAutomation = (data) => {
    return axiosInterceptors().post(automationUrl + '/createAutomation', data).then(res => res)
}

export const getAutomationData = () => {
    return axiosInterceptors().get(automationUrl + '/getAutomation').then(res => res)
}

export const getAutomationDataById = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationById/' + easUrlEncoder(id)).then(res => res)
}

export const getAutomationList = (data) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationList?'+easUrlEncoder(data)).then(res => res)
}

export const deleteAutomation = (data) => {
    return axiosInterceptors().delete(automationUrl + '/deleteAutomation', {data:data}).then(res => res);
}

export const getAutomationReportDashboard = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportDashboard/'+easUrlEncoder(id)).then(res => res)
}
export const getAutomationBouncedReportList = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationBouncedReportList?csId='+easUrlEncoder(id)).then(res => res)
}
export const getAutomationReportProductLinks = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportProductLinks?amId='+easUrlEncoder(id)).then(res => res)
}
export const getAutomationReportProductLinksClickUser = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportProductLinksClickUser?linkId='+easUrlEncoder(id)).then(res => res)
}
export const getAutomationReportMembersListPage = (data) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportMembersListPage?'+easUrlEncoder(data)).then(res => res)
}
export const getAutomationReportMemberClick = (data) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportMemberClick?'+easUrlEncoder(data)).then(res => res)
}
export const getAutomationReportMembersList = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportMembersList?csId='+easUrlEncoder(id)).then(res => res)
}
export const getAutomationReportSources = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationReportSources?amId='+easUrlEncoder(id)).then(res => res)
}
export const getAutomationMyPageLinkList = (id) => {
    return axiosInterceptors().get(automationUrl + '/getAutomationMyPageLinkList?myPageId='+easUrlEncoder(id)).then(res => res)
}
export const stopAutomationById = (id) => {
    return axiosInterceptors().get(automationUrl + '/stopAutomationById?amId='+easUrlEncoder(id)).then(res => res)
}
export const startAutomationById = (id) => {
    return axiosInterceptors().get(automationUrl + '/startAutomationById?amId='+easUrlEncoder(id)).then(res => res)
}
export const copyAutomationById = (id) => {
    return axiosInterceptors().get(automationUrl + '/copyAutomationById?amId='+easUrlEncoder(id)).then(res => res)
}