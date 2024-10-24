<template>
  <div>
    <el-row>
      <el-col :span=12>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="解说面试者" curStep="向柴瞳提出申请"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="柴瞳" curStep="第一轮面试审核"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="赛事组成员" curStep="第二轮面试审核"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="落梨、柴瞳" curStep="第二轮面试审核"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <el-row>
              <Card roleLabel="其他常驻解说" curStep="第二轮面试审核"></Card>
              <p class="line_P"><i class="el-icon-bottom"></i></p>
            </el-row>       
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="赛事组成员" curStep="提议"></Card>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="落梨、柴瞳" curStep="决定性审核"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <el-row>
              <Card roleLabel="其他常驻解说" curStep="提议"></Card>
            </el-row>       
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="解说" curStep="录用 or 拒绝"></Card>
           <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
      </el-col>
      <!-- 右侧 -->
      <el-col :span=12>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="赛事组面试者" curStep="向落梨发起面试申请"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="10">
           <Card roleLabel="面试者" curStep="给出特长"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="罗澜" curStep="面试特长（编程）"></Card>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="落梨" curStep="面试特长（管理）"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <el-row>
              <Card roleLabel="星宇" curStep="面试特长（剪辑）"></Card>
            </el-row>  
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="落梨" curStep="同意\拒绝加入"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="浊泉" curStep="同意\拒绝加入"></Card>
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
  name: "ThirdCur",
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
