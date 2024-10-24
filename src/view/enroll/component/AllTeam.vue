<template>
  <div>
    <el-row>
      <el-select v-model="eventsname" size="mini" style="margin-bottom: 10px; margin-right: 30px"
        @change="handleChange">
        <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name">
          <span>{{ item.name }}</span>
          <i v-if="item.is_over" style="color: red; margin-left: 20px" class="el-icon-warning"></i>
          <i v-else style="color: green; margin-left: 20px" class="el-icon-success"></i>
        </el-option>
      </el-select>
      <span v-if="isOver">
        <el-tooltip effect="dark" content="进入赛程页面-赛季-结束赛程" placement="top">
          <el-tag size="small" type="danger">已结束</el-tag>
        </el-tooltip>
      </span>

      <el-tag size="small" v-else-if="isOver === null" type="info">请选择赛季</el-tag>
      <el-tag size="small" v-else type="success">进行中</el-tag>
    </el-row>
    <el-scrollbar :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section"
      style="height: calc(70vh - 30px); margin-bottom: 10px">
      <baseTable v-loading="loading" element-loading-text="系统加载中，请稍等" element-loading-spinner="el-icon-loading"
        :data="tableData" :column="tableProps">
        <template #projectHeader="{ data }">
          <div>
            <span>
              <span class="fontWeight">{{ data.name }}</span>
            </span>
            <span>
              票数：
              <span class="fontWeight">{{ data.piaoshu }}</span>
            </span>
          </div>
          <div>
            <i class="el-icon-view" style="color: rgb(91, 182, 242); font-size: 16px; cursor: pointer;margin-right:12px"
              @click="check(data)"></i>
            <i class="el-icon-delete" style="color: red; font-size: 16px; cursor: pointer" @click="delTeam(data)"></i>
          </div>
        </template>
        <template #LOGO="{ data }">
          <!-- <img class="img-wrap" :src="`${serveIp}/loge/${eventsname}/${data.name}.png`" /> -->
           <img class="img-wrap" :src="data.logo">
        </template>
        <template #registerTime="{ data }">
          <p class="orgName">
            {{ new Date(data.time) | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
          </p>
        </template>
        <template #teamMates="{ data }">
          <el-col v-for="(item, index) in data.role" :key="index" :span="6"><span style="margin: 5px">{{ item.role_name
              }}</span>
            <el-tag size="mini" :type="item.role_lin === '求生者' ? 'primary' : 'danger'">{{ item.role_lin }}</el-tag>
          </el-col>
        </template>
      </baseTable>
    </el-scrollbar>
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10, 20, 30, 100]" :page-size="listQuery.page_long" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->
  </div>
</template>

<script>
import { getEnrollList, delEnrollTeam } from "@/api/enroll/index";
import { getAllEvents,getPlayerDetails } from "@/api/gameSeason/index";
import baseTable from "@/components/baseTable.vue";
export default {
  name: "AllTeam",
  components: {
    baseTable,
  },
  created() {
    this.initSeason();
  },
  data() {
    return {
      tableData: [],
      options: [],
      listQuery: {
        page: 1,
        page_long: 10,
      },
      total: 200,
      loading: false,
      // 是否结束
      isOver: false,
      eventsname: "",
      tableProps: [
        {
          type: "index",
          label: "序号",
          props: "index",
          style: {
            textAlign: "center",
            minWidth: "80px",
          },
        },
        {
          type: "LOGO",
          label: "战队LOGO",
          prop: "LOGO",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "60px",
          },
        },
        {
          type: "registerTime",
          label: "报名时间",
          prop: "registerTime",
          slot: true,
          style: {
            textAlign: "center",
            width: "250px",
          },
        },
        {
          type: "teamMates",
          label: "战队成员",
          prop: "teamMates",
          slot: true,
          style: {
            textAlign: "left",
            minWidth: "400px",
          },
        },
      ],
    };
  },
  computed: {
    serveIp() {
      return window.SERVE_IP
    }
  },
  methods: {
    initData(page, size, sort, eventsname) {
      this.loading = true;
      getPlayerDetails(eventsname)
        .then((res) => {
          this.tableData = res.data.map(item => {
            return {
              ...item,
              logo:item.logo_uri.replace('124.223.35.239','api.idvasg.cn')
            }
          });
            this.loading = false;
        })
        .catch((err) => {
          console.log(err);
            this.loading = false;
        });
    },
    //检查事件
    check(row) {
      this.$store.commit("updateTeamName", row.team_name);
      this.$emit("searchteam", row.team_name);
    },
    //删除战队
    delTeam(row) {
      this.$confirm("是否删除该战队信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          delEnrollTeam(row.id)
            .then(() => {
              this.$message.success("删除成功");
              this.initData(1, 10, "time", this.eventsname);
            })
            .catch((err) => {
              this.$message.error("删除失败") + err;
            });
        })
        .catch(() => {
          this.$message.warning("取消删除！");
        });
    },
    handleSizeChange(val) {
      this.listQuery.page_long = val;
      this.initData(
        this.listQuery.page,
        this.listQuery.page_long,
        "time",
        this.eventsname
      );
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.initData(
        this.listQuery.page,
        this.listQuery.page_long,
        "time",
        this.eventsname
      );
    },
    // 获取赛季
    initSeason() {
      getAllEvents()
        .then((res) => {
          this.options = res.data;
          this.eventsname = res.data && Array.isArray(res.data) && res.data.at(-1).name;
          this.initData(1, 10, "time", this.eventsname);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //处理选择框
    handleChange(e) {
      let index = this.options.map((item) => item.name).indexOf(e);
      this.isOver = this.options[index].is_over;
      this.initData(1, 10, "time", this.eventsname);
    },
  },
};
</script>

<style scoped lang="less">
.logo_url {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.img-wrap {
  height: 60px;
  width: 60px;
}

.fontWeight {
  font-size: 16px;
  font-weight: bold;
}
</style>
