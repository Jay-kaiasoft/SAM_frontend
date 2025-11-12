import {takeEvery, call, put, all} from "redux-saga/effects";
import * as Profileservice from "../services/profileService";
import * as types from '../config/actionTypes'
import History from "../history";
import * as globalAlert from "../actions/globalAlertActions";

function* saveDomainEmail({data}) {
    try {
        const res = yield call(Profileservice.saveDomainEmail, data);
        if (res.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: res.message,
                    open: true,
                })
            );
            History.push("/emailverification");
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: res.message,
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

function* watchSaveDomainEmail() {
    yield takeEvery(types.EMAIL_VERIFICATION, saveDomainEmail)
}

export function* profileSaga() {
    yield all([
        watchSaveDomainEmail()
    ])
}