import {RESET_PENDING_TRANSACTION, SET_PENDING_TRANSACTION} from "../config/actionTypes";

const initialState = [];

export const pendingTransactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PENDING_TRANSACTION:
            return action.data;
        case RESET_PENDING_TRANSACTION:
            return initialState;
        default:
            return state;
    }
};