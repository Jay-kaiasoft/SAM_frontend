import * as types from '../config/actionTypes'

export const setResetQuestionYesAction = data => {
    return {
        type: types.RESET_QUESTION_YES,
        data
    }
}

export const setResetQuestionNoAction = data => {
    return {
        type: types.RESET_QUESTION_NO,
        data
    }
}