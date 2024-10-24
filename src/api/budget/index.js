import request from "@/utils/request";

const URL = {
    saveBudget:'/api/v1/admin/insertBg', //插入预算
    getBudget:'/api/v1/admin/getBg', //获取赛季预算信息
    updateBudget:'/api/v1/admin/updateBg', //预算补录
    countBudgetTotal:'/api/v1/admin/countBudgetTotal', //获取use
    useBudget:'/api/v1/admin/updateBudgetUsage', //使用预算
    deleteBudget: '/api/v1/admin/DelBg', //删除预算
}

export function saveBudget(data){
    return request({
        url:URL.saveBudget,
        method:'POST',
        data
    })
}

export function getBudget(sourceEventId){
    return request({
        url:URL.getBudget,
        method:'GET',
        params:{
            sourceEventId
        }
    })
}

export function updateBudget(data,id){
    return request({
        url:URL.updateBudget,
        method:'POST',
        params:{
            id
        },
        data
    })
}

// 获取预算总和
export function countBudgetTotal(){
    return request({
        url:URL.countBudgetTotal,
        method:"GET"
    })
}

// 使用预算
export function changeBudgetStatus(data){
    return request({
        url:URL.useBudget,
        method:"POST",
        data
    })
}

// 删除预算
export function delBudget(id){
    return request({
        url:URL.deleteBudget,
        method:"DELETE",
        params:{
            id
        }
    })
}