<template>
  <div class="history__content">
    <div class="wf_title">{{ bizName }}<span class="wf_over" v-if="info.status === '4'">(已终止)</span></div>
    <div class="workflow-content">
      <div class="grid-wrap" v-for="(item, index) in realTimeLine" :key="index">
        <div class="line--content">
          <div class="circle-content" :class="item.status">
            <div class="inner-content" :class="item.status"></div>
          </div>
          <div class="line" :class="item.status"></div>
        </div>
        <div class="main--content">
          <div class="title_parent">
            <p class="node__title">{{ index === 0 ? "发起" : "审批节点" }}</p>
            <div class="icon--right" v-if="item.status === 'process'">
              当前节点<svg-icon iconClass="nowProcess" width="13px" height="13px"></svg-icon>
            </div>
          </div>
          <div class="info__box">
            <p>
              <span class="title-font">节点人员</span>
              <span class="content-font">{{ item.name }}</span>
            </p>
            <p v-if="index !== 0">
              <span class="title-font">能否退回</span>
              <span class="content-font">{{
                item.allowReturn ? "允许" : "不允许"
              }}</span>
            </p>
            <p v-else>
              <span class="title-font">初始节点</span>
              <span class="content-font">发起人</span>
            </p>
            <p v-if="index === realTimeLine.length - 1">
              <span class="title-font">最终节点</span>
              <span class="content-font" >最终决策权</span>
            </p>

          </div>
        </div>
      </div>
      <div class="grid-wrap">
        <div class="line--content">
          <div class="circle-content" style="background: #d3d3d3"></div>
        </div>
        <div class="main--content">
          <div class="title_parent">
            <p class="node__title">流程结束</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "HistoryRecord",
  props: {
    info: {
      type: Object,
      default: () => { },
    },
    bizTypeArr: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "add",
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    bizName() {
      return (
        this.bizTypeArr.find((item) => item.bizType === this.info.bizType)
          ?.label ?? "未知业务"
      );
    },
  },
  data() {
    return {
      realTimeLine: [],
    };
  },
  methods: {
    constructorTree() {
      const process = JSON.parse(this.info.flowConfig)
      if (this.info.status === "0") {
        this.realTimeLine = [
          {
            name: this.userInfo.chinaname,
            allowReturn: false,
            status: "process",
          },
          ...process.map((item) => {
            return {
              name: item.chinaname,
              allowReturn: item.isAllowReturn === "1",
              status: "wait",
            };
          }),
        ];
      } else if (this.info.status === "3") {
        this.realTimeLine = [
          {
            name: this.info.startPerson,
            allowReturn: false,
            status: "success",
          },
          ...process.map((item) => {
            return {
              name: item.chinaname,
              allowReturn: item.isAllowReturn === "1",
              status: "success",
            };
          }),
        ];
      } else if (this.info.status === '4') {
        process.forEach((item) => {
          item.status = 'wait';
        });
        this.realTimeLine = [
          {
            name: this.info.startPerson,
            allowReturn: false,
            status: "danger",
          },
          ...process.map((item) => {
            return {
              ...item,
              name: item.chinaname,
              allowReturn: item.isAllowReturn === "1",
            };
          }),
        ];
      } else {
        const labelIndex = this.info.nodeIndex;
        if (labelIndex !== null || labelIndex !== undefined) {
          process.forEach((item, index) => {
            if (index < labelIndex) {
              item.status = "success";
            } else if (index === labelIndex) {
              item.status = "process";
            } else {
              item.status = "wait";
            }
          });
          this.realTimeLine = [
            {
              name: this.info.startPerson,
              allowReturn: false,
              status: labelIndex === -1 ? 'process' : 'success',
            },
            ...process.map((item) => {
              return {
                ...item,
                name: item.chinaname,
                allowReturn: item.isAllowReturn === "1",
              };
            }),
          ];
        } else {
          this.realTimeLine = [
            {
              name: this.userInfo.chinaname,
              allowReturn: false,
              status: "process",
            },
            ...process.map((item) => {
              return {
                name: item.chinaname,
                allowReturn: item.isAllowReturn === "1",
                status: "wait",
              };
            }),
          ];
        }
      }
      console.log(this.realTimeLine,'realTimeLine');
    },
  },
  created() {
    this.constructorTree();
  },
};
</script>
<style lang="less" scoped>
.history__content {
  padding: 0 12px;

  .wf_title {
    margin: 12px 0;
    padding: 12px;
    background: linear-gradient(180deg, #f0f3f6 0%, #ffffff 100%);
    box-shadow: 0px 2px 6px 0px rgba(220, 231, 241, 0.7);
    border-radius: 4px;
    border: 1px solid #ffffff;
    font-weight: 500;
    font-size: 13px;
    color: #000000;
    line-height: 15px;
    .wf_over{
      color:#d62a2a;
      margin-left: 4px;
    }
  }

  .workflow-content {
    width: 100%;

    .grid-wrap {
      display: grid;
      grid-template-columns: 30px auto;
      gap: 12px;
      align-items: flex-start;

      .main--content {
        margin-bottom: 12px;

        .title_parent {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .node__title {
            font-weight: 400;
            font-size: 13px;
            color: #5b5d5f;
            line-height: 15px;
          }

          .icon--right {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            gap: 3px;
            color: #4090ef;
          }
        }

        .info__box {
          background: #f6f6f6;
          border-radius: 8px;
          padding: 8px;
          margin-top: 4px;

          .title-font {
            font-weight: 400;
            font-size: 12px;
            color: #878787;
            line-height: 14px;
            margin-right: 12px;
          }

          .content-font {
            font-weight: 400;
            font-size: 13px;
            color: #000000;
            line-height: 15px;
            font-family: 'hk';
          }
        }
      }
    }

    .line--content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      margin-bottom: 6px;
      height: 100%;

      .circle-content {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.process {
          background: #edf3fc;
        }

        &.wait {
          background: #f3f3f3;
        }

        &.danger {
          background: #e8b6b6;
        }

        &.success {
          background: #e5f8f2;
        }

        .inner-content {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.process {
            background: #0c80e5;
          }

          &.wait {
            background: #747474;
          }

          &.danger {
            background: #d62a2a;
          }

          &.success {
            background: #00b87b;
          }
        }
      }

      .line {
        height: calc(100% - 28px);
        width: 2px;

        &.process {
          background: #4090ef;
        }

        &.wait {
          background: #e7e7e7;
        }

        &.danger {
          background: #d62a2a;
        }

        &.success {
          background: #00b87b;
        }
      }
    }
  }
}
</style>
