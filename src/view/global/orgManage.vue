<template>
  <div class="asg-table-main">
    <AsgTable :data="orgTableData" border style="width: 100%" v-loading="loading"
      :header-cell-style="{ background: '#f2f6fd', color: '#000', 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }" @operation="handleOpenDialog('add')">
      <template #mark>
        <div class="mark-container">
          <el-button type="text" @click="handleSave">保存表格</el-button>
          <p>一共拥有{{ orgTableData.length }}个成员职位</p>
        </div>
      </template>
      <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
      <el-table-column label="用户名" prop="name" width="180px" align="center"></el-table-column>
      <el-table-column label="职位" prop="role" align="center"></el-table-column>
      <el-table-column label="工作内容" prop="worker" width="220px" align="center"></el-table-column>
      <el-table-column label="工作细节" prop="description" align="center" min-width="320px"></el-table-column>
      <el-table-column label="操作" width="180px" align="center">
        <template #default="{ row, $index }">
          <el-button type="text" @click="handleOpenDialog('edit', row, $index)">编辑</el-button>
          <el-button type="text" @click="handleDelete($index)">删除</el-button>
        </template>
      </el-table-column>
    </AsgTable>
    <el-dialog :title="dialogType === 'add' ? '新增人员' : '编辑人员'" width="50%" :visible.sync="dialogVisible">
      <el-form :model="form" label-position="right" label-width="150px">
        <el-form-item label="成员名" prop="name">
          <el-input size="small" v-model="form.name" @focus="handleOpenPersonChoose"></el-input>
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
        <el-button size="small" type="primary" @click="updateOrAdd">{{ dialogType === 'add' ? '新增人员' : '更新信息'
        }}</el-button>
      </span>
    </el-dialog>
    <AsgPersonChoose ref="personChooseDialog" @finish="chooseFinish"></AsgPersonChoose>
  </div>
</template>

<script>
import { getByTitle, addConfig } from "@/api/config";
import { deepClone } from "@/utils";
import AsgTable from "@/components/AsgTable.vue";
import AsgPersonChoose from "@/components/AsgPersonChoose.vue";
export default {
  name: "orgManage",
  components: {
    AsgTable,
    AsgPersonChoose
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
      },
      index: 0,
    }
  },
  created() {
    this.initLayout();
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm('你确定要离开此页面吗？离开页面默认保存您刚才填写的内容！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '再修改一下',
      type: 'warning'
    }).then(() => {
      this.handleSave();
      next();
    }).catch(() => {
      // 用户点击了取消
      next(false);
    });
  },
  methods: {
    handleOpenPersonChoose() {
      this.$refs.personChooseDialog?.openDialog();
    },
    chooseFinish(node) {
      const { label, officium } = node;
      this.form.name = label;
      this.form.role = officium;
    },
    handleDelete(index) {
      this.orgTableData.splice(index, 1);
    },
    handleOpenDialog(type, row = {}, index) {
      this.index = 0;
      this.dialogType = type;
      if (this.dialogType === 'edit') {
        this.form = deepClone(row);
        this.index = index;
      }
      this.dialogVisible = true;
    },
    updateOrAdd() {
      if (this.dialogType === 'add') {
        this.orgTableData.push(this.form);
      } else {
        this.$set(this.orgTableData, this.index, this.form)
      }
      this.form = {
        name: '',
        role: '',
        worker: '',
        description: ''
      },
        this.dialogVisible = false;
    },
    handleSave() {
      this.loading = true;
      const param = {
        id: 349,
        msg: "组织机构管理",
        substance: JSON.stringify(this.orgTableData),
        title: "orgConfig",
      };
      addConfig(param).then(() => {
        this.$message.success("保存成功！");
        this.loading = false;
      }).catch((err) => {
        this.$message.error(err.message);
        this.loading = false;
      })
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

<style lang="less" scoped>
.mark-container {
  display: flex;
  align-items: center;
  gap: 1rem;

  p {
    font-size: 0.85rem;
    color: #4080EF;
  }
}
</style>
