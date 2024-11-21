<template>
  <div class="clearfix">
    <div v-show="isCanvas" class="shuffle-wrap">
      <img ref="img1" class="shuffle-img" src="@/assets/images/1.jpg" />
      <img ref="img2" class="shuffle-img" src="@/assets/images/1.jpg" />
      <img ref="img3" class="shuffle-img" src="@/assets/images/1.jpg" />
      <img ref="img4" class="shuffle-img" src="@/assets/images/1.jpg" />
      <img class="shuffle-img" src="@/assets/images/1.jpg" />
    </div>
    <div v-show="!isCanvas" class="card-wrap">
      <img ref="card" class="card" src="@/assets/images/card.png" />
    </div>
    <canvas ref="canvas" class="canvas-wrap"></canvas>
    <audio ref="audio" :src="url"></audio>
  </div>
</template>

<script>
export default {
  name: "Second",
  data() {
    return {
      audioEle: null,
      cvs: null,
      ctx: null,
      isInit: false,
      analyser: null,
      dataArray: null,
      isCanvas: true,
    };
  },
  props: {
    url: {
      type: String,
      default: "",
    },
    time:{
      type:Number,
      default:20
    }
  },
  mounted() {
    this.audioEle = this.$refs.audio;
    this.cvs = this.$refs.canvas;
    this.ctx = this.cvs.getContext("2d");
    this.initAnalyser();
    this.initCvs();
    this.draw();
  },
  methods: {
    initCvs() {
      this.cvs.width = window.innerWidth * devicePixelRatio;
      this.cvs.height = window.innerHeight / 2;
      this.devicePixelRatio;
    },
    draw() {
      requestAnimationFrame(this.draw);
      const { width, height } = this.cvs;
      this.ctx.clearRect(0, 0, width, height);
      // 分析器节点分析出数据到数组中
      if (!this.isInit) {
        return;
      }
      this.analyser.getByteFrequencyData(this.dataArray);
      const len = this.dataArray.length / 2.5;
      const barWidth = width / len / 2;
      this.ctx.fillStyle = "rgb(250,77,151)";
      for (let i = 0; i < len; i++) {
        const data = this.dataArray[i]; // <256
        const barHeight = (data / 255) * height;
        const x1 = i * barWidth + width / 2;
        const x2 = width / 2 - (i + 1) * barWidth;
        const y = height - barHeight;
        this.ctx.fillRect(x1, y, barWidth - 2, barHeight);
        this.ctx.fillRect(x2, y, barWidth - 2, barHeight);
      }
    },
    initAnalyser() {
      if (this.isInit) {
        return;
      }
      // 初始化
      const audCtx = new AudioContext(); //创建音频上下文
      const source = audCtx.createMediaElementSource(this.audioEle); //创建音频源节点
      this.analyser = audCtx.createAnalyser();
      this.analyser.fftSize = 512;
      // 创建数组用于接收分析器节点的分析数据
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      source.connect(this.analyser);
      this.analyser.connect(audCtx.destination);
      this.isInit = true;
    },
    beforePlay() {
      if (!this.url) {
        this.$message.error("请选择一首抽签音乐！并且是音乐格式！");
        return;
      } 
      if(this.time === 0){
        this.$message.error("请设置抽取时间！");
        return 
      }
      this.play();
      
    },
    play() {
      this.$emit("loadingStart");
      this.audioEle.play();
      this.startAnimation();
      this.initAnalyser();
      setTimeout(() => {
        this.audioEle.pause();
        this.$emit("loadingEnd");
        this.isCanvas = false;
        this.$message.success("洗牌结束！");
        setTimeout(() => {
          this.setImg();
          this.stopAnimation();
          this.$confirm("抽取完毕，是否进入下一步？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "重抽",
            type: "warning",
          })
            .then(() => {
              this.$emit("finish");
            })
            .catch(() => {
              this.hiddenImg();
              this.isCanvas = true;
            });
        }, 500);
      }, this.time * 1000);
    },
    setImg() {
      this.$refs.card.style.scale = "1";
      this.$refs.card.style.opacity = "1";
    },
    hiddenImg() {
      this.$refs.card.style.scale = "0";
      this.$refs.card.style.opacity = "0";
    },
    startAnimation() {
      this.$refs.img1.style.animationPlayState = "running";
      this.$refs.img2.style.animationPlayState = "running";
      this.$refs.img3.style.animationPlayState = "running";
      this.$refs.img4.style.animationPlayState = "running";
    },
    stopAnimation() {
      this.$refs.img1.style.animationPlayState = "paused";
      this.$refs.img2.style.animationPlayState = "paused";
      this.$refs.img3.style.animationPlayState = "paused";
      this.$refs.img4.style.animationPlayState = "paused";
      this.$refs.img1.style.transform = 'translateX(0)'
      this.$refs.img2.style.transform = 'translateX(0)'
      this.$refs.img3.style.transform = 'translateX(0)'
      this.$refs.img4.style.transform = 'translateX(0)'
    },
  },
};
</script>

<style scoped lang="less">
.canvas-wrap {
  display: block;
  width: 90%;
  margin:0 auto;
  height: 15vh;
  background-color: rgb(44,11,100);
  border-bottom: 1px solid #e7e7e7;
}
.extract-wrap {
  display: block;
  width: 200px;
  margin: 50px auto;
}
.card {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.2;
  scale: 0;
  transition: all 0.4s ease-in-out;
}
.shuffle-wrap {
  width: 100%;
  height:380px;
  position: relative;
}
.card-wrap {
  width: 100%;
  height:350px;
  margin-bottom: 30px;
}
.shuffle-img {
  display: block;
  position: absolute;
  left: calc(50% - 90PX);
  width: 180px;
  height: 300px;

  &:nth-child(1) {
    animation: move1 2s infinite;
    animation-play-state: paused;
  }
  &:nth-child(2) {
    animation: move2 2s infinite;
    animation-play-state: paused;
  }
  &:nth-child(3) {
    animation: move3 2s infinite;
    animation-play-state: paused;
  }
  &:nth-child(4) {
    animation: move4 2s infinite;
    animation-play-state: paused;
  }
}
@keyframes move1 {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-400px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes move2 {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-200px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes move3 {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(200px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes move4 {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(400px);
  }
  100% {
    transform: translateX(0);
  }
}
.clearfix{
  clear:both
}
</style>
