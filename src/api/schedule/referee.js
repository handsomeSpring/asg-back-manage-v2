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