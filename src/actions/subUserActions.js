import * as types from '../config/actionTypes';

export const setSubUserAction = data => {
    return {
        type: types.SET_SUB_USER,
        data
    }
}

export const resetSubUserAction = () => {
    return {
        type: types.RESET_SUB_USER
    }
}