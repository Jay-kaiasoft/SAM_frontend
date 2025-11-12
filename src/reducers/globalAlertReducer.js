import { SET_GLOBALALERT, RESET_GLOBALALERT } from '../config/actionTypes'

const initialState = {
    type: "",
    text: "",
    open: false
}

export const globalAlertReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GLOBALALERT:
            return action.data

        case RESET_GLOBALALERT:
            return initialState

        default:
            return state
    }
}