import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {calendarUrl, googleCalendarUrl, outlookCalendarUrl, calendarAppointmentEventTypeUrl, calendarAppointmentUrl} from "../config/api"
import {easUrlEncoder} from "../assets/commonFunctions";

export const getEventList = (range) => {
    return axiosInterceptors().get(calendarUrl + `/getEventList?start=${easUrlEncoder(range.start)}&end=${easUrlEncoder(range.end)}&timeZone=${easUrlEncoder(range.timeZone)}`).then(res => res)
}
export const saveEvent = (data) => {
    return axiosInterceptors().post(calendarUrl + '/saveEvent', data).then(res => res)
}
export const deleteEvent = (data) => {
    return axiosInterceptors().delete(calendarUrl + `/deleteEvent`, { data: data }).then(res => res)
}
export const getTimeZoneList = () => {
    return axiosInterceptors().get(calendarUrl + '/getTimeZoneList').then(res => res)
}
export const getCalendarAuthentication = () => {
    return axiosInterceptors().get(calendarUrl + '/getCalendarAuthentication').then(res => res)
}
export const getSync = (timeZone) => {
    return axiosInterceptors().get(calendarUrl + '/getSync?timeZone='+timeZone).then(res => res)
}
export const saveMemberTimeZone = (data) => {
    return axiosInterceptors().post(calendarUrl + '/saveMemberTimeZone', data).then(res => res)
}

export const saveWebConference = (data) => {
    return axiosInterceptors().post(calendarUrl + '/saveWebConference', data).then(res => res)
}

export const saveEmailNotification = (data) => {
    return axiosInterceptors().post(calendarUrl + '/saveEmailNotification', data).then(res => res)
}
export const saveSmsNotification = (data) => {
    return axiosInterceptors().post(calendarUrl + '/saveSmsNotification', data).then(res => res)
}
export const saveReminder = (data) => {
    return axiosInterceptors().post(calendarUrl + '/saveReminder', data).then(res => res)
}

export const googleCalendarOauth = (data) => {
    return axiosInterceptors().get(googleCalendarUrl + `/oauth${data}`).then(res => res)
}
export const googleCalendarRevoke = () => {
    return axiosInterceptors().get(googleCalendarUrl + '/revoke').then(res => res)
}
export const outlookCalendarOauth = (data) => {
    return axiosInterceptors().get(outlookCalendarUrl + `/oauth${data}`).then(res => res)
}
export const outlookCalendarRevoke = () => {
    return axiosInterceptors().get(outlookCalendarUrl + '/revoke').then(res => res)
}
export const saveEventType = (data) => {
    return axiosInterceptors().post(calendarAppointmentEventTypeUrl + '/saveEventType', data).then(res => res)
}
export const getEventTypeList = (data) => {
    return axiosInterceptors().get(calendarAppointmentEventTypeUrl + '/getEventTypeList?'+ easUrlEncoder(data)).then(res => res)
}
export const getEventTypeAllList = (id) => {
    return axiosInterceptors().get(calendarAppointmentEventTypeUrl + '/getEventTypeAllList/'+easUrlEncoder(id)).then(res => res)
}
export const deleteEventType = (data) => {
    return axiosInterceptors().delete(calendarAppointmentEventTypeUrl + '/deleteEventType', {data: data}).then(res => res)
}
export const getAvailabilitySlotsList = (memberId) => {
    return axiosInterceptors().get(calendarAppointmentUrl + `/getAvailabilitySlotsList/${easUrlEncoder(memberId)}`).then(res => res)
}
export const saveAvailabilitySlots = (data) => {
    return axiosInterceptors().post(calendarAppointmentUrl + `/saveAvailabilitySlots`, data).then(res => res)
}
export const freeSlotList = (data) => {
    return axiosInterceptors().post(calendarAppointmentUrl + '/freeSlotList', data).then(res => res)
}
export const saveAppointment = (data) => {
    return axiosInterceptors().post(calendarAppointmentUrl + '/saveAppointment', data).then(res => res)
}
export const sendSmsAppointmentLink = (data) => {
    return axiosInterceptors().post(calendarAppointmentUrl + '/sendSmsAppointmentLink', data).then(res => res)
}
export const sendEmailAppointmentLink = (data) => {
    return axiosInterceptors().post(calendarAppointmentUrl + '/sendEmailAppointmentLink', data).then(res => res)
}