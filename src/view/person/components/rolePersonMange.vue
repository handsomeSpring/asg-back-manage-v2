<template>
  <div>
    <el-table height="70vh" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      :data="tableData" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
      <el-table-column prop="id" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column label="头像" width="150" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.base64">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="250" align="center">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;justify-content: center;">
            <p class="my-task-auth margin-icon" v-if="scope.row.isadmin">
              <i class="el-icon-s-custom"></i>管理员
            </p>
            <p class="my-task-success margin-icon" v-else>
              <i class="el-icon-user-solid"></i>常驻用户
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chinaname" label="姓名" width="250">
      </el-table-column>
      <el-table-column label="qq号" width="250">
        <template #default="{ row }">
          {{ row.qqnumber || '未绑定qq' }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="auto">
        <template #default="{ row }">
          {{ row.email || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button style="color:#f40" type="text" @click="refuseUser(row)">辞退</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { refuseCom } from "@/api/admin/index.js";
export default {
  name: 'CommentaryManager',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    refuseUser(row) {
      this.$confirm(`您确定将解说${row.chinaname}劝退吗？, 一旦操作无法恢复，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuseCom(row.id).then(() => {
          this.$message.success("劝退成功！");
          this.initGetCommentary();
        })
          .catch((err) => {
            this.$message.error(err.message);
          })
      })
    }
  },
};
</script>

<style scoped lang="less"></style>
