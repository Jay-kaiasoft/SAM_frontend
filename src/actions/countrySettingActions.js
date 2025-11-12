import * as types from '../config/actionTypes';

export const setCountrySettingAction = data => {
    return {
        type: types.SET_COUNTRY_SETTING,
        data
    }
}

export const resetCountrySettingAction = () => {
    return {
        type: types.RESET_COUNTRY_SETTING
    }
}