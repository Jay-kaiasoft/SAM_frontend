import {SET_COUNTRY_SETTING, RESET_COUNTRY_SETTING} from "../config/actionTypes";

const initialState = [];

export const countrySettingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COUNTRY_SETTING:
            return action.data;
        case RESET_COUNTRY_SETTING:
            return initialState;
        default:
            return state;
    }
};