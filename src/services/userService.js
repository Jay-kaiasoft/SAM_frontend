import { authURL,baseURL,authenticatorUrl,planUrl,profileURL,subUser, staticUrl} from '../config/api'
import axiosInterceptors from '../axiosInterceptor/axiosInterceptors.js'
import {easUrlEncoder} from "../assets/commonFunctions";

/**
 * 
 * @param {username, password} creds 
 */

export const login = creds =>{
        return axiosInterceptors().post(authURL+'/token', creds).then(res => res)
}
export const verifiedOtp = data =>{
    return axiosInterceptors().post(authURL+'/verifiedOtp', data).then(res => res)
}
export const checkEmail = emailId =>{
    return axiosInterceptors().get(authURL+'/checkEmail/'+easUrlEncoder(emailId)).then(res => res)
}
export const registrationStep2 = data =>{
    return axiosInterceptors().post(authURL+'/registration', data).then(res => res)
}
export const resendActivationEmail = id =>{
    return axiosInterceptors().get(authURL+'/resendActivationEmail/'+easUrlEncoder(id)).then(res => res)
}
export const getprocessActivation = (id, d) =>{
    return axiosInterceptors().get(authURL+'/processActivation?v='+easUrlEncoder(id)+'&d='+d).then(res => res)
}
export const forgotPassword = data =>{
    return axiosInterceptors().post(authURL+'/forgotPassword', data).then(res => res)
}
export const forgotPasswordStep2 = data =>{
    return axiosInterceptors().post(authURL+'/forgotPasswordVerify', data).then(res => res)
}
export const resetPassword = (data) =>{
    return axiosInterceptors().post(authURL+'/resetPassword', data).then(res => res)
}

export const setInformation = data =>{
    return axiosInterceptors().post(authURL+'/onboarding/1', data).then(res => res)
}
export const setAddressDetails = data =>{
    return axiosInterceptors().post(authURL+'/onboarding/2', data).then(res => res)
}
export const setBusinessDetails = data =>{
    return axiosInterceptors().post(authURL+'/onboarding/3', data).then(res => res)
}
export const setCellInfoAction = data =>{
    return axiosInterceptors().post(authURL+'/onboarding/4', data).then(res => res)
}
export const setCompleteActivation = data =>{
    return axiosInterceptors().post(authURL+'/onboarding/5', data).then(res => res)
}
export const checkActiveSubaccount = id =>{
    return axiosInterceptors().get(authURL+'/checkActiveSubaccount?encMemberId='+easUrlEncoder(id)).then(res => res)
}
export const activeSubaccount = data =>{
    return axiosInterceptors().post(authURL+'/activeSubaccount', data).then(res => res)
}
export const sendOtpAuthenticationCode = id =>{
    return axiosInterceptors().get(authURL+'/sendOtpAuthenticationCode/'+easUrlEncoder(id)).then(res => res)
}
export const verifiedOtpCell = data =>{
    return axiosInterceptors().post(profileURL+'/verifiedOtpOnboarding', data).then(res => res)
}
export const saveSubUsers = data =>{
    return axiosInterceptors().post(subUser+'/saveUsers', data).then(res => res)
}

export const updateprofile = data =>{
    return axiosInterceptors().post(profileURL+'/updateMemberinfo', data).then(res => res)
}
export const saveCreditCardDetails = data =>{
    return axiosInterceptors().post(baseURL+'/paymentGateway/createPaymentProfile', data).then(res => res)
}
export const updateCreditCardDetails = data =>{
    return axiosInterceptors().post(baseURL+'/paymentGateway/updatePaymentProfile', data).then(res => res)
}
export const removeCreditCardDetails = () =>{
    return axiosInterceptors().delete(baseURL+'/paymentGateway/deletePaymentProfile').then(res => res)
}

export const getCreditCardDetails = () =>{
    return axiosInterceptors().get(baseURL+'/paymentGateway/getPaymentProfile').then(res => res)
}
export const updateSecurity = data =>{
    return axiosInterceptors().post(profileURL+'/updateSecurityQuestion', data).then(res => res)
}
export const updateCommunicationPref = data =>{
    return axiosInterceptors().post(profileURL+'/updateCommunicationPreferences', data).then(res => res)
}
export const changePassword = data =>{
    return axiosInterceptors().post(authURL+'/changepassword', data).then(res => res)
}

export const uploadProfileImage = (data) =>{
    return axiosInterceptors().post(profileURL+'/uploadFile', data).then(res => res)
}
export const saveSubUserType = data =>{
    return axiosInterceptors().post(subUser+'/saveSubUserType', data).then(res => res)
}
export const logout = () => {
    axiosInterceptors().get(authURL+'/logout').then(res =>{
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
        sessionStorage.clear();
        localStorage.clear();
        if(staticUrl !== ""){
            window.location.href=`${staticUrl}/index.html`;
        }
    })
}

export const checkUser = () => {
    return JSON.parse(sessionStorage.getItem('user'))
}
export const checkSubUser = () => {
    return JSON.parse(sessionStorage.getItem('subUser'))
}
export const checkMenuList = () => {
    return JSON.parse(sessionStorage.getItem('menuList'))
}
export const checkModuleList = () => {
    return JSON.parse(sessionStorage.getItem('moduleList'))
}
export const checkCountrySetting = () => {
    return JSON.parse(sessionStorage.getItem('countrySetting'))
}
export const getMemberDetails = (memberEncId) => {
    return axiosInterceptors().get(profileURL + '/getMemberDetails/'+easUrlEncoder(memberEncId)).then(res => res)
}
export const getSubUserPhoneList = () => {
    return axiosInterceptors().get(subUser + '/getSubUserPhoneList').then(res => res)
}
export const getPlanById = (data) => {
    return axiosInterceptors().get(planUrl + '/getPlanById?'+data).then(res => res)
}
export const getPlanListById = (countryId, planId) => {
    return axiosInterceptors().get(planUrl + '/getPlanListById?countryId='+countryId+'&planId='+planId).then(res => res)
}
export const updatePlan = (data) => {
    return axiosInterceptors().post(profileURL + '/updatePlan', data).then(res => res)
}
export const uploadWhiteListingLogo = (data) =>{
    return axiosInterceptors().post(profileURL+'/uploadWhiteListingLogo', data).then(res => res)
}
export const updateWhiteListingDetails = (data) =>{
    return axiosInterceptors().post(profileURL+'/updateWhiteListingDetails', data).then(res => res)
}
export const getWhiteListingDetails = () => {
    return axiosInterceptors().get(profileURL + '/getWhiteListingDetails').then(res => res)
}
export const checkSmsWhiteFlag = () => {
    return axiosInterceptors().get(profileURL + '/checkSmsWhiteFlag').then(res => res)
}
export const sendOtpOnboarding = data =>{
    return axiosInterceptors().post(authURL+'/sendOtpOnboarding', data).then(res => res)
}
export const saveDataTracker = data =>{
    return axiosInterceptors().post(authURL+'/saveDataTracker', data).then(res => res)
}
export const updateAuthenticator = data =>{
    return axiosInterceptors().post(authURL+'/updateAuthenticator', data).then(res => res)
}
export const checkLogin = data =>{
    return axiosInterceptors().post(authURL+'/checkLogin', data).then(res => res)
}
export const registrationAuthId = (id, d) =>{
    return axiosInterceptors().get(authURL+'/registrationAuthId?v='+easUrlEncoder(id)+'&d='+d).then(res => res)
}
export const checkUsername = (username, memberId) =>{
    return axiosInterceptors().get(authURL+'/checkUsername?username='+easUrlEncoder(username)+'&memberId='+easUrlEncoder(memberId)).then(res => res)
}
export const verifyEmail = data =>{
    return axiosInterceptors().post(authURL+'/verifyEmail', data).then(res => res)
}
export const registration = data =>{
    return axiosInterceptors().post(authURL+'/registration', data).then(res => res)
}
export const cancelRegistration = (data) =>{
    return axiosInterceptors().delete(authURL+'/cancelRegistration', {data:data}).then(res => res)
}
export const authenticatorGenerate = (username) =>{
    return axiosInterceptors().get(authenticatorUrl+'/generate?username='+easUrlEncoder(username)).then(res => res)
}
export const authenticatorVerify = data =>{
    return axiosInterceptors().post(authenticatorUrl+'/verify', data).then(res => res)
}
export const changePlan = data =>{
    return axiosInterceptors().post(authURL+'/changePlan', data).then(res => res)
}
export const checkRegistrationLink = (v) =>{
    return axiosInterceptors().get(authURL+'/checkRegistrationLink?v='+easUrlEncoder(v)).then(res => res)
}