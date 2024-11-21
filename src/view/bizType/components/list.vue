<template>
  <div>
    <AsgHighSearch showOperation>
      <template #top>
        <el-button type="primary" size="small" @click="handleToDetail('add')">
          <i class="el-icon-plus"></i>发起业务审核
        </el-button>
      </template>
      <template #search>
        <el-input v-model="listQuery.projName" size="small" placeholder="输入项目名称检索" clearable></el-input>
        <el-input v-model="listQuery.projNo" size="small" placeholder="输入项目编号检索" clearable></el-input>
        <el-input v-model="listQuery.startPerson" size="small" placeholder="输入发起人检索" clearable></el-input>
        <el-select size="small" v-model="listQuery.budgetUse" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="使用预算" value="1"></el-option>
          <el-option label="未使用预算" value="0"></el-option>
        </el-select>
        <el-select size="small" v-model="listQuery.bizType" placeholder="选择业务类型进行检索" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option :label="item.label" :value="item.bizType" v-for="(item, index) in bizTypeOptions"
            :key="index"></el-option>
        </el-select>
        <el-radio-group size="small" v-model="listQuery.archive">
          <el-radio label="" border>我的待办</el-radio>
          <el-radio label="1" border>归档</el-radio>
        </el-radio-group>
      </template>
      <template #btnList>
        <el-button size="small" type="primary" @click="originGetList">查询</el-button>
        <el-button plain size="small" @click="resetSearch">重置</el-button>
      </template>
      <template #operation>
        <el-button size="small" type="primary" @click="jumpToBudget">新增预算</el-button>
      </template>
    </AsgHighSearch>
    <div class="asg-table-main">
      <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
        <el-table-column label="序号" type="index" align="center" width="60px"></el-table-column>
        <el-table-column label="项目名称" prop="projName" align="center" min-width="220px">
          <template #default="{ row }">
            <p class="ellipsis__text">{{ row.projName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="projNo" align="center" width="180px">
          <template #default="{ row }">
            <p class="ellipsis__text">{{ row.projNo }}</p>
          </template>
        </el-table-column>
        <el-table-column label="业务名称" align="center">
          <template #default="{ row }">
            <p class="ellipsis__text">{{ row.bizType ? row.bizType : "/" }}</p>
          </template>
        </el-table-column>
        <el-table-column label="金额/是否使用预算" align="center" width="180px">
          <template #default="{ row }">
            <p v-if="row.budgetUse === '1'" class="ellipsis__text money__text">
              {{ row.budgetMoney | moneyFormat }} /
              <span class="green_tag">是</span>
            </p>
            <p v-else class="ellipsis__text none__data">
              {{ 0 | moneyFormat }} /
              <span class="red_tag">否</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="startPerson" label="发起人" align="center" width="120px">
          <template #default="{ row }">
            <p class="ellipsis__text emphysis">{{ row.startPerson }}</p>
          </template>
        </el-table-column>
        <el-table-column label="当前节点" prop="nowAuthPerson" align="center" width="120px">
          <template #default="{ row }">
            <p v-if="row.status === '4'" class="ellipsis__text stop">已终止</p>
            <p v-else-if="row.status !== '3'" class="ellipsis__text emphysis">
              {{ row.nowAuthPerson }}
            </p>
            <p v-else class="ellipsis__text emphysis">已归档</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template #default="{ row }">
            <el-button v-if="!['3', '4'].includes(row.status) && listQuery.archive !== '1'" type="text"
              @click="handleToDetail('auth', row)">
              {{ row.status === "0" ? "编辑" : "审批" }}
            </el-button>
            <el-button v-else type="text" @click="handleToDetail('check', row)">查看</el-button>
            <el-button type="text" @click="handleHistoryTrance(row)">跟踪</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination style="float: right; margin-top: 12px" @size-change="handlePageChange('limit', $event)"
      @current-change="handlePageChange('page', $event)" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 100]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <AsgHistoryRecord :dialog-visible.sync="dialogVisible" :tableData="historyLine"></AsgHistoryRecord>
  </div>
</template>

<script>
import AsgHighSearch from "@/components/AsgHighSearch.vue";
import AsgHistoryRecord from "@/components/AsgHistoryRecord.vue";
import { findAudit } from "@/api/admin/index";
export default {
  name: "bizType-list",
  components: {
    AsgHighSearch,
    AsgHistoryRecord,
  },
  props: {
    bizTypeOptions: {
      type: Array,
      default: () => [],
    },
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
      total: null,
      tableData: [],
      dialogVisible: false,
      historyLine: [],
      loading: false,
    };
  },
  created() {
    const { querySearchMap } = this.$store.state?.cacheQuery ?? {};
    this.listQuery = querySearchMap?.bizType || this.listQuery;
    this.getList();
  },
  methods: {
    handleHistoryTrance(row) {
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
        if (row.status === "4") {
          this.historyLine.push({
            time: "-",
            person: row.startPerson,
            choose: "4",
          });
        }
        this.dialogVisible = true;
      }
    },
    handleToDetail(type, row = {}) {
      this.$emit("toDeTail", type, row);
    },
    resetSearch() {
      this.listQuery = {
        projName: "", //项目名称模糊搜索
        projNo: "", //项目编号模糊搜索
        bizType: "", //业务类型code，精确搜索
        startPerson: "", // 发起人，模糊搜索
        budgetUse: "", //是否使用预算 ''全部 '1' 是 '0' 否
      };
      this.originGetList();
    },
    originGetList() {
      this.listQuery.page = 1;
      this.listQuery.limit = 10;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const { data, status } = await findAudit(this.listQuery);
        if (status !== 200) throw new Error("后端服务器异常！");
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
            supplementaryInfo: item.supplementary_info,
          };
        });
        this.total = data?.data?.total ?? 0;
        this.$store.commit("cacheQuery/setQueryCondition", {
          businessName: "bizType",
          condition: this.listQuery,
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    handlePageChange(prop, value) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: value,
      };
      this.getList();
    },
    jumpToBudget() {
      this.$router.push("/authorization/budget");
    },
  },
};
</script>
<style lang="less" scoped>
.el-table {
  border-top: 1px solid #e8e8e8;

  th {
    border-bottom: 1px solid #e8e8e8 !important;

    &:first-child {
      border-left: 1px solid #e8e8e8 !important;
    }

    &:last-child {
      border-right: 1px solid #e8e8e8 !important;
    }
  }

  td {
    border-bottom: 1px solid #e8e8e8 !important;

    &:first-child {
      border-left: 1px solid #e8e8e8 !important;
    }

    &:last-child {
      border-right: 1px solid #e8e8e8 !important;
    }
  }
}

.ellipsis__text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.emphysis {
    color: #4090ef;
    font-weight: 600;
  }

  &.stop {
    color: #f40;
    font-weight: 600;
  }

  &.money__text {
    font-size: 14px;
    font-weight: 500;
    color: #4090ef;
  }

  &.none__data {
    font-size: 14px;
    font-weight: 500;
    color: #d9d9d9;
  }

  .green_tag {
    color: #429f46;
  }

  .red_tag {
    color: #f40;
  }
}
</style>
