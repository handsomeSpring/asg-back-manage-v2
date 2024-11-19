<template>
  <div class="allFlow-container">
    <header>ASG赛事办赛全流程指南</header>
    <main>
      <div class="left_flow">
        <li class="parent_li" v-for="(item, index) in allFlowInfo" :key="index">
          <div class="title_header">
            <div class="tag_header">{{ item.parentTitle }}</div>
            <div class="text_header">
              <p class="title">{{ item.parentInfo }}</p>
              <p class="time_tag">{{ item.tag }}</p>
            </div>
          </div>
          <div
            class="child_li"
            v-for="(child, childI) in item.children"
            :key="`${childI}-child`"
          >
            <div class="line">
              <div class="circle"></div>
            </div>
            <div class="content">
              <div class="title">{{ child.tag }}</div>
              <div class="main_content">
                <p>{{ child.childInfo }}</p>
              </div>
            </div>
          </div>
        </li>
        <li class="parent_li">
          <div class="title_header">
            <div class="tag_header">结束</div>
            <div class="text_header"></div>
          </div>
        </li>
      </div>
      <div class="right_content">
        <div class="right_header">
          <div
            class="checkItem"
            :class="activeName === item.parentTitle ? 'active' : ''"
            v-for="(item, index) in allFlowInfo"
            :key="index"
            @click="handleCheck(item)"
          >
            <p>{{ item.parentTitle }}</p>
          </div>
        </div>
        <div class="right-main">
          <div
            class="grid-item"
            v-for="(item, index) in activeChildren"
            :key="item.tag"
          >
            <div class="jump_header">
              <p>{{ item.tag }}</p>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="info">{{ item.childInfo }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { allFlowInfo } from "./const";
export default {
  name: "allFlowSeason",
  data() {
    return {
      allFlowInfo,
      activeName: "众投",
      activeChildren: [],
    };
  },
  methods: {
    handleCheck(item) {
      this.activeName = item.parentTitle;
      this.activeChildren = item.children;
    },
  },
  created() {
    this.activeName = this.allFlowInfo[0].parentTitle;
    this.activeChildren = this.allFlowInfo[0].children;
  },
};
</script>

<style scoped lang="less">
@b-color: #e7e7e7;
.allFlow-container {
  header {
    border-bottom: 1px solid @b-color;
    padding: 12px 0;
    font-weight: 500;
    font-size: 15px;
    color: #0c80e5;
    line-height: 18px;
  }
  main {
    display: grid;
    grid-template-columns: 300px auto;
    .left_flow {
      width: 100%;
      border-right: 1px solid @b-color;
    }
  }
}
.parent_li {
  .title_header {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    margin: 12px 0;
    .tag_header {
      width: 38px;
      height: 38px;
      background: #188eff;
      border-radius: 8px;
      border: 1px solid #1a88ef;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .text_header {
      display: flex;
      justify-content: center;
      flex-direction: column;
      .title {
        font-weight: 400;
        font-size: 16px;
        color: #1f2123;
        line-height: 19px;
      }
      .time_tag {
        font-weight: 400;
        font-size: 13px;
        color: #959595;
        line-height: 15px;
      }
    }
  }
}
.child_li {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  position: relative;
  .line {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 100%;
    &::after {
      position: absolute;
      content: "";
      width: 2px;
      height: 90%;
      background: @b-color;
      left: 18px;
      top: 14px;
    }
    .circle {
      width: 9px;
      height: 9px;
      background: #188eff;
      border-radius: 100px;
      border: 1px solid #1a88ef;
    }
  }
  .content {
    .title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 13px;
      color: #5b5d5f;
      line-height: 15px;
    }
    .main_content {
      width: 189px;
      background: #f6f6f6;
      border-radius: 8px;
      margin: 6px 0;
      padding: 8px;
      p {
        font-weight: 500;
        font-size: 12px;
        color: #0c80e5;
        line-height: 18px;
      }
    }
  }
}
.right_content {
  width: 100%;
  padding: 0 12px;
  .right_header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    .checkItem {
      cursor: pointer;
      width: 90px;
      height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #edeef0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.27s all;
      &.active {
        background: #0c80e5;
        border-color: #0c80e5;
        p {
          color: #ffffff;
        }
      }
      p {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 16px;
      }
    }
  }
  .right-main {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 24px;
    .grid-item {
      flex-shrink: 0;
      width: 213px;
      background: linear-gradient(180deg, #f0f3f6 0%, #ffffff 100%);
      box-shadow: 0px 2px 6px 0px rgba(220, 231, 241, 0.7);
      border-radius: 4px;
      border: 1px solid #ffffff;
      padding: 13px;
      transition: .27s all;
      cursor: pointer;
      &:hover {
        background: linear-gradient(180deg, #eff7ff 0%, #fefeff 100%);
        transform: perspective(600px) rotateY(30deg);
        .jump_header {
          color: #0c80e5;
        }
      }
      .jump_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        font-size: 13px;
        color: #000000;
        line-height: 15px;
      }
      .info {
        padding: 3px 10px;
        height: 20px;
        background: #ffffff;
        box-shadow: 0px 4px 8px 0px rgba(219, 219, 219, 0.25);
        border-radius: 4px;
        margin: 8px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-weight: 400;
        font-size: 12px;
        color: #8c8c8c;
        line-height: 14px;
      }
    }
  }
}
</style>
