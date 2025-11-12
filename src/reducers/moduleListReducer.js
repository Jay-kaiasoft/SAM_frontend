import {SET_MODULE_LIST, RESET_MODULE_LIST} from "../config/actionTypes";

const initialState = [];

export const moduleListsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MODULE_LIST:
            return action.data;
        case RESET_MODULE_LIST:
            return initialState;
        default:
            return state;
    }
};