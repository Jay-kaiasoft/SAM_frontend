import axiosInterceptors from "../axiosInterceptor/axiosInterceptors"
import { numberForwardingUrl } from "../config/api"

export const saveNumberForwarding = (data) =>{
    return axiosInterceptors().post(numberForwardingUrl+'/saveNumberForwarding',data).then(res => res)
}
export const deleteNumberForwarding = (id) =>{
    return axiosInterceptors().delete(numberForwardingUrl+'/deleteNumberForwarding?cfnId='+id).then(res => res)
}