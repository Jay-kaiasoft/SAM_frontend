import { combineReducers } from 'redux'
import { globalAlertReducer } from './globalAlertReducer'
import { userReducer } from './userReducer'
import { snackBarReducer } from './snackBarReducer'
import { cardDetailReducer } from './cardDetailReducer'
import {confirmDialogReducer} from "./confirmDialogReducer";
import { importContactReducer } from "./importContactReducer"
import { createSegmentReducer } from './createSegmentReducer'
import {pendingTransactionReducer} from "./pendingTransactionReducer";
import {subUserReducer} from "./subUserReducer";
import {menuListReducer} from "./menuListReducer";
import {moduleListsReducer} from "./moduleListReducer";
import {countrySettingReducer} from "./countrySettingReducer";
import {loaderReducer} from "./loaderReducer";
import { resetQuestionReducer } from './resetQuestionReducer';
import { viewVisitorProfileReducer } from './viewVisitorProfile'

export default combineReducers({
    globalAlert: globalAlertReducer,
    confirmDialog: confirmDialogReducer,
    user: userReducer,
    snackBar:snackBarReducer,
    cardDetail: cardDetailReducer,
    importContact: importContactReducer,
    createSegment: createSegmentReducer,
    pendingTransaction: pendingTransactionReducer,
    subUser:subUserReducer,
    menuLists:menuListReducer,
    moduleLists:moduleListsReducer,
    countrySetting:countrySettingReducer,
    loader: loaderReducer,
    resetQuestion: resetQuestionReducer,
    viewVisitorProfile: viewVisitorProfileReducer
})