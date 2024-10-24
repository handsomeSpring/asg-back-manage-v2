<template>
  <div>
    <header>
      <el-select v-model="eventname" size="small" placeholder="请选择赛季" @change="handleChange">
        <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name">
        </el-option>
      </el-select>

      <div>
        <el-button size="small" type="warning" @click="downloadLogos">批量下载logo<i
            class="el-icon-download"></i></el-button>
        <el-button size="small" type="success" @click="exportDetails">导出队伍所有信息<i
            class="el-icon-download"></i></el-button>
        <el-button size="small" type="success" @click="exportData(tableData, `${eventname}战队信息表`)">导出excel表格<i
            class="el-icon-download"></i></el-button>
        <el-button size="small" type="danger" plain @click="handleClear">清除服务器文件<i
            class="el-icon-delete"></i></el-button>
      </div>
    </header>
    <!-- 表格 -->
    <el-scrollbar style="height:70vh">
      <el-table size="small" border v-loading="loading" :span-method="mergeRowMethod" :data="tableData"
        style="width: 100%">
        <el-table-column label="所属赛季" prop="赛季名" width="150">
        </el-table-column>
        <el-table-column label="战队名" prop="战队名" width="180">
        </el-table-column>
        <el-table-column label="联系方式" prop="联系方式" width="150">
        </el-table-column>
        <el-table-column label="报名时间" prop="报名时间" width="250">
        </el-table-column>
        <el-table-column label="票数" prop="票数" width="80"> </el-table-column>
        <el-table-column label="logo地址" width="auto" align="center" prop="logo">
          <template slot="header">
            下载单个logo替换域名为{{ serveIp }}
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- <input type="file" accept=".xlsx, .xls" @change="handleClick" /> -->
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { getAllEvents, getPlayerDetails } from "@/api/gameSeason/index";
import { exportIMGs } from "@/api/gameSeason/img.js";
import { exportExcel, deleteFiles } from "@/api/admin/index.js";
export default {
  name: "test",
  data() {
    return {
      tableData: [],
      options: [],
      loading: false,
      eventname: "第五届ASG众创赛",
    };
  },
  created() {
    this.initSeason();
    this.getPlayerDetails();
  },
  computed: {
    serveIp() {
      return window.SERVE_IP
    }
  },
  methods: {
    // 下载所有信息表单
    async exportDetails() {
      const { data } = await exportExcel(this.eventname);
      const baseURL = `${window.SERVE_IP}/excel/`;
      let a = document.createElement("a");
      a.href = baseURL + data + ".xlsx";
      a.download = `${this.eventname}所有战队详情`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    mergeRowMethod({ row, rowIndex, columnIndex }) {
      // 合并行  产品名字相同合并、我是合并第三列，所以合判断columnIndex是否等于2
      if (columnIndex === 0) {
        if (
          rowIndex === 0 ||
          row["赛季名"] != this.tableData[rowIndex - 1]["赛季名"]
        ) {
          let rowspan = 0;
          this.tableData.forEach((element) => {
            if (element["赛季名"] === row["赛季名"]) {
              rowspan++;
            }
          });
          return [rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    handleClick(e) {
      console.log(XLSX);
      const files = e.target.files;
      const rawFile = files[0]; // only use files[0]
      if (!rawFile) return;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const results = XLSX.utils.sheet_to_json(worksheet);
          this.headers = Object.keys(results[0]);
          this.tableData = results;
          this.loading = false;
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },
    handleChange() {
      this.getPlayerDetails();
    },
    exportData(data, fileName) {
      let ws = XLSX.utils.json_to_sheet(data);
      ws["!cols"] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 },
        { wch: 10 },
        { wch: 100 },
      ];
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "战队信息表");
      XLSX.writeFile(wb, fileName + ".xlsx");
    },
    // 获取赛季
    initSeason() {
      getAllEvents()
        .then((res) => {
          this.options = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取详细信息
    async getPlayerDetails() {
      try {
        this.loading = true;
        const { data } = await getPlayerDetails(this.eventname);
        this.tableData = data.map((item) => {
          return {
            赛季名: item.events.name,
            战队名: item.team_name,
            联系方式: item.team_tel,
            报名时间: item.time,
            票数: item.piaoshu,
            logo: item.logo_uri,
          };
        });
      } catch (error) {
        if (error.response.data.code === 400) {
          return this.$message.error('操作失败，无权访问');
        }
        this.$message.error('操作失败，后端服务器异常');
      } finally {
        this.loading = false;
      }
    },
    // 本地下载
    async downloadLogos() {
      const baseURL = window.SERVE_IP;
      let result = await exportIMGs();
      console.log("🐕 ~ result:", result);

      let a = document.createElement("a");
      a.href = baseURL + result.data;
      a.download = "所有战队的logo";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    // 清除服务器所有文件
    handleClear() {
      this.$confirm("此操作将永久删除服务器上所有文件, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteFiles()
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => { });
    },
  },
};
</script>

<style scoped lang="less">
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
