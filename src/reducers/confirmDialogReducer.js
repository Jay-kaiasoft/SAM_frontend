import {SET_CONFIRM_DIALOG, RESET_CONFIRM_DIALOG} from '../config/actionTypes'

const initialState = {
    title: "",
    subTitle:"",
    open: false,
    onConfirm:""
}

export const confirmDialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CONFIRM_DIALOG:
            return action.data

        case RESET_CONFIRM_DIALOG:
            return initialState

        default:
            return state
    }
}