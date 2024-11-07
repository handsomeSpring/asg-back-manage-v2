import request from "@/utils/request";
export function pushSchedule(data) {
  return request({
    url:"/api/v1/admin/game",
    method:"POST",
    data
  });
}
//获取赛程
export function getSchedule(page, pagesize, belong) {
  return request.get(
    `/api/v1/game?page=${page}&page_long=${pagesize}&belong=${belong}`
  );
}

// 前端新获取赛程接口
export function getScheduleFrontNew(params){
  return request({
    url:'/api/v1/game',
    method:'GET',
    params
  })
}

//删除赛程
export function delSchedule(id) {
  return request.delete(`/api/v1/admin/game?gameid=${id}`);
}
//根据职位获取用户列表 opname
export function getUserRoles(params) {
  return request({
    url: "/api/v1/getuserbyop",
    method: "get",
    params,
  });
}
//抽取赛程
export function ballotSchedule(tag, data) {
  return request({
    url: "/api/v1/admin/team",
    method: "post",
    params: 
    { 
        game_tag: tag 
    },
    data,
  });
}
//修改赛程信息
export function updateSchedule(gameid, info) {
  return request.put(`/api/v1/admin/game?gameid=${gameid}`, info);
}
//设置获胜队伍
export function setWinGame(id, winteam) {
  return request({
    url: `/api/v1/admin/game/win?teamid=${id}&winteam=${winteam}`,
    method: "post",
  });
}

// 获得所有职位用户
export function getUsersWithRole(){
  return request({
    url:'/api/v1/admin/officium/group',
    method:'get'
  })
}
// 导入excel
export function importExcel(data){
  return request({
    url:"/api/v1/admin/import/schedule",
    method:"POST",
    data:data
  })
}

// 设置赛果
export function setFinalScore(gameid,finalScore){
  return request({
    url:'/api/v1/game/final',
    method:'POST',
    params:{
      gameid,
      finalScore
    }
  })
}

// 获取赛程新（NEW V2）page limit teamName1 teamName2 belong
export function getAllScheduleV2(params){
  return request({
    url:"/api/v2/game",
    method:"GET",
    params
  })
}
