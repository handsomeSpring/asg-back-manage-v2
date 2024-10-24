import axios from 'axios'
import { getToken } from "../utils/auth";
//配置请求的根路径
axios.defaults.baseURL = window.SERVE_IP  //http://dev.idvasg.cn/ https://124.223.35.239
axios.interceptors.request.use(config=>{
    config.headers.Authorization = `Bearer ${getToken()}`
    // config.headers['Content-Type'] = "application/json"
    return config

})

export default axios