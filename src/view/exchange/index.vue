<template>
  <div>
    <AsgHighSearch>
      <template #top>
        <el-button type="primary" size="small" @click="handleOpen">
          <i class="el-icon-plus"></i>关联发起业务审核
        </el-button>
      </template>
      <template #search>
        <el-input v-model="listQuery.chinaname" size="small" clearable placeholder="请输入申请者中文名"></el-input>
        <el-select v-model="listQuery.status" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审批" value="1"></el-option>
            <el-option label="审批通过" value="2"></el-option>
            <el-option label="审批不通过" value="3"></el-option>
          </el-select>
      </template>
      <template #btnList>
        <el-button type="primary" size="small" @click="initComFormList(1)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </template>
    </AsgHighSearch>
    <div class="asg-table-main">
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        :data="tableData" style="width:100%" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-card class="tableCard" shadow="hover">
              <div class="tableCard__container">
                <div class="left-container">
                  <el-form label-position="right" label-width="120px">
                    <el-form-item label="游戏账号">
                      <p>{{ props.row.game_id }}</p>
                    </el-form-item>
                    <el-form-item label="游戏段位">
                      <p>{{ toChies(props.row.history_rank) }}</p>
                    </el-form-item>
                    <el-form-item label="个人介绍">
                      <el-input style="width:80%" size="small" type="textarea" v-model="props.row.introduction" disabled
                        :rows="5"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="right-container">
                  <el-steps direction="vertical">
                    <el-step title="申请人" status="finish">
                      <template #description>
                        <el-card class="box-card">
                          <p class="title__info"><i class="el-icon-user-solid"></i>{{ props.row.chinaname }}</p>
                          <p><i class="el-icon-time"></i>{{ props.row.create_time }}</p>
                        </el-card>
                      </template>
                    </el-step>
                    <el-step title="审批结论" :status="computedStatus(props.row.status)">
                      <template #description>
                        <el-card class="box-card" v-if="props.row.status !== '1'">
                          <div
                            style="display: flex;justify-content: space-between;align-items: center;font-size: 1rem;">
                            <p class="title__info"><i class="el-icon-s-custom"></i>{{ props.row.approval_person }}</p>
                            <p :style="{ color: props.row.status === '2' ? '#67C23A' : '#f40' }">{{ props.row.status ===
                              '2' ? '通过' : '拒绝' }}</p>
                          </div>
                          <p><i class="el-icon-time"></i>{{ props.row.approval_time }}</p>
                        </el-card>
                        <el-alert v-else style="height:70px" title="待管理员审核" type="warning" :closable="false">
                        </el-alert>
                      </template>
                    </el-step>
                  </el-steps>
                </div>
              </div>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="chinaname" align="center"></el-table-column>
        <el-table-column label="联系方式" prop="contact_number" align="center"></el-table-column>
        <el-table-column label="性别" align="center" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="row.sex === 1 ? 'primary' : 'danger'">{{ row.sex === 1 ? '男' : '女' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" prop="bizType" align="center"></el-table-column>
        <el-table-column label="状态" align="center" width="150">
          <template #default="{ row }">
            <div style="display: flex;justify-content: center;">
              <p class="my-task-auth margin-icon" v-if="row.status === '1'">
                <i class="el-icon-warning"></i>待审核
              </p>
              <p class="my-task-success margin-icon" v-else-if="row.status === '2'">
                <i class="el-icon-success"></i>已接受
              </p>
              <p class="my-task-error margin-icon" v-else-if="row.status === '3'">
                <i class="el-icon-error"></i>已驳回
              </p>
              <p class="my-task-info margin-icon" v-else-if="row.status === '4'">
                <i class="el-icon-s-release"></i>已辞退
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <template v-if="row.status === '1'">
              <el-button type="text" @click="handleSet('2', row)">通过</el-button>
              <el-button style="color:#f40" type="text" @click="handleSet('3', row)">拒绝</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination style="text-align: right;" @size-change="handleChange($event, 'limit')"
      @current-change="handleChange($event, 'page')" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="关联业务发起" :visible.sync="dialogVisible" width="75%" top="5vh">
      <detail v-if="dialogVisible" type="add" :bizTypeOptions="rules" isDialog @returnBack="dialogVisible = false"></detail>
    </el-dialog>
  </div>

</template>

<script>
import { conformList, approvalCommentary } from "@/api/admin/index.js";
import AsgHighSearch from "@/components/AsgHighSearch.vue";
import { getByTitle } from "@/api/config";
import { setRole } from "@/api/home";
import { mapGetters } from "vuex";
import detail from "@/view/bizType/components/detail.vue";
export default {
  name: "exchange-page",
  components:{
    AsgHighSearch,
    detail
  },
  data() {
    return {
      tableData: [],
      listQuery: {
        chinaname: '',
        status: '',
        page: 1,
        limit: 10
      },
      total: 0,
      options: [],
      loading: false,
      rules: [],
      dialogVisible:false
    };
  },
  created() {
    getByTitle('historyRank').then(res => {
      this.options = res.data;
    })
    getByTitle('ruleConfig').then(res => {
      this.rules = res.data;
      this.initComFormList();
    })

  },
  computed: {
    ...mapGetters(['userInfo'])
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
    handleOpen(){
      this.dialogVisible = true;
    },
    toChies(value) {
      return this.options.find(item => item.value === value)?.label ?? '未知段位';
    },
    resetForm() {
      this.listQuery = {
        chinaname: '',
        status: '',
        page: 1,
        limit: 10
      }
      this.initComFormList();
    },
    initComFormList(page) {
      this.loading = true;
      if(page){
        this.listQuery.page = page;
      }
      conformList(this.listQuery)
        .then(res => {
          const { data } = res;
          if (data.code === 401) {
            return this.$message.error(data.message);
          }
          this.tableData = data.rows.map(item => {
            return {
              ...item,
              bizType: this.rules.find(el => el.bizType === item.biz_type)?.label ?? '未知业务'
            }
          });
          this.total = data.total;
        }).catch(err => {
          this.$message.error(err.message);
        }).finally(() => {
          this.loading = false;
        })
    },
    computedType(status) {
      const mapStatus = {
        '1': 'warning',
        '2': 'success',
        '3': 'danger'
      }
      return mapStatus[status];
    },
    handleChange(value, prop) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: value
      }
      this.initComFormList();
    },
    async handleSet(type, row) {
      try {
        const userChoose = await this.$confirm(`您确定${type === '2' ? '通过' : '拒绝'}该解说的应聘申请吗?`, '确定',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        if (userChoose === 'confirm') {
          const params = {
            id:row.id,
            approvalPerson: this.userInfo.chinaname || sessionStorage.getItem('chinaname'),
            status: type
          };
          const { data } = await approvalCommentary(params);
          if (data.code !== 200) throw new Error(data.message);
          this.loading = true;
          if (type === '2') {
            await setRole(row.user_id, row.req_role);
          }
          this.$message.success('操作成功!');
          this.initComFormList();
        }
      } catch (error) {
        this.loading = false;
        if (typeof error === 'string' && error === 'cancel') return;
        if (error instanceof Error) {
          return this.$message.error(error.message);
        }
        this.$message.error('服务端异常，请联系网站管理员');
      }
    },
    computedStatus(status) {
      const statusMap = {
        '0': 'wait',
        '1': 'process',
        '2': 'success',
        '3': 'error'
      }
      return statusMap[status];
    }
  },
};
</script>

<style scoped lang="less">
.icon-container {
  margin: 0 auto;
  width: 95%;
  height: 70vh;
}

header {
  margin: 0 auto;
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tableCard {
  width: 90%;
  margin: 12px auto;

  .introduction {
    color: #939393;

    .label {
      color: #303030;
      font-weight: bold;
    }
  }
}

.tableCard__container {
  display: grid;
  grid-template-columns: auto 350px;
}

/deep/.el-step__description {
  padding-right: 0 !important;
}

.title__info {
  color: #4090EF;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 6px;
}
</style>
