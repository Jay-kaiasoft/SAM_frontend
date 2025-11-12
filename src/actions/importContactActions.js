import * as types from "../config/actionTypes"

export const setImportMethod = (payload) => {
    return {
        type: types.SET_IMPORT_METHOD,
        payload
    }
}

export const fetchGroups = () => {
    return {
        type: types.FETCH_GROUPS
    }
}
export const setGroups = (payload) => {
    return {
        type: types.SET_GROUPS,
        payload
    }
}

export const saveGroup = (payload) => {
    return {
        type: types.SAVE_GROUP,
        payload
    }
}

export const setFilePath = (payload) => {
    return {
        type: types.SET_FILE_PATH,
        payload
    }
}

export const importContact = (payload) => {
    return {
        type: types.IMPORT_CONTACT,
        payload
    }
}
export const setImportContactResult = (payload) => {
    return {
        type: types.SET_IMPORT_CONTACT_RESULT,
        payload
    }
}

export const fetchGroupInformation = (payload) => {
    return {
        type: types.FETCH_GROUP_INFORMATION,
        payload
    }
}

export const setGroupInformation = (payload) => {
    return {
        type: types.SET_GROUP_INFORMATION,
        payload
    }
}

export const setImportType = (payload) => {
    return {
        type: types.SET_IMPORT_TYPE,
        payload
    }
}

export const setHeaders = (payload) => {
    return {
        type: types.SET_HEADERS,
        payload
    }
}

export const setUDFs = (payload) => {
    return {
        type: types.SET_UDFS,
        payload
    }
}

export const setGroupID = (payload) => {
    return {
        type: types.SET_GROUP_ID,
        payload
    }
}

export const resetStore = () => {
    return {
        type: types.RESET_STORE
    }
}

export const setCronCheckDuplicateYN = (payload) => {
    return {
        type: types.CRON_CHECK_DUPLICATE_YN,
        payload
    }
}