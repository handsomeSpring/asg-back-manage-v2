import request from "@/utils/request";
const URL = {
    addNew:"/api/v1/admin/Store",
    getStore:"/api/v1/Store",
    editGoods:"/api/v1/admin/Store",
    deleteItem:"/api/v1/admin/Store",
    getStoreInfo:"/api/v1/admin/Storeinfo",
    verification: "/api/v1/Store/Verification",
    buyGoods:"/api/v1/Store/Buy",
}

export function addNew(data){
    return request({
        url:URL.addNew,
        method:"POST",
        data
    })
}

export function getStore(){
    return request({
        url:URL.getStore,
        method:"GET"
    })
}

export function editGoods(data){
    return request({
        url:URL.editGoods,
        method:"PUT",
        data
    })
}

export function deleteItem(id){
    return request({
        url:URL.deleteItem,
        method:"DELETE",
        params:{
            id
        }
    })
}

export function getStoreInfo(params){
    return request({
        url:URL.getStoreInfo,
        method:'GET',
        params
    })
}

// 核销
export function verification(storeinfoid){
    return request({
      url:URL.verification,
      method:"GET",
      params:{
        storeinfoid
      }
    })
}

//购买商品
export function buyGoods(storeid){
    return request({
        url:URL.buyGoods,
        method:"POST",
        data:storeid
    })
  }