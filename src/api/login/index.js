import request from '@/utils/request'
//登录
export function loginUser(data){
    return request.post('/api/v1/login',{
        userName:data.username,
        password:data.password
    })
}
// 通过邮箱登录
export function loginByEmail(data){
    return request({
        url:"/api/v1/email_login",
        method:"post",
        data
    }) 
}
// 修改密码
export function updatePassword(email){
    return request({
        url:"/api/v1/password/sendtoken",
        method:"post",
        data:email,
        headers:{
            'Content-Type':'application/json'
        }
    })
}
// 确认修改
export function confirmUpdate(email,new_Password,token){
    return request({
        url:"/api/v1/password/ok",
        method:"post",
        data:{
           email,
           new_Password,
           token
        }
    })
}

// 更新qq号
export function updateQQ(qqnumber){
    return request({
        url:'/api/qqbotr/qqnumber',
        method:'POST',
        params:{
            qqnumber
        }
    })
}
