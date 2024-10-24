<template>
  <div>
    <!-- 赛程表 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="赛程管理" name="first">
        <schedule-table ref="schedule" @operation="changeOperation" />
      </el-tab-pane>
      <el-tab-pane label="赛季管理" name="second">
        <SetSeason />
      </el-tab-pane>
    </el-tabs>
    <add-schedule :operationVisible.sync="operationVisible" :eventOptions="eventOptions" :instructor="instructor"
      :commentary="commentary" @onSuccess="onRefresh"></add-schedule>
  </div>
</template>

<script>
import { pushSchedule, getUserRoles } from "@/api/schedule/index";
import { getPlayerDetails } from "@/api/gameSeason/index.js"
import { getAllEvents } from "@/api/gameSeason/index";
import addSchedule from "@/view/schedule/components/addSchedule.vue"
export default {
  name: "seasonSchdule",
  data() {
    return {
      active: 1,
      allTeam: [],
      team1_name: "",
      team2_name: "",
      belong: "",
      tag: "", //赛程标签
      gameList: [],
      startTime: "",
      btnloading: false,
      scheduleData: [],
      referee: [], //裁判
      referee_value: "",
      commentary: [], //解说1
      commentary_value: [],
      instructor: [], //导播
      instructor_value: "",
      bilibiliuri: "",
      operationVisible: false,
      // 选项卡
      activeName: "first",
      eventOptions: [],
    };
  },
  components: {
    ScheduleTable: () => import("./components/ScheduleTable.vue"),
    SetSeason: () => import("./components/SetSeason.vue"),
    addSchedule,
  },
  watch: {
    belong(newValue) {
      if (!newValue) {
        this.gameList = [];
        return;
      }
      getPlayerDetails(newValue)
        .then(res => {
          this.gameList = [];
          this.gameList = res.data.map(item => ({ name: item.team_name, id: item.id }));
          this.gameList.unshift({ name: "TBD", id: new Date().getTime() })
        })
        .catch((err) => {
          this.$message.error(err)
        })
    }
  },
  methods: {
    onRefresh(belong) {
      this.operationVisible = false;
      this.$refs.schedule.belong = belong;
      this.$refs.schedule?.initSchedule(1, 10, belong);
    },
    changeOperation() {
      this.operationVisible = true;
    },

    // 发布
    // submit() {
    //   this.btnloading = true;
    //   this.setSchedule();
    // },
    // setSchedule() {
    //   const comMap = this.commentary_value.map(com => ({id:com.id,chinaname:com.chinaname}));
    //   const filterArr = comMap.filter(f => f.id !== 0);
    //   let commentary = JSON.stringify(filterArr);
    //   pushSchedule(
    //     this.team1_name,
    //     this.team2_name,
    //     this.startTime,
    //     this.belong,
    //     commentary,
    //     this.referee_value,
    //     this.bilibiliuri,
    //     this.tag
    //   )
    //     .then((res) => {
    //       this.$message.success(res.data);
    //       this.btnloading = false;
    //       this.$refs.schedule.belong = this.belong;
    //       this.$refs.schedule?.initSchedule(1, 10, this.belong);
    //       this.team1_name = "";
    //       this.team2_name = "";
    //       this.instructor_value = "";
    //       this.commentary_value = [];
    //       this.referee_value = "";
    //       this.tag = "";
    //       this.active = 1;
    //     })
    //     .catch(() => {
    //       this.$message.error("设置失败，请检查数据！");
    //       this.btnloading = false;
    //     });
    // },
    //获取解说列表
    initGetCommentary() {
      let params = {
        opname: "Commentator",
      };
      getUserRoles(params)
        .then((res) => {
          this.commentary = [];
          this.commentary.push({ chinaname: "待定", id: 0 });
          this.commentary = this.commentary.concat(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取裁判列表
    initGetReferee() {
      let params = {
        opname: "referees",
      };
      getUserRoles(params)
        .then((res) => {
          this.referee = [];
          this.referee.push({ chinaname: "待公布" });
          this.referee = this.referee.concat(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取导播列表
    initGetAnchor() {
      let params = {
        opname: "Anchor",
      };
      getUserRoles(params)
        .then((res) => {
          this.instructor = [];
          this.instructor.push({ chinaname: "待定" });
          this.instructor = this.instructor.concat(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // handleClick
    handleClick(tab) {
      this.activeName = tab.name;
    },
    // 获取赛季
    initSeason() {
      getAllEvents()
        .then((res) => {
          this.eventOptions = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  //METHOD结束
  created() {
    this.initGetCommentary();
    this.initGetAnchor();
    this.initGetReferee();
    this.initSeason();
  },
};
</script>

<style scoped lang="less">
.el-row {
  margin: 20px;
}

.el-input {
  width: 20%;
  margin: 10px;
}

.el-select {
  margin: 10px;
}

.btn_wrap {
  float: right;
}
</style>
