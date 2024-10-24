import request from "@/utils/request.js";

const apiUrl = {
    getProcess:"/server/api/v1/process",
    closeProcess:"/server/api/v1/process"
}

export function getProcess(){
    return request({
        url:apiUrl.getProcess,
        method:"GET"
    })
}

export function closeProcess(id){
    return request({
        url:apiUrl.closeProcess,
        method:"DELETE",
        params:{
            process_id:id
        }
    })
}