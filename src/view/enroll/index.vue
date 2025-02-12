<template>
  <div class="enroll__container">
    <header>
      <p>报名赛季</p>
      <el-select size="small" v-model="eventId" @change="handleEventChange">
        <el-option v-for="item in eventList" :key="item.id" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <p style="margin-left:12px">排序</p>
      <el-select size="small" v-model="listQuery.sort" @change="handleEventChange">
        <el-option v-for="item in sortOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </header>
    <template v-if="tableData.length > 0">
      <asgTableCard v-for="(item, index) in tableData" :key="index">
        <template v-slot:header>
          <div class="header__wrap">
            <div class="flex--align">
              <p class="team__name">{{ item.teamName }}</p>
            </div>
            <div>
              <el-button style="margin:0 12px" type="text" size="small" @click="handleView(item)">
                查看成员
              </el-button>
              <el-button style="color:#f40" type="text" size="small" @click="handleDeleteTeam(item)">删除战队</el-button>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <div class="content__wrap">
            <div style="display: flex;
              align-items: center;justify-content: center;">
              <img class="logo" :src="`${prefix}${item.logo}`" @error="imgErrorHandler" />
            </div>
            <div>
              <p class="flex--align"><span class="table-title">队长联系方式</span>{{ item.tel }}</p>
              <p class="flex--align"><span class="table-title">获赞数</span>{{ item.vote }}</p>
              <p class="flex--align"><span class="table-title">报名时间</span>{{ new Date(item.registerTime) |
                parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}</p>
            </div>
            <div class="team__roles">
              <div class="role-tag" v-for="(role, index) in item.roles" :key="index"
                :class="role.isSur ? 'primary' : 'danger'">{{ role.name }}
              </div>
            </div>
          </div>
        </template>
      </asgTableCard>
    </template>
    <el-empty v-else description="无报名信息"></el-empty>
    <el-pagination style="float: right; margin-top: 12px" @size-change="handlePageChange('limit', $event)"
      @current-change="handlePageChange('page', $event)" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 100]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <dialoginfo :dialog-visible.sync="dialogVisible" :tableList="tableList"></dialoginfo>
  </div>
</template>

<script>
import { getByTitle } from "@/api/config";
import { getAllEvents } from "@/api/gameSeason/index";
import { getEnrollTeam, delEnrollTeam } from "@/api/enroll/index.js";
import asgTableCard from "@/components/AsgTableCard.vue";
import dialoginfo from "./component/dialoginfo.vue";
export default {
  name: "enrollList",
  components: {
    asgTableCard,
    dialoginfo
  },
  data() {
    return {
      historyRank: [],
      eventList: [],
      tableData: [],
      loading: false,
      eventId: "",
      eventName: "",
      listQuery: {
        sort: 0,
        page: 1,
        limit: 10,
      },
      total: null,
      fullScreenLoading: null,
      defaultImgUrl: require("../../assets/images/logo.png"),
      dialogVisible: false,
      tableList: [],
      sortOptions: [
        {
          label: '默认',
          value: 0
        },
        {
          label: '按票数升序',
          value: 1
        },
        {
          label: '按票数降序',
          value: 2
        },
        {
          label: '按时间升序',
          value: 3
        },
        {
          label: '按时间降序',
          value: 4
        }
      ]
    };
  },
  created() {
    this.fullScreenLoading = this.$loading({
      lock: true,
      text: "正在刷新数据中......",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.8)",
    });
    getByTitle("historyRank").then(({ data }) => {
      this.historyRank = data;
    });
    this.initAllData();
  },
  computed: {
    prefix() {
      return window.SERVE_IP;
    },
  },
  methods: {
    handleView(item) {
      this.dialogVisible = true;
      this.tableList = item.roles ?? [];
    },
    imgErrorHandler(event) {
      let img = event.srcElement;
      img.src = this.defaultImgUrl;
      img.onerror = null;
    },
    async handleDeleteTeam(item) {
      try {
        const result = await this.$confirm("您确定删除该战队的报名信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        });
        if (result === 'confirm') {
          const { status } = await delEnrollTeam(item.id);
          if (status !== 200) throw new Error('服务端异常，请联系网站管理员。');
          this.$message.success('删除成功！');
          this.getList();
        }
      } catch (error) {
        if (typeof error === 'string' && error === 'cancel') return;
        this.$message.error(error.message);
      }
    },
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
        this.tableData = data.data.map(item => {
          return {
            teamName: item.form.team_name,
            tel: item.form.team_tel,
            registerTime: item.form.time,
            logo: item.form.logo_uri,
            id: item.form.id,
            vote: item.form.piaoshu,
            roles: (item?.roles ?? []).map(role => {
              return {
                commonRoles: role?.commonRoles ?? '未填报常用角色',
                isSur: role.roleLin === '求生者',
                name: role.roleName,
                rank: this.historyRank.find(rank => rank.value.toString() === (role.roleRank ?? -1).toString())?.label ?? '未填报段位'
              }
            })
          }
        });
        this.total = data.total;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
        this.fullScreenLoading.close();
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

.header__wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 12px;
}

.content__wrap {
  display: grid;
  grid-template-columns: 220px auto 500px;
  align-items: center;
  padding: 12px;

  .logo {
    width: 50px;
    height: 50px;
    text-align: center;
  }
}

.team__roles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-right: 50px;
  .role-tag{
    padding:2pt 4pt;
    border-radius: 6pt;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 80px;
    text-align: center;
    font-size: 14px;
    &.primary{
      color:#1070AB;
      background: #AED2E8;
    }
    &.danger{
      color:#EF2D2D;
      background: #FFC8C8;
    }
  }
}

.table-title {
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
}

.flex--align {
  display: flex;
  align-items: center;

  .team__name {
    color: rgb(121, 140, 222);
    font-size: 1.1rem;
    font-weight: bold;
  }
}
</style>
