<template>
  <div>
    <div class="container">
       <div class="header">
         <p>{{roleLabel}}</p>
       </div>
       <div class="body">
         <p>{{curStep}}</p>
       </div>
    </div>
  </div>
</template>

<script>
export default {
   name: 'Card',
   props:{
    // 职位标签
     roleLabel:{
        type:String,
        default:""
     },
     curStep:{
        type:String,
        default:""
     }
   } 
}
</script>

<style scoped lang="less">
   .container{
    width:130px;
    height:60px;
    box-sizing: border-box;
    border:1px solid #909399;
    cursor: pointer;
    .header{
        height: 25px;
        background-color: #6fc1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: bold;
        color:#303030
    }
    .body{
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color:#303030
    }
    &:hover{
      box-shadow:  2px 2px 10px rgba(0, 0, 0, .24), 0 0 6px rgba(0, 0, 0, .04)
    }
   }
</style>
