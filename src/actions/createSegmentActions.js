import * as types from '../config/actionTypes'

export const setNewSegmentPopUp = (payload) => {
    return {
        type: types.SET_SEGMENT_POPUP,
        payload
    }
}

export const fetchGroupUdfList = (id) => {
    return {
        type: types.FETCH_GROUP_UDF_LIST,
        id
    }
}
export const setGroupUdfList = (payload) => {
    return {
        type: types.SET_GROUP_UDF_LIST,
        payload
    }
}

export const setEditSegmentPopUp = (payload) => {
    return {
        type: types.SET_EDIT_SEGMENT_POPUP,
        payload
    }
}

export const getSegmentDetails = (segId) => {
    return {
        type: types.GET_SEGMENT_DETAILS,
        segId
    }
}

export const setSegmentDetails = (payload) => {
    return {
        type: types.SET_SEGMENT_DETAILS,
        payload
    }
}

export const setDuplicateSegmentPopUp = (payload) => {
    return {
        type: types.SET_DUPLICATE_SEGMENT_POPUP,
        payload
    }
}