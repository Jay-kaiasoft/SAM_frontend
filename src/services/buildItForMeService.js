import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {builditformeUrl, proxyBaseURL} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getListOrder = () =>{
    return axiosInterceptors().get(builditformeUrl+'/getListOrder').then(res => res)
}
export const getListRequestForApproval = () =>{
    return axiosInterceptors().get(builditformeUrl+'/getListRequestForApproval').then(res => res)
}
export const getRequestForApprovalTags = () =>{
    return axiosInterceptors().get(builditformeUrl+'/getRequestForApprovalTags').then(res => res)
}
export const getOrderDetails = (id) =>{
    return axiosInterceptors().get(builditformeUrl+'/getOrderDetails/'+easUrlEncoder(id)).then(res => res)
}
export const deleteOrder = (id) =>{
    return axiosInterceptors().delete(builditformeUrl+'/deleteOrder/'+id).then(res => res)
}
export const approveRequest = (data) =>{
    return axiosInterceptors().post(builditformeUrl+'/approveRequest',data).then(res => res)
}
export const rejectRequest = (data) =>{
    return axiosInterceptors().post(builditformeUrl+'/rejectRequest',data).then(res => res)
}
export const saveOrder = (data) =>{
    return axiosInterceptors().post(builditformeUrl+'/saveOrder',data).then(res => res)
}
export const placeOrder = (id,data) =>{
    return axiosInterceptors().put(builditformeUrl+'/placeOrder/'+easUrlEncoder(id),data).then(res => res)
}
export const bfmUploadFile = (data) =>{
    return axiosInterceptors().post(proxyBaseURL+'/builditforme/uploadFile',data).then(res => res)
}
export const bfmRemoveFile = (id,name) =>{
    return axiosInterceptors().delete(builditformeUrl+'/removeFile/'+id+'/'+name).then(res => res)
}
export const getListPackage = () =>{
    return axiosInterceptors().get(builditformeUrl+'/getListPackage').then(res => res)
}