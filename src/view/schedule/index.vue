<template>
  <div>
    <schedule-table ref="schedule" @operation="changeOperation" :tagOptions=tagOptions />
    <add-schedule
      :operationVisible.sync="operationVisible"
      :tagOptions="tagOptions"
      :eventOptions="eventOptions"
      :instructor="instructor"
      :commentary="commentary"
      @onSuccess="onRefresh"
    ></add-schedule>
  </div>
</template>

<script>
import { getUserRoles } from "@/api/schedule/index";
import { getPlayerDetails } from "@/api/gameSeason/index.js"
import { getAllEvents } from "@/api/gameSeason/index";
import addSchedule from "@/view/schedule/components/addSchedule.vue";
import { getByTitle } from "@/api/config";
import  ScheduleTable from"./components/ScheduleTable.vue";
export default {
  name: "scheduleList",
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
      tagOptions: [],
    };
  },
  components: {
    ScheduleTable,
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
    getByTitle('scheduleType').then(res=>{
      this.tagOptions = res.data;
    })
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
