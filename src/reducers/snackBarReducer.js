import { SET_SNACKBAR, RESET_SNACKBAR } from '../config/actionTypes';

const initialState = {
    type: 'info',
    text: '',
    open: false,
    onClick: ()=>{}
}

export const snackBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SNACKBAR:
            return action.msg

        case RESET_SNACKBAR:
            return initialState

        default:
            return state
    }
}