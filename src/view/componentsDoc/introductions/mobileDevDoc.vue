<template>
    <div>
        <TextTitle class="custom-my-1" title-name="解说端移动端开发"></TextTitle>
        <AsgTipComponent type="warning">
            <p class="p-l">解说端开发没有什么特别需要注意的，只需要把调试页面调成移动端开发即可，使用响应式布局，不要写死“px”即可。</p>
        </AsgTipComponent>
        <TextTitle class="custom-my-1" title-name="兼容后台系统移动端开发"></TextTitle>
        <AsgTipComponent type="warning">
            <p class="p-l">兼容后台系统移动开发，需要在菜单配置把需要兼容的模块调成双端，可以联系星宇调控。
                然后跟解说端一样，把调试网站改成移动端，然后进行代码开发。
                使用媒体查询编写代码，在项目文件夹<span class="font-special">src\assets\mobileStyles</span>下新建文件夹编写你需要兼容的模块
                移动端css代码，然后在该模块引入该移动端css代码。
            </p>
        </AsgTipComponent>
        <TextTitle class="custom-my-1" title-name="兼容移动端请使用公共组件"></TextTitle>
        <el-button type="primary" @click="showComponent('AsgMobileTableDoc')">移动端表格-点击前往查看</el-button>
        <el-button type="primary" @click="showComponent('AsgMobilePageDoc')">移动端分页-点击前往查看</el-button>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
  name:'mobileDevDoc',
  text:'移动端开发规范',
  components:{
    TextTitle,
    AsgTipComponent
  },
  methods: {
    showComponent(type){
        console.log(
            '传递',
            type
        );
        this.$emit('changePage',type);
    }
  }
}
</script>
<style lang='less' scoped>
.p-l{
    text-indent: 2em;
}
.font-special{
    font-weight: 600;
    font-family: 'hk';
    color:#4090EF;
    margin:0 1em;
    text-decoration: underline;
    text-underline-offset: 0.5em;
}
</style>