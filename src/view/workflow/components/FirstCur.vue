<template>
  <div>
    <el-row>
      <el-col :span=3 :offset="1">
        <Card roleLabel="导播" curStep="发起直播流程"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="排班" curStep="填写后台系统"></Card>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="裁判长" curStep="发起裁判通知"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="裁判" curStep="同意出席"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="排班" curStep="填写后台系统"></Card>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="解说负责人" curStep="发起解说招募"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="解说" curStep="同意出席"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="排班" curStep="填写后台系统"></Card>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="赛程排班" curStep="发起排班流程"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="主办方" curStep="审核流程"></Card>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="面试者" curStep="发起面试流程"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="面试官" curStep="发布审核流程"></Card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Card from "./Card.vue";
export default {
  name: "SecondCur",
  components: {
    Card,
  },
};
</script>

<style scoped lang="less">
.line_P {
  width: 130px;
  text-align: center;
  font-size: 25px;
  color: #67c23a;
}
</style>
