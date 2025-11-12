import {
  USER_LOGGEDIN,
  USER_LOGGEDOUT,
  REGISTER_USER,
  CHANGE_PASSWORD,
  SET_SECURITY,
  SET_COMMUNICATION_PREFERENCES,
  UPDATE_MEMBER_INFO,
  FORGOT_PASSWORD_DATA
} from "../config/actionTypes";

const initialState = null;

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGGEDIN:
      return action.user;

    case USER_LOGGEDOUT:
      return initialState;

    case CHANGE_PASSWORD:
      return action.data;

    case UPDATE_MEMBER_INFO:
      return action.data;

    case SET_SECURITY:
      return action.data;

    case SET_COMMUNICATION_PREFERENCES:
      return action.data;

    case REGISTER_USER:
      return action.data;

    case FORGOT_PASSWORD_DATA:
      return action.data;

    default:
      return state;
  }
};
