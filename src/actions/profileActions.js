import * as types from '../config/actionTypes'

export const loadMemberInfoAction = () => {
    return {
        type: types.LOAD_MEMBER_INFO
    }
}
export const memberInformationUpdateAction = (data) => {
    return {
        type: types.UPDATE_MEMBER_INFO,
        data
    }
}
export const setManageApps = (data) => {
    return {
        type: types.SET_MANAGE_APPS,
        data
    }
}
export const emailVerification = (data) => {
    return {
        type: types.EMAIL_VERIFICATION,
        data
    }
}