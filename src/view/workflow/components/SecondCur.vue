<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :offset="10">
            <Card roleLabel="申请者" curStep="官网/解说端发起业务申请"></Card>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">
            <Card
              roleLabel="导播负责人"
              curStep="关联业务申请发起业务流程审批"
            ></Card>
          </el-col>
          <el-col :span="6">
            <Card
              roleLabel="裁判负责人"
              curStep="关联业务申请发起业务流程审批"
            ></Card>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <el-row>
              <Card
                roleLabel="解说负责人"
                curStep="关联发起业务流程审批"
              ></Card>
              <p class="line_P"><i class="el-icon-bottom"></i></p>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="10">
            <Card
              roleLabel="业务流程节点"
              curStep="各节点审批及时审批流程让流程进行"
            ></Card>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
          <el-col :span="6">
            <Card
              roleLabel="解说负责人"
              curStep="在解说审核模块，对新解说进行审批"
            ></Card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
            <Card roleLabel="主办方" curStep="主办方最后确认是否入选"></Card>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="10">
            <Card roleLabel="申请人" curStep="入选或者淘汰"></Card>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :offset="6">
        <Card roleLabel="超级管理员" curStep="创建业务审批流程"></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card
          roleLabel="开发负责人"
          curStep="确认该流程可以进行"
        ></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card
          roleLabel="超级管理员"
          curStep="公布新业务审批流程给相应节点审批负责人"
        ></Card>
        <p class="line_P"><i class="el-icon-bottom"></i></p>
        <Card roleLabel="审批负责人" curStep="关注审批节点进行情况"></Card>
        <p class="line_O">结束<i class="el-icon-error"></i></p>
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
.line_O {
  width: 130px;
  text-align: center;
  font-size: 14px;
  color: #238eb8;
}
</style>
