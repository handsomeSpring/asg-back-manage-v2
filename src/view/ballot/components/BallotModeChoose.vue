<template>
  <div class="mode_container">
    <div class="mode_choose">
      <div class="flex-item" :class="mode === '1' ? 'active' : ''" @click="handleClick('1')">
        <p>淘汰赛</p>
      </div>
      <div class="flex-item" :class="mode === '2' ? 'active' : ''" @click="handleClick('2')">
        <p>小组赛</p>
      </div>
    </div>
    <AsgTipComponent type="warning">
      <p class="tip-text">您的选择是：<span class="specal-text">{{ mode ? (mode === "1" ? "淘汰赛" : "小组赛") : '未选择模式' }}</span></p>
      <p class="tip-text">小组赛和淘汰赛将区分后续抽签模式，如果选择是小组赛，则将进行小组组数设置；如果选择是淘汰赛，将进行淘汰场次设置。</p>
    </AsgTipComponent>
    <template v-if="mode">
      <label>抽取的{{ mode === "1" ? "淘汰场次" : "组数" }}</label>
      <el-input-number size="small" v-model="groupNumber" :min="1" label="请输入分组数量"></el-input-number>
    </template>
  </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
  name: "BallotModeChoose",
  components: {
    AsgTipComponent
  },
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      groupNumber: 1,
    };
  },
  methods: {
    handleClick(type) {
      this.$emit("update:mode", type);
    },
  },
};
</script>

<style scoped lang="less">
.mode_choose {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;

  .flex-item {
    cursor:pointer;
    background: linear-gradient(180deg,
        #226af1 0%,
        rgba(108, 178, 255, 0.1) 100%);
    border-radius: 6px;
    flex-shrink: 0;
    width: 290px;
    height: 148px;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid rgb(255, 255, 255);

    &.active {
      border-color: #ff943e;
    }

    display: flex;
    justify-content: center;
    align-items: center;

    p {
      font-size: 28px;
      font-weight: bold;
    }
  }
}

label {
  margin-right: 12px;
  font-size: 14px;
  font-weight: 600;
}

.tip-text {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
  font-weight: 600;
  .specal-text{
    color:#4090EF;
  }
}
</style>
