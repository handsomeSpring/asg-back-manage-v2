<template>
  <div>
    <!-- 搜索 -->
    <div class="operation_wrap">
      <div style="width: 580px">
        <el-input size="small" v-model="listQuery.keyword" clearable placeholder="请输入用户名搜索">
          <el-button size="small" slot="append" icon="el-icon-search" @click="initGetUsers(true)"></el-button>
        </el-input>
      </div>
    </div>
    <!-- 表格开始 -->
    <el-scrollbar style="height: calc(70vh - 40px)">
      <el-table :header-cell-style="{ background: '#f2f6fd', color: '#000' }" v-loading="loading" element-loading-text="数据加载中，请稍等" element-loading-spinner="el-icon-loading"
        :data="personList" border style="width: 100%">
        <el-table-column prop="id" label="序列号" width="90" align="center">
        </el-table-column>
        <el-table-column label="中文名" width="250" align="center">
          <template #default="{ row }">
            {{ row.chinaname || '暂未设置中文名' }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" width="250" align="center">
        </el-table-column>
        <el-table-column label="积分余额" width="150" align="center">
          <template #default="{ row }">
            <span>{{ row.integral === null ? '未开启积分' : row.integral }}</span>
          </template>
        </el-table-column>
        <el-table-column label="qq号" width="auto" align="center">
          <template #default="{ row }">
            <span>{{ !row.qqnumber ? '未绑定QQ' : row.qqnumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" width="250" align="center">
          <template #default="{ row, $index }">
            <p v-if="$index !== editIndex">{{ row.officium | filterRole }}<i class="el-icon-edit operate-icon edit"
                @click="handleEditRoles($index)"></i></p>
            <p v-else>
              <el-select style="width: 70%;" size="small" v-model="row.officium" placeholder="请选择职业" @change="handleJobChange($event, row)">
                <el-option v-for="item in jobs" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <i class="el-icon-close operate-icon closeType" @click="resetEditIndex"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleSetAdmin(scope.row.id)">
              设为管理员
            </el-button>
            <el-button type="text" @click="handleDelUser(scope.row.id)">
              <span style="color:red">删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-pagination style="float: right;margin-top: 12px;" background @current-change="handleChange('pageindex', $event)"
      @size-change="handleChange('pagesize', $event)" :current-page.sync="listQuery.pageindex"
      :page-size="listQuery.pagesize" layout="total,prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getUsers, setAdmin, delUser, setRole } from "@/api/home";
import { getByTitle } from "@/api/config";
export default {
  name: "survivorPage",
  data() {
    return {
      personList: [],
      //加载
      loading: false,
      //分页
      listQuery: {
        pageindex: 1,
        pagesize: 10,
        keyword: "",
      },
      total: 0,
      job: "",
      jobs: [],
      editIndex: null,
    };
  },
  created() {
    this.initGetUsers();
    this.initRoles();
  },
  methods: {
    handleEditRoles(index) {
      this.editIndex = index;
    },
    resetEditIndex() {
      this.editIndex = null;
    },
    initGetUsers(flag = false) {
      if (flag) {
        this.listQuery.pageindex = 1;
      }
      this.loading = true;
      const postParams = {
        ...this.listQuery,
        pageindex: this.listQuery.pageindex - 1,
      }
      getUsers(postParams)
        .then(({ data }) => {
          this.total = data.cout;
          this.personList = data.msg;
        })
        .catch((err) => {
          if (err.response.data.code === 400) {
            return this.$message.error('您无权访问，请更换管理员账号。');
          }
          this.$message.error('服务端异常，请联系网站管理员');
        })
        .finally(() => {
          this.loading = false;
        })
    },
    handleJobChange(value, row) {
      this.handleSetRoles(row.id, value);
    },
    // 设置管理员
    handleSetAdmin(id) {
      setAdmin(id)
        .then(() => {
          this.$message.success("设置成功！");
          this.initGetUsers();
        })
        .catch(() => {
          this.$message.error("设置失败，请联系超级管理员！");
        });
    },
    // 删除用户
    handleDelUser(id) {
      this.$confirm("此操作将永久删除该用户所有信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delUser(id)
            .then(() => {
              this.$message.success("删除成功！");
              this.initGetUsers();
            })
            .catch(() => {
              this.$message.error("删除失败，请联系超级管理员！");
            });
        })
        .catch(() => { });
    },
    //分页改变
    handleChange(prop, value) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: value,
      };
      this.initGetUsers();
    },
    //设置职位
    async handleSetRoles(id, job) {
      const loading = this.$loading({
        lock: true,
        text: "正在设置职位中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        await setRole(id, job);
        this.$message.success("设置成功！");
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        loading.close();
        this.initGetUsers();
        this.editIndex = null;
      }
    },
    initRoles() {
      getByTitle("roleList").then(res => {
        this.jobs = res.data;
      })
        .catch((err) => {
          this.$message.error("获取云端配置失败！")
        })
    }
  },
};
</script>

<style scoped lang="less">
.el-row {
  margin-bottom: 20px;
}

.operation_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-input {
  margin: 10px 0;
  width: 70%;
}

.operate-icon {
  font-size: 16px;
  margin-left: 12px;
  font-weight: bold;
  cursor: pointer;

  &.edit {
    color: #4090EF;

    &:hover {
      color: #94b9e7;
    }
  }

  &.closeType {
    color: #f40;

    &:hover {
      color: rgb(247, 132, 90);
    }
  }
}
</style>
