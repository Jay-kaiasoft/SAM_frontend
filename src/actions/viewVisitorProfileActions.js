import * as types from '../config/actionTypes'

export const setViewVisitorProfileAction = data => {
    return {
        type: types.SET_VIEW_VISITOR,
        data
    }
}

export const resetViewVisitorProfileAction = () => {
    return {
        type: types.RESET_VIEW_VISITOR
    }
}