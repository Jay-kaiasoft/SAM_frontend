import { pollingUrl } from "../config/api";
import axiosInterceptors from '../axiosInterceptor/axiosInterceptors.js';


export const grabImagesPolling = (wcgId) => {
    return axiosInterceptors().get(`${pollingUrl}/grabImages?wcgId=${wcgId}`).then(res => res);
}
export const grabColorsPolling = (wcgId) => {
    return axiosInterceptors().get(`${pollingUrl}/grabColors?wcgId=${wcgId}`).then(res => res);
}
export const grabLinksPolling = (wcgId) => {
    return axiosInterceptors().get(`${pollingUrl}/grabLinks?wcgId=${wcgId}`).then(res => res);
}
export const grabAnalyticsCsvPolling = (campaignId) => {
    return axiosInterceptors().post(`${pollingUrl}/grabAnalyticsCsv?campId=${campaignId}`).then(res => res);
}
