<template>
  <div>
    <el-row>
      <el-col :span=12>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="开始" curStep="发布众投下一届主策划提案"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="对应赛道主办方" curStep="确认可以开始竞选"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="导播组成员" curStep="给予一定投票1/4"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="赛事组成员" curStep="给予一定投票1/2"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
              <Card roleLabel="常驻解说" curStep="给予一定投票1/4"></Card>
              <p class="line_P"><i class="el-icon-bottom"></i></p>    
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="导播组成员" curStep="整理投票方案给赛事组"></Card>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="主办方" curStep="汇总投票数量和比例"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
              <Card roleLabel="常驻解说" curStep="整理投票方案给赛事组"></Card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="主策划" curStep="众投出下一届主策划"></Card>
           <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
      </el-col>
      <!-- 右侧 -->
      <el-col :span=12>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="任何人" curStep="向成员踢出赛事提案"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="10">
           <Card roleLabel="浊泉" curStep="审核踢出赛事的原因以及违规事项"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
           <Card roleLabel="若无违规情况" curStep="拒绝提案"></Card>
           <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
          <el-col :span="6">
           <Card roleLabel="若违规且有待商榷" curStep="进入下一步众投"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <Card roleLabel="若违规且情节严重" curStep="直接生效提案"></Card>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="赛事组" curStep="众人投票决策"></Card>
           <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
           <Card roleLabel="终审" curStep="同意/拒绝提案"></Card>
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
