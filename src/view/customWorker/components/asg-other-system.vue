<template>
     <el-scrollbar class="comp__container--absolute">
        <TextTitle title-name="系统信息"></TextTitle>
        <li><span class="dot"></span><el-link type="primary" href="https://commentary.idvasg.cn">第五人格ASG赛事解说选班系统 </el-link></li>
        <li><span class="dot"></span><el-link type="primary" href="https://idvasg.cn">第五人格ASG赛事官网 </el-link></li>
        <el-divider></el-divider>
        <li>© 2024 - 2025 Avengers Gaming CopyRight</li>
        <li>ICP备案：鄂ICP备2024037646号-1</li>
     </el-scrollbar>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
export default {
  name:'asgOtherSystem',
  text:'ASG其他系统',
   components:{
    TextTitle
   },
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;

    li{
        margin:16px 0;
        .dot{
          display: inline-block;
          width: 5px;
          height:5px;
          background: #4090EF;
          border-radius: 50%;
          margin-right: 12px;
        }

    }
}
</style>