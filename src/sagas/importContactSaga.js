import { takeEvery, call, put, all } from "redux-saga/effects";
import * as types from "../config/actionTypes";
import * as clientContactService from "../services/clientContactService";
import * as actions from "../actions/importContactActions";
import * as globalAlert from "../actions/globalAlertActions";
import { pathOr } from "ramda";

function* fetchGroup() {
    try {
        const data = yield call(clientContactService.getGroupListWithCheckDuplicate);
        if (data.status === 200) {
            const groups = pathOr([], ["result", "group"], data)
            yield put(actions.setGroups(groups));
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: data.message,
                    open: true,
                })
            );
        }
    } catch (e) {
        yield put(
            globalAlert.setGlobalAlertAction({
                type: "Error",
                text: e.msg,
                open: true,
            })
        );
    }
}

function* saveGroup({ payload }) {
    try {
        const data = yield call(clientContactService.saveGroup, payload);
        if (data.status === 200) {
            yield put(actions.fetchGroups());
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: data.message,
                    open: true,
                })
            );
        }
    } catch (e) {
        yield put(
            globalAlert.setGlobalAlertAction({
                type: "Error",
                text: e.msg,
                open: true,
            })
        );
    }
}

function* importContact({ payload }) {
    try {
        const data = yield call(clientContactService.importContact, payload);
        if (data.status === 200) {
            yield put(actions.setImportContactResult(data));
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: data.message,
                    open: true,
                })
            );
        }
    } catch (e) {
        yield put(
            globalAlert.setGlobalAlertAction({
                type: "Error",
                text: e.msg,
                open: true,
            })
        );
    }
}

function* fetchGroupInformation({ payload }) {
    try {
        const data = yield call(clientContactService.fetchGroupInformationFromServer, payload);
        if (data.status === 200) {
            yield put(actions.setGroupInformation(data));
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: data.message,
                    open: true,
                })
            );
        }
    } catch (e) {
        yield put(
            globalAlert.setGlobalAlertAction({
                type: "Error",
                text: e.msg,
                open: true,
            })
        );
    }
}

function* watchImportContact() {
    yield takeEvery(types.IMPORT_CONTACT, importContact)
}

function* watchFetchGroup() {
    yield takeEvery(types.FETCH_GROUPS, fetchGroup);
}

function* watchSaveGroup() {
    yield takeEvery(types.SAVE_GROUP, saveGroup);
}

function* watchFetchGroupInformation() {
    yield takeEvery(types.FETCH_GROUP_INFORMATION, fetchGroupInformation);
}

export function* importContactSaga() {
    yield all([
        watchFetchGroup(),
        watchSaveGroup(),
        watchImportContact(),
        watchFetchGroupInformation()
    ]);
}