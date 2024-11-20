<template>
  <div>
    <div class="container">
      <div class="header">
        <p>{{ roleLabel }}</p>
      </div>
      <div class="body">
        <p>{{ curStep }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    // 职位标签
    roleLabel: {
      type: String,
      default: "",
    },
    curStep: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 130px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    border-color: #40a9ff;
  }
  .header {
    color: #fff;
    padding: 3px 12px;
    font-size: 13px;
    font-weight: 500;
    background: rgb(255, 148, 62);
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    padding:3px 6px;
    color: #737373;
    min-height: 35px;
  }
}
</style>
