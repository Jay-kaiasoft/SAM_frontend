import {takeEvery, call, put, all, select} from "redux-saga/effects";
import History from "../history";
import * as types from "../config/actionTypes";
import * as Userservice from "../services/userService";
import * as actions from "../actions/userActions";
import * as globalAlert from "../actions/globalAlertActions";
import {resetPendingTransactionAction} from "../actions/pendingTransactionActions";
import {resetSubUserAction, setSubUserAction} from "../actions/subUserActions";
import {resetMenuListAction, setMenuListAction} from "../actions/menuListActions";
import {resetModuleListAction, setModuleListAction} from "../actions/moduleListActions";
import {resetCountrySettingAction, setCountrySettingAction} from "../actions/countrySettingActions";
import {saveResendCampaign, saveSendCampaign} from "../services/emailCampaignService";
import {saveSendSmsCampaign} from "../services/smsCampaignService";
import {finalPublishAndConfirm} from "../services/smsPollingService";
import {saveSendSurvey} from "../services/surveyService";
import {saveSendAssessment} from "../services/assessmentService";
import {tokenName, websiteSmallTitleWithExt} from "../config/api";
import { getSync } from "../services/myCalendarServices";
import { getClientTimeZone, setBrandColorsToLocal } from './../assets/commonFunctions';
import { getCookie, setCookie } from "react-use-cookie";

function* login({creds}) {
    try {
        const user = yield call(Userservice.login, creds);
        if (user.status === 200) {
            setBrandColorsToLocal(user.result.member.brandKits);
            sessionStorage.setItem("user", JSON.stringify(user.result.member));
            sessionStorage.setItem("subUser", JSON.stringify(user.result.subMember));
            sessionStorage.setItem("menuList", JSON.stringify(user.result.menuList));
            sessionStorage.setItem("moduleList", JSON.stringify(user.result.moduleList));
            sessionStorage.setItem("countrySetting", JSON.stringify(user.result.countrySetting));
            sessionStorage.setItem("isLoggedInUser", "yes");
            yield put(actions.userLoggedIn(user.result.member));
            yield put(setSubUserAction(user.result.subMember));
            yield put(setMenuListAction(user.result.menuList));
            yield put(setModuleListAction(user.result.moduleList));
            yield put(setCountrySettingAction(user.result.countrySetting));
            if(localStorage.getItem("t") === "z") {
                History.push("/managesupportticket");
            } else {
                History.push("/dashboard");
            }
            let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
            yield call(getSync, tz);
            let time = new Date(new Date().getTime() + (60 * 60 * 24 * 1000 * 1));
            document.cookie = `${tokenName}=${user.result.token}; expires=${time}; path=${websiteSmallTitleWithExt}`;
        } else if (user.status === 304) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
            localStorage.setItem("id", user.result.id);
            localStorage.setItem("otp", user.result.otp);
            History.push("/otp");
        } else if (user.status === 401) {
            let msg = 'Your account is inactive.<br><br> Please click on button sent in email.<br><br> <a id="resendemail" class="cursor-pointer text-blue" data-item-id="'+user.result.id+'"><u>Click Here</u></a> to resend activation email.';
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: msg,
                    open: true,
                })
            );
        } else if (user.status === 406) {
            localStorage.setItem("encId", user.result.encMemberId);
            let msg = 'Your plan is no longer available in the system. Please choose another Plan.<br><br> <a id="choosePlan" class="cursor-pointer text-blue"><u>Choose Plan</u></a> to upgrade your plan.';
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: msg,
                    open: true,
                })
            );
        } else {
            if(typeof getCookie(tokenName) !== "undefined" && getCookie(tokenName) !== "" && getCookie(tokenName) !== null){
                setCookie(tokenName, "");
                document.cookie = `${tokenName}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
                window.location.reload();
            } else {
                yield put(
                    globalAlert.setGlobalAlertAction({
                        type: "Error",
                        text: user.message,
                        open: true,
                    })
                );
            }
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

function* verifiedOtp({data}) {
    try {
        const user = yield call(Userservice.verifiedOtp, data);
        if (user.status === 200) {
            setBrandColorsToLocal(user.result.member.brandKits);
            sessionStorage.setItem("user", JSON.stringify(user.result.member));
            sessionStorage.setItem("subUser", JSON.stringify(user.result.subMember));
            sessionStorage.setItem("menuList", JSON.stringify(user.result.menuList));
            sessionStorage.setItem("moduleList", JSON.stringify(user.result.moduleList));
            sessionStorage.setItem("countrySetting", JSON.stringify(user.result.countrySetting));
            sessionStorage.setItem("isLoggedInUser", "yes");
            yield put(actions.userLoggedIn(user.result.member));
            yield put(setSubUserAction(user.result.subMember));
            yield put(setMenuListAction(user.result.menuList));
            yield put(setModuleListAction(user.result.moduleList));
            yield put(setCountrySettingAction(user.result.countrySetting));
            History.push("/dashboard");
            let tz = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
            yield call(getSync, tz);
            let time = new Date(new Date().getTime() + (60 * 60 * 24 * 1000 * 1));
            document.cookie = `${tokenName}=${user.result.token}; expires=${time}; path=${websiteSmallTitleWithExt}`;
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* getCardDetails() {
    try {
        const creditcarddetails = yield call(Userservice.getCreditCardDetails);
        if (creditcarddetails.status === 200) {
            yield put(actions.loadCreditCardDetails(creditcarddetails.result.paymentProfile));
        } else {
            yield put(actions.loadCreditCardDetails(null));
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

function* registration() {
    yield (function() { return History.push("/registerstep2"); })();
}

function* registrationStep2({data}) {
    try {
        const user = yield call(Userservice.registrationStep2, data)
        if (user.status === 200) {
            localStorage.setItem("memberId", user.result.member.memberId);
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
            History.push("/thanksregister");
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* resendactivateemail({data}) {
    try {
        const user = yield call(Userservice.resendActivationEmail, data);
        if (user.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* getProcessActivation({id, d}) {
    try {
        const user = yield call(Userservice.getprocessActivation, id, d);
        if (user.status === 200) {
            if (user.result.callingPage === "login") {
                History.push("/login");
                yield put(
                    globalAlert.setGlobalAlertAction({
                        type: "Success",
                        text: user.message,
                        open: true,
                    })
                );
            } else {
                sessionStorage.setItem("userId", JSON.stringify(user.result.userId));
                sessionStorage.setItem("firstName", user.result.firstName);
                sessionStorage.setItem("lastName", user.result.lastName);
                sessionStorage.setItem("operationId", user.result.operationId);
                sessionStorage.setItem("oneTimeSecret", user.result.oneTimeSecret);
            }
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* forgotPassword({data}) {
    try {
        const user = yield call(Userservice.forgotPassword, data)
        if (user.status === 200) {
            yield put(actions.forgotPasswordData(user.result.member));
            History.push("/forgotpasswordstep2");
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* forgotPasswordStep2({data}) {
    try {
        const user = yield call(Userservice.forgotPasswordStep2, data)
        if (user.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
            yield put(actions.forgotPasswordData(null));
            History.push("/forgotpassword");
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
                    open: true,
                })
            );
            yield put(actions.forgotPasswordData(null));
            History.push("/forgotpassword");
        }
    } catch (e) {
        yield put(
            globalAlert.setGlobalAlertAction({
                type: "Error",
                text: e.msg,
                open: true,
            })
        );
        yield put(actions.forgotPasswordData(null));
        History.push("/forgotpassword");
    }
}
function* resetPassword({data}) {
    try {
        const user = yield call(Userservice.resetPassword, data)
        if (user.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
            History.push("/login");
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* setInformation({data}) {
    try {
        const user = yield call(Userservice.setInformation, data);
        if (user.status === 200) {

        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* setAddressDetails({data}) {
    try {
        const user = yield call(Userservice.setAddressDetails, data);
        if (user.status === 200) {

        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* setBusinessDetails({data}) {
    try {
        const user = yield call(Userservice.setBusinessDetails, data);
        if (user.status !== 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* setCellInformation({data}) {
    try {
        const user = yield call(Userservice.setCellInfoAction, data);
        if (user.status === 200) {
            localStorage.setItem("cellotp", user.result.otp);
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* setCompleteActivation({data}) {
    try {
        const user = yield call(Userservice.setCompleteActivation, data);
        if (user.status === 200) {
            setBrandColorsToLocal(user.result.member.brandKits);
            sessionStorage.setItem("user", JSON.stringify(user.result.member));
            sessionStorage.setItem("subUser", JSON.stringify(user.result.subMember));
            sessionStorage.setItem("menuList", JSON.stringify(user.result.menuList));
            sessionStorage.setItem("moduleList", JSON.stringify(user.result.moduleList));
            sessionStorage.setItem("countrySetting", JSON.stringify(user.result.countrySetting));
            sessionStorage.setItem("isLoggedInUser", "yes");
            yield put(actions.userLoggedIn(user.result.member));
            yield put(setSubUserAction(user.result.subMember));
            yield put(setMenuListAction(user.result.menuList));
            yield put(setModuleListAction(user.result.moduleList));
            yield put(setCountrySettingAction(user.result.countrySetting));
            History.push("/clientContact");
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* saveSubUsers({data}) {
    try {
        const user = yield call(Userservice.saveSubUsers, data);
        if (user.status === 200) {
            History.push("/manageusers");
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* saveSubUserType({data}) {
    try {
        const user = yield call(Userservice.saveSubUserType, data);
        if (user.status === 200) {
            History.push("/manageusers");
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* updateprofile({data}) {
    try {
        const user = yield call(Userservice.updateprofile, data);
        if (user.status === 200) {
            sessionStorage.setItem("user", JSON.stringify(data));
            yield put(actions.userLoggedIn(data));
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* saveCreditCardDetails({data}) {
    try {
        const creditcarddetails = yield call(Userservice.saveCreditCardDetails, data);
        if (creditcarddetails.status === 200) {
            yield call(getCardDetails);
            const pendingTransaction = yield select((state)=>{ return state.pendingTransaction; });
            if(pendingTransaction.length > 0){
                if(pendingTransaction[0].pendingTransactionType === "resendEmailCampaign"){
                    const res = yield call(saveResendCampaign,pendingTransaction[0]);
                    if(res.status === 200){
                        yield put(resetPendingTransactionAction());
                        History.push("/manageemailcampaign");
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Success",
                                text: res.message,
                                open: true,
                            })
                        );
                    } else {
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Error",
                                text: res.message,
                                open: true,
                            })
                        );
                    }
                } else if(pendingTransaction[0].pendingTransactionType === "saveEmailCampaign") {
                    const res = yield call(saveSendCampaign, pendingTransaction[0]);
                    if (res.status === 200) {
                        yield put(resetPendingTransactionAction());
                        History.push("/manageemailcampaign");
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Success",
                                text: res.message,
                                open: true,
                            })
                        );
                    } else {
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Error",
                                text: res.message,
                                open: true,
                            })
                        );
                    }
                } else if(pendingTransaction[0].pendingTransactionType === "sendSmsCampaign") {
                    const res = yield call(saveSendSmsCampaign, pendingTransaction[0]);
                    if (res.status === 200) {
                        yield put(resetPendingTransactionAction());
                        History.push("/managesmscampaign");
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Success",
                                text: res.message,
                                open: true,
                            })
                        );
                    } else {
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Error",
                                text: res.message,
                                open: true,
                            })
                        );
                    }
                } else if(pendingTransaction[0].pendingTransactionType === "addSmsCampaign" || pendingTransaction[0].pendingTransactionType === "editSmsCampaign") {
                    yield put(resetPendingTransactionAction());
                    History.push("/managesmscampaign");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                } else if(pendingTransaction[0].pendingTransactionType === "editSmsPolling") {
                    yield put(resetPendingTransactionAction());
                    History.push("/managesmspolling");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                } else if(pendingTransaction[0].pendingTransactionType === "addSmsPolling") {
                    yield put(resetPendingTransactionAction());
                    History.push("/createsmspolling");
                } else if(pendingTransaction[0].pendingTransactionType === "publishSmsPolling") {
                    const res = yield call(finalPublishAndConfirm, pendingTransaction[0]);
                    if (res.status === 200) {
                        yield put(resetPendingTransactionAction());
                        History.push("/managesmspolling");
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Success",
                                text: res.message,
                                open: true,
                            })
                        );
                    } else {
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Error",
                                text: res.message,
                                open: true,
                            })
                        );
                    }
                } else if(pendingTransaction[0].pendingTransactionType === "addSocialMediaPost" || pendingTransaction[0].pendingTransactionType === "editSocialMediaPost") {
                    yield put(resetPendingTransactionAction());
                    History.push("/managesocialmedia");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                } else if(pendingTransaction[0].pendingTransactionType === "saveSurvey") {
                    const res = yield call(saveSendSurvey, pendingTransaction[0]);
                    if (res.status === 200) {
                        History.push("/managesurvey");
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Success",
                                text: res.message,
                                open: true,
                            })
                        );
                    } else {
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Error",
                                text: res.message,
                                open: true,
                            })
                        );
                    }
                } else if(pendingTransaction[0].pendingTransactionType === "saveAssessment") {
                    const res = yield call(saveSendAssessment, pendingTransaction[0]);
                    if (res.status === 200) {
                        History.push("/manageassessment");
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Success",
                                text: res.message,
                                open: true,
                            })
                        );
                    } else {
                        yield put(
                            globalAlert.setGlobalAlertAction({
                                type: "Error",
                                text: res.message,
                                open: true,
                            })
                        );
                    }
                } else if(pendingTransaction[0].pendingTransactionType === "buyEmailWarmUp") {
                    yield put(resetPendingTransactionAction());
                    History.push("/domainemailverification");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                } else if(pendingTransaction[0].pendingTransactionType === "addClientImport") {
                    yield put(resetPendingTransactionAction());
                    History.push("/createimport");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                } else if(pendingTransaction[0].pendingTransactionType === "tenDLC") {
                    yield put(resetPendingTransactionAction());
                    History.push("/sms");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                } else if(pendingTransaction[0].pendingTransactionType === "myCalendar") {
                    yield put(resetPendingTransactionAction());
                    History.push("/mycalendar");
                    yield put(
                        globalAlert.setGlobalAlertAction({
                            type: "Success",
                            text: "Add credit card profile successfully.",
                            open: true,
                        })
                    );
                }
            } else {
                yield put(
                    globalAlert.setGlobalAlertAction({
                        type: "Success",
                        text: creditcarddetails.message,
                        open: true,
                    })
                );
            }
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: creditcarddetails.message,
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

function* updateCardDetails({data}) {

    try {
        const creditcarddetails = yield call(Userservice.updateCreditCardDetails, data);
        if (creditcarddetails.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: creditcarddetails.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: creditcarddetails.message,
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

function* removeCardDetails() {
    try {
        const creditcarddetails = yield call(Userservice.removeCreditCardDetails);
        if (creditcarddetails.status === 200) {
            yield put(actions.loadCreditCardDetails(null));
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: creditcarddetails.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: creditcarddetails.message,
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


function* updateSecurity({data}) {
    try {
        const user = yield call(Userservice.updateSecurity, data);
        if (user.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* updateCommunicationPref({data}) {
    try {
        const user = yield call(Userservice.updateCommunicationPref, data);
        if (user.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* changePassword({data}) {
    try {
        const user = yield call(Userservice.changePassword, data);
        if (user.status === 200) {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Success",
                    text: user.message,
                    open: true,
                })
            );
        } else {
            yield put(
                globalAlert.setGlobalAlertAction({
                    type: "Error",
                    text: user.message,
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

function* logout() {
    yield put(actions.userLoggedOutAction());
    yield put(resetSubUserAction());
    yield put(resetMenuListAction());
    yield put(resetModuleListAction());
    yield put(resetCountrySettingAction());
    setCookie(tokenName, "");
    document.cookie = `${tokenName}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`;
    document.cookie = `${tokenName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${websiteSmallTitleWithExt}`;
    document.cookie = `${tokenName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${websiteSmallTitleWithExt}`;
    yield call(Userservice.logout);
}

function* watchRegistration() {
    yield takeEvery(types.REGISTER_USER, registration);
}

function* watchRegistrationStep2() {
    yield takeEvery(types.REGISTER_STEP_2_USER, registrationStep2);
}

function* watchResendActivationEmail() {
    yield takeEvery(types.RESEND_ACTIVATE_EMAIL, resendactivateemail);
}

function* watchProcessActivation() {
    yield takeEvery(types.PROCESS_ACTIVATION, getProcessActivation);
}

function* watchForgotPassword() {
    yield takeEvery(types.FORGOT_PASSWORD, forgotPassword);
}

function* watchForgotPasswordStep2() {
    yield takeEvery(types.FORGOT_PASSWORD_STEP_2, forgotPasswordStep2);
}

function* watchResetPassword() {
    yield takeEvery(types.RESET_PASSWORD, resetPassword);
}

function* watchSetInformation() {
    yield takeEvery(types.SET_INFORMATION, setInformation);
}

function* watchSaveSubUsers() {
    yield takeEvery(types.SAVE_SUB_USERS, saveSubUsers);
}

function* watchSaveSubUserType() {
    yield takeEvery(types.SAVE_SUB_USER_TYPE, saveSubUserType);
}

function* watchSetAddressDetails() {
    yield takeEvery(types.SET_ADDRESS_DETAIL_ACTION, setAddressDetails);
}

function* watchSetBusinessDetails() {
    yield takeEvery(types.SET_BUSINESS_DETAIL_ACTION, setBusinessDetails);
}

function* watchSetCellInformation() {
    yield takeEvery(types.SET_CELL_INFO_ACTION, setCellInformation);
}

function* watchSetCompleteActivation() {
    yield takeEvery(types.SET_COMPLETE_ACTIVATION_ACTION, setCompleteActivation);
}

function* watchLoginUser() {
    yield takeEvery(types.LOGIN_USER, login);
}

function* watchVerifiedOtp() {
    yield takeEvery(types.VERIFIED_OTP_ACTION, verifiedOtp);
}

function* watchchangePassword() {
    yield takeEvery(types.CHANGE_PASSWORD, changePassword);
}

function* watchupdateprofile() {
    yield takeEvery(types.UPDATE_MEMBER_INFO, updateprofile);
}

function* watchgetCardDetails() {
    yield takeEvery(types.GET_CREDIT_CARD_DETAILS, getCardDetails);
}

function* watchsaveCreditCardDetails() {
    yield takeEvery(types.SAVE_CREDIT_CARD_DETAILS, saveCreditCardDetails);
}

function* watchupdateCardDetails() {
    yield takeEvery(types.UPDATE_CARD_DETAILS, updateCardDetails);
}

function* watchremoveCardDetails() {
    yield takeEvery(types.REMOVE_CARD_DETAILS, removeCardDetails);
}

function* watchupdateSecurity() {
    yield takeEvery(types.SET_SECURITY, updateSecurity);
}

function* watchupdatecommunicationpref() {
    yield takeEvery(types.SET_COMMUNICATION_PREFERENCES, updateCommunicationPref);
}

function* watchLogoutUser() {
    yield takeEvery(types.LOGOUT_USER, logout);
}

export function* userSaga() {
    yield all([
        watchLoginUser(),
        watchchangePassword(),
        watchLogoutUser(),
        watchVerifiedOtp(),
        watchupdateprofile(),
        watchupdateSecurity(),
        watchSetBusinessDetails(),
        watchSetCellInformation(),
        watchSetCompleteActivation(),
        watchRegistration(),
        watchForgotPassword(),
        watchForgotPasswordStep2(),
        watchResetPassword(),
        watchSaveSubUsers(),
        watchSaveSubUserType(),
        watchRegistrationStep2(),
        watchResendActivationEmail(),
        watchSetAddressDetails(),
        watchProcessActivation(),
        watchSetInformation(),
        watchgetCardDetails(),
        watchremoveCardDetails(),
        watchupdateCardDetails(),
        watchsaveCreditCardDetails(),
        watchupdatecommunicationpref()
    ]);
}