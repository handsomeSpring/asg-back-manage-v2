<template>
  <div>
    <el-table v-loading="loading" :data="commentator" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
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
              <i class="el-icon-s-custom"></i>解说管理员
            </p>
            <p class="my-task-success margin-icon" v-else>
              <i class="el-icon-user-solid"></i>常驻解说
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chinaname" label="姓名" width="auto">
      </el-table-column>
      <el-table-column label="邮箱" width="350">
        <template #default="{ row }">
          {{ row.email || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button style="color:#f40" type="text" @click="refuseUser(row)">劝退</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserRoles } from "@/api/schedule/index";
import { refuseCom } from "@/api/admin/index.js";
export default {
  name: 'CommentaryManager',
  mounted() {
    this.initGetCommentary();
  },
  data() {
    return {
      commentator: [],
      loading: false,
    };
  },
  methods: {
    initGetCommentary() {
      this.loading = true;
      let params = {
        opname: "Commentator",
      };
      getUserRoles(params)
        .then((res) => {
          this.commentator = res.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
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
