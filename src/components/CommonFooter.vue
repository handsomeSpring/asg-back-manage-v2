<template>
    <el-footer v-show="!hiddenFooter.includes($route.fullPath)">
        <p>© 2024 - 2025 Avengers Gaming CopyRight</p>
        <p><a style="color:#111" href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2024037646号-1</a></p>
    </el-footer>
</template>

<script>
export default {
    name: 'CommonFooter',
    data(){
      return{
        hiddenFooter:[
          '/index/budget',
          '/index'
        ]
      }
    }
}
</script>
<style lang='less' scoped>
.el-footer {
  height: 70px !important;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap:6px 0;
  p {
    font-size: 13px;
    color: #303030;
  }
}
</style>