<template>
  <div>
    <el-row>
      <el-col :span=3 :offset="1">
        <Card roleLabel="导播" curStep="后台管理系统选班"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="排班人" curStep="督促导播进行选班"></Card>
        <p class="line_O">结束<i class="el-icon-error"></i></p>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="裁判长" curStep="发起裁判通知"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="裁判" curStep="同意出席"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="裁判长" curStep="填写后台系统赛程"></Card>
        <p class="line_O">结束<i class="el-icon-error"></i></p>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="解说" curStep="解说进行选班"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="解说负责人" curStep="督促解说选班进行"></Card>
        <p class="line_O">结束<i class="el-icon-error"></i></p>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="赛程排班人" curStep="及时确认双方参赛时间，发布赛程信息"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="主办方" curStep="确认赛程信息，并通知导播裁判解说管理人督促选班"></Card>
        <p class="line_O">结束<i class="el-icon-error"></i></p>
      </el-col>
      <el-col :span=3 :offset="1">
        <Card roleLabel="申请者" curStep="发起业务申请流程"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="相关面试者" curStep="关联申请发起业务审批流程"></Card>
        <p class="line_O">结束<i class="el-icon-error"></i></p>
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
.line_O{
  width: 130px;
  text-align: center;
  font-size: 14px;
  color: #238eb8;
}
</style>
