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
  margin:10px 0;
  border: 1px solid #ddd;
}
.asg-table-card_header {
  cursor:pointer;
  height: 40px;
  background-color: rgb(239, 239, 239);
  border-bottom: 1px solid #ddd;
  width: 100%;
  &:hover {
    background-color: #f2f6fd;
  }
}
</style>
