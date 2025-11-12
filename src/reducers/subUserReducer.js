import {SET_SUB_USER, RESET_SUB_USER} from "../config/actionTypes";

const initialState = [];

export const subUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SUB_USER:
            return action.data;
        case RESET_SUB_USER:
            return initialState;
        default:
            return state;
    }
};