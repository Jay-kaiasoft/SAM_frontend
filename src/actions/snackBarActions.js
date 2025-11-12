import * as types from '../config/actionTypes'

/**
 * 
 * @param {type,text, open} msg 
 */
export const setSnackBarAction = msg => {
    return {
        type: types.SET_SNACKBAR,
        msg
    }
}

export const resetSnackBarAction = () => {
    return {
        type: types.RESET_SNACKBAR
    }
}