<template>
  <div>
    <el-row>
      <el-col :span=12>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="主办方：星宇" curStep="发起高校赛主办"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="导播" curStep="准备出席导播工作"></Card>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="赛程安排者" curStep="安排赛程、通知报名"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <el-row>
              <Card roleLabel="裁判长" curStep="安排裁判、解说工作"></Card>
              <p class="line_P"><i class="el-icon-bottom"></i></p>
            </el-row>       
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="10">
           <Card roleLabel="解说" curStep="同意出席"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="裁判" curStep="同意出席"></Card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="排班" curStep="排班赛程"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="星宇" curStep="主办方发布奖励"></Card>
           <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span=12>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="主办方：落梨" curStep="发起众创赛主办"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="导播" curStep="准备出席导播工作"></Card>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="赛程安排者" curStep="安排赛程、通知报名"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <el-row>
              <Card roleLabel="裁判长" curStep="安排裁判、解说工作"></Card>
              <p class="line_P"><i class="el-icon-bottom"></i></p>
            </el-row>       
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="10">
           <Card roleLabel="解说" curStep="同意出席"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="裁判" curStep="同意出席"></Card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="排班" curStep="排班赛程"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="落梨" curStep="主办方发布奖励"></Card>
           <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Card from "./Card.vue";
export default {
  name: "FirstCur",
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
