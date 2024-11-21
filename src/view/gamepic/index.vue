<template>
  <div>
    <header>
      <el-button @click="drawer = true" size="small" type="primary">
        制作<i class="el-icon-edit"></i>
      </el-button>
      <el-button size="small" type="primary" @click="handleOnExport" id="onExport">
        导出<i class="el-icon-top-right"></i>
      </el-button>
    </header>
    <div class="picture" ref="imageWrapper">
      <img ref="bg" class="background-wrap" :src="bgImg" />
      <div class="icon">
        <img class="icon-img" src="@/assets/images/logo.png" />
      </div>
      <div class="title-wrap" ref="titleWrap">
        <p ref="title">{{ eventname }}</p>
      </div>
      <div class="pk-wrap">
        <p ref="vs" class="pk">VS</p>
      </div>
      <img class="host-wrap" :src="hostImgSrc" />
      <img class="cust-wrap" :Src="custImgSrc" />
      <div class="host-text-wrap">
        <p>{{ hostImg.team_name }}</p>
      </div>
      <div class="cust-text-wrap">
        <p>{{ custImg.team_name }}</p>
      </div>
      <div class="bottom-wrap" ref="bottomWrap">
        <p ref="gameTime" class="gameTime">{{ gameTime }}</p>
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
      title="操作区域"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-scrollbar style="height: 80vh; padding: 12px">
        <h4>背景图制作</h4>
        <clip-vue @clipSure="changeSrc"></clip-vue>
        <h4>选择赛季</h4>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-select
            v-model="eventname"
            size="mini"
            placeholder="请选择赛季"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-color-picker
            @change="setColor"
            size="small"
            v-model="textColor"
          ></el-color-picker>
        </div>
        <el-input
          v-model="topMargin"
          placeholder="调节标题的上边距"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-edit"
            @click="setMargin"
          ></el-button>
        </el-input>
        <el-row>
          <el-col :span="12">
            <h4>主场战队</h4>
            <el-select
              value-key="id"
              v-model="hostImg"
              size="mini"
              placeholder="请选择赛季"
            >
              <el-option
                v-for="item in teamInfos"
                :key="item.id"
                :label="item.team_name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <h4>客场战队</h4>
            <el-select
              value-key="id"
              v-model="custImg"
              size="mini"
              placeholder="请选择赛季"
            >
              <el-option
                v-for="item in teamInfos"
                :key="item.id"
                :label="item.team_name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <h4>填写比赛日期</h4>
        <el-input size="small" v-model="gameTime"></el-input>
        <el-input
          v-model="bottomMargin"
          placeholder="调节日期的下边距"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-edit"
            @click="setDataMargin"
          ></el-button>
        </el-input>
        <el-color-picker
          @change="setDataColor"
          size="small"
          v-model="textDataColor"
        ></el-color-picker>
        <h4>修改VS的颜色</h4>
        <el-color-picker
          @change="setVSColor"
          size="small"
          v-model="textVSColor"
        ></el-color-picker>
        <h4>设置背景透明度</h4>
        <el-slider v-model="stepOp" :max="1" :min="0" :step="0.1" show-stops>
        </el-slider>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import ClipVue from "@/components/ClipVue.vue";
import html2canvas from 'html2canvas';
import { getAllEvents, getPlayerDetails } from "@/api/gameSeason/index";
export default {
  name: "gamePic",
  components: {
    ClipVue,
  },
  data() {
    return {
      bgImg: "",
      drawer: false,
      eventname: "",
      hostImg: "",
      custImg: "",
      options: [],
      teamInfos: [],
      gameTime: "", //比赛时间
      textColor: "", //字体颜色
      textDataColor: "", //日期颜色
      textVSColor: "", //VS的颜色
      topMargin: "", //标题上边距
      bottomMargin: "", //日期下边距
      stepOp: 1, //透明度
    };
  },
  created() {
    this.initSeason();
  },
  computed:{
    hostImgSrc(){
      return `${window.SERVE_IP}/loge/${this.eventname}/${this.hostImg.team_name}.png`
    },
    custImgSrc(){
      return `${window.SERVE_IP}/loge/${this.eventname}/${this.custImg.team_name}.png`
    }
  },
  watch: {
    stepOp(newValue) {
      this.$refs.bg.style.opacity = newValue;
    },
  },
  methods: {
    changeSrc(src) {
      this.bgImg = src;
    },
    initSeason() {
      getAllEvents()
        .then((res) => {
          this.options = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取详细信息
    async getPlayerDetails() {
      let { data } = await getPlayerDetails(this.eventname);
      this.teamInfos = data;
    },
    handleChange() {
      this.getPlayerDetails();
    },
    setColor(val) {
      if (!this.eventname) {
        this.$message.error("请选择赛季！");
        return;
      }
      this.$refs.title.style.color = val;
      this.$refs.title.style.borderColor = val;
    },
    setDataColor(val) {
      if (!this.eventname) {
        this.$message.error("请选择赛季！");
        return;
      }
      this.$refs.gameTime.style.color = val;
    },
    setVSColor(val) {
      if (!this.eventname) {
        this.$message.error("请选择赛季！");
        return;
      }
      this.$refs.vs.style.color = val;
    },
    setMargin() {
      if (!this.topMargin) {
        this.$message.error("请输入上边距！");
        return;
      }
      if (isNaN(this.topMargin)) {
        this.$message.error("请输入数字！");
        return;
      }
      this.$refs.titleWrap.style.top = this.topMargin + "px";
    },
    setDataMargin() {
      if (!this.bottomMargin) {
        this.$message.error("请输入下边距！");
        return;
      }
      if (isNaN(this.bottomMargin)) {
        this.$message.error("请输入数字！");
        return;
      }
      this.$refs.bottomWrap.style.bottom = this.bottomMargin + "px";
    },
    handleOnExport(){
      this.$confirm('此操作将导出对战图，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           if(!this.eventname || !this.bgImg){
              this.$message.error("请先设计后再导出！");
              return;
           }
           this.onExport();
        }).catch(() => {});
    },
    onExport() {
      const clientWidth = this.$refs.imageWrapper.offsetWidth;
      const clientHeight = this.$refs.imageWrapper.offsetHeight;
      const kh = [clientWidth, clientHeight];
      html2canvas(this.$refs.imageWrapper, 
       {
         useCORS: true,
         logging: true,
         allowTaint:true,
         background: null, // 一定要添加背景颜色，否则出来的图片，背景全部都是透明的
         scale: 2, // 处理模糊问题
         dpi: 360, // 处理模糊问题
        }).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        this.download(dataURL, kh);
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
    download(imgUrl, kh) {
      this.getUrlBase64(imgUrl, kh).then((base64) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = `${this.hostImg.team_name} vs ${this.custImg.team_name}`;
        link.click();
      });
    },
  },
};
</script>

<style scoped lang="less">
header {
  display: flex;
  justify-content: start;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 12px;
  height: 40px;
  width: 100%;
}
.picture {
  width: 960px;
  margin: 0 auto;
  height: calc(960px / 16 * 9);
  border: 1px solid #e7e7e7;
  position: relative;
  .background-wrap {
    width: 100%;
    height: 100%;
  }
}

.host-wrap,
.cust-wrap {
  width: 170px;
  height: 170px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  object-fit: cover;
}
.host-text-wrap,
.cust-text-wrap {
  position: absolute;
  top: calc(50% + 100px);
  p {
    font-family: "ckt", sans-serif;
  }
}
.host-wrap {
  left: 100px;
}
.host-text-wrap {
  left: 100px;
  background-color: rgb(237, 152, 109);
  height: 40px;
  width: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.cust-wrap {
  right: 100px;
}
.cust-text-wrap {
  right: 100px;
  background-color: rgb(72, 179, 232);
  height: 40px;
  width: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
h4 {
  margin: 5px 0;
}
.title-wrap {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 105px;
  p {
    color: #fff;
    display: inline-block;
    font-weight: bold;
    font-size: 28px;
    font-style: italic;
    padding-bottom: 12px;
    font-family: "hk", sans-serif;
    border-bottom: 3px solid #fff;
    text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.7);
  }
}
.bottom-wrap {
  width: 100%;
  position: absolute;
  bottom: 50px;
  text-align: center;
}
.pk-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .pk {
    color: #fff;
    font-size: 68px;
    font-family: "ckt", sans-serif;
    text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.7);
  }
}
.icon {
  position: absolute;
  left: 15px;
  top: 15px;
  .icon-img {
    width: 80px;
    height: 80px;
  }
}
.gameTime {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  font-family: "hk", sans-serif;
}
.el-input {
  width: 90%;
  margin: 5px;
}
</style>
