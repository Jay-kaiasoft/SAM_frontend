import axios from "axios";
import store from "../store"
import { setLoader } from "../actions/loaderActions";
import { logoutUserAction } from "../actions/userActions";

let runningApis = [];
const axiosInterceptors = () => {
    const baseURL = process.env.REACT_APP_MAIN_BASE_URL;
    const ignoreApi = ["getSmsCampaignReplyNotification","getAllReplyCount","currentConversationsDetailList","getCampaignList","getGroupListWithCheckDuplicate","getGroupList","importImageFromUrl","callingStop","autoSave","getSurveyAllListAuto","getAssessmentAllListAuto","getCustomFormLinkListAuto","getShopifyAuthentication","getGroupFirstRecords","getGroupUDFAuto","grabImages", "grabColors", "grabLinks", "grabWebsiteImages", "grabWebsiteLinks", "grabWebsiteColors", "saveDataTracker"];
    let headers = {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
    };

    if (sessionStorage.getItem('token')) {
        headers.Authorization = "Bearer " + sessionStorage.getItem('token');
    }
    
    const axiosInterceptors = axios.create({
        baseURL: baseURL,
        headers,
        validateStatus: function (status) {
            return status <= 500;
        }
    });
    axiosInterceptors.interceptors.request.use(
        (config) => {
            const check = ignoreApi.filter((v)=>{
                return (config.url.match(v) !== null) ? -1 : 0
            })
            if (check.length === 0) {
                runningApis.push(config.url);
                config._loaderTimeout = setTimeout(() => {
                    if (runningApis.includes(config.url)) {
                        store.dispatch(setLoader({
                            load: true,
                            text: "Please wait !!!"
                        }));
                    }
                }, 5000);
            }
            return config;
        }, 
        (error) => {
            return Promise.reject(error);
        }
    );
    axiosInterceptors.interceptors.response.use(
        (response) => {
            if(typeof response.data.suspended != "undefined" && response.data.suspended === "suspended") {
                store.dispatch(logoutUserAction());
            }
            if(typeof response.data.result != "undefined") {
                if (response.data.result.token) {
                    if (sessionStorage.getItem("token")) {
                        sessionStorage.removeItem("token");
                        sessionStorage.setItem('token', response.data.result.token)
                    } else {
                        sessionStorage.setItem('token', response.data.result.token)
                    }
                }
            }
            let apiIndex = runningApis.indexOf(response.config.url);
            if(apiIndex !== -1){
                runningApis.splice(apiIndex, 1);
            }
            if (response.config._loaderTimeout) {
                clearTimeout(response.config._loaderTimeout);
            }
            if (runningApis.length === 0) {
                store.dispatch(setLoader({
                    load: false
                }));
            }
            if(response.config.url.match("saveCustomFormAnswers") !== null && response?.data?.result?.customFormAnswers?.stIsComplete === 1){
                window?.opener?.sessionStorage?.setItem('closeModal10DLC', true);
            }
            return new Promise((resolve, reject) => {
                resolve(response.data);
            })
        },
        (error) => {
            if (error.config && error.config._loaderTimeout) {
                clearTimeout(error.config._loaderTimeout);
            }
            store.dispatch(setLoader({
                load: false
            }));
            return new Promise((resolve, reject) => {
                resolve({message:"Request Timed Out"});
            });
        }
    );

    return axiosInterceptors;
};

export default axiosInterceptors;
