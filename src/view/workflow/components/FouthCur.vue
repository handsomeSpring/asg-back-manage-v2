<template>
  <div>
    <!-- 操作区域 -->
    <div class="icon_btn">
       <i :class="grid" @click="toggleGrid"></i>
    </div>
    <transition name="run">
    <header class="clearfix" v-show="headVisible">
      <div class="item">
        <p>赞助金额：</p>
        <el-input v-model.number="money" style="width:100%;margin:10px 0" type="number" placeholder="请输入赞助金额">
          <template slot="prepend">积分：</template>
        </el-input>
        <el-button style="width:100%;margin:10px 0" type="primary" @click="check">查看<i class="el-icon-zoom-in"></i></el-button>
      </div>
      <div class="item">
        <p>视频稿件金额：</p>
        <el-input v-model.number="videoMoney" style="width:100%;margin:10px 0" type="number" placeholder="请输入稿件金额">
          <template slot="prepend"><i class="el-icon-document-add"></i></template>
        </el-input>
        <el-button style="width:100%;margin:10px 0" type="danger" @click="clear">清空<i class="el-icon-delete-solid"></i></el-button>
      </div>
      <div class="item">
        <el-progress
          type="dashboard"
          :percentage="percentage"
          :color="colors"
        ></el-progress>
        <div class="btnList">
          <p>赛事组 / 奖金</p>
        </div>
        <div class="btnList">
          <i class="el-icon-remove-outline" @click="decrease"></i>
          <i class="el-icon-circle-plus-outline" @click="increase"></i>
        </div>
      </div>
    </header>
    </transition>
    <el-row>
      <el-col :span="20">
        <el-row>
          <el-col :offset="10">
            <MoneyCard roleLabel="赛事组" curStep="赛事成员总金额" :money="teamMoney" :percent="100"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
          </el-col>
        </el-row>
        <!-- 第二层 -->
        <el-row>
          <el-col :span="4">
            <MoneyCard roleLabel="解说组" curStep="按出席场次分" :money="teamMoney" :percent="20"></MoneyCard>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
          <el-col :span="4" :offset="1">
            <MoneyCard roleLabel="导播组" curStep="按出席场次分" :money="teamMoney" :percent="30"></MoneyCard>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
          <el-col :span="4" :offset="1">
            <MoneyCard roleLabel="管理组" curStep="多劳多得" :money="teamMoney" :percent="20"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="管理人" curStep="赞助金额" :money="teamMoney" :percent="15"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="面试人" curStep="赞助金额" :money="teamMoney" :percent="15"></MoneyCard>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
          <el-col :span="4" :offset="1">
            <MoneyCard roleLabel="程序组" curStep="开发人员均分" :money="teamMoney" :percent="20"></MoneyCard>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
          <el-col :span="4" :offset="1">
            <MoneyCard roleLabel="宣传组" curStep="多劳多得" :money="teamMoney" :percent="10"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="海报" curStep="赞助金额+稿件金额" :money="teamMoney" :percent="5" :videoMoney="videoMoney"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="剪辑" curStep="赞助金额+稿件金额" :money="teamMoney" :percent="5" :videoMoney="videoMoney"></MoneyCard>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
          <el-col :span="3" :offset="1">
            <MoneyCard roleLabel="比赛选手" curStep="名次分配" :money="gameMoney" :percent="100"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="冠军" curStep="冠军奖金" :money="gameMoney" :percent="50"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="亚军" curStep="亚军奖金" :money="gameMoney" :percent="30"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="季军" curStep="季军奖金" :money="gameMoney" :percent="15"></MoneyCard>
            <p class="line_P"><i class="el-icon-bottom"></i></p>
            <MoneyCard roleLabel="殿军" curStep="殿军奖金" :money="gameMoney" :percent="5"></MoneyCard>
            <p class="line_O">结束<i class="el-icon-error"></i></p>
          </el-col>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import MoneyCard from "./MoneyCard.vue";
export default {
  name: "FouthCur",
  components: {
    MoneyCard,
  },
  methods:{
    increase() {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      },
      decrease() {
        this.percentage -= 10;
        if (this.percentage < 0) {
          this.percentage = 0;
        }
      },
      check(){
        this.teamMoney = this.money / 100 * this.percentage
        this.gameMoney = this.money / 100 * (100 - this.percentage)
      },
      clear(){
        this.percentage = 0,
        this.money=0,
        this.teamMoney=0,
        this.gameMoney=0,
        this.videoMoney=0
      },
      toggleGrid(){
        if(this.headVisible === true){
          this.headVisible = false
          this.grid ='el-icon-menu'
        }else{
          this.headVisible = true
          this.grid ='el-icon-s-grid'
        }
      }
  },
  data() {
    return {
      grid:'el-icon-s-grid',
      headVisible:true,
      percentage: 10,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      money:0,
      teamMoney:0,
      gameMoney:0,
      videoMoney:0
    };
  },
};
</script>

<style scoped lang="less">
header{
  display: flex;
  justify-content: center;
  padding-bottom:20px;
  margin-bottom: 20px;
  border-bottom:1px solid #ddd;
  gap:100px;
}
p{
  color:#898989;
}
.icon_btn{
  i{
    font-size: 28px;
    cursor:pointer;
    &:hover{
      color:rgb(237, 182, 80);
    }
  }
}
.btnList{
  text-align: center;
  i{
    font-size: 28px;
  }
}
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
.run-enter-active { 
   animation: bounce-in .8s; 
} 
/* 离开的时候要激活的样式 */
.run-leave-active { 
   animation: bounce-in .8s reverse;
}
@keyframes bounce-in {
   0% { 
      opacity:0; 
   } 
   100% { 
      opacity:1; 
   }
}
</style>
