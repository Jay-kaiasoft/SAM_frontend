import { RESET_QUESTION_YES, RESET_QUESTION_NO } from '../config/actionTypes'

const initialState = {
    reset: 'No'
}

export const resetQuestionReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_QUESTION_YES:
            return {
                ...state,
                reset: action.data.reset || 'No'
            }

        case RESET_QUESTION_NO:
            return {
                ...state,
                reset: action.data.reset || 'No'
            }

        default:
            return state;
    }
}
