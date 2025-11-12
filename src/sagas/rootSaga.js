import { all } from 'redux-saga/effects'
import { userSaga } from './userSaga'
import {profileSaga} from "./profileSaga";
import { importContactSaga } from './importContactSaga'
import { segmentSaga } from './segmentSaga';

function* rootSaga() {
    yield all([
        userSaga(),
        profileSaga(),
        importContactSaga(),
        segmentSaga()
    ])
}

export default rootSaga