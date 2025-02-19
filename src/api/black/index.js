import request from "@/utils/request";

// 获取违规记录
export function FindBlacks(params){
    return request({
      url:'/api/v1/admin/FindBlacks',
      method:'GET',
      params:params
    })
  }

  //增加记录
  export function addRecord(data){
    return request({
        url:'/api/v1/blackTable/Add',
        method:"POST",
        data
    })
}

//删除记录  
export function deleteRecord(idFind){
    return request({
        url:'/api/v1/blackTable/Del',
        method:"DELETE",
        params:{
            idFind
        }
    })
}
  //更新记录
  export function updateRecord(data){
    return request({
        url:'/api/v1/blackTable/Update',
        method:"POST",
        data
    })
}
