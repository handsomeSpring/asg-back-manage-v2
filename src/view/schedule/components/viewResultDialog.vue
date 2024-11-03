<template>
    <el-dialog title="查看赛果" width="50%" :visible="visible" @close="closeDialog" @open="handleOpen">
      <div class="dialog__body--header">
        <p>本场比赛获胜队伍是<span class="fontWeight">{{ gameResult.winteam }}</span></p>
      </div>
      <div class="dialog__body--score">
        <template v-if="!gameScoreInfo">
          <el-empty description="该场比赛没有登记赛果"></el-empty>
        </template>
        <template v-else>
          <table class="score-table">
            <thead>
              <tr>
                <th colspan="6">比赛得分</th>
              </tr>
              <tr>
                <th>Game</th>
                <th>选边情况</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(score, index) in gameScoreInfo" :key="index">
                <td>Game {{ index + 1 }}</td>
                <td class="centered-content">{{ score.side === '1' ? '屠先' : '人先' }}</td>
                <td class="centered-content">
                  <span v-if="score.side === '1'">{{ score.topHalfLeft }} - {{ score.topHalfRight }}</span>
                  <span v-else>{{ score.topHalfRight }} - {{ score.topHalfLeft }}</span>
                </td>
                <td class="centered-content">
                  <span v-if="score.side === '1'">{{ score.bottomHalfLeft }} - {{ score.bottomHalfRight }}</span>
                  <span v-else>{{ score.bottomHalfRight }} - {{ score.bottomHalfLeft }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </el-dialog>
  </template>
  
  <script>
  export default {
    name: 'viewResultDialog',
    data() {
      return {
        gameScoreInfo: [
          { "side": "1", "topHalfLeft": 0, "topHalfRight": 5, "bottomHalfLeft": 5, "bottomHalfRight": 0 },
          { "side": "2", "topHalfLeft": 2, "topHalfRight": 2, "bottomHalfLeft": 2, "bottomHalfRight": 2 },
          { "side": "1", "topHalfLeft": 1, "topHalfRight": 3, "bottomHalfLeft": 1, "bottomHalfRight": 3 }
        ]
      };
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      gameResult: {
        type: Object,
        default: () => { }
      }
    },
    computed: {
      visible: {
        get() {
          return this.dialogVisible;
        },
        set(val) {
          this.$emit('update:dialogVisible', val);
        }
      },
    },
    methods: {
      handleOpen() {
        this.gameScoreInfo = !!this.gameResult.final_score ? JSON.parse(this.gameResult?.final_score ?? '[]') : void 0;
        console.log(this.gameScoreInfo, 'this.gameScoreInfo');
      },
      closeDialog() {
        this.visible = false;
      }
    },
  }
  </script>
  
  <style lang='less' scoped>
  .dialog__body--header {
    margin: 20px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #e7e7e7;
  
    .fontWeight {
      color: #4090EF;
      font-weight: bold;
      font-size: 1.5rem;
      margin-left: 16px;
    }
  }
  
  .score-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  
    tr {
      border-bottom: 1px solid #e7e7e7;
    }
  
    th,
    td {
      padding: 15px;
      text-align: center;
      border: 1px solid #e7e7e7;
    }
  
    th {
      background-color: #f2f2f2;
    }
  
    .centered-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  </style>