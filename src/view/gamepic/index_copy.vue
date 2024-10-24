<template>
  <div>
    <!-- banner -->
    <div class="banner">
      <img src="@/assets/logo.png" alt="" />
      <h2>ASG八强赛晋升图</h2>
    </div>
    <!-- 外部壳 -->
    <div class="wrapper">
      <!-- 顶部 -->
      <div class="header">
        <div class="tit"></div>
      </div>
      <!-- 比赛区域盒子 -->
      <div class="game-box">
        <!-- 第一个盒子 -->
        <div class="team red team_1">
          <p>FZU</p>
        </div>
        <!-- 第二个盒子 -->
        <div class="team blue team_2">
          <p>BFSU</p>
        </div>
        <!-- 第三个盒子 -->
        <div class="team red team_3">
          <p>ZYU</p>
        </div>
        <!-- 第四个盒子 -->
        <div class="team blue team_4">
          <p>厂川太子</p>
        </div>
        <!-- 第五个盒子 -->
        <div class="team red team_5">
          <p>NPU</p>
        </div>
        <!-- 第六个盒子 -->
        <div class="team blue team_6">
          <p>CUZ</p>
        </div>
        <!-- 第七个盒子 -->
        <div class="team red team_7">
          <p>XMU</p>
        </div>
        <!-- 第八个盒子 -->
        <div class="team blue team_8">
          <p>HCY</p>
        </div>
        <!-- 4-2盒子 -->
        <div class="team red team_4_1">
          <p>{{ form.dataI }}</p>
        </div>
        <!-- 4-2盒子 -->
        <div class="team blue team_4_2">
          <p>{{ form.dataJ }}</p>
        </div>
        <!-- 4-3盒子 -->
        <div class="team red team_4_3">
          <p>{{ form.dataK }}</p>
        </div>
        <!-- 4-4盒子 -->
        <div class="team blue team_4_4">
          <p>{{ form.dataL }}</p>
        </div>
        <!-- 2-1盒子 -->
        <div class="team red team_2_1">
          <p>{{ form.dataM }}</p>
        </div>
        <!-- 2-2盒子 -->
        <div class="team blue team_2_2">
          <p>{{ form.dataN }}</p>
        </div>
        <!-- 决赛盒子 -->
        <div class="team gold teamp">
          <p>{{ form.dataO }}</p>
        </div>
      </div>
      <!-- 操作区域盒子 -->
      <div class="operation">
        <!-- 填入区 -->
        <div class="insetion">
          <p>从上到下四个队(4-2)</p>
          <el-row>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataI" @blur="handleDataI"></el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataJ" @blur="handleDataJ"></el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataK" @blur="handleDataK"></el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataL" @blur="handleDataL"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="insetion">
          <p>从上到下俩个队(2-1)</p>
          <el-row>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataM" @blur="handleDataM"></el-input>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataN" @blur="handleDataN"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="insetion">
          <p>冠军</p>
          <el-row>
            <el-col :span="5" :offset="1">
              <el-input v-model="form.dataO" @blur="handleDataO"></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { openDB,addData,getDataByKey } from "@/utils/indexedDB.js"
export default {
  name: "GamePic",
  data() {
    return {
      db:null,
      form: {
        dataI: "TBD-I",
        dataJ: "TBD-J",
        dataK: "TBD-K",
        dataL: "TBD-L",
        dataM: "TBD-M",
        dataN: "TBD-N",
        dataO: "TBD-O",
      }
    };
  },
  created(){
    openDB("game",1)
    .then(db => {
      this.db = db
      getDataByKey(this.db,'games','I').then(res=>{
         this.form.dataI = res.name  
      })
      getDataByKey(this.db,'games','J').then(res=>{
         this.form.dataJ = res.name  
      })
      getDataByKey(this.db,'games','K').then(res=>{
         this.form.dataK = res.name  
      })
      getDataByKey(this.db,'games','L').then(res=>{
         this.form.dataL = res.name  
      })
      getDataByKey(this.db,'games','M').then(res=>{
         this.form.dataM = res.name  
      })
      getDataByKey(this.db,'games','N').then(res=>{
         this.form.dataN = res.name  
      })
      getDataByKey(this.db,'games','O').then(res=>{
         this.form.dataO = res.name  
      })
    })
  },
  methods:{
     handleDataI(){
       let data = {
           uuid:"I",
           name:this.form.dataI
         }
       addData(this.db,'games',data)
    },
    handleDataJ(){
       let data = {
           uuid:"J",
           name:this.form.dataJ
         }
       addData(this.db,'games',data)
    },
    handleDataK(){
       let data = {
           uuid:"K",
           name:this.form.dataK
         }
       addData(this.db,'games',data)
    },
    handleDataL(){
       let data = {
           uuid:"L",
           name:this.form.dataL
         }
       addData(this.db,'games',data)
    },
    handleDataM(){
       let data = {
           uuid:"M",
           name:this.form.dataM
         }
       addData(this.db,'games',data)
    },
    handleDataN(){
       let data = {
           uuid:"N",
           name:this.form.dataN
         }
       addData(this.db,'games',data)
    },
    handleDataO(){
       let data = {
           uuid:"O",
           name:this.form.dataO
         }
       addData(this.db,'games',data)
    },
  }
};
</script>

<style scoped lang="less">
.wrapper {
  height: 564px;
  width: 100%;
  box-sizing: border-box;
  border: 5px solid black;
  background: url("../../assets/gameBcg.png") center no-repeat;
}
.banner {
  width: 100%;
  height: 50px;
  background-color: #81aef2;
  position: relative;
  line-height: 50px;
}
.banner img {
  position: absolute;
  width: 30px;
  height: 30px;
  left: 20px;
  top: 10px;
}
.banner h2 {
  text-align: center;
}
.wrapper .header {
  width: 74%;
  height: 35px;
  margin: 30px auto 10px;
  border-bottom: 4px solid #444;
  position: relative;
}
.wrapper .header .tit {
  width: 227px;
  height: 74px;
  background: url("../../assets/title.png") center no-repeat;
  position: absolute;
  top: -10px;
}
.wrapper .game-box {
  height: 460px;
  width: 74%;
  margin: 0 auto;
  position: relative;
}

.wrapper .game-box .team {
  width: 142px;
  height: 30px;
  font-weight: 700;
  line-height: 30px;
  color: #cbb17f;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 25px;
}
.wrapper .game-box .team.red {
  border-left: 5px solid rgb(81, 44, 41);
  border-right: 5px solid rgb(81, 44, 41);
}
.wrapper .game-box .team.blue {
  border-left: 5px solid rgb(55, 52, 64);
  border-right: 5px solid rgb(55, 52, 64);
}
.wrapper .game-box .team.gold {
  width: 142px;
  height: 50px;
  line-height: 50px;
  border-left: 5px solid gold;
  border-right: 5px solid gold;
}
.wrapper .game-box .team.red.team_1 {
  position: absolute;
  top: 10px;
  left: 40px;
}

.wrapper .game-box .team.blue.team_2 {
  position: absolute;
  top: calc(10px + 30px + 20px);
  left: 40px;
}
.wrapper .game-box .team.red.team_3 {
  position: absolute;
  top: calc(10px + 2 * 30px + 20px + 40px);
  left: 40px;
}
.wrapper .game-box .team.blue.team_4 {
  position: absolute;
  top: calc(10px + 3 * 30px + 40px + 40px);
  left: 40px;
}
.wrapper .game-box .team.red.team_5 {
  position: absolute;
  top: calc(10px + 4 * 30px + 3 * 40px);
  left: 40px;
}
.wrapper .game-box .team.blue.team_6 {
  position: absolute;
  top: calc(10px + 5 * 30px + 3 * 40px + 20px);
  left: 40px;
}

.wrapper .game-box .team.red.team_7 {
  position: absolute;
  top: calc(10px + 6 * 30px + 4 * 40px + 20px);
  left: 40px;
}
.wrapper .game-box .team.blue.team_8 {
  position: absolute;
  top: calc(10px + 7 * 30px + 4 * 40px + 2 * 20px);
  left: 40px;
}
/* 4-2 */
.wrapper .game-box .team.red.team_4_1 {
  position: absolute;
  top: 35px;
  left: calc(40px + 142px + 150px);
}
.wrapper .game-box .team.blue.team_4_2 {
  position: absolute;
  top: calc(130px + 35px - 15px);
  left: calc(40px + 142px + 150px);
}
.wrapper .game-box .team.red.team_4_3 {
  position: absolute;
  top: calc(10px + 4 * 30px + 3 * 40px + 25px);
  left: calc(40px + 142px + 150px);
}
.wrapper .game-box .team.blue.team_4_4 {
  position: absolute;
  top: calc(10px + 6 * 30px + 4 * 40px + 20px + 25px);
  left: calc(40px + 142px + 150px);
}
.wrapper .game-box .team.red.team_2_1 {
  position: absolute;
  top: 95px;
  left: calc(40px + 2 * 142px + 300px);
}
.wrapper .game-box .team.blue.team_2_2 {
  position: absolute;
  bottom: 95px;
  left: calc(40px + 2 * 142px + 300px);
}
.wrapper .game-box .team.gold.teamp {
  position: absolute;
  top: calc(230px - 25px);
  left: calc(40px + 3 * 142px + 400px);
}

.wrapper .game-box .team p {
  font-size: 20px;
  width: 100%;
  display: block;
  text-align: center;
}

.wrapper .operation {
  position: relative;
  width: 80%;
  margin: 25px auto;
}
.wrapper .operation .insetion {
  width: 100%;
  margin:5px;
}
.insetion p {
    margin-bottom: 10px;
}
.wrapper .operation .insetion input {
  width: 11%;
  height: 25px;
  font-size: 18px;
  padding: 0 5px;
  color: red;
}
.wrapper .operation .insetion button {
  position: absolute;
  right: 20%;
  top: 50%;
  margin: 0 50px;
  width: 100px;
  height: 30px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: #102faf;
}
.wrapper .operation .insetion button:hover {
  background-color: #81aef2;
}

</style>
