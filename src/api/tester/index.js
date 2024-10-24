import request from "@/utils/request"

export function getDataByKey(keyword){
    return request({
        url:"http://localhost:3000/api",
        method:"get",
        params:{
            keyword
        }
    })
}