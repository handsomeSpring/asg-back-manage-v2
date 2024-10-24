// 发送邮箱接口
import request from "@/utils/request";
export function sendEmail(params){
    return request({
        url:"/api/v1/admin/SendEmail",
        method:"post",
        params
    })
}