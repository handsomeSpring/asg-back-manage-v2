<template>
  <div>
    <AsgHighSearch showOperation>
      <template #top>
        <el-button type="primary" size="small" @click="handleToDetail('add')"
          >
          <i class="el-icon-plus"></i>发起业务审核
        </el-button>
      </template>
      <template #search>
        <el-input
          v-model="listQuery.projName"
          size="small"
          placeholder="输入项目名称检索"
        ></el-input>
        <el-input
          v-model="listQuery.projNo"
          size="small"
          placeholder="输入项目编号检索"
        ></el-input>
        <el-input
          v-model="listQuery.startPerson"
          size="small"
          placeholder="输入发起人检索"
        ></el-input>
        <el-select size="small" v-model="listQuery.budgetUse">
          <el-option label="全部" value=""></el-option>
          <el-option label="使用预算" value="1"></el-option>
          <el-option label="未使用预算" value="0"></el-option>
        </el-select>
        <el-select
          size="small"
          v-model="listQuery.bizType"
          placeholder="选择业务类型进行检索"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            :label="item.label"
            :value="item.bizType"
            v-for="(item, index) in bizTypeOptions"
            :key="index"
          ></el-option>
        </el-select>
      </template>
      <template #btnList>
        <el-button size="small" type="primary" @click="originGetList">查询</el-button>
        <el-button plain size="small" @click="resetSearch">重置</el-button>
      </template>
      <template #operation>
        <el-button size="small" type="primary" @click="jumpToBudget">新增预算</el-button>
      </template>
    </AsgHighSearch>
    <el-table :data="tableData" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="60px"
      ></el-table-column>
      <el-table-column
        label="项目名称"
        prop="projName"
        align="center"
        min-width="180px"
      >
      <template #default="{row}">
        <p class="ellipsis__text">{{ row.projName }}</p> 
      </template>
      </el-table-column>
      <el-table-column
        label="项目编号"
        prop="projNo"
        align="center"
      >
      <template #default="{row}">
        <p class="ellipsis__text">{{ row.projNo }}</p> 
      </template>
      </el-table-column>
      <el-table-column label="预算使用" width="120" align="center">
        <template #default="{ row }">
          <p class="ellipsis__text">{{ row.budgetUse === "1" ? "是" : "否" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="预算名称" align="center">
        <template #default="{ row }">
            <p class="ellipsis__text">{{ row.budgetName ? row.budgetName : "/" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="预算金额" align="center" width="120px">
        <template #default="{ row }">
            <p v-if="row.budgetMoney" class="ellipsis__text money__text">{{  row.budgetMoney | moneyFormat }}</p>
            <p v-else class="ellipsis__text none__data">/</p>
        </template>
      </el-table-column>
      <el-table-column prop="startPerson" label="发起人" align="center" width="120px">
        <template #default="{ row }">
            <p class="ellipsis__text emphysis">{{ row.startPerson }}</p>
        </template>
      </el-table-column>
      <el-table-column label="当前审批人" prop="nowAuthPerson" align="center" width="120px">
        <template #default="{ row }">
            <p class="ellipsis__text emphysis">{{ row.nowAuthPerson }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px">
        <template #default="{ row }">
          <el-button type="text" @click="handleToDetail('auth', row)"
            >审核</el-button
          >
          <el-button type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AsgHighSearch from "@/components/AsgHighSearch.vue";
export default {
  name: "bizType-list",
  components: {
    AsgHighSearch,
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
        projName:'', //项目名称模糊搜索
        projNo:'',  //项目编号模糊搜索
        bizType:'', //业务类型code，精确搜索
        startPerson:'', // 发起人，模糊搜索
        budgetUse: '', //是否使用预算 ''全部 '1' 是 '0' 否
      },
      tableData: [
        {
          projName: "一步办结情况",
          projNo: "admin20241109",
          budgetUse: "1",
          budgetName: "第六届ASG众创赛预算",
          bizType: "judgeAuth",
          budgetId: 142,
          startTime: "2024-11-09",
          budgetMoney: 100,
          startPerson: "落梨",
          startPersonId: 427,
          nowAuthPerson: "浊泉",
          nowAuthPersonId: 429,
          description: "测试",
          reason: "我太想进步了",
          supplementaryInfo: "[]",
          status: "1", // '0'发起 '1' 是进行中 , '2' 退回，'3'是接档
        },
        {
          projName: "退回到浊泉手上例子",
          projNo: "commen20241109",
          budgetMoney: 231,
          budgetUse: "1",
          budgetName: "第六届ASG众创赛预算",
          bizType: "anchorAuth",
          startTime: "2024-11-09",
          budgetId: 142,
          startPersonId: 229,
          startPerson: "晓月",
          nowAuthPerson: "浊泉",
          nowAuthPersonId: 429,
          description: "导播审批",
          reason: "有新导播申请",
          supplementaryInfo:
            '[{"userId":429,"opinion":"同意","time":"2024-11-09 22:00:00","authPerson":"浊泉"},{"userId":429,"opinion":"不同意","time":"2024-11-09 22:00:00","authPerson":"柴瞳"}]',
          status: "2",
        },
        {
          projName: "退回到发起人且发起人是自己的情况",
          projNo: "commen20241109",
          budgetUse: "0",
          budgetName: "",
          bizType: "judgeAuth",
          startTime: "2024-11-09",
          budgetId: 142,
          budgetMoney: 0,
          startPersonId: 429,
          startPerson: "浊泉",
          nowAuthPerson: "浊泉",
          nowAuthPersonId: 429,
          description: "测试",
          reason: "我太想进步了",
          supplementaryInfo:
            '[{"userId":429,"opinion":"不同意","time":"2024-11-09 22:00:00","authPerson":"浊泉"}]',
          status: "0",
        },
      ],
      
    };
  },
  methods: {
    handleToDetail(type, row = {}) {
      this.$emit("toDeTail", type, row);
    },
    resetSearch(){
       this.listQuery = {
        projName:'', //项目名称模糊搜索
        projNo:'',  //项目编号模糊搜索
        bizType:'', //业务类型code，精确搜索
        startPerson:'', // 发起人，模糊搜索
        budgetUse: '', //是否使用预算 ''全部 '1' 是 '0' 否
      }
      this.originGetList();
    },
    originGetList(){
       this.listQuery.page = 1;
       this.listQuery.limit = 10;
       this.getList();
    },
    getList(){
        //TODO
    },
    jumpToBudget(){
        this.$router.push('/authorization/budget');
    }
  },
};
</script>
<style lang="less" scoped>
.el-table {
    height: 100% !important;
    border-top: 1px solid #e8e8e8;
    th {
      border-bottom: 1px solid #e8e8e8 !important;
      &:first-child{
        border-left: 1px solid #e8e8e8 !important;
      }
      &:last-child {
        border-right:1px solid #e8e8e8 !important;
      }
    }
    td {
      border-bottom: 1px solid #e8e8e8 !important;
      &:first-child{
        border-left: 1px solid #e8e8e8 !important;
      }
      &:last-child {
        border-right:1px solid #e8e8e8 !important;
      }
    }
  }
  .ellipsis__text{
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.emphysis{
        color:#4090EF;
        font-weight: 600;
    }
    &.money__text{
        font-size: 14px;
        font-weight: 500;
        color:#4090EF;
    }
    &.none__data{
        font-size: 14px;
        font-weight: 500;
        color:#d9d9d9
    }
  }
</style>
