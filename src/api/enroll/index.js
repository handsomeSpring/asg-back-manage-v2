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
// 删除v2口
export function delEnrollTeamV2(formId){
    return request({
        url:'/api/v2/form/delete',
        method:'DELETE',
        params:{
            formId
        }
    })
}
//获取详细信息表单
export function getDetailForm(){
    return request.get('/api/v1/user/form')
}


// 获取报名队伍v3
// page limit sort eventId
export function getEnrollTeam(params){
    return request({
        url:'/api/v3/form/all',
        method:'GET',
        params
    })
}