<template>
  <div>
    <div class="container">
        <div class="box">
            <h1>404!</h1>
            <p>没有权限，页面丢失了~</p>
            <el-button type="danger" @click="backToLogin" size="mini">返回登录页面</el-button>
        </div>
        <div class="box">
            <span><i class="el-icon-question"></i></span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
   name: 'Err',
   methods:{
    backToLogin(){
        this.$router.push({path:"/login"})
    }
   }
}
</script>

<style scoped lang="less">
   .container{
     background-color: #ddd;
     background-attachment: fixed;
     height:100vh;
     width:100vw;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .box{
      h1{
        font-size: 98px;
        color:#3f3f3f
      }
      p{
        font-size: 28px;
        margin:10px 0;
      }
      span{
        margin-left:20px;
        color:#a65330;
        font-size: 128px;
      }
   }
</style>
