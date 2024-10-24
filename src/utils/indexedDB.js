// 创建indexedDB数据库
/**
 *@param {object} dbName 数据库的名字
 *@param {string} storeName 仓库名称
 *@param {string} version 数据库版本
 *@return {object} 该函数会返回一个数据库实例
 */
export function openDB(dbName,version = 1){
    return new Promise((resolve) => {
        //兼容浏览器
        var indexedDB = window.indexedDB || window.webkitIndexedDB 
        let db;
        //打开数据库，若没有则会创建
        const request = indexedDB.open(dbName,version)
        //数据库打开成功的回调
        request.onsuccess = function(event){
            db = event.target.result;
            console.log("数据库打开成功了");
            resolve(db);
        };
        //打开失败的回调
        request.onerror = function (){
            console.log("数据库打开报错");
        }
        //数据库有更新时候的回调
        request.onupgradeneeded = function (event){
            console.log("更新");
            db = event.target.result;
            var objectStore;
            //创建存储库
            objectStore = db.createObjectStore("games",{
                keyPath:"uuid",//这是主键
                //autoIncrement:true //实现自增
            });
           //创建索引，在后面查询数据的时候可以根据索引查
          objectStore.createIndex("uuid","uuid",{unique:true});
          objectStore.createIndex("name","name",{unique:false});
        }
    })
}

//插入数据
export function addData(db,storeName,data){
    var request = db.transaction([storeName],"readwrite") //事务对象 指定表格名称和操作（只读\读写）
    request.objectStore(storeName).put(data)
    request.onsuccess = function (){
        console.log("数据写入成功！")
    }
    request.onerror = function () {
        console.log("数据库写入失败")
    }
}
export function getDataByKey(db,storeName,key){
    return new Promise((resolve) => {
        var transaction = db.transaction([storeName]);
        var objectStore = transaction.objectStore(storeName);
        var request = objectStore.get(key) //通过主键获取数据
        request.onerror = function (){
            console.log("事务失败")
        }
        request.onsuccess = function (){
            resolve(request.result);
        }
    })
}
//查询数据
export function cursorGetData(list,db,storeName){
    var store = db
    .transaction(storeName,"readwrite")
    .objectStore(storeName);
    var request = store.openCursor();//指针对象
    //游标开启成功，逐行读取数据
    request.onsuccess = function(e){
        var cursor = e.target.result;
        if(cursor){
           //必须检查
            list.push(cursor.value);
            cursor.continue();//遍历储存对象中的所有内容
        }else{
            console.log("所有数据",list)
        }
    }
}