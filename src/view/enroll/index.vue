<template>
  <div class="enroll__container">
    <header>
      <p>报名赛季:</p>
      <el-select size="small" v-model="eventId" @change="handleEventChange">
        <el-option
          v-for="item in eventList"
          :key="item.id"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </header>
    <el-table
      :header-cell-style="{ background: '#f2f6fd', color: '#000' }"
      :data="tableData"
      style="width: 100%"
      height="65vh"
      v-loading="loading"
    >
      <el-table-column
        label="序号"
        type="index"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column label="战队LOGO" align="center">
        <template #default="{ row }">
          <img class="logo" :src="`${prefix}${eventName}/${row.teamName}.png`" />
        </template>
      </el-table-column>
      <el-table-column
        label="战队Id"
        prop="formId"
        align="center"
      ></el-table-column>
      <el-table-column
        label="战队名称"
        prop="teamName"
        width="250px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="点赞数"
        prop="voteOfLikes"
        width="250px"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="120px">
        <el-button type="text">查阅</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right; margin-top: 12px"
      @size-change="handlePageChange('limit', $event)"
      @current-change="handlePageChange('page', $event)"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 30, 100]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getByTitle } from "@/api/config";
import { getAllEvents } from "@/api/gameSeason/index";
import { getEnrollTeam } from "@/api/enroll/index.js";
export default {
  name: "enrollList",
  data() {
    return {
      historyRank: [],
      eventList: [],
      tableData: [],
      loading: false,
      eventId: "",
      eventName: "",
      listQuery: {
        sort: "1",
        page: 1,
        limit: 10,
      },
      total: null,
    };
  },
  created() {
    getByTitle("historyRank").then(({ data }) => {
      this.historyRank = data;
    });
    this.initAllData();
  },
  computed: {
    prefix() {
      return window.SERVE_IP + "/loge/";
    },
  },
  methods: {
    async initAllData() {
      try {
        const result = await getAllEvents();
        this.eventList = result.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            over: item.is_over,
          };
        });
        this.eventId =
          this.eventList.filter((item) => !item.over).at(-1)?.value ?? null;
        this.eventName =
          this.eventList.filter((item) => !item.over).at(-1)?.label ?? "";
        if (!this.eventId) throw new Error("获取赛季信息失败！");
        this.getList();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    handlePageChange(prop, value) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: value,
      };
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const reqQuery = {
          ...this.listQuery,
          eventId: this.eventId,
        };
        const { data, status } = await getEnrollTeam(reqQuery);
        console.log("表格数据是===", data);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
        if (data && data?.code === 401)
          throw new Error(data?.message ?? "没有权限，获取失败");
        this.tableData = data.data;
        this.total = data.total;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    handleEventChange($event) {
      this.eventName =
        this.eventList.find((item) => item.value === $event)?.label ?? "";
      this.getList();
    },
  },
};
</script>

<style scoped lang="less">
.enroll__container {
  header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
    margin-right: 12px;
    p {
      margin-right: 12px;
    }
  }
}
.logo{
  width:50px;
  height:50px;
}
</style>
