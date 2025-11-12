import * as types from "../config/actionTypes";

/**
 *
 * @param {username, password} creds
 */
export const loginUserAction = (creds) => {
  return {
    type: types.LOGIN_USER,
    creds,
  };
};
export const verifiedOtpAction = (data) => {
  return {
    type: types.VERIFIED_OTP_ACTION,
    data,
  };
};
/**
 *
 * @param {firstname, lastname, email, password} data
 */
export const registerUserAction = (data) => {
  return {
    type: types.REGISTER_USER,
    data,
  };
};

/**
 *
 * @param {secQus1, secAns1, secQus2, secAns2, secQus3, secAns3} data
 */
export const registerStep2UserAction = (data) => {
  return {
    type: types.REGISTER_STEP_2_USER,
    data,
  };
};
export const resendActivateEmailUserAction = (data) => {
  return {
    type: types.RESEND_ACTIVATE_EMAIL,
    data,
  };
};
export const getprocessActivation = (id, d) => {
  return {
    type: types.PROCESS_ACTIVATION,
    id,
    d
  };
};
export const setInformationAction = (data) => {
  return {
    type: types.SET_INFORMATION,
    data,
  };
};
export const setAddressDetailAction = (data) => {
  return {
    type: types.SET_ADDRESS_DETAIL_ACTION,
    data,
  };
};
export const setBusinessInfoAction = (data) => {
  return {
    type: types.SET_BUSINESS_DETAIL_ACTION,
    data,
  };
};
export const setCellInfoAction = (data) => {
  return {
    type: types.SET_CELL_INFO_ACTION,
    data,
  };
};
export const setCompleteActivationAction = (data) => {
  return {
    type: types.SET_COMPLETE_ACTIVATION_ACTION,
    data,
  };
};
export const forgotPassword = (data) => {
  return {
    type: types.FORGOT_PASSWORD,
    data,
  };
};
export const forgotPasswordStep2 = (data) => {
  return {
    type: types.FORGOT_PASSWORD_STEP_2,
    data,
  };
};
export const forgotPasswordData = (data) => {
  return {
    type: types.FORGOT_PASSWORD_DATA,
    data,
  };
};
export const resetPassword = (data) => {
  return {
    type: types.RESET_PASSWORD,
    data,
  };
};
export const saveSubUsers = (data) => {
  return {
    type: types.SAVE_SUB_USERS,
    data,
  };
};
export const saveSubUserType = (data) => {
  return {
    type: types.SAVE_SUB_USER_TYPE,
    data,
  };
};
/**
 *
 * @param {username, token} user
 */
export const userLoggedIn = (user) => {
  return {
    type: types.USER_LOGGEDIN,
    user,
  };
};

/**
 *
 * @param {username} username
 */
export const changePassword = (data) => {
  return {
    type: types.CHANGE_PASSWORD,
    data,
  };
};
export const updateprofile = (data) => {
  return {
    type: types.UPDATE_MEMBER_INFO,
    data,
  };
};
export const getCardDetails = () => {
  return {
    type: types.GET_CREDIT_CARD_DETAILS
  };
};
export const loadCreditCardDetails = (data) => {
  return {
    type: types.LOAD_CREDIT_CARD_DETAILS,
    data,
  };
};
export const saveCreditCardDetails = (data) => {
  return {
    type: types.SAVE_CREDIT_CARD_DETAILS,
    data,
  };
};
export const updateCardDetails = (data) => {
  return {
    type: types.UPDATE_CARD_DETAILS,
    data,
  };
};
export const removeCardDetails = () => {
    return {
      type: types.REMOVE_CARD_DETAILS
    };
  };

export const updateSecurity = (data) => {
  return {
    type: types.SET_SECURITY,
    data,
  };
};
export const updateCommunicationPref = (data) => {
  return {
    type: types.SET_COMMUNICATION_PREFERENCES,
    data,
  };
};
export const logoutUserAction = () => {
  return {
    type: types.LOGOUT_USER,
  };
};

export const userLoggedOutAction = () => {
  return {
    type: types.USER_LOGGEDOUT,
  };
};
