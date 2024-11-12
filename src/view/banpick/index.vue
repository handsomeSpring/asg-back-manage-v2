<template>
  <div>
    <div class="btn_wrap">
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addItem">添加名单</el-button>
    </div>
    <white :tableData="whiteData" :total="total" :listQuery="listQuery" @deleteWhite="handleDelete"
      @sizechange="handleSizeChange" @pagechange="handlePageChange" @edit="editItem"></white>
    <el-drawer title="新增名单" :visible.sync="drawer" :before-close="handleClose">
      <div style="padding: 20px; margin-bottom: 50px">
        <el-form ref="form" :model="form" label-position="right" label-width="120px" :rules="rules"
          @submit.native.prevent>
          <el-form-item v-if="this.pageType === 'add'" label="LOGO" prop="logo">
            <button v-if="!isImg" class="logo-wrap" @click="importFile">
              <div class="child-item"><i class="el-icon-upload"></i></div>
              <p class="text">合作方logo</p>
            </button>
            <div class="over_content" v-else>
              <img class="image" :src="form.logo" />
              <div class="operation__line" @click="deleteImg">
                  删除logo
              </div>
            </div>

            <div v-show="false">
              <input id="fileInput" ref="importRef" type="file" @input="handleFile" accept="image/png,image/jpeg" />
            </div>
          </el-form-item>
          <el-form-item label="优先级" prop="degree">
            <el-slider v-model="form.degree" :step="1" show-stops :min="1" :max="10">
            </el-slider>
          </el-form-item>
          <el-form-item label="合作方全称" prop="orgName">
            <el-input size="small" v-model="form.orgName" clearable placeholder="请输入合作方全称"></el-input>
          </el-form-item>
          <el-form-item label="合作类型" prop="comType">
            <el-popover placement="top-start" title="已选合作类型" width="200" trigger="hover" :content="form.comType">
              <el-input slot="reference" v-model="form.comType" disabled size="small">
                <el-button slot="append" @click="treeNode = true">增加<i class="el-icon-plus"></i></el-button>
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="合作内容" prop="comMsg">
            <el-input type="textarea" :rows="5" size="small" maxlength="250" show-word-limit v-model="form.comMsg"
              placeholder="请输入合作内容"></el-input>
          </el-form-item>
          <el-form-item label="负责人姓名" prop="headName">
            <el-input size="small" v-model="form.headName" placeholder="请输入负责人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="headTel">
            <el-input size="small" v-model="form.headTel" placeholder="请输入联系方式" clearable></el-input>
          </el-form-item>
          <el-form-item label="社交媒体账号" prop="account">
            <el-input size="small" v-model="form.account" placeholder="请输入社交媒体账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="合作时间" prop="comTime">
            <el-date-picker size="small" v-model="form.comTime" type="date" placeholder="选择合作日期" clearable>
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="save_btn">
        <el-button type="primary" size="small" @click="submit('form')">{{
          this.pageType === "add" ? "保存新增" : "完成修改"
        }}</el-button>
      </div>
      <tree-node :treeNode.sync="treeNode" @save="saveNodes"></tree-node>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";
import white from "./components/white.vue";
import TreeNode from "./components/TreeNode.vue";
import {
  getFriendList,
  saveFriend,
  deleteFriend,
  putFriend,
} from "@/api/admin/index";

export default {
  name: "CoratorTeam",
  components: {
    white,
    TreeNode,
  },
  data() {
    return {
      listQuery: {
        page: 1,
        page_long: 10,
      },
      whiteData: [],
      drawer: false,
      form: {
        degree: 1,
      },
      pageType: "",
      logoFile: null,
      isImg: false,
      total: 0,
      rules: {
        logo: [{ required: true, message: "请选择战队LOGO", trigger: "blur" }],
        orgName: [
          { required: true, message: "请输入合作方组织全称", trigger: "blur" },
        ],
        headName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
        ],
        comType: [
          { required: true, message: "请选择合作类型", trigger: "change" },
        ],
        comMsg: [
          { required: true, message: "请输入合作内容", trigger: "blur" },
        ],
        headTel: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        account: [
          { required: true, message: "请输入社交媒体账号", trigger: "blur" },
        ],
        comTime: [
          { required: true, message: "请输入合作时间", trigger: "change" },
        ],
      },
      treeNode: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const {
        data: { friend, total },
        status,
      } = await getFriendList(this.listQuery);
      if (status === 200) {
        this.whiteData = friend;
        this.total = total || 10;
      }
    },
    handleClick(tab) {
      this.activeName = tab.name;
    },
    handleClose() {
      this.form = {};
      this.$refs.form.resetFields();
      this.isImg = false;
      this.drawer = false;
    },
    handleFile(e) {
      const file = e.target.files[0];
      const isPNG = ["image/png"].includes(file.type);
      if (!isPNG) {
        return this.$message.error("只允许上传PNG格式，QQ截图即是PNG格式!");
      }
      this.logoFile = file;
      this.form.logo = window.URL.createObjectURL(file);
      this.isImg = true;
    },
    importFile() {
      if (!this.form.orgName) {
        return this.$message.error('请先输入合作方全称，再上传头像');
      }
      this.$refs.importRef.click();
    },
    deleteImg() {
      this.$refs.importRef.value = "";
      this.isImg = false;
      this.form.logo = null;
    },
    addItem() {
      this.drawer = true;
      this.pageType = "add";
    },
    editItem(row) {
      this.drawer = true;
      this.pageType = "edit";
      const cloneRow = Object.assign({}, row);
      this.$set(this, "form", cloneRow);
      // this.form = row
      this.form.logo = "completeValidate";
    },
    handleImgFile(file) {
      console.log(this.form, 'this.form');
      const fileType = file.type.split("/");
      let fileName = this.form.orgName + "." + fileType[1];
      let renameFile = new File([file], fileName, {
        type: file.type,
      });
      let formdata = new FormData();
      console.log(renameFile, 'renameFile');
      formdata.append("imageFile", renameFile);
      axios
        .post(`${window.SERVE_IP}/api/v1/admin/updata_img`, formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          this.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    time(time) {
      let month = time.getMonth() + 1; // 月
      let date = time.getDate(); // 日
      let hh = time.getHours(); // 时
      let mm = time.getMinutes(); // 分
      let ss = time.getSeconds(); // 秒
      if (hh >= 0 && hh < 10) {
        hh = "0" + hh;
      }
      if (mm >= 0 && mm < 10) {
        mm = "0" + mm;
      }
      if (ss >= 0 && ss < 10) {
        ss = "0" + ss;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      return (
        time.getFullYear().toString() +
        month.toString() +
        date.toString() +
        hh.toString() +
        mm.toString() +
        ss.toString()
      );
    },
    saveNodes(string) {
      this.$set(this.form, "comType", string);
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pageType === "add") {
            saveFriend(this.form).then(() => {
              this.$message.success("保存成功！");
              this.getList();
              this.handleImgFile(this.logoFile);
            });
          } else {
            this.form = {
              ...this.form,
              friend_id: this.form.id,
            };
            putFriend(this.form).then(() => {
              this.$message.success("修改成功！");
              this.getList();
              this.handleClose();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除
    async handleDelete(id) {
      const { status } = await deleteFriend(id);
      if (status === 200) {
        this.$message.success("删除成功！");
        this.getList();
      }
    },
    // handleSizeChange
    handleSizeChange(val) {
      this.listQuery.page_long = val;
      this.getList();
    },
    handlePageChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="less">
.btn_wrap {
  margin: 12px 0;
}

.save_btn {
  position: fixed;
  bottom: 0;
  height: 40px;
  width: 460px;
  padding: 5px 0;
  border-top: 1px solid #e7e7e7;
  text-align: center;
}

.logo-wrap {
  width: 80px;
  height: 80px;
  outline: none;
  background-color: #EBF3FE;
  border: 1px dashed #0C80E5;
  border-radius: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    background-color: #5f9fd4;

    .child-item i,
    .text {
      color: #fff;
    }
  }
}

.child-item {
  width: 20px;
  height: 20px;

  i {
    color: #5f9fd4;
  }
}

.text {
  color: #5f9fd4;
  font-size: 13px;
}

.over_content {
  position: relative;
  .image {
    width: 80px;
    height: 80px;
    border: 1px dashed #0C80E5;
    border-radius: 8%;
  }

  .operation__line {
    position: absolute;
    top:80px;
    padding:3px;
    width:76px;
    color:#f40;
    cursor: pointer;
    font-size: 14px;
    &:hover{
      color:rgb(233, 148, 148);
    }
  }
}


.pointPos {
  position: absolute;
  left: 0;
  color: red;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: #ebb563;
  }
}

/deep/.el-input-group__append {
  background-color: #238cc4;
  border-radius: 0 !important;
  color: #fff;
  font-weight: bold;

  &:hover {
    background-color: #55b0e1;
  }
}
</style>
