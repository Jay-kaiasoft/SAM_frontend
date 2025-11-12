import {SET_MENU_LIST, RESET_MENU_LIST} from "../config/actionTypes";

const initialState = [];

export const menuListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MENU_LIST:
            return action.data;
        case RESET_MENU_LIST:
            return initialState;
        default:
            return state;
    }
};