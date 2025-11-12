import * as types from '../config/actionTypes'

export const setGlobalAlertAction = data => {
    return {
        type: types.SET_GLOBALALERT,
        data
    }
}

export const resetGlobalAlertAction = () => {
    return {
        type: types.RESET_GLOBALALERT
    }
}