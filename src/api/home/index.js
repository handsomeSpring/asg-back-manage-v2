import { getToken } from "../../utils/auth";
import request from "../../utils/request";
//登录
export function getInfo() {
  return request.get("/api/v1/user");
}
// 获取所有用户接口
export function getUsers(params) {
  return request({
    url:"/api/v2/admin/allperson",
    method:"GET",
    params
  })
}
//修改用户中文名
export function updateChinaName(newchinaname) {
  return request.post("/api/v1/user/name", null, {
    params: {
      newchinaname,
    },
  });
}
//注册管理员
export function enrollAdmin(userName, password, chinaname, eMail) {
  return request.post("/api/v1/admin/enroll", {
    userName,
    password,
    chinaname,
    eMail,
  },{
    params:{
        captoken:getToken()
    }
  });
}
//设置管理员
export function setAdmin(userid){
   return request.post('/api/v1/admin/setadmin',null,{
    params:{
        userid
    }
   })
}
//删除用户
export function delUser(userid){
  return request.delete(`/api/v1/admin/deluser?userid=${userid}`)
}
//设置职位
export function setRole(userid,officium){
  return request.post(`/api/v1/admin/setop?userid=${userid}&opname=${officium}`)
}
//成为管理员
export function getSuperAdmin(password){
  return request.post(`/api/v1/getadmin?password=${
    password
  }`)
}
//上传头像
export function uploadImg(baseImg){
  return request({
    url:'/api/v1/setimg',
    method:'post',
    headers:{
      "Content-Type":"application/json"
    },
    data:baseImg
  })
}
//搜索接口
export function searchUser(userid){
  return request.get(`/api/v1/admin/user/${userid}`)
}

// 获取我的商品口
export function getMyShopping(){
  return request({
    url:"/api/v1/Store/my",
    method:"GET"
  })
}

// 获取我的竞猜
export function mylog(){
  return request({
    url:"/api/v1/game/mylog",
    method:"GET"
  })
}

// 新增菜单口
export function addMenu(data){
  return request({
    url:'/api/v1/admin/menuAdd',
    method:'POST',
    data
  })
}

// 设置职位
export function setRight(params){
  return request({
    url:'/api/v1/admin/setRight',
    method:'POST',
    params
  })
}

// 删除菜单
export function deleteMenu(uid){
   return request({
    url:"/api/v1/admin/menuDel",
    method:'DELETE',
    params:{
      uid
    }
   })
}
