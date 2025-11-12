import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {facebookUrl, linkedinUrl, proxyBaseURL, socialMediaCampaignReportUrl, socialMediaCampaignUrl, twitterUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const facebookOauth = (data) =>{
    return axiosInterceptors().get(facebookUrl+'/facebookOauth'+data).then(res => res)
}
export const getFacebookUserData = () =>{
    return axiosInterceptors().get(facebookUrl+'/getFacebookUserData').then(res => res)
}
export const facebookLogout = () =>{
    return axiosInterceptors().get(facebookUrl+'/facebookLogout').then(res => res)
}
export const twitterOauth = (data) =>{
    return axiosInterceptors().get(twitterUrl+'/twitterOauth'+data).then(res => res)
}
export const getTwitterUserData = () =>{
    return axiosInterceptors().get(twitterUrl+'/getTwitterUserData').then(res => res)
}
export const twitterLogout = () =>{
    return axiosInterceptors().get(twitterUrl+'/twitterLogout').then(res => res)
}
export const linkedInOauth = (data) =>{
    return axiosInterceptors().get(linkedinUrl+'/linkedInOauth'+data).then(res => res)
}
export const linkedinUserData = () =>{
    return axiosInterceptors().get(linkedinUrl+'/linkedinUserData').then(res => res)
}
export const linkedinPagesData = () =>{
    return axiosInterceptors().get(linkedinUrl+'/linkedinPagesData').then(res => res)
}
export const linkedinLogout = () =>{
    return axiosInterceptors().get(linkedinUrl+'/linkedinLogout').then(res => res)
}
export const getSocialMediaCampaignList = (data) =>{
    return axiosInterceptors().get(socialMediaCampaignUrl+'/getSocialMediaCampaignList?'+easUrlEncoder(data)).then(res => res)
}
export const editSocialMediaPostSchedule = (data) =>{
    return axiosInterceptors().put(socialMediaCampaignUrl+'/editSocialMediaPostSchedule',data).then(res => res)
}
export const deleteSocialMediaPost = (data) =>{
    return axiosInterceptors().delete(socialMediaCampaignUrl+'/deleteSocialMediaPost',{data:data}).then(res => res)
}
export const getSocialMediaAuthentication = () =>{
    return axiosInterceptors().get(socialMediaCampaignUrl+'/getSocialMediaAuthentication').then(res => res)
}
export const uploadImage = (data) =>{
    return axiosInterceptors().post(proxyBaseURL+'/socialMediaCampaign/uploadImage',data).then(res => res)
}
export const uploadVideo = (data) =>{
    return axiosInterceptors().post(proxyBaseURL+'/socialMediaCampaign/uploadVideo',data).then(res => res)
}
export const removeImage = (id,fileName) =>{
    return axiosInterceptors().delete(socialMediaCampaignUrl+'/removeImage/'+easUrlEncoder(id)+'/'+easUrlEncoder(fileName)).then(res => res)
}
export const getLinkPreview = (url) =>{
    return axiosInterceptors().get(socialMediaCampaignUrl+'/getLinkPreview?url='+easUrlEncoder(url)).then(res => res)
}
export const saveAsDraft = (data) =>{
    return axiosInterceptors().post(socialMediaCampaignUrl+'/saveAsDraft',data).then(res => res)
}
export const saveSchedule = (data) =>{
    return axiosInterceptors().post(socialMediaCampaignUrl+'/saveSchedule',data).then(res => res)
}
export const postNow = (data) =>{
    return axiosInterceptors().post(socialMediaCampaignUrl+'/postNow',data).then(res => res)
}
export const getSocialMediaCampaign = (data) =>{
    return axiosInterceptors().get(socialMediaCampaignUrl+'/getSocialMediaCampaign?'+easUrlEncoder(data)).then(res => res)
}
export const getSocialMediaCampaignReportListPage = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getSocialMediaCampaignReportListPage?' + easUrlEncoder(data)).then(res => res)
}
export const getReportFacebookPageDetails = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportFacebookPageDetails?' + easUrlEncoder(data)).then(res => res)
}
export const reportFacebookPostDetails = (data) => {
    return axiosInterceptors().post(socialMediaCampaignReportUrl + '/reportFacebookPostDetails', data).then(res => res)
}
export const reportFacebookPostReactions = (data) => {
    return axiosInterceptors().post(socialMediaCampaignReportUrl + '/reportFacebookPostReactions', data).then(res => res)
}
export const reportFacebookPostComments = (data) => {
    return axiosInterceptors().post(socialMediaCampaignReportUrl + '/reportFacebookPostComments', data).then(res => res)
}
export const getReportTwitterTweetsDetails = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportTwitterTweetsDetails?' + easUrlEncoder(data)).then(res => res)
}
export const getReportLinkedinWallDetails = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportLinkedinWallDetails?' + easUrlEncoder(data)).then(res => res)
}
export const getReportLinkedinPageList = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportLinkedinPageList?' + easUrlEncoder(data)).then(res => res)
}
export const getReportLinkedinPageDetails = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportLinkedinPageDetails?' + easUrlEncoder(data)).then(res => res)
}
export const getReportLinkedinReactionReport = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportLinkedinReactionReport?' + easUrlEncoder(data)).then(res => res)
}
export const getReportLinkedinCommentsReport = (data) => {
    return axiosInterceptors().get(socialMediaCampaignReportUrl + '/getReportLinkedinCommentsReport?' + easUrlEncoder(data)).then(res => res)
}