import * as types from '../config/actionTypes'

export const setConfirmDialogAction = data => {
    return {
        type: types.SET_CONFIRM_DIALOG,
        data
    }
}

export const resetConfirmDialogAction = () => {
    return {
        type: types.RESET_CONFIRM_DIALOG
    }
}