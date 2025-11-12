import { CRON_CHECK_DUPLICATE_YN, RESET_STORE, SET_FILE_PATH, SET_GROUPS, SET_GROUP_ID, SET_GROUP_INFORMATION, SET_HEADERS, SET_IMPORT_CONTACT_RESULT, SET_IMPORT_METHOD, SET_IMPORT_TYPE, SET_UDFS } from "../config/actionTypes";

const initialState = {
    importSource: null,
    group: [],
    filePath: "",
    importContactData: null,
    importContactSuccessfull: false,
    groupInformation: [],
    importWithoutHeader: false,
    headers: [],
    udfs: {},
    groupID: "",
    cronCheckDuplicateYN: "N"
};

export const importContactReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IMPORT_METHOD:
            return {
                ...state,
                importSource: action.payload
            }
        case SET_GROUPS:
            return {
                ...state,
                group: action.payload
            }
        case SET_FILE_PATH:
            return {
                ...state,
                filePath: action.payload
            }
        case SET_IMPORT_CONTACT_RESULT:
            return {
                ...state,
                importContactData: action.payload,
                importContactSuccessfull: true
            }
        case SET_GROUP_INFORMATION:
            return {
                ...state,
                groupInformation: action.payload
            }
        case SET_IMPORT_TYPE: {
            return {
                ...state,
                importWithoutHeader: action.payload
            }
        }
        case SET_HEADERS: {
            return {
                ...state,
                headers: action.payload
            }
        }
        case SET_UDFS: {
            return {
                ...state,
                udfs: action.payload
            }
        }
        case SET_GROUP_ID: {
            return {
                ...state,
                groupID: action.payload
            }
        }
        case CRON_CHECK_DUPLICATE_YN: {
            return {
                ...state,
                cronCheckDuplicateYN: action.payload
            }
        }
        case RESET_STORE:
            return initialState;
        default:
            return state;
    }
}