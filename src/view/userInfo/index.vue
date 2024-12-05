<template>
  <div>
    <div class="menu_title" v-show="!isMobile">
      <TextTitle titleName="个人中心"></TextTitle>
    </div>
    <div class="form__content">
      <el-form :model="form" :label-position="isMobile? 'top' : 'right'" label-width="120px">
        <el-row>
          <el-col :span="isMobile ? 24 : 12">
            <el-form-item :label="isMobile ? '':'头像：'">
              <div class="image__container">
                <el-image :src="avatar" style="width: 100px; height: 100px">
                  <div slot="error">
                    <img
                      style="
                        width: 99px;
                        height: 98px;
                        border: 1px dashed #4090ef;
                      "
                      src="@/assets/images/logo.png"
                    />
                  </div>
                </el-image>
                <div class="mask__content">
                  <p @click="uploadAvatar">更新头像</p>
                </div>
              </div>
              <input
                id="avatar"
                type="file"
                style="display: none"
                @input="beforeInputAvatar"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="中文名：">
              <p v-if="!chinaEdit">
                <span>{{ userInfo.chinaname }}</span>
                <span class="edit__icon" @click="chinaEdit = !chinaEdit"
                  >修改</span
                >
              </p>
              <el-input
                v-else
                v-model="form.chinaname"
                size="small"
                @blur="changeName"
              >
                <template slot="append">
                  <i class="el-icon-close" @click="chinaEdit = !chinaEdit"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="qq号：">
              <p v-if="!qqEdit">
                <span>{{ userInfo.qqnumber }}</span>
                <span class="edit__icon" @click="qqEdit = !qqEdit">修改</span>
              </p>
              <el-input
                v-else
                v-model="form.qqnumber"
                size="small"
                placeholder="请输入QQ号"
                clearable
                @blur="changeQQ"
              >
                <template slot="append">
                  <i class="el-icon-close" @click="qqEdit = !qqEdit"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="职位：">
              <p>{{ userInfo.officium | filterRole }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="用户名：">
              <p>{{ userInfo.name }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户编号：">
              <p>{{ userInfo.id }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="积分：">
              <p>{{ userInfo.money || "未开启积分" }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="权限：">
              <div style="line-height:20px;margin-top:8px">
                <p
                  v-if="userInfo.isadmin"
                  class="my-task-auth"
                >
                  管理员
                </p>
                <p v-else class="my-task-info">
                  <i class="el-icon-user-solid"></i>普通用户
                </p>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-form-item label="岗位：">
                <div v-if="roleArray.length > 0" class="role__content">
                    <el-tag style="margin-right:12px" v-for="(item, index) in roleArray" :key="index" type="primary" size="small">
                     {{ item }}
                    </el-tag>
                </div>
                <div v-else>无岗位信息</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateChinaName } from "@/api/home/index.js";
import { uploadImg } from "@/api/home/index.js";
import { mapGetters } from "vuex";
import { updateQQ } from "@/api/login";
import TextTitle from "@/components/TextTitle.vue";
import { isMobile } from "@/utils";
export default {
  name: "userInfo",
  components: {
    TextTitle,
  },
  data() {
    return {
      form: {
        chinaname: "",
        qqnumber: "",
      },
      chinaEdit: false,
      qqEdit: false,
      isMobile:false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    avatar() {
      return this.userInfo.base64 || sessionStorage.getItem("baseImg");
    },
    roleArray(){
        return this.userInfo.roleListName ? this.userInfo.roleListName.split(',') : []
    }
  },
  methods: {
    uploadAvatar() {
      const ipt = document.getElementById("avatar");
      ipt.click();
    },
    beforeInputAvatar(e) {
      try {
        const fileTypes = ["JPEG", "JPEG", "PNG"]; //文件后缀只能是这五类
        const maxSize = 1024;
        const file = e.target.files[0];
        const fileType = file.type.split("/").at(-1).toUpperCase();
        const fileSize = file.size / 1024;
        if (!fileTypes.includes(fileType))
          throw new Error("头像只允许是JPG、JPEG、或者是PNG类型");
        if (fileSize > maxSize) throw new Error("图片不能超过1MB");
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const vue = this;
        reader.onload = async function (event) {
          const fileBase = event.target.result;
          const { status } = await uploadImg(fileBase);
          if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
          vue.$message.success("上传成功");
          vue.$store.commit("SET_LOGO", fileBase);
        };
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async changeQQ() {
      try {
        const qq = this.form.qqnumber;
        const { status } = await updateQQ(qq);
        if (status !== 200) throw new Error("操作失败，后端异常");
        this.$message.success("修改成功");
        this.$store.commit("UPDATE_QQ", this.form.qqnumber);
        this.qqEdit = false;
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async changeName() {
      console.log(this.form.chinaname);
      if (!this.form.chinaname) {
        return this.$message.error("请输入中文名");
      }
      try {
        await updateChinaName(this.form.chinaname);
        this.$store.commit("UPDATE_NAME", this.form.chinaname);
        this.$message.success("修改成功！");
        this.chinaEdit = false;
      } catch (error) {
        this.$message.error("服务端异常，请联系网站管理");
      } finally {
        this.isEdit = false;
      }
    },
  },
  created() {
    this.isMobile = isMobile();
    this.form.chinaname = this.userInfo.chinaname;
    this.form.qqnumber = this.userInfo.qqnumber;
  },
};
</script>
<style lang="less" scoped>
.menu_title {
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid #e7e7e7;
  font-weight: bold;
}
.form__content {
  margin: 24px auto;
  width: 80%;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  padding: 24px 5%;

  .edit__icon {
    margin-left: 10px;
    color: #169bd5;
    font-size:1rem;
    font-weight: 500;
    cursor: pointer;
  }
}

.image__container {
  width: 100px;
  height: 100px;
  position: relative;

  .mask__content {
    position: absolute;
    inset: 0;
    align-items: center;
    justify-content: center;
    display: none;
    background: rgba(0, 0, 0, 0.63);
    cursor: pointer;

    p {
      color: #4090ef;
    }
  }

  &:hover {
    .mask__content {
      display: flex;
    }
  }
}
@media (max-width: 1024px) {
  .form__content{
    width:95%;
    margin:1em auto;
    border:none;
  }
}
</style>
