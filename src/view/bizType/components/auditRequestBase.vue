<template>
  <el-dialog :visible.sync="dialogVisible" title="关联业务选择" @close="closeDialog" append-to-body
    :close-on-click-modal="false" width="50%" :fullscreen="isMobile">
    <header>
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="申请人">
          <el-input v-model="listQuery.chinaname" size="small" placeholder="申请人"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审批" value="1"></el-option>
            <el-option label="审批通过" value="2"></el-option>
            <el-option label="审批不通过" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <template v-if="!isMobile">
      <el-table v-loading="loading" :data="tableData" border height="50vh">
        <el-table-column label="选择" width="60px" align="center">
          <template #default="{ row, $index }">
            <el-checkbox v-model="row.isCheck" :disabled="row.status !== '1'"
              @input="handleCheck($index, row, $event)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="申请人" min-width="180px" align="center" prop="chinaname">
        </el-table-column>
        <el-table-column label="性别" width="120px" align="center" prop="chinaname">
          <template #default="{ row }">
            <span>{{ row.sex === 1 ? "男" : "女" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120px" align="center">
          <template #default="{ row }">
            {{ row.status | filterStatus }}
          </template>
        </el-table-column>
        <el-table-column label="申请业务" min-width="120px" align="center" prop="bizType">
          <template #default="{ row }">
            {{ computedLabel(row.biz_type) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleChange($event, 'limit')" @current-change="handleChange($event, 'page')"
        :current-page="listQuery.page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </template>
    <template v-else>
      <MobileTable :loading="loading" :table-data="tableData" :table-props="tableProps">
          <template #check="{ row, index }">
            <el-checkbox v-model="row.isCheck" :disabled="row.status !== '1'"
              @input="handleCheck(index, row, $event)"></el-checkbox>
          </template>
          <template #sex="{row}">
            <span>{{ row.sex === 1 ? "男" : "女" }}</span>
          </template>
          <template #bizType="{ row }">
            {{ computedLabel(row.biz_type) }}
          </template>
      </MobileTable>
      <mobilePage :page="listQuery.page" :total="total" :limit="listQuery.limit"  @current-change="handleChange($event, 'page')"></mobilePage>
    </template>
    <span slot="footer" style="text-align: right">
      <el-button type="primary" size="small" @click="handleConfirm">确 认</el-button>
      <el-button plain size="small" @click="closeDialog">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { conformList } from "@/api/admin/index.js";
import MobileTable from "@/components/mobile/mobileTable.vue";
import mobilePage from "@/components/mobile/mobilePage.vue";
import { isMobile } from "@/utils";
export default {
  name: "auditRequestBase",
  components:{
    MobileTable,
    mobilePage
  },
  props: {
    checkId: {
      type: Number | null,
      required: true,
    },
    bizTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.isMobile = isMobile();
  },
  data() {
    return {
      tableProps: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '操作',
          prop: 'check',
          type: 'slot'
        },
        {
          label: '申请人',
          prop: 'chinaname',
          type: 'prop'
        },
        {
          label: '性别',
          prop: 'sex',
          type: 'slot'
        },
        {
          label:'业务类型',
          prop:'bizType',
          type:'slot'
        }
      ],
      dialogVisible: false,
      listQuery: {
        chinaname: "",
        status: "",
        page: 1,
        limit: 10,
      },
      tableData: [],
      total: null,
      loading: false,
      feedbackId: null,
      checkData: {},
      isMobile: false,
    };
  },
  filters: {
    filterStatus(val) {
      const mapList = {
        '1': '待审核',
        '2': '已通过',
        '3': '已拒绝'
      }
      return mapList[val];
    }
  },
  methods: {
    computedLabel(bizType) {
      return this.bizTypeOptions.find(item => item.bizType === bizType)?.label ?? '未知业务审批流程'
    },
    handleCheck(index, row, value) {
      if (value) {
        this.tableData.forEach((item) => {
          item.isCheck = false;
        });
        this.tableData[index].isCheck = true;
        this.checkData = row;
        this.feedbackId = row.id;
      } else {
        this.checkData = {};
        this.feedbackId = null;
      }
    },
    handleConfirm() {
      this.$emit("finishChoose", this.checkData);
      this.dialogVisible = false;
    },
    handleChange(value, prop) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: value,
      };
      this.getList();
    },
    async getList(page) {
      try {
        this.loading = true;
        if (!!page) {
          this.listQuery.page = page;
        }
        const { data, status } = await conformList(this.listQuery);
        if (status !== 200) throw new Error("服务端异常！");
        if (data.code === 401) throw new Error(data?.message ?? "未知错误");
        this.tableData = data.rows.map((item) => {
          if (item.id === this.feedbackId) {
            this.checkData = item;
          }
          return {
            ...item,
            isCheck: this.checkId ? this.feedbackId === item.id : false,
          };
        });
        this.total = data.total;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    openDialog() {
      this.feedbackId = this.checkId;
      this.dialogVisible = true;
      this.getList();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
