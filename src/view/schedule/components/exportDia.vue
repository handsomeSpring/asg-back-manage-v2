<template>
  <div>
    <el-button
      style="margin:0 12px"
      size="mini"
      type="primary"
      @click="openDialog"
      >赛程直览<i class="el-icon-share"></i></el-button
    >
    <el-dialog
      :visible.sync="exportVisible"
      title="导出赛程"
      :fullscreen="true"
      @open="initSchedule"
      @close="exportVisible = false"
    >
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        size="mini"
        @click="exportData(scheduleData, `${belong}赛程表`)"
        >导出excel</el-button
      >
      <el-table border :data="scheduleData" style="width: 100%">
        <el-table-column
          prop="opentime"
          label="比赛时间"
          :formatter="format"
          width="auto"
        >
        </el-table-column>
        <el-table-column prop="team1_name" label="战队1" width="auto">
        </el-table-column>
        <el-table-column prop="team2_name" label="战队2" width="auto">
        </el-table-column>
        <el-table-column label="解说" width="auto">
          <template #default="{row}">
            {{ handleCom(row.commentary) }}
          </template>
        </el-table-column>
        <el-table-column label="裁判" width="auto">
          <template #default="{row}">
            <span>{{ row.judge ? row.judge : '无裁判' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="referee" label="导播" width="auto">
        </el-table-column>
        <el-table-column prop="remarks" label="备注" width="250">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { getSchedule } from "@/api/schedule/index";
export default {
  name: "exportDia",
  data() {
    return {
      exportVisible: false,
      scheduleData: [],
    };
  },
  props: {
    belong: {
      type: String,
      default: "all",
    },
  },
  watch: {
    belong: {
      handler() {
        this.initSchedule();
      },
    },
  },
  methods: {
    openDialog() {
      if(!this.belong || this.belong === 'all'){
          this.$message.error("请选择一个赛季进行导出！")
      }else{
        this.exportVisible = true;
      }
      
    },
    initSchedule() {
      getSchedule(1, 999, this.belong)
        .then((res) => {
          this.scheduleData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    format(row, column, cellValue) {
      let year = cellValue.slice(0, 4);
      let month = cellValue.slice(5, 7);
      let day = cellValue.slice(8, 10);
      let time = cellValue.slice(11, 16);
      return year + "年" + month + "月" + day + "日" + " " + time + ":00";
    },
    exportData(data, fileName) {
      data.forEach((element) => {
        delete element.id;
        delete element.team1_piaoshu;
        delete element.team2_piaoshu;
        delete element.bilibiliuri;
        delete element.belong;
        delete element.logs;
      });
      let ws = XLSX.utils.json_to_sheet(data);
      ws["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 50 },
        { wch: 15 },
      ];
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "战队信息表");
      XLSX.writeFile(wb, fileName + ".xlsx");
    },
    handleCom(row){
      const arr = JSON.parse(row);
      const comMap = arr.map(item => item.chinaname);
      return comMap.join(",")
    },
  },
};
</script>

<style scoped lang="less"></style>
