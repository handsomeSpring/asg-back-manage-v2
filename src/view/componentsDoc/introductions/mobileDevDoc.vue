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
        <el-divider content-position="left">兼容移动端请使用公共组件</el-divider>
        <el-button type="primary" @click="showComponent('AsgMobileTableDoc')">移动端表格-点击前往查看</el-button>
        <el-button type="primary" @click="showComponent('AsgMobilePageDoc')">移动端分页-点击前往查看</el-button>
        <el-divider content-position="left">移动端兼容常用方法</el-divider>
        <el-table :data="tableData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="内容" prop="name" align="center"></el-table-column>
            <el-table-column label="描述" prop="doc" align="center"></el-table-column>
            <el-table-column label="例子" prop="exam" align="center"></el-table-column>
        </el-table>
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
  data(){
    return{
        tableData:[
            {
                name:'像素转换',
                doc:'使用一些响应式的单位来替代px。',
                exam:'vh,vw,em,rem,%,1em = 16px类似这样。'
            },
            {
                name:'响应式布局',
                doc:'使用flex或者grid或者%布局，而非用px。',
                exam:'例如display:flex;或者width:90%;注意，如果要描述高度，请使用dvh(动态高度，跟vh相比，去掉了手机下面的搜索栏计算的全屏)。'
            },
            {
                name:'很难用样式兼容的布局使用v-if写两份',
                doc:'使用isMobile()方法来鉴别是否是移动端，若是，则用v-if区分移动端页面和pc端页面。',
                exam:"import { isMobile } from '@/utils';"
            },
            {
                name:'组件替换',
                doc:'使用移动端组件替换pc端组件。',
                exam:"例如，利用我们mobileTable替换el-table。"
            },
            {
                name:'媒体查询',
                doc:'使用@media写一份移动端样式。',
                exam:"例如，在src/assets/mobileStyles文件夹下创建一个highSearch/index.less文件，在里面写移动端的样式，然后在highSearch/index.vue里引入该less文件即可。"
            }
        ]
    }
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