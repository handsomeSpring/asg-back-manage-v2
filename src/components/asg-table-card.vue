<template>
  <div class="asg-table-card">
    <div class="asg-table-card_header">
      <slot name="header"></slot>
    </div>
    <div class="asg-table-card_content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "asg-table-card",
};
</script>

<style scoped lang="less">
.asg-table-card {
  margin: 12px 0;
  border: 1px solid #b3d4ff;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
}

.asg-table-card_header {
  cursor: pointer;
  height: 40px;
  border-radius: 6px 6px 0 0 ;
  background: linear-gradient(172deg,
      #b3d4ff 0%,
      rgba(255, 255, 255, 0) 93%);
  border-bottom: 1px solid;
  border-image: linear-gradient(172deg,
      #b3d4ff 0%,
      rgba(255, 255, 255, 0) 93%);
  border-bottom: 1px solid #ddd;
  width: 100%;
}

</style>
