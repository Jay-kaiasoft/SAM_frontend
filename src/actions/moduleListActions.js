import * as types from '../config/actionTypes';

export const setModuleListAction = data => {
    return {
        type: types.SET_MODULE_LIST,
        data
    }
}

export const resetModuleListAction = () => {
    return {
        type: types.RESET_MODULE_LIST
    }
}