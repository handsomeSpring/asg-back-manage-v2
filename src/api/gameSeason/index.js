import request from '@/utils/request'
//获取所有比赛
export function getAllEvents(){
    return request({
        url:'/api/v1/Events',
        method:'get'
    })
}
// 获得赛季晋升图
export function getEventProm(){
  return request({
    url:"/api/v1/Events",
    method:"get",
    params:{
      get_poem:true
    }
  })
}
// 修改晋升图
export function updateProm(eventId,string){
  return request({
    url:"/api/v1/admin/poem",
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    params:{
      eventId
    },
    data:JSON.stringify(string)
  })
}
//发布新赛事
export function pushNewEvents(data){
    return request({
        url:'/api/v1/admin/Events',
        method:'post',
        headers:{
          "Content-Type":"application/json"
        },
        data,
    })
}
//删除
export function deleteEvents(eventId){
  return request({
    url:'/api/v1/admin/Events',
    method:'DELETE',
    params:{
      eventId
    }
  })
}
//更新赛季
export function updateEvents(data){
  return request({
    url:'/api/v1/admin/Events',
    method:'put',
    params:{
      eventId:data.id
    },
    data
  })
}
//获取用户详细信息
export function getPlayerDetails(events){
  return request({
    url:"/api/v1/admin/form/all",
    method:"get",
    params:{
      events
    }
  })
} 