import request from '../../utils/request'
export function searchInfo(name){
    return request.get(`/api/v1/admin/form/${name}`)
}
//报名列表
export function getEnrollList(page,pagesize,sort,eventsname){
    return request({
        url:'/api/v2/form/all',
        method:'get',
        params:{
            page,
            page_long:pagesize,
            sort,
            eventsname
        }
    })
}
//删除列表
export function delEnrollTeam(id){
    return request.delete(`/api/v1/admin/form?formid=${id}`)
}
//获取详细信息表单
export function getDetailForm(){
    return request.get('/api/v1/user/form')
}
