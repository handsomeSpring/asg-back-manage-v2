<template>
  <div class="mode_container">
    <div class="mode_choose">
      <div
        class="flex-item"
        :class="mode === '1' ? 'active' : ''"
        @click="handleClick('1')"
      >
        <p>淘汰赛</p>
      </div>
      <div
        class="flex-item"
        :class="mode === '2' ? 'active' : ''"
        @click="handleClick('2')"
      >
        <p>小组赛</p>
      </div>
    </div>
    <p v-show="mode" class="text_title">
      您选择的是{{ mode === "1" ? "淘汰赛" : "小组赛" }},请设置{{
        mode === "1" ? "淘汰场次" : "小组组数"
      }}
    </p>
    <template v-if="mode">
      <label>抽取的{{ mode === "1" ? "淘汰场次" : "组数" }}</label>
      <el-input-number
        size="small"
        v-model="groupNumber"
        :min="1"
        label="请输入分组数量"
      ></el-input-number>
    </template>
  </div>
</template>

<script>
export default {
  name: "BallotModeChoose",
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
    background: linear-gradient(
      180deg,
      #226af1 0%,
      rgba(108, 178, 255, 0.1) 100%
    );
    border-radius: 6px;
    flex-shrink: 0;
    width: 290px;
    height: 148px;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid rgb(255, 255, 255);
    &.active {
      border-color: #f40;
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
.text_title {
  padding-left: 12px;
  border-left: 5px solid #226af1;
  margin: 15px 0;
}
label{
  margin-right: 12px;
}
</style>
