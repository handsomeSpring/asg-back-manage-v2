import request from "@/utils/request";

export function exportExcel(event_name) {
  return request({
    url: "/api/v1/admin/excel",
    method: "get",
    params: {
      event_name,
    },
  });
}
// 删除所有表
export function deleteFiles() {
  return request({
    url: "/api/v1/admin/excel",
    method: "delete",
  });
}
// 发布隐私政策
export function pushPrivatePolice(rule) {
  return request({
    url: "/api/v1/admin/Privacy_Policy",
    method: "post",
    data: rule,
  });
}

// 统计
export function getStatic() {
  return request({
    url: "/api/v1/admin/statistics",
    method: "get",
  });
}

//发送请求上传图片
export function uploadImg(formData) {
  return request({
    url: "/api/v1/admin/updata_img",
    method: "POST",
    data: formData,
    headers: {
        'Content-Type': 'multipart/form-data'
      }
  });
}

// 获取白名单列表
export function getFriendList(query){
    return request({
        url:"/api/v1/admin/Friend",
        method:'get',
        params:query
    })
}

// 存储
export function saveFriend(query){
    return request({
        url:"/api/v1/admin/Friend",
        method:'post',
        params:query
    })
}

// 删除
export function deleteFriend(friend_id){
    return request({
        url:"/api/v1/admin/Friend",
        method:'delete',
        params:{
            friend_id
        }
    })
}

// 更新
export function putFriend(params){
  return request({
    url:"/api/v1/admin/Friend",
    method:'put',
    params:params
})
}
// 发送公告
export function sendAdminMsg(qqgrope,atuserqq,msg){
  return request({
    url:"/api/v1/admin/post_qqbotmsg",
    method:"POST",
    params:{
      qqgrope,
      atuserqq
    },
    data:msg,
    headers:{
      "Content-Type":"application/json"
    }
  })
}

// qq发送审批通知
export function sendqqMsg(msgObj){
  console.log("qqmsg",msgObj);
  return request({
    url:"/api/v1/admin/post_qqtix",
    method:"POST",
    params:{
      qqgrope:msgObj.group,
      atqqnumber:msgObj.qq
    },
    data:msgObj.msg,
    headers:{
      "Content-Type":"application/json"
    }
  })
}

// 根据id查询用户
export function getUserName(userid){
  return request({
    url:`/api/v1/admin/userfind/${userid}`,
    method:"GET"
  })
}

// 超管新建任务
export function setTask(data){
  return request({
    url:"/api/v1/admin/Task",
    method:"POST",
    data
  })
}

// 获取用户的任务
export function getTask(userid){
  return request({
    url:"/api/v1/Tasks",
    method:"GET",
    params:{
      userid
    }
  })
}

// 超管获取任务
export function findTasks(params){
  return request({
    url:"/api/v1/admin/FindTasks",
    method:"GET",
    params
  })
}

// 用户自己点完成任务
export function taskFinish(taskid){
  return request({
    url:"/api/v1/Task",
    method:"GET",
    params:{
      taskid
    }
  })
}

// 删除任务
export function deleteTask(id){
  return request({
    url:"/api/v1/admin/Task",
    method:"DELETE",
    params:{
      id
    }
  })
}

// 超管完成任务
export function taskDone(data){
  return request({
    url:"/api/v1/admin/Task/Done",
    method:"POST",
    data
  })
}

// 查看解说核验列表-分页
export function conformList(params){
  return request({
    url:"/api/v1/admin/findRegister",
    method:"GET",
    params
  })
}

// 审批通过
export function approvalCommentary(data){
  return request({
    url:"/api/v1/admin/approval",
    method:"POST",
    data
  })
}
//获取管理员列表
export function rolealluser(rolename,others = {}){
  return request({
    url:"/api/v1/admin/rolealluser",
    method:"GET",
    params:{
      rolename,
      ...others
    }
  })
}

// 拒绝解说
export function refuseCom(userId){
  return request({
    url:'/api/v1/admin/refuseCom',
    method:'GET',
    params:{
      userId
    }
  })
}

// 任务通知
export function remindTasks(taskId){
   return request({
    url:'/api/v1/admin/RemindTasks',
    method:'GET',
    params:{
      taskId
    }
   })
}

// 取消管理员
export function removeAdmin(userid){
  return request({
    url:'/api/v1/admin/removeadmin',
    method:'POST',
    params:{
      userid
    }
  })
}

// 管理员帮忙注册账号
export function adminEnrollUser(data){
   return request({
    url:'/api/v1/admin/enroll',
    method:'POST',
    data
   })
}

// 封装
export function updateTaskApi(data){
  return request({
    url:'/api/v1/admin/UpdateTasks',
    method:'PUT',
    data
  })
}

// 查询口
export function findAudit(params){
  return request({
    url:'/api/v1/admin/AuditFind',
    method:'GET',
    params
  })
}
// 新增业务审批
export function postAudit(data){
  return request({
    url:'/api/v1/admin/AuditPost',
    method:'POST',
    data
  })
}
// 修改状态为4-终止申请
export function statusChange4(Id){
  return request({
    url:'/api/v1/admin/statusChange4',
    method:'GET',
    params:{
      Id
    }
  })
}

// 根据id获取申请表数据
export function findFormById(Id){
  return request({
    url:'/api/v1/admin/findFormById',
    method:'GET',
    params:{
      Id
    }
  })
}