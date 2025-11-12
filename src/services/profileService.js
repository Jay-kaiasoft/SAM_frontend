import {profileURL, baseURL, subUser, domainUrl, domainEmailUrl, contactUsUrl, billingUrl, brandKitUrl, signatureUrl, supportapiUrl, affiliateProgramUrl} from '../config/api'
import axiosInterceptors from '../axiosInterceptor/axiosInterceptors.js'
import {easUrlEncoder} from "../assets/commonFunctions";
export const getMemberprofileById = () =>{
    return axiosInterceptors().get(profileURL+'/getMemberById').then(res => res.result)
}
export const updateMemberInfo = data =>{
    return axiosInterceptors().post(profileURL+'/updateMemberinfo',data).then(res => res.result)
}
export const getUserType = () =>{
    return axiosInterceptors().get(subUser+'/getUserType').then(res => res)
}
export const getSubUsersList = () =>{
    return axiosInterceptors().get(subUser+'/getAllUser').then(res => res)
}
export const deleteSubUser = (id) =>{
      return axiosInterceptors().delete(subUser+'/deleteSubUser/'+easUrlEncoder(id)).then(res => res)
}
export const getsecurityquestionstab = () =>{
    return axiosInterceptors().get(profileURL+'/securityquestionstab').then(res => res)
}
export const getcommunicationpreferencestab = () =>{
    return axiosInterceptors().get(profileURL+'/communicationpreferencestab').then(res => res)
}
export const updateSmsConversationYn = yn=>{
    return axiosInterceptors().get(profileURL+'/updateSmsConversationYn?yn='+easUrlEncoder(yn)).then(res => res)
}
export const updateSmsCvrMyphoneYn = yn=>{
    return axiosInterceptors().get(profileURL+'/updateSmsCvrMyphoneYn?yn='+easUrlEncoder(yn)).then(res => res)
}
export const get10DLCStatus = () =>{
    return axiosInterceptors().get(profileURL+'/get10DLCStatus').then(res => res)
}
export const set10DLCStatus = data =>{
    return axiosInterceptors().post(profileURL+'/set10DLCStatus',data).then(res => res)
}
export const grabWebsiteLinks = data =>{
    return axiosInterceptors().post(profileURL+'/grabWebsiteLinks',data).then(res => res)
}
export const grabWebsiteImages = data =>{
    return axiosInterceptors().post(profileURL+'/grabWebsiteImages',data).then(res => res)
}
export const grabWebsiteColors = data =>{
    return axiosInterceptors().post(profileURL+'/grabWebsiteColors',data).then(res => res)
}
export const save10DLCData = data =>{
    return axiosInterceptors().post(profileURL+'/save10DLCData',data).then(res => res)
}
export const getAll10DLCData = () =>{
    return axiosInterceptors().get(profileURL+'/getAll10DLCData').then(res => res)
}
export const getCreditCardDetails = () =>{
    return axiosInterceptors().get(baseURL+'/paymentGateway/getPaymentProfile').then(res => res)
}
export const getSubAccountTypeDetails = (id) => {
    return axiosInterceptors().get(subUser+'/getSubUserTypeDetails/'+easUrlEncoder(id)).then(res =>res)
}
export const deleteSubUserType = (id) =>{
    return axiosInterceptors().delete(subUser+'/deleteSubUserType/'+easUrlEncoder(id)).then(res => res)
}
export const getDomainList = () =>{
    return axiosInterceptors().get(domainUrl+'/getDomainList').then(res => res)
}
export const deleteDomain = (dId) =>{
    return axiosInterceptors().delete(domainUrl+'/deleteDomain/'+easUrlEncoder(dId)).then(res => res)
}
export const saveDomain = data =>{
    return axiosInterceptors().post(domainUrl+'/saveDomain',data).then(res => res)
}
export const buyWarmupService = data =>{
    return axiosInterceptors().post(domainUrl+'/buyWarmupService',data).then(res => res)
}
export const domainChecker = (domain) =>{
    return axiosInterceptors().get(domainUrl+'/domainChecker?domainName='+easUrlEncoder(domain)).then(res => res)
}
export const getDNSProvider = (domain) =>{
    return axiosInterceptors().get(domainUrl+'/getDNSProvider?domainName='+easUrlEncoder(domain)).then(res => res)
}
export const checkDMARC = (domain) =>{
    return axiosInterceptors().get(domainUrl+'/checkDMARC?domainName='+easUrlEncoder(domain)).then(res => res)
}
export const getDomainEmailList = (flag) =>{
    return axiosInterceptors().get(domainEmailUrl+'/getDomainEmailList/'+flag).then(res => res)
}
export const deleteDomainEmail = (deId) =>{
    return axiosInterceptors().delete(domainEmailUrl+'/deleteDomainEmail/'+easUrlEncoder(deId)).then(res => res)
}
export const addVerifyDomainEmail = data =>{
    return axiosInterceptors().post(domainEmailUrl+'/addVerifyDomainEmail',data).then(res => res)
}
export const saveDomainEmail = data =>{
    return axiosInterceptors().post(domainEmailUrl+'/saveDomainEmail',data).then(res => res)
}
export const sendContactUs = data =>{
    return axiosInterceptors().post(contactUsUrl+'/sendContactUs',data).then(res => res)
}
export const getInvoiceList = () =>{
    return axiosInterceptors().get(billingUrl+'/getInvoiceList').then(res => res)
}
export const printInvoice = (data) =>{
    return axiosInterceptors().post(billingUrl+'/printInvoice',data).then(res => res)
}
export const getUninvoicedList = () =>{
    return axiosInterceptors().get(billingUrl+'/getUninvoicedList').then(res => res)
}
export const checkPassword = (data) =>{
    return axiosInterceptors().post(billingUrl+'/checkPassword',data).then(res => res)
}
export const deleteAccount = (data) =>{
    return axiosInterceptors().delete(billingUrl+'/deleteAccount',{ data: data }).then(res => res)
}
export const removeCreditCard = (data) =>{
    return axiosInterceptors().delete(billingUrl+'/removeCreditCard',{ data: data }).then(res => res)
}
export const saveBrandData = (data) =>{
    return axiosInterceptors().post(brandKitUrl+'/saveBrandData',data).then(res => res)
}
export const getBrandData = () =>{
    return axiosInterceptors().get(brandKitUrl+'/getBrandData').then(res => res)
}
export const deleteBrandData = (id) =>{
    return axiosInterceptors().delete(brandKitUrl+'/deleteBrandData/'+id).then(res => res)
}
export const getEmailSignatureList = () =>{
    return axiosInterceptors().get(signatureUrl+'/getEmailSignatureList').then(res => res)
}
export const saveEmailSignature = (data) =>{
    return axiosInterceptors().post(signatureUrl+'/saveEmailSignature',data).then(res => res)
}
export const deleteEmailSignature = (data) =>{
    return axiosInterceptors().delete(signatureUrl+'/deleteEmailSignature', { data: data }).then(res => res)
}
export const saveWhiteListingUrls = (data) =>{
    return axiosInterceptors().post(supportapiUrl+'/saveWhiteListingUrls',data).then(res => res)
}
export const getWhiteListingUrlsList = () =>{
    return axiosInterceptors().get(supportapiUrl+'/getWhiteListingUrlsList').then(res => res)
}
export const deleteWhiteListingUrls = (data) =>{
    return axiosInterceptors().delete(supportapiUrl+'/deleteWhiteListingUrls', { data: data }).then(res => res)
}
export const getSupportApiModuleList = () =>{
    return axiosInterceptors().get(supportapiUrl+'/getSupportApiModuleList').then(res => res)
}
export const getSupportApiSetting = () =>{
    return axiosInterceptors().get(supportapiUrl+'/getSupportApiSetting').then(res => res)
}
export const generateAuthKey = () =>{
    return axiosInterceptors().get(supportapiUrl+'/generateAuthKey').then(res => res)
}
export const saveAllowApiAccess = (data) =>{
    return axiosInterceptors().post(supportapiUrl+'/saveAllowApiAccess',data).then(res => res)
}
export const saveAllowApiTo = (data) =>{
    return axiosInterceptors().post(supportapiUrl+'/saveAllowApiTo',data).then(res => res)
}
export const getAffiliateProgramListPage = (data) =>{
    return axiosInterceptors().get(affiliateProgramUrl+'/getAffiliateProgramListPage?'+easUrlEncoder(data)).then(res => res)
}
export const getAffiliateProgramBillsListPage = (data) =>{
    return axiosInterceptors().get(affiliateProgramUrl+'/getAffiliateProgramBillsListPage?'+easUrlEncoder(data)).then(res => res)
}
export const setAgreeAffiliateProgram = () =>{
    return axiosInterceptors().get(affiliateProgramUrl+'/setAgreeAffiliateProgram').then(res => res)
}