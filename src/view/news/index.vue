<template>
  <div class="news-content">
    <header>
      <el-select size="small" v-model="search_Type" @change="initNews">
        <el-option label="全部公告" value=""></el-option>
        <el-option v-for="(item, index) in noticeType" :key="index" :value="item.type" :label="item.label"></el-option>
      </el-select>
      <el-button icon="el-icon-plus" style="margin-bottom:12px" type="primary" size="small"
        @click="openDialog">发布公告</el-button>
    </header>
    <el-dialog :visible.sync="isShowBox" :title="dialogName" :fullscreen="isMobile" width="40%"
      :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-position="isMobile ? 'top' : 'left'"
        label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input size="small" v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select size="small" v-model="form.type">
            <el-option v-for="(item, index) in noticeType" :key="index" :value="item.type"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容" prop="msg">
          <el-input type="textarea" :rows="isMobile ? 10 : 5" v-model="form.msg" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" size="small" type="primary" @click="handleSubmit('ruleForm')">{{ dialogName
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-skeleton :rows="6" :loading="loading" animated />
    <template v-if="!loading">
      <el-timeline v-if="newsData.length > 0">
        <el-timeline-item v-for="(activity, index) in newsData" :key="index" :timestamp="handleTime(activity.time)"
          placement="top">
          <el-card style="position: relative;">
            <header>
              <div class="position-l">
                <p v-if="activity.type === '1'" class="my-task-auth margin-icon">
                  <i class="el-icon-s-order"></i>{{ activity.type | noticeType }}
                </p>
                <p class="my-task-success margin-icon" v-else>
                  <i class="el-icon-s-order"></i>{{ activity.type | noticeType }}
                </p>
                <el-tag size="small"><i class="el-icon-s-custom"></i>{{ activity.formName }}</el-tag>
              </div>
              <p class="position-w">
                <i class="el-icon-edit edit-icon" @click="openUpdDialog(activity)"></i>
                <i class="el-icon-delete-solid del-icon" @click="delNews(activity)"></i>
              </p>
            </header>
            <p class="msg__container">{{ activity.msg }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无公告"></el-empty>
    </template>
  </div>
</template>

<script>
import { pushNews, getNews, delNews, updateNews } from "@/api/news/index";
import { getByTitle } from "@/api/config";
import { isMobile } from "@/utils";
export default {
  name: "News-publish",
  data() {
    return {
      form: {
        title: "",
        type: "",
        msg: "",
      },
      search_Type: '',
      dialogName: '新增公告',
      newsData: [],
      isShowBox: false,
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择公告类型', trigger: 'change' },
        ],
        msg: [
          { required: true, message: '请输入公告内容', trigger: 'change' }
        ],
      },
      isMobile: false,
      noticeType: [],
      loading: true
    };
  },
  filters: {
    noticeType(value) {
      return value === '1' ? '官网公告' : '解说活动';
    }
  },
  async created() {
    this.loading = true;
    this.isMobile = isMobile();
    const { data } = await getByTitle('noticeType');
    this.noticeType = data;
    this.initNews();
  },
  methods: {
    handleTime(time) {
      return time.slice(0, 10);
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogName === '新增公告') {
            this.pushNews();
          } else {
            this.updNews();
          }
        } else {
          this.$message.error('请完整填写表单内容');
          return false;
        }
      });
    },
    async pushNews() {
      try {
        const { data, status } = await pushNews(this.form);
        if (status !== 200) throw new Error('后端服务器异常，请联系后端人员修复！');
        if (data.code && data.code !== 200) throw new Error(data?.message ?? '未知错误！');
        this.$message.success("发布成功！");
        this.form = {};
        this.isShowBox = false;
        this.initNews();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async updNews() {
      try {
        const { data, status } = await updateNews(this.form);
        console.log('===', this.form)
        if (status !== 200) throw new Error('后端服务器异常，请联系后端人员修复！');
        if (data.code && data.code !== 200) throw new Error(data?.message ?? '未知错误！');
        this.$message.success("更新成功！");
        this.form.title = '';
        this.form.msg = '';
        this.isShowBox = false;
        this.initNews();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    //获取news
    async initNews() {
      try {
        this.loading = true;
        const { data, status } = await getNews(this.search_Type);
        if (status !== 200) throw new Error('后端服务器异常，请联系后端人员修复！');
        this.newsData = data;
      } catch (error) {
        this.newsData = [];
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    //删除公告
    delNews(row) {
      this.$confirm("是否确认删除该公告", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delNews(row.id)
          .then(() => {
            this.$message.success("删除成功！");
            this.initNews();
          })
          .catch(() => {
            console.log("err");
          });
      });
    },
    //新增公告
    openDialog() {
      this.form = {};
      this.dialogName = '新增公告';
      this.isShowBox = true;
    },
    //编辑公告
    openUpdDialog(row) {
      console.log(row, 'row===是')
      this.form = {
        ...row
      };
      this.dialogName = '更新公告';
      this.isShowBox = true;
    }
  }
};
</script>

<style scoped lang="less">
@import url('../../assets/mobileStyles/news/index.less');

#icon-show {
  margin-left: 20px;
  font-size: 16px;
}

header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  .position-l {
    display: flex;
    gap: 12px;
    margin-bottom: 6px;
  }

  .position-w {
    cursor: pointer;
    font-size: 20px;

    .del-icon {
      color: #f40;

      &:hover {
        color: lighten(#f40, 20%);
      }
    }

    .edit-icon {
      color: #4099EF;
      margin-right: 12px;

      &:hover {
        color: lighten(#4099EF, 20%);
      }
    }
  }
}

.msg__container {
  text-indent: 2em;
}
</style>
