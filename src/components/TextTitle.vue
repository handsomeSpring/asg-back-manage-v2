<!-- 需求调查-供应商文字组件 -->
<template>
  <div class="text-wrap">
    <p class="pointer"></p>
    <p :style="{color:color}" class="text">{{ titleName }}</p>
  </div>
</template>

<script>
export default {
  name: "TextTitle",
  props: {
    titleName: {
      type: String,
      default: ""
    },
    color:{
      type:String,
      default:'#000'
    }
  },
  
};
</script>

<style scoped lang="less">
.text-wrap {
  display: flex;
  justify-content: start;
  align-items: center;
  .pointer {
    width: 8px;
    height: 16px;
    border-radius: 40%;
    margin-right: 12px;
    background-image: linear-gradient(to bottom, #6cccf7, #18aff1);
  }
  .text {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
