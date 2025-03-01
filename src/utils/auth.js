import Cookies from 'js-cookie'

const TokenKey = 'token'
//获取token
export function getToken(){
    return Cookies.get(TokenKey) || localStorage.getItem(TokenKey);
}
//设置token
export function setToken(value){
    Cookies.set(TokenKey,value)
    localStorage.setItem(TokenKey,value)
}
//移除token
export function removeToken(){
    Cookies.remove(TokenKey)
    localStorage.removeItem(TokenKey)
}