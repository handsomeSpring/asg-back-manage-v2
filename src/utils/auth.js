import Cookies from 'js-cookie'

const TokenKey = 'token'
//获取token
export function getToken(){
    return Cookies.get(TokenKey)
}
//设置token
export function setToken(value){
    return Cookies.set(TokenKey,value)
}
//移除token
export function removeToken(){
    return Cookies.remove(TokenKey)
}