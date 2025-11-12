import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {dropboxUrl, easDriveUrl, googleDriveUrl, mypagesUrl, onedriveUrl, proxyBaseURL, smsTemplateUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getMyPagesTags = (filter) =>{
    return axiosInterceptors().get(mypagesUrl+'/getMyPagesTags/'+easUrlEncoder(filter)).then(res => res)
}
export const getMyPagesList = (filter) =>{
    return axiosInterceptors().get(mypagesUrl+'/getMyPagesList/'+easUrlEncoder(filter)).then(res => res)
}
export const saveForLater = (data) =>{
    return axiosInterceptors().post(mypagesUrl+'/saveForLater',data).then(res => res)
}
export const autoSave = (data) =>{
    return axiosInterceptors().post(mypagesUrl+'/autoSave',data).then(res => res)
}
export const publish = (data) =>{
    return axiosInterceptors().post(mypagesUrl+'/publish',data).then(res => res)
}
export const getGroupLanguageList = (data) =>{
    return axiosInterceptors().post(mypagesUrl+'/getGroupLanguageList',data).then(res => res)
}
export const authenticateGD = () =>{
    return axiosInterceptors().get(googleDriveUrl+'/authenticate').then(res => res)
}
export const oauthGD = (data) =>{
    return axiosInterceptors().get(googleDriveUrl+'/oauth'+data).then(res => res)
}
export const getImagesGD = (data) =>{
    return axiosInterceptors().get(googleDriveUrl+'/getImages/'+easUrlEncoder(data)).then(res => res)
}
export const getFoldersGD = (folder) =>{
    return axiosInterceptors().get(googleDriveUrl+'/getFolders/'+easUrlEncoder(folder)).then(res => res)
}
export const getSearchImagesGD = (folder,searchString,fileType) =>{
    return axiosInterceptors().get(googleDriveUrl+easUrlEncoder(`/getSearchImages/${folder}/${searchString}?fileType=`+fileType)).then(res => res)
}
export const downloadFileGD = (folder) =>{
    return axiosInterceptors().get(googleDriveUrl+'/downloadFile/'+easUrlEncoder(folder)).then(res => res)
}
export const getFoldersED = () =>{
    return axiosInterceptors().get(easDriveUrl+'/getFolders').then(res => res)
}
export const createFolderED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/createFolder',data).then(res => res)
}
export const deleteFoldersAndFilesED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/deleteFoldersAndFiles',data).then(res => res)
}
export const getImagesED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/getImages',data).then(res => res)
}
export const cutFoldersAndFilesED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/cutFoldersAndFiles',data).then(res => res)
}
export const copyFoldersAndFilesED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/copyFoldersAndFiles',data).then(res => res)
}
export const importImageFromUrlED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/importImageFromUrl',data).then(res => res)
}
export const importVideoImageFromUrlED = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/importVideoImageFromUrl',data).then(res => res)
}
export const editImage = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/editImage',data).then(res => res)
}
export const uploadFileED = (foldername,data) =>{
    return axiosInterceptors().post(proxyBaseURL+'/easDrive/uploadFile?destination='+foldername,data).then(res => res)
}
export const importImageFromAiUrl = (data) =>{
    return axiosInterceptors().post(easDriveUrl+'/importImageFromAiUrl',data).then(res => res)
}
export const aiTransactions = (type) =>{
    return axiosInterceptors().post(easDriveUrl+'/aiTransactions?aiTransactionType='+type).then(res => res)
}
export const authenticateDB = () =>{
    return axiosInterceptors().get(dropboxUrl+'/authenticate').then(res => res)
}
export const oauthDB = (data) =>{
    return axiosInterceptors().get(dropboxUrl+'/oauth'+data).then(res => res)
}
export const getImagesDB = (data) =>{
    return axiosInterceptors().get(dropboxUrl+'/getImages/'+easUrlEncoder(data)).then(res => res)
}
export const getFoldersDB = () =>{
    return axiosInterceptors().get(dropboxUrl+'/getFolders').then(res => res)
}
export const getSearchImagesDB = (folder,searchString,fileType) =>{
    return axiosInterceptors().get(dropboxUrl+'/search?path='+easUrlEncoder(folder)+'&searchStr='+easUrlEncoder(searchString)+'&fileType='+easUrlEncoder(fileType)).then(res => res)
}
export const downloadFileDB = (folder,fileName) =>{
    return axiosInterceptors().get(dropboxUrl+'/download?path='+easUrlEncoder(folder)+'&fn='+easUrlEncoder(fileName)).then(res => res)
}
export const authenticateOD = () =>{
    return axiosInterceptors().get(onedriveUrl+'/authenticate').then(res => res)
}
export const oauthOD = (data) =>{
    return axiosInterceptors().get(onedriveUrl+'/oAuth'+data).then(res => res)
}
export const getFoldersOD = () =>{
    return axiosInterceptors().get(onedriveUrl+'/getFolders').then(res => res)
}
export const getImagesOD = (folder) =>{
    return axiosInterceptors().get(onedriveUrl+'/getImages'+easUrlEncoder(folder)).then(res => res)
}
export const getSearchImagesOD = (searchString,fileType) =>{
    return axiosInterceptors().get(onedriveUrl+'/search?searchStr='+easUrlEncoder(searchString)+'&fileType='+fileType).then(res => res)
}
export const downloadFileOD = (folder,fileName) =>{
    return axiosInterceptors().get(onedriveUrl+'/download?path='+easUrlEncoder(folder)+'&fn='+easUrlEncoder(fileName)).then(res => res)
}
export const deleteMyPage = (id) => {
    return axiosInterceptors().delete(mypagesUrl + `/deleteMyPage/${easUrlEncoder(id)}`).then(res => res)
}
export const cloneMyPage = (data) => {
    return axiosInterceptors().get(mypagesUrl + `/getMyPageClone/${easUrlEncoder(data.subUserId)}/${easUrlEncoder(data.id)}`).then(res => res)
}
export const getMyPageById = (id) => {
    return axiosInterceptors().get(mypagesUrl + `/getMyPageById/${easUrlEncoder(id)}`).then(res => res)
}
export const getFreeTemplatesTags = () => {
    return axiosInterceptors().get(mypagesUrl + "/getFreeTemplateTags").then(res => res)
}
export const getFreeTemplateList = () => {
    return axiosInterceptors().get(mypagesUrl + "/getFreeTemplateList").then(res => res)
}
export const sendMyPageEmailPreview = (data) => {
    return axiosInterceptors().post(mypagesUrl + "/sendMyPageEmailPreview", data).then(res => res)
}
export const getMyPagesPreview = (id, lan) => {
    return axiosInterceptors().get(mypagesUrl + easUrlEncoder(`/getPreview?id=${id}&lang=${lan}`)).then(res => res)
}
export const getPreviewFreeTemplate = (data) => {
    return axiosInterceptors().get(mypagesUrl + `/getPreviewFreeTemplate/${easUrlEncoder(data)}`).then(res => res)
}
export const saveSmsTemplate = (data) => {
    return axiosInterceptors().post(smsTemplateUrl + '/saveSmsTemplate', data).then(res => res)
}
export const getSmsTemplate = (id) => {
    return axiosInterceptors().get(smsTemplateUrl + `/getSmsTemplate/${easUrlEncoder(id)}`).then(res => res)
}
export const getSmsTemplateList = () => {
    return axiosInterceptors().get(smsTemplateUrl + '/getSmsTemplateList').then(res => res)
}
export const deleteSmsTemplate = (id) => {
    return axiosInterceptors().delete(smsTemplateUrl + `/deleteSmsTemplate/${easUrlEncoder(id)}`).then(res => res)
}