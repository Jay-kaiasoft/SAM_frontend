import { SET_LOADER } from '../config/actionTypes'

const initialState = {
    text: "",
    load: false
}

export const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADER:
            return action.payload
        default:
            return state
    }
}