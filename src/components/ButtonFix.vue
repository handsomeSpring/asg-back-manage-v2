<template>
<!--
   * @Description: 用于固定fixed底部的按钮，解决切换路由时按钮抖动问题
   * @Version: feature_market
   * @Author: fangyunong
   * @Date: 2023-10-26 10:29:27
   * @use: 全局注册该组件，使用<button-fix>中间传入fixed定位的按钮</button-fix>
-->
  <div class="footer-wrap" :style="{ 'height':`${customHeight}px` }">
    <slot></slot>
  </div>
</template>

<script>
export default {
   name: 'ButtonFix',
   props:{
    customHeight:{
      type:Number,
      default:30
    }
   },
   mounted() {
     const node = this.$mount().$el
     document.body.appendChild(node)
   },
   destroyed() {
     const node = this.$mount().$el
     node.remove();
   },

}
</script>

<style scoped lang="less">
.footer-wrap{
  position:fixed;
  bottom: 0px;
  width: calc(100% - 208px);
  margin-left:200px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap:20px;
  box-shadow: 0 -2px 2px #f5f5f5;
  padding: 5px;
  background-color: #FFFFFF;
  text-align: center;
  background-color: hsla(0, 0%, 100%, 0.9);
}
</style>
