import axiosInterceptors from "../axiosInterceptor/axiosInterceptors";
import {shopifyUrl} from "../config/api";
import {easUrlEncoder} from "../assets/commonFunctions";

export const getShopifyAuthentication = () =>{
    return axiosInterceptors().get(shopifyUrl+'/getShopifyAuthentication').then(res => res)
}
export const shopifyLogout = () =>{
    return axiosInterceptors().get(shopifyUrl+'/shopifyLogout').then(res => res)
}
export const shopifyOauth = (data) =>{
    return axiosInterceptors().get(shopifyUrl+'/shopifyOauth'+data).then(res => res)
}
export const getShopifyCollectionList = () =>{
    return axiosInterceptors().get(shopifyUrl+'/getShopifyCollectionList').then(res => res)
}
export const getShopifyProductList = (data) =>{
    return axiosInterceptors().get(shopifyUrl+'/getShopifyProductList?'+easUrlEncoder(data)).then(res => res)
}
export const getShopifyProductById = (data) =>{
    return axiosInterceptors().get(shopifyUrl+'/getShopifyProductById?'+easUrlEncoder(data)).then(res => res)
}