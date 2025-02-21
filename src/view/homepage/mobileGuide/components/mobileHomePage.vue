<template>
  <div class="mobile-homepage-container">
    <AsgTipComponent type="primary">
      <p class="tip-comp-text">欢迎来到第五人格ASG赛事后台管理系统移动端，本系统主要用于管理赛事和导播\裁判选班，若有问题，请反馈给QQ：793651012。</p>
    </AsgTipComponent>
    <el-divider content-position="center">ASG三大系统</el-divider>
    <div class="list-comp active">第五人格ASG后台管理系统</div>
    <div class="list-comp" @click="routerToNew('https://commentary.idvasg.cn/')">第五人格ASG解说端</div>
    <div class="list-comp" @click="routerToNew('https://idvasg.cn/')">第五人格ASG官网</div>
    <el-divider content-position="center">ASG合作伙伴</el-divider>
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
  methods:{
    routerToNew(link){
      window.open(link,'_blank')
    }
  }
}
</script>
<style lang='less' scoped>
.mobile-homepage-container{
  margin:1em 0;
  padding:0 1em;
  .tip-comp-text{
    font-size:0.8em;
    color:#5E6D82;
    line-height:1.3em;
    text-indent: 2em;
  }
  .list-comp{
    width: 100%;
    border-radius: 12px;
    height:120px;
    margin:1.5em 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F2F6FC;
    color:#606266;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    &.active{
      background: #ECF8FF;
      border:2px dashed #50bfff;
    }
  }
}
</style>