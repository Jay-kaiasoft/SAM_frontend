import * as types from '../config/actionTypes';

export const setPendingTransactionAction = data => {
    return {
        type: types.SET_PENDING_TRANSACTION,
        data
    }
}

export const resetPendingTransactionAction = () => {
    return {
        type: types.RESET_PENDING_TRANSACTION
    }
}