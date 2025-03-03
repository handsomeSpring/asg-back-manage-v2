<template>
  <div class="asg-table-main">
    <AsgTable :data="orgTableData" border style="width: 100%" :loading="loading"
      :header-cell-style="{ background: '#f2f6fd', color: '#000', 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }" @operation="handleOpenDialog('add')">
      <template #mark>
        <p>一共拥有{{ orgTableData.length }}个成员职位</p>
      </template>
      <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
      <el-table-column label="用户名" prop="name" width="180px" align="center"></el-table-column>
      <el-table-column label="职位" prop="role" align="center"></el-table-column>
      <el-table-column label="工作内容" prop="worker" width="220px" align="center"></el-table-column>
      <el-table-column label="工作细节" prop="description" align="center" min-width="320px"></el-table-column>
      <el-table-column label="操作" width="180px" align="center">
           <template #default="{row}">
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
           </template>
      </el-table-column>
    </AsgTable>
    <el-dialog :title="dialogType === 'add' ? '新增人员' : '编辑人员'" width="50%" :visible.sync="dialogVisible">
      <el-form :model="form" label-position="right" label-width="150px">
        <el-form-item label="成员名" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="role">
          <el-input size="small" v-model="form.role"></el-input>
        </el-form-item>
        <el-form-item label="工作职责" prop="workear">
          <el-input size="small" v-model="form.worker"></el-input>
        </el-form-item>
        <el-form-item label="具体细节" prop="description">
          <el-input size="small" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary">新增</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getByTitle, addConfig } from "@/api/config";
import { deepClone } from "@/utils";
import AsgTable from "@/components/AsgTable.vue";
export default {
  name: "orgManage",
  components: {
    AsgTable
  },
  data() {
    return {
      orgTableData: [],
      dialogType: 'add',
      dialogVisible: false,
      loading: false,
      form: {
        name: '',
        role: '',
        worker: '',
        description: ''
      }
    }
  },
  created() {
    this.initLayout();
  },
  methods: {
    handleOpenDialog(type) {
      this.dialogType = type;
      this.dialogVisible = true;
    },
    handleSave() {
      const param = {
        id: 349,
        msg: "组织机构管理",
        substance: JSON.stringify(this.orgTableData),
        title: "orgConfig",
      };
      addConfig(param).then(() => {
        this.$message.success("保存成功！");
      });
    },
    async initLayout() {
      try {
        this.loading = true;
        const { status, data } = await getByTitle("orgConfig");
        if (status !== 200) throw new Error("服务端异常");
        this.orgTableData = data;
      } catch (error) {
        this.$message.error("orgConfig未找到:" + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
