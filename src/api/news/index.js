import request from '../../utils/request'
// 发布公告
export function pushNews(data){
    return request({
        url:"/api/v1/admin/news",
        method:"POST",
        data
    })
}
//获取公告
export function getNews(type){
    return request({
        url:'/api/v1/news',
        method:'GET',
        params:{
            type
        }
    })
}
// 修改公告
export function updateNews(obj){
    const { id,msg,title } = obj;
    return request({
        url:'/api/v1/admin/news',
        method:"PUT",
        params:{
            newsid:id
        },
        data:{
            msg,
            title
        }
    })
}
//删除公告
export function delNews(id){
    return request.delete(`/api/v1/admin/news?newid=${id}`)
}