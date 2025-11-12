import * as types from '../config/actionTypes';

export const setMenuListAction = data => {
    return {
        type: types.SET_MENU_LIST,
        data
    }
}

export const resetMenuListAction = () => {
    return {
        type: types.RESET_MENU_LIST
    }
}