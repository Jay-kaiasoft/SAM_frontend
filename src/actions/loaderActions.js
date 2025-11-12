import * as types from '../config/actionTypes'

export const setLoader = payload => {
    return {
        type: types.SET_LOADER,
        payload
    }
}
