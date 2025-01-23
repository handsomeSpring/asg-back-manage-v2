<template>
  <div>
    <header>
      <svg-icon iconClass="promChart"></svg-icon>
      <p>战队晋升图制作中心</p>
    </header>
    <el-container>
      <el-aside>
        <el-scrollbar style="height: 100%">
          <div class="nav-container">
            <div class="nav-line"></div>
            <div class="nav-box title__box">
              <div class="icon-box">
                <i class="el-icon-menu"></i>
              </div>
              <h4>ASG赛季列表</h4>
            </div>
            <div class="nav-box" v-for="(item, index) in navList" :key="item.id">
              <div class="icon-box" :class="storage[index].isActive ? '' : 'transparent-box'">
                <i class="el-icon-s-promotion active" v-show="storage[index].isActive"></i>
              </div>
              <p class="normal" :class="storage[index].isActive ? 'active' : ''" @click="changeActive(item, index)">
                {{ item.name }}
              </p>
            </div>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <div class="main-header">
          <div style="
              display: flex;
              justify-content: start;
              align-items: center;
              gap: 20px;
            ">
            <h4>
              <i class="el-icon-s-promotion active"></i>{{ checkInfo.name }}
            </h4>
            <el-button size="small" type="primary" @click="dialogVisible = true">选择模板</el-button>
            <el-button size="small" type="success" @click="submit" style="margin-left: 0;">保存晋升图</el-button>
            <el-button size="small" type="primary" style="margin-left: 0;" @click="handleExport" v-loading.fullscreen.lock="fullscreenLoading">导出晋升图</el-button>
            <el-popover placement="top-start" title="提示" width="200" trigger="hover"
              content="减少服务器负担，发布后不会刷新晋升图，需要手动刷新">
              <el-button size="small" slot="reference" @click="handleRefresh">刷新</el-button>
            </el-popover>
          </div>
          <AsgCheckBox :value.sync="readOnly" active-text="查看" inactive-text="编辑"></AsgCheckBox>
          <p>{{ readOnly ? '查阅模式' : '编辑模式' }}</p>
          <div class="warning-text">
            <span style="margin-right: 12px">全屏打开</span>
            <i class="el-icon-full-screen" @click="changeFullscreen"></i>
          </div>
        </div>
        <div class="template" id="fullScreen" ref="imageWrapper">
          <p v-if="noChooseTemplate">未找到该赛季的晋升图设计记录</p>
          <component ref="templateComponent" :key="proPic" :propPromChart="promChart" v-if="!noChooseTemplate"
            :is="componentName" :readOnly="readOnly">
          </component>
        </div>
      </el-main>
    </el-container>
    <templateVue :dialogVisible.sync="dialogVisible" @changeName="changeComponent"></templateVue>
  </div>
</template>

<script>
import { getEventProm, updateProm } from "@/api/gameSeason/index.js";
import templateVue from "@/view/drag/components/template.vue";
import groupTeam from "./components/groupTeam.vue";
import championTem from "./components/championTem.vue";
import eightTem from "./components/eightTem.vue";
import screenfull from "screenfull";
import AsgCheckBox from '@/components/AsgCheckBox.vue'
import html2canvas from 'html2canvas';

export default {
  name: "dragIndex",
  components: {
    templateVue,
    groupTeam,
    championTem,
    eightTem,
    AsgCheckBox
  },
  data() {
    return {
      navList: [],
      storage: [],
      checkInfo: {},
      noChooseTemplate: true,
      fullVisible: false,
      componentName: "",
      proPic: 0,
      isFullScreen: false,
      dialogVisible: false,
      readOnly: true,
      fullscreenLoading:false,
    };
  },
  created() {
    this.getProm();
  },

  mounted() {
    screenfull.on("change", this.change);
  },
  unmounted() {
    screenfull.off("change", this.change);
  },

  computed: {
    promChart() {
      return this.checkInfo.promChart;
    },
  },
  methods: {
    handleExport() {
      this.fullscreenLoading = true;
      const clientWidth = this.$refs.imageWrapper.offsetWidth;
      const clientHeight = this.$refs.imageWrapper.offsetHeight;
      const kh = [clientWidth, clientHeight];
      
      html2canvas(this.$refs.imageWrapper,
        {
          useCORS: true,
          logging: true,
          allowTaint: true,
          background: null, // 一定要添加背景颜色，否则出来的图片，背景全部都是透明的
          scale: 2, // 处理模糊问题
          dpi: 360, // 处理模糊问题
        }).then((canvas) => {
          const dataURL = canvas.toDataURL('image/png');
          this.download(dataURL, kh);
        });
    },
    download(imgUrl, kh) {
      this.getUrlBase64(imgUrl, kh).then((base64) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = `${this.checkInfo.name}晋升图`;
        link.click();
        this.fullscreenLoading = false;
        this.$notify({
          title: '警告',
          message: '如果图片显示不全，请缩小屏幕后再导出。',
          type: 'warning'
        });
      });
    },
    getUrlBase64(url, kh) {
      return new Promise((resolve) => {
        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = window.SERVE_IP; // 允许跨域
        img.src = url;
        img.onload = () => {
          // eslint-disable-next-line prefer-destructuring
          canvas.height = kh[1];
          // eslint-disable-next-line prefer-destructuring
          canvas.width = kh[0];
          ctx.drawImage(img, 0, 0, kh[0], kh[1]);
          const dataURL = canvas.toDataURL('image/png');
          canvas = null;
          resolve(dataURL);
        };
      });
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    changeFullscreen() {
      let fullDom = document.getElementById("fullScreen");
      if (fullDom) screenfull.toggle(fullDom);
    },
    handleRefresh() {
      const loading = this.$loading({
        lock: true,
        text: "正在刷新数据中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      this.getProm();
      loading.close();
    },
    async getProm() {
      try {
        const { data } = await getEventProm();
        this.navList = data;
        this.storage = [];
        this.navList.forEach((value, index) => {
          const activeObj = {
            isActive: false,
          };
          if (index === 0) {
            activeObj.isActive = true;
          }
          this.storage.push(activeObj);
        });
        this.checkInfo = this.navList[0];
        this.checkIfTem();
      } catch (error) {
        console.log(error);
      }
    },
    changeActive(item, index) {
      this.noChooseTemplate = true;
      this.storage.forEach((item) => {
        item.isActive = false;
      });
      this.storage[index].isActive = true;
      this.checkInfo = item;
      if (!this.promChart) {
        this.noChooseTemplate = true;
      } else {
        this.noChooseTemplate = false;
        this.checkIfTem();
      }
      this.proPic++;
    },
    changeComponent(name) {
      this.noChooseTemplate = false;
      this.componentName = name;
    },
    submit() {
      if (this.noChooseTemplate) {
        this.$message.error("请配置模板！");
      } else {
        const loading = this.$loading({
          lock: true,
          text: "正在上传晋升图数据",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.8)",
        });
        console.log("模板", this.$refs.templateComponent.promChart);
        updateProm(
          this.checkInfo.id,
          JSON.stringify(this.$refs.templateComponent.promChart)
        )
          .then(() => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
          })
          .catch(() => {
            this.$notify.error({
              title: '错误',
              message: '服务端异常，请联系网站管理员'
            });
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    checkIfTem() {
      if (!this.promChart) {
        this.noChooseTemplate = true;
      } else {
        this.noChooseTemplate = false;
        const promObj = JSON.parse(this.promChart);
        this.componentName = promObj.componentName;
      }
    },
  },
};
</script>

<style scoped lang="less">
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e7e7e7;
}

.template {
  background-color: #f7f7f7;
  width: 100%;
  height: 90%;
  overflow-y: auto;

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #303030;
  }
}

header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 12px;
  border: 1px solid #e7e7e7;
}

.el-aside,
.el-main {
  height: calc(80vh - 40px);
  border: 1px solid #e7e7e7;
  margin: 6px;
}

.nav-container {
  padding: 12px;
  height: 100%;
  width: calc(100% - 24px);
  position: relative;

  .nav-line {
    height: 90%;
    width: 0;
    position: absolute;
    top: 7%;
    left: 19px;
    border: 2px solid gray;
  }
}

.transparent-box {
  background-color: transparent !important;
}

.nav-box {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 12px 0;
  height: 20px;

  .icon-box {
    width: 30px;
    height: 16px;
    line-height: 16px;
    background-color: #fff;
    z-index: 999;
    margin-left: 1px;
  }

  &.title__box {
    color: rgb(239, 155, 66);
  }
}

.normal {
  cursor: pointer;
}

.normal.active {
  color: #147aff;
}

.active {
  color: #147aff;
}

.warning-text {
  color: #147aff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/deep/.el-dialog__body {
  background-color: #303030;
}
</style>
