<template>
  <div class="row_container">
    <header>
      <p class="smart_title">智能业务填报提示</p>
      <li
        class="line_row"
        v-for="(item, index) in bizTypeOptions"
        :key="item.value"
      >
        <p class="index_text">{{ index + 1 }}</p>
        <p class="bizTypeName">{{ item.label }}</p>
      </li>
      <div class="text-box">
        <p class="text">
          以上是所有配置审批规则的业务流程。当您手上有需要申请的业务，可以选择你要申请的业务，然后填报申请的描述，送审后即可开始走流程审批。
        </p>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: "helpAssignInfo",
  props: {
    bizTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="less">
.row_container {
  padding: 0 12px;
  .smart_title {
    padding-left: 12px;
    border-left: 5px solid #4090ef;
  }
  .line_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
    border-bottom: 1px solid #e4e4e5;
    .index_text {
      font-weight: 500;
      color: #bcbcbc;
      font-style: italic;
    }
    .bizTypeName {
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      line-height: 19px;
      text-align: left;
    }
  }
  .text-box {
    margin-top: 12px;
    background: #f0f7ff;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #d7e7f9;
    padding: 5px;
    .text {
      font-weight: 400;
      font-size: 14px;
    }
  }
}
</style>
