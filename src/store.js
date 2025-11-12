import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers/rootReducer'
import rootSaga from './sagas/rootSaga'
import {checkCountrySetting, checkMenuList, checkModuleList, checkSubUser, checkUser} from './services/userService'
import { userLoggedIn } from './actions/userActions'
// import { createLogger } from 'redux-logger'
import {setSubUserAction} from "./actions/subUserActions";
import {setMenuListAction} from "./actions/menuListActions";
import {setModuleListAction} from "./actions/moduleListActions";
import {setCountrySettingAction} from "./actions/countrySettingActions";

// const logger = createLogger({
//     // ...options
//   });

const saga = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(saga))
// const store = createStore(rootReducer, applyMiddleware(saga,logger))

const user = checkUser()
const subUser = checkSubUser()
const menuList = checkMenuList()
const moduleList = checkModuleList()
const countrySetting = checkCountrySetting()
if (user) {
    store.dispatch(userLoggedIn(user))
    store.dispatch(setSubUserAction(subUser))
    store.dispatch(setMenuListAction(menuList))
    store.dispatch(setModuleListAction(moduleList))
    store.dispatch(setCountrySettingAction(countrySetting))
}

saga.run(rootSaga)
export default store