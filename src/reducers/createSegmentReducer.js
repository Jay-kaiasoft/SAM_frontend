import { SET_DUPLICATE_SEGMENT_POPUP, SET_EDIT_SEGMENT_POPUP, SET_GROUP_UDF_LIST, SET_SEGMENT_DETAILS, SET_SEGMENT_POPUP } from "../config/actionTypes"

const initialState = {
    openNewModal: false,
    groupId: "",
    udfList: [],
    openEditModal: false,
    segmentId: "",
    segmentDetails: {},
    openDuplicateModal: false
}
export const createSegmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEGMENT_POPUP:
            return {
                ...state,
                openNewModal: action.payload.status,
                groupId: action.payload.groupId ? action.payload.groupId : ""
            }
        case SET_GROUP_UDF_LIST:
            return {
                ...state,
                udfList: action.payload
            }
        case SET_EDIT_SEGMENT_POPUP:
            return {
                ...state,
                openEditModal: action.payload.status,
                segmentId: action.payload.segmentId ? action.payload.segmentId : ""
            }
        case SET_SEGMENT_DETAILS:
            return {
                ...state,
                segmentDetails: action.payload
            }
        case SET_DUPLICATE_SEGMENT_POPUP:
            return {
                ...state,
                openDuplicateModal: action.payload.status,
                segmentId: action.payload.segmentId ? action.payload.segmentId : ""
            }
        default:
            return state;
    }
}