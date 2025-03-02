<template>
  <div>
    <AsgHighSearch>
        <template #top>
          <el-button type="primary" size="small" @click="handleEdit">
            <i class="el-icon-plus"></i>新增违规记录
          </el-button>
        </template>
        <template #btnList>
          <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
        </template>
        <template #search>
          <el-input size="small" v-model="pageQuery.violator" placeholder="请输入违规人员名单" clearable>
            <template #append>
              <el-button icon="el-icon-search" @click="handleSearch"></el-button>
            </template>
          </el-input>
          <el-date-picker style="width:100%" size="small" v-model="pageQuery.recordYear" type="year" placeholder="选择年份"
            value-format="yyyy">
          </el-date-picker>
        </template>
      </AsgHighSearch>
    <template v-if="!isMobile">
      <main v-loading="loading" element-loading-text="系统加载中，请稍等" element-loading-spinner="el-icon-loading">
        <div class="asg-table-main">
          <el-table :data="tableData" border style="width: 100%"
          :header-cell-style="{ background: '#f2f6fd', color: '#000', 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="recordTime" label="记录时间" width="180" :formatter="(row) => row.record_time" />
            <el-table-column prop="violator" label="违规人员名称" width="180" />
            <el-table-column prop="platformRecord" label="违规平台" :formatter="(row) => row.platform_record" />
            <el-table-column prop="featureId" label="特征id" :formatter="(row) => row.feature_id" />
            <el-table-column prop="offendingDetails" label="违规内容" :formatter="(row) => row.offending_details" />
            <el-table-column prop="processingResult" label="处理结果" :formatter="(row) => row.processing_result" />
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row)" class="delete-btn">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top: 18px; text-align: right" @size-change="handlePageSizeChange"
          @current-change="handlePageChange" :current-page="pageQuery.page" :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </main>
    </template>
    <!-- 移动端 -->
    <template v-else>
      <mobileTable :skeLoading="loading" :table-data="tableData" :table-props="tableProps">
        <template #operation="{row}">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)" class="delete-btn">删除</el-button>
        </template>
      </mobileTable>
      <mobilePage :page="pageQuery.page" :total="total" :limit="pageQuery.limit"  @current-change="handlePageChange"></mobilePage>
    </template>
    <el-dialog :fullscreen="isMobile" :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form :model="formData" ref="ruleRef" label-width="120px" :rules="rules" :label-position="isMobile ? 'top' : 'right'">
        <el-form-item label="记录时间" prop="recordTime">
          <el-date-picker v-model="formData.recordTime" type="date" placeholder="选择日期" value-format="yyyy-MM-DD"
            format="yyyy-MM-DD" class="full-width">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="违规人员名称" prop="violator">
          <el-input v-model="formData.violator" placeholder="请输入违规人员名称" />
        </el-form-item>
        <el-form-item label="违规平台" prop="platformRecord">
          <el-input v-model="formData.platformRecord" placeholder="请输入违规平台" />
        </el-form-item>
        <el-form-item label="特征id" prop="featureId">
          <el-input v-model="formData.featureId" placeholder="请输入特征id" class="full-width" />
        </el-form-item>
        <el-form-item label="违规内容" prop="offendingDetails">
          <el-input v-model="formData.offendingDetails" type="textarea" :rows="4" placeholder="请输入违规内容" maxlength="200"
            show-word-limit />
        </el-form-item>
        <el-form-item label="处理结果" prop="processingResult">
          <el-input v-model="formData.processingResult" placeholder="请输入处理结果" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">
          {{ dialogTitle == '新增违规人员' ? '新增' : '编辑' }}
        </el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AsgHighSearch from "@/components/AsgHighSearch.vue";
import { FindBlacks, addRecord, deleteRecord, updateRecord } from "@/api/black/index";
import { isMobile } from "@/utils";
import mobilePage from "@/components/mobile/mobilePage.vue";
import mobileTable from "@/components/mobile/mobileTable.vue";

export default {
  name: "asgBlack-Page",
  components: {
    AsgHighSearch,
    mobileTable,
    mobilePage
  },
  data() {
    return {
      pageQuery: {
        page: 1,
        limit: 10,
        violator: '',
        recordYear: ''
      },
      isMobile:false,
      tableProps: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '记录时间',
          prop: 'record_time',
          type: 'prop'
        },
        {
          label: '违规人员名称',
          prop: 'violator',
          type: 'prop'
        },
        {
          label: '违规平台',
          prop: 'platform_record',
          type: 'prop'
        },
        {
          label: '特征id',
          prop: 'feature_id',
          type: 'prop'
        },
        {
          label: '违规内容',
          prop: 'offending_details',
          type: 'prop'
        },
        {
          label: '处理结果',
          prop: 'processing_result',
          type: 'prop'
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'slot'
        },
      ],
      tableData: [
      ],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {
        recordTime: '',        // 记录时间
        violator: '',          // 违规人员名称
        platformRecord: '',   // 违规平台
        featureId: undefined,        // 特征id
        offendingDetails: '', // 违规内容
        processingResult: '', // 处理结果
        recorder: ''          // 记录人
      },
      dialogTitle: '',
      rules: {
        recordTime: [
          { required: true, message: '请选择记录时间', trigger: 'change' }
        ],
        violator: [
          { required: true, message: '请输入违规人员名称', trigger: 'blur' }
        ],
        platformRecord: [
          { required: true, message: '请输入违规平台', trigger: 'blur' }
        ],
        featureId: [
          { required: true, message: '请输入特征id', trigger: 'blur' },
          { type: 'string', message: '特征id必须为字符串', trigger: 'blur' }
        ],
        offendingDetails: [
          { required: true, message: '请输入违规内容', trigger: 'blur' }
        ],
        processingResult: [
          { required: true, message: '请输入处理结果', trigger: 'blur' }
        ]
      }

    };
  },
  methods: {
    async initTable() {
      const res = await FindBlacks(this.pageQuery)
      this.tableData = res.data.data.rows
      this.total = res.data.data.total
    },
    convertToCamelCase(obj) {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        newObj[camelKey] = obj[key];
      });
      return newObj;
    },
    handleEdit(row) {
      this.dialogVisible = true
      if (row) {
        this.dialogTitle = '编辑违规人员'
        let copyRow = { ...row }
        this.formData = this.convertToCamelCase(copyRow)
      } else {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        this.formData.recordTime = `${year}-${month}-${day}`
        this.dialogTitle = '新增违规人员'
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return deleteRecord(row.id)
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功!')
            this.initTable()
          } else {
            this.$message.warning(res.data.message)
          }
        })
        .catch(error => {
          if (error !== 'cancel') {
            this.$message.error('删除失败')
          }
        })
    },
    handleClose() {
      this.dialogVisible = false
      this.$refs.ruleRef && this.$refs.ruleRef.resetFields()
      this.formData = {
        recordTime: '',
        violator: '',
        platformRecord: '',
        featureId: undefined,
        offendingDetails: '',
        processingResult: '',
        recorder: ''
      }
    },
    async handleSubmit() {
      this.$refs.ruleRef.validate(async (valid) => {
        if (valid) {
          const submitData = { ...this.formData }
          try {
            if (this.dialogTitle === '新增违规人员') {
              const res = await addRecord(submitData)
              if (res.data.code == 200) {
                this.$message.success('新增成功')
              } else {
                this.$message.warning(res.data.message)
              }
            } else {
              const res = await updateRecord(submitData)
              if (res.data.code == 200) {
                this.$message.success('更新成功')
              } else {
                this.$message.warning(res.data.message)
              }
            }
            this.initTable()
            this.handleClose()
          } catch (error) {
            this.$message.error(this.dialogTitle === '新增违规人员' ? '添加失败' : '更新失败')
          }
        } else {
          this.$message.warning('请填写完整所有必填项')
          return false
        }
      })
    },
    handleSearch() {
      this.initTable()
    },
    handleReset() {
      this.pageQuery = {
        page: 1,
        limit: 10,
        violator: '',
        recordYear: '',
      }
      this.initTable()
    },
    handlePageSizeChange(size) {
      this.pageQuery.limit = size;
      this.initTable()
    },
    handlePageChange(page) {
      this.pageQuery.page = page;
      this.initTable()
    },
  },
  created() {
    this.isMobile = isMobile();
    this.initTable()
  }
};
</script>

<style lang="less" scoped>
@borderColor: #e9e9e8;
@bgColor: #f2f6fd;
@hoverBgColor: #e7f0ff;
@ContainerBgColor: #f2f2f2;
@textBlueColor: #4090ef;

.delete-btn {
  color: #F56C6C !important;
}

.full-width {
  width: 100%;
}

.full-width /deep/ .el-input__inner {
  text-align: left;
}

.el-pagination {
  margin-top: 18px;
  text-align: right;
}
</style>