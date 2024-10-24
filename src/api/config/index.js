import request from "@/utils/request.js"

const apiUrl = {
    addConfig:"/api/config/api/v1/admin/config",
    deleteConfig:"/api/config/api/v1/admin/config",
    getConfig:"/api/config/api/v1/admin/config/all",
    getByTitle:"/api/config/api/v1/admin/config/byTitle"
}

export function addConfig(data){
    return request({
        url:apiUrl.addConfig,
        method:"POST",
        data
    })
}

export function deleteConfig(id){
    return request({
        url:apiUrl.deleteConfig,
        method:"DELETE",
        params:{
            Id:id
        }
    })
}

export function getConfig(params){
    return request({
        url:apiUrl.getConfig,
        method:"GET",
        params
    })
}

export function getByTitle(title){
    return request({
        url:apiUrl.getByTitle,
        method:"POST",
        data:title,
        headers:{
            'Content-Type':'application/json'
        }
    })
}