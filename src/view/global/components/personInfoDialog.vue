<template>
  <el-dialog
    :visible.sync="visible"
    title="新增人员"
    width="40%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="el-form-custom">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="成员姓名" prop="name">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="role">
          <el-input size="small" v-model="form.role"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            size="small"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <div class="footer-list">
        <el-button type="primary" size="small" @click="handleConfirm"
          >确 认</el-button
        >
        <el-button plain size="small" @click="handleClose">关 闭</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "personInfoDialog",
  data() {
    return {
      form: {
        name: "",
        role: "",
        sex: "",
        remark: "",
      },
      visible: false,
      tagIndex: null,
      rules:{
        name:[
            {
                required:true,message:'请填写名称',trigger:'blur'
            }
        ],
        role:[
            {
                required:true,message:'请填写职位',trigger:'blur'
            }
        ],
        sex:[
            {
                required:true,message:'请选择性别',trigger:'change'
            }
        ],
      }
    };
  },
  methods: {
    openDialog(type, row, index) {
      this.tagIndex = index;
      if (type === "edit") {
        this.form = row;
      } else {
        this.form = {
          name: "",
          role: "",
          sex: "",
          remark: "",
        };
      }
      this.visible = true;
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("finish", this.form, this.tagIndex);
          this.visible = false;
        } else {
          this.$message.error("请完成填写表单！");
        }
      });
    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="less">
.el-form-custom {
  width: 90%;
  margin: 0 auto;
}
.footer-list {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
