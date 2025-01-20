import request from '@/utils/request';

export function anchorChoose(gameIds){
    return request({
        url:'/api/v1/anchor',
        method:'POST',
        params:{
            gameIds
        }
    })
}

// 取消选班
export function cancelGame(gameId,reason){
    return request({
        url:'/api/v1/anchor',
        method:'DELETE',
        params:{
            gameId,
            reason
        }
    })
}

// 二十-TODO-需要跟唯因虚梦接口对接
// 裁判选班口
export function judgeChoose(gameIds){
    return request({
        url:'', //todo
        method:'POST',
        params:{
            gameIds
        }
    })
}
// 裁判取消选班口
export function judgeCancelGame(gameId,reason){
    return request({
        url:'', //todo
        method:'DELETE',
        params:{
            gameId,
            reason
        }
    })
}