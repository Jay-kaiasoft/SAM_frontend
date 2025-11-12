import { takeEvery, call, put, all } from "redux-saga/effects";
import * as types from "../config/actionTypes";
import * as clientContactService from "../services/clientContactService";
import * as actions from "../actions/createSegmentActions";
import * as globalAlert from "../actions/globalAlertActions";
import { pathOr } from "ramda";

function* fetchGroupUdfList(payload) {
    try {
        const data = yield call(clientContactService.fetchGroupUdfList, payload.id);
        if (data.status === 200) {
            const udfList = pathOr([], ["result"], data)
            yield put(actions.setGroupUdfList(udfList));
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

function* getSegmentDetails(payload) {
    try {
        const data = yield call(clientContactService.getSegment, payload.segId);
        if (data.status === 200) {
            const segmentData = pathOr([], ["result"], data)
            yield put(actions.setSegmentDetails(segmentData));
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

function* watchFetchGroupUdfList() {
    yield takeEvery(types.FETCH_GROUP_UDF_LIST, fetchGroupUdfList)
}

function* watchGetSegmentDetails() {
    yield takeEvery(types.GET_SEGMENT_DETAILS, getSegmentDetails)
}

export function* segmentSaga() {
    yield all([
        watchFetchGroupUdfList(),
        watchGetSegmentDetails()
    ]);
}