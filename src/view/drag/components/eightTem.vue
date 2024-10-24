<template>
  <div class="container" v-loading="loading" id="efContainer">
    <li class="tag__container" v-for="(item, index ) in promChart.propData" :key="index" :id="`index-${index}`">
      <div class="tag__left"></div>
      <div class="content__box">
        <p v-show="index !== editIndex" :style="{
          width: readOnly ? '100%' : 'calc(100% - 30px)'
        }">{{ item.teamName }}</p>
        <input v-show="index === editIndex" v-model="item.teamName" @blur="editIndex = null" />
      </div>
      <div class="editBox" v-show="!readOnly">
        <i v-show="index !== editIndex" class="el-icon-edit" @click="editIndex = index"></i>
        <i v-show="index === editIndex" class="el-icon-close" @click="editIndex = null"></i>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: "eightTem",
  data() {
    return {
      promChart: {
        componentName: "eightTem",
        propData: [
          {
            teamName: "TBD"
          },
          {
            teamName: "TBD"
          },
          {
            teamName: "TBD"
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          },
          {
            teamName: "TBD",
          }
        ]
      },
      editIndex: null,
      loading: false,
      jsPlumb: null
    };
  },
  props: {
    propPromChart: {
      type: String,
      default: "",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.loading = true;
  },
  mounted() {
    const propProm = JSON.parse(this.propPromChart);
    if (!!this.propPromChart && this.promChart.componentName === propProm.componentName) {
      this.$set(this, 'promChart', propProm);
    };
    this.initJSPlumb();
    this.$nextTick(() => {
      this.initPosition();
      this.connectionLine();
      this.loading = false;
    })

  },
  methods: {
    connectionLine() {
      this.jsPlumb.connect({
        source: 'index-0',
        target: 'index-8'
      });
      this.jsPlumb.connect({
        source: 'index-1',
        target: 'index-8'
      });
      this.jsPlumb.connect({
        source: 'index-2',
        target: 'index-9'
      });
      this.jsPlumb.connect({
        source: 'index-3',
        target: 'index-9'
      });
      this.jsPlumb.connect({
        source: 'index-4',
        target: 'index-10'
      });
      this.jsPlumb.connect({
        source: 'index-5',
        target: 'index-10'
      });
      this.jsPlumb.connect({
        source: 'index-6',
        target: 'index-11'
      });
      this.jsPlumb.connect({
        source: 'index-7',
        target: 'index-11'
      });
      this.jsPlumb.connect({
        source: 'index-8',
        target: 'index-12'
      });
      this.jsPlumb.connect({
        source: 'index-9',
        target: 'index-12'
      });
      this.jsPlumb.connect({
        source: 'index-10',
        target: 'index-13'
      });
      this.jsPlumb.connect({
        source: 'index-11',
        target: 'index-13'
      });
      this.jsPlumb.connect({
        source: 'index-12',
        target: 'index-14'
      });
      this.jsPlumb.connect({
        source: 'index-13',
        target: 'index-14'
      });
    },
    initJSPlumb() {
      this.jsPlumb = this.$jsPlumb.getInstance({
        Container: "efContainer", //容器id
        endpoint: 'Dot',
        Anchor: [0.5, 1, 0, 1, -10, 50],
        Anchors: ["Right", "Left"], //连线的source和target 
        EndpointStyle: { radius: 4, fill: "#498FFF" }, //端点默认样式
        PaintStyle: { stroke: "#c5c5c6", strokeWidth: 1 }, // 连线样式
        HoverPaintStyle: { stroke: "#818FB4" }, // 默认悬停样式
        EndpointHoverStyle: { fill: "#818FB4" }, // 端点悬停样式
        ConnectionsDetachable: false,
        Connector: ['Flowchart', { stub: 20, gap: 5, midpoint: 0.04, cornerRadius: 5, alwaysRespectStubs: true }],
        DrapOptions: { cursor: "crosshair", zIndex: 2000 },
        Scope: "jsPlumb_DefaultScope"
      });
    },
    initPosition() {
      const lis = document.querySelectorAll('.tag__container');
      for (let i = 0; i < lis.length; i++) {
        if (i >= 0 && i < 8) {
          lis[i].style.left = '30px';
          //  计算高度
          const offTop = (i + 1) * 40 + i * 40;
          lis[i].style.top = offTop + 'px';
        }
        if (i >= 8 && i < 12) {
          lis[i].style.left = '280px';
          //  计算高度
          const index = i - 8;
          const offTop = 80 + index * 160;
          lis[i].style.top = offTop + 'px';
        }
        if (i >= 12 && i < 14) {
          lis[i].style.left = '480px';
          //  计算高度
          const index = i - 12;
          const offTop = 160 + 320 * index;
          lis[i].style.top = offTop + 'px';
        }
        if (i === 14) {
          lis[i].style.left = '680px';
          lis[i].style.top = '320px';
        }
      }
    }
  },
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .tag__container {
    height: 40px;
    width: 150px;
    box-sizing: border-box;
    position: absolute;
    border-radius: 0 5px 5px 0;
    display: grid;
    grid-template-columns: 5px 105px 40px;

    &:nth-child(2n) {
      background: #dce8fc;
      border: 2px solid #a4b3d6;
      .tag__left{
        background:#a4b3d6;
      }
    }

    &:nth-child(2n-1) {
      background: #f2d7bb;
      border: 2px solid #d5b459;
      .tag__left{
        background:  #d5b459;
      }
    }
    &:nth-child(15){
      background: #e4bcbe !important;
      border: 2px solid #c9797d !important;
      .tag__left{
        background:  #c9797d !important;
      }
    }
    .tag__left {
      height: 100%;
      width: 100%;
    }

    .content__box {
      display: flex;
      align-items: center;
      padding: 6px 0;

      input {
        outline: none;
        height: 20px;
        width: 80px;
        margin-left: 10px;
      }

      p {
        width: calc(100% - 30px);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-left: 10px;
        color: #515151;
        font-weight: bold;
      }
    }

    .editBox {
      border-left: 2px solid #979797;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 18px;
        cursor: pointer;
        color: #4090EF;

        &:hover {
          color: #8ab7ed;
        }
      }
    }
  }
}
</style>
