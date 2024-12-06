<template>
  <div class="status-grid-container">
    <div class="grid-item" v-for="(item, index) in list" :key="index">
      <div class="label">{{ item.label }}</div>
      <div class="circle" :class="item.status < Number(status) ? '' : item.status === Number(status) ? 'process' : 'wait'">
        <div class="inner" v-if="item.status === Number(status)"></div>
        <i class="el-icon-check" v-if="item.status < Number(status)"></i>
      </div>
      <div class="line" :class="item.status < Number(status) ? '' : item.status === Number(status) ? 'process' : 'wait'"></div>
    </div>
    <div class="grid-item">
      <div class="label">已结束</div>
      <div class="circle" :class="status === '5' ? 'over' : 'wait'">
        <i class="el-icon-finished"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AsgProgress",
  props: {
    status: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      list: [
        {
          label: "筹备中",
          status: 0,
        },
        {
          label: "报名中",
          status: 1,
        },
        {
          label: "建联期",
          status: 2,
        },
        {
          label: "公示中",
          status: 3,
        },
        {
          label: "进行中",
          status: 4,
        }
      ],
    };
  },
};
</script>

<style scoped lang="less">
.status-grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  width: 100%;
  .grid-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    height: 40px;
    .label {
      position: absolute;
      bottom: 40px;
      left: 0;
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
    .circle {
      background: #64d13b;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      flex-shrink: 0;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      .inner{
        width:10px;
        height:10px;
        background:#fff;
        border-radius:50%;
      }
      &.process{
        background: #4090ef;
      }
      &.wait{
        background:#979797;
      }
      &.over{
        background:#f40;
      }
    }
    .line {
      height: 3px;
      background: #64d13b;
      width: 100%;
      margin: 0 12px;
      &.process{
        background: #4090ef;
      }
      &.wait{
        background:#979797;
      }
    }
  }
}
</style>
