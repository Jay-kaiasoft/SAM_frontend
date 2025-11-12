import { dashboardUrl } from "../config/api";
import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getModuleList = () => {
    return axiosInterceptors().get(dashboardUrl + '/getModuleList').then(res => res)
}
export const getModuleDetails = (apiParams) => {
    return axiosInterceptors().get(dashboardUrl + `/getModuleDetails/${easUrlEncoder(apiParams)}`).then(res => res)
}
export const myCalendarAppointmentList = (count) => {
    return axiosInterceptors().get(dashboardUrl + `/myCalendarAppointmentList/${count}`).then(res => res)
}