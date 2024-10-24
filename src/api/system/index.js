import request from '@/utils/request'
const apiUrl = {
    getDiskInfo:"/system?action=GetDiskInfo"
}
export function getDiskInfo(){
    return request({
        url:apiUrl.getDiskInfo,
        method:"GET"
    })
}