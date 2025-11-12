import { baseURL } from '../config/api';
import axiosInterceptors from '../axiosInterceptor/axiosInterceptors.js';
import {easUrlEncoder} from "../assets/commonFunctions";

export const getSecurityQuestion = () =>{
    return axiosInterceptors().get(baseURL+'/securityQuestion').then(res => res)
}
export const getDisplayLanguage = () =>{
    return axiosInterceptors().get(baseURL+'/displayLanguage').then(res => res)
}
export const getLanguage = () =>{
    return axiosInterceptors().get(baseURL+'/language').then(res => res)
}
export const getCountry = () =>{
    return axiosInterceptors().get(baseURL+'/country').then(res => res)
}
export const getCountryToState = (countryId) => {
    return axiosInterceptors().get(baseURL+'/countryToState/'+easUrlEncoder(countryId)).then(res =>res)
}
export const countryToStateName = (countryName) => {
    return axiosInterceptors().get(baseURL+'/countryToStateName/'+easUrlEncoder(countryName)).then(res =>res)
}
export const getCountryName = (countryId) => {
    return axiosInterceptors().get(baseURL+'/getCountryName/'+easUrlEncoder(countryId)).then(res =>res)
}
export const getCountryId = (countryName) => {
    return axiosInterceptors().get(baseURL+'/getCountryId/'+easUrlEncoder(countryName)).then(res =>res)
}
export const checkAuthorized = () => {
    return axiosInterceptors().get(baseURL+'/checkAuthorized').then(res =>res)
}
export const validatePhoneFormat = (countryId, phoneNumber) => {
    return axiosInterceptors().get(baseURL+'/validatePhoneFormat/'+easUrlEncoder(countryId)+"/"+easUrlEncoder(phoneNumber)).then(res =>{return (res.status===200)});
}
export const unsubscribe = (data) => {
    return axiosInterceptors().post(baseURL+'/unsubscribe', data).then(res =>res)
}