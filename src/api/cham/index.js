import request from '@/utils/request'

export function searchId(name){
    return request.get(`/api/v1/form/${name}`)
}

export function saveCham(data){
    return request({
        url:'/api/v1/admin/Champion',
        method:'post',
        data
    })
}
//获取冠军
export function getAllCham(){
    return request.get('/api/v1/Champion')
}

//删除冠军
export function deleteCham(id){
    return request({
        url:'/api/v1/admin/Champion',
        method:'delete',
        params:{
            id
        }
    })
}

// 修改冠军
export function updateChampion(data){
    return request({
        url:'/api/v1/admin/Champion',
        method:'put',
        data,
    })
}