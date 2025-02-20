<template>
  <div>
    <el-carousel height="150px">
      <el-carousel-item v-for="item in carousel" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    <AsgTipComponent type="warning">
      菜单在右上角哦~点击查看菜单！
    </AsgTipComponent>
  </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
  name: 'mobileHomePage',
  components:{
    AsgTipComponent
  },
  data() {
    return {
      carousel: [
        '欢迎来到第五人格ASG赛事后台管理系统',
        '首页开发中'
      ]
    };
  },
}
</script>
<style lang='less' scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>