<template>
  <div>
    <schedule-table v-if="isIndexPage" ref="schedule" @toDetail="toDetail" :tagOptions="tagOptions"
      :personGroup="personOptions" :groupOptions="groupOptions" />
    <detailSchedule v-else :personGroups="personOptions" :formType="formType" :formRow="formRow" :tagOptions="tagOptions"
      :eventOptions="eventOptions" @onSuccess="onRefresh" :groupOptions="groupOptions"></detailSchedule>
  </div>
</template>

<script>
import { getAllEvents } from "@/api/gameSeason/index";
import detailSchedule from "@/view/schedule/components/detailSchedule.vue";
import { getByTitle } from "@/api/config";
import ScheduleTable from "./components/ScheduleTable.vue";
export default {
  name: "scheduleList",
  components: {
    ScheduleTable,
    detailSchedule,
  },
  data() {
    return {
      isIndexPage: true,
      // 选项卡
      eventOptions: [],
      tagOptions: [],
      formType: 'add',
      formRow: {},
      // 传参
      groupOptions: [],
      personOptions: [],
    };
  },
  methods: {
    onRefresh() {
      this.isIndexPage = true;
    },
    toDetail(type, row) {
      this.formType = type;
      this.formRow = row;
      this.isIndexPage = false;
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
    getByTitle('scheduleType').then(res => {
      this.tagOptions = res.data;
    })
    getByTitle("gameComposition").then(res => {
      this.personOptions = res.data;
    })
    getByTitle("qqGroup").then(res => {
      this.groupOptions = res.data;
    })
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
