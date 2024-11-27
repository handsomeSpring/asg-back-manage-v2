<template>
  <div v-loading="loading">
    <header>
      <el-radio-group v-model="listQuery.archive" size="mini" @input="getList">
        <el-radio label="" border>我的待办</el-radio>
        <el-radio label="1" border>归档数据</el-radio>
      </el-radio-group>
    </header>
    <main>
      <div class="grid-item thead">
        <p style="text-align: center">项目标题</p>
        <p style="text-align: center">当前节点审批人</p>
        <p style="text-align: center">节点状态</p>
      </div>
      <template v-if="tableData.length > 0">
        <div class="grid-item" v-for="item in tableData" :key="item.id" @click="showHistory(item)">
          <p>{{ item.projName }}</p>
          <p class="auth--person" style="text-align: center;font-weight: bold;">
            {{ item.status !== "3" ? item.nowAuthPerson : "已办结" }}
          </p>
          <p :class="`status-${item.status}`" style="text-align: center">
            {{ item.status | filterNode }}
          </p>
        </div>
      </template>
      <div class="no_msg" v-else>没有数据</div>
    </main>
    <AsgHistoryRecord :dialog-visible.sync="dialogVisible" :tableData="historyLine"></AsgHistoryRecord>
  </div>
</template>

<script>
import AsgHistoryRecord from "@/components/AsgHistoryRecord.vue";
import { findAudit } from "@/api/admin/index";
export default {
  name: "asg-audit-list",
  text: "业务待办列表",
  components:{
    AsgHistoryRecord
  },
  data() {
    return {
      listQuery: {
        projName: "", //项目名称模糊搜索
        projNo: "", //项目编号模糊搜索
        bizType: "", //业务类型code，精确搜索
        startPerson: "", // 发起人，模糊搜索
        budgetUse: "", //是否使用预算 ''全部 '1' 是 '0' 否
        archive: "",
        page: 1,
        limit: 10,
      },
      tableData: [],
      loading: false,
      dialogVisible:false,
      historyLine:[],
    };
  },
  filters: {
    filterNode(val) {
      const mapList = {
        '0': "发起",
        '1': "进行中",
        '2': "退回",
        '3': "已归档",
        '4': "流程终止"
      };
      return mapList[val];
    },
  },
  methods: {
    showHistory(row) {
      let authTime = [];
      try {
        authTime = JSON.parse(row.supplementaryInfo ?? "[]");
      } catch (error) {
        authTime = [];
      } finally {
        this.historyLine = [
          {
            time: row.startTime,
            person: row.startPerson,
            choose: "0",
          },
          ...authTime.map((item) => {
            return {
              time: item.time,
              person: item.authPerson,
              choose: item.choose,
            };
          }),
        ];
        if(row.status === '4'){
          this.historyLine.push({
            time:'-',
            person:row.startPerson,
            choose:'6'
          })
        }
        this.dialogVisible = true;
      }
    },
    async getList() {
      try {
        this.loading = true;
        const { data, status } = await findAudit(this.listQuery);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员！");
        this.tableData = (data?.data?.rows ?? []).map((item) => {
          return {
            bizType: item.biz_type,
            budgetId: item.budget_id,
            budgetName: item.budget_name,
            budgetUse: item.budget_use,
            budgetMoney: item.budget_money,
            description: item.description,
            id: item.id,
            nowAuthPerson: item.now_auth_person,
            nowAuthPersonId: item.now_auth_person_id,
            projName: item.proj_name,
            projNo: item.proj_no,
            reason: item.reason,
            startPerson: item.start_person,
            startPersonId: item.start_person_id,
            startTime: item.start_time,
            status: item.status,
            supplementaryInfo: item.supplementary_info
          };
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
header {
  margin: 6px 0;
}
main {
  .no_msg {
    display: flex;
    justify-content: center;
    align-items: center;
    margin:12px 0;
    font-size: 13px;
    color:#979797;
  }
  .grid-item {
    display: grid;
    grid-template-columns: 50% 20% 30%;
    align-items: center;
    padding:8px 2px;
    cursor: pointer;
    &:hover{
      background: #e5f0ff
    }
    .auth--person {
      color: #4090ef;
    }
    p {
      font-size: 13px;
      font-weight: 500;
    }
    &.thead {
      background: linear-gradient(180deg, #e5f0ff 0%, #ffffff 30%);
      padding: 8px 12px;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid #e7e7e7;
      p {
        font-weight: bold;
        font-size: 14px;
      }
    }
    .status-0 {
      color: #979797;
    }
    .status-1 {
      color: #4090ef;
    }
    .status-3 {
      color: #32b16c;
    }
    .status-2 {
      color: #ee281f;
    }
    .status-4 {
      color: #ee281f;
    }
  }
}
</style>
