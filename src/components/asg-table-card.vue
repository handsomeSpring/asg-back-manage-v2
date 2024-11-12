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
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}
.asg-table-card_header {
  cursor: pointer;
  height: 40px;
  background: #F1F2F6;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid #ddd;
  width: 100%;
  &:hover {
    background-color: #f2f6fd;
  }
}
.asg-table-card_content {
  background: linear-gradient(180deg, #e5f0ff 0%, #ffffff 30%);
}
</style>
