import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {analyticsUrl, analyticsTrackingUrl} from "../config/api";

export const getDevicesUsersCampaigns = (data) => {
    return axiosInterceptors().post(analyticsUrl + '/getDevicesUsersCampaigns', data).then(res => res)
}

export const getSessionPageLogData = (data) => {
    return axiosInterceptors().post(analyticsUrl + '/getSessionPageLogData', data).then(res => res)
}

export const getDashboardData = (data) => {
    return axiosInterceptors().post(analyticsUrl + '/getDashboardData', data).then(res => res)
}

export const getMinuteActiveUsers = (data) => {
    return axiosInterceptors().post(analyticsUrl + '/getMinuteActiveUsers', data).then(res => res)
}
export const getDashBoardComboList = (websiteId) => {
    return axiosInterceptors().post(analyticsUrl + '/getDashBoardComboList?websiteId=' + websiteId).then(res => res)
}
export const getEmailCampaignOpenMemberLink = (data) => {
    return axiosInterceptors().post(analyticsUrl + '/getEmailCampaignOpenMemberLink', data).then(res => res)
}

export const getEmailCampaignOpenMemberLinkCSV = (data) => {
    return axiosInterceptors().post(analyticsUrl + '/getEmailCampaignOpenMemberLinkCSV', data).then(res => res)
}

export const grabAnalyticsCsvData = (campaignId) => {
    return axiosInterceptors().post(analyticsUrl + '/grabAnalyticsCsvData?campaignId='+campaignId).then(res => res)
}

export const getAllAnalyticsWebsites = () => {
    return axiosInterceptors().get(analyticsTrackingUrl + '/getAllAnalyticsWebsites').then(res => res)
}

export const saveAnalyticsWebsite = (data) => {
    return axiosInterceptors().post(analyticsTrackingUrl + '/saveAnalyticsWebsite', data).then(res => res)
}
export const deleteAnalyticsWebsite = (id) => {
    return axiosInterceptors().delete(analyticsTrackingUrl + '/deleteAnalyticsWebsite?id=' + id).then(res => res)
}