// 处理图片导出的js
import request from '@/utils/request'

export function exportIMGs(){
    return request({
        url:"/api/v1/admin/img_zip",
        method:"get"
    })
}