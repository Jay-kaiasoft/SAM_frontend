import { SET_VIEW_VISITOR, RESET_VIEW_VISITOR } from '../config/actionTypes'

const initialState = {
    isSet: "No",
    groupId: "",
    userId: ""
}

export const viewVisitorProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_VIEW_VISITOR:
            return {
                ...state,
                ...action.data
            }

        case RESET_VIEW_VISITOR:
            return {
                ...initialState
            }

        default:
            return state;
    }
}