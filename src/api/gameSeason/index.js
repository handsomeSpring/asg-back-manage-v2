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
export function updateProm(event_name,string){
  return request({
    url:"/api/v1/admin/poem",
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    params:{
      event_name
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
export function deleteEvents(name){
  return request.delete(`/api/v1/admin/Events?event_name=${name}`)
}
//更新赛季
export function updateEvents(event_name,row){
  return request({
    url:'/api/v1/admin/Events',
    method:'put',
    params:{
      event_name
    },
    data:{
      id:row.id,
      name:row.name,
      is_over:row.is_over,
      opentime:row.opentime
    }
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