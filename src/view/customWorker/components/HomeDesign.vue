<template>
  <div>
    <header class="workflowHeader">
      <div class="left__container">
        <el-image
          :src="userAvatar"
          style="
            width: 50px;
            height: 50px;
            margin-right: 16px;
            border-radius: 6px;
          "
        >
          <div slot="error">
            <img
              style="width: 50px; height: 50px"
              src="@/assets/images/logo_black.png"
            />
          </div>
        </el-image>
        <div class="text--content">
          <p class="welcome">
            您好，{{ myUser }}
            <span class="identify__content">
              {{
                isSuperAdmin
                  ? "统领管理员"
                  : isAdmin
                  ? "领导管理员"
                  : "普通人员"
              }}
            </span>
            <span class="identify__content">
              {{ officium | filterRole }}
            </span>
          </p>
          <p class="role">{{ roles }}</p>
        </div>
      </div>
      <div class="right__container">
        <img src="@/assets/images/person.png" />
        <p>我经常发现，快乐几乎常常是辛勤工作的一种反应！</p>
      </div>
    </header>
    <div class="empty-consult" v-if="showEmpty && !design">
      <el-result
        icon="warning"
        title="未设计首页提示"
        subTitle="尊敬的用户，您尚未自定义首页，请前往个性化工作台设置。"
      >
        <template slot="extra">
          <el-button
            type="primary"
            size="medium"
            @click="$router.push({ path: '/myCustomWorker' })"
            >点我前往</el-button
          >
        </template>
      </el-result>
    </div>
    <template v-else>
      <grid-layout
        :layout.sync="layout"
        :col-num="60"
        :row-height="1"
        :is-draggable="design"
        :is-resizable="design"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[20, 20]"
        :use-css-transforms="true"
        :autoSize="true"
      >
        <grid-item
          v-for="(item, index) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <div v-if="design" class="delete__icon" @click="deletePort(index)">
            <i class="el-icon-delete-solid"></i>
          </div>
          <li class="box-li" data-drop="copy" :data-index="index" :key="index">
            <component :is="item.component" :design="design"></component>
          </li>
        </grid-item>
      </grid-layout>
    </template>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import widgetOptions from "../hooks/index.js";
import { mapGetters } from "vuex";
export default {
  name: "HomeDesign",
  components: {
    ...widgetOptions.components,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: {
    design: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showEmpty: false,
      layout: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo","roles"]),
    myUser() {
      return this.userInfo.chinaname || sessionStorage.getItem("chinaname");
    },
    userAvatar() {
      return this.userInfo.base64 || sessionStorage.getItem("baseImg");
    },
    isAdmin() {
      return (
        Array.isArray(this.userInfo.roles) &&
        this.userInfo.roles.includes("admin")
      );
    },
    isSuperAdmin() {
      return (
        Array.isArray(this.userInfo.roles) &&
        this.userInfo.roles.includes("nbadmin")
      );
    },
    officium() {
      return this.userInfo.officium || sessionStorage.getItem("officium");
    },
  },
  created() {
    try {
      if (!window.localStorage.getItem("asg-layout")) {
        this.showEmpty = true;
        return;
      }
      this.layout = JSON.parse(window.localStorage.getItem("asg-layout")) ?? [];
    } catch (error) {
      console.log(error.message);
    }
  },
  methods: {
    addLayout() {
      console.log(this.layout);
      if (this.layout.length === 0) {
        this.layout.push({
          x: 0,
          y: 0,
          w: 20,
          h: 8,
          i: 0,
          component: "",
        });
        return;
      }
      const layoutI = [];
      let layoutY = 0;
      this.layout.forEach((item) => {
        layoutI.push(item.i);
        if (item.x === 0) {
          layoutY = layoutY + item.h;
        }
      });
      this.layout.push({
        x: 0,
        y: layoutY,
        w: 20,
        h: 8,
        i: Math.max(...layoutI) + 1,
        component: "",
      });
      this.$nextTick(() => {
        const lis = document.querySelectorAll(".box-li");
        const lastLi = lis[lis.length - 1];
        lastLi && lastLi.scrollIntoView();
      });
    },
    deletePort(index) {
      this.layout.splice(index, 1);
    },
    setComponent(index, type) {
      this.layout[index].component = type;
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="less" scoped>
.workflowHeader {
  height: 56px;
  width: calc(100% - 70px);
  background: linear-gradient(90deg, #f1f5fd 16%, #c9d6f8 93%);
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #a0b7f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border-radius: 3px;
  margin: 0 20px 12px;

  .left__container {
    display: flex;
    align-items: center;

    .welcome {
      font-weight: 600;

      .identify__content {
        display: inline-block;
        background: #d6e5f4;
        color: #0c80e5;
        font-size: 12px;
        padding: 3px 8px;
        font-weight: 500;
        border-radius: 2px;
        margin-left: 12px;
      }
    }

    .text--content {
      .role {
        color: #9ba4ad;
        margin-top: 2px;
        font-size: 13px;
        font-weight: 400;
        width:30vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .right__container {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    img {
      position: relative;
      width: 96px;
      height: 90px;
      top: -6px;
      margin-right: 15px;
    }

    p {
      font-size: 17px;
    }
  }
}

.empty-consult {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(80vh - 40px - 80px - 60px - 50px);
}

.vue-grid-layout {
  margin-bottom: 60px;
}
.vue-grid-item {
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;

  /deep/ .vue-resizable-handle {
    width: 30px;
    height: 30px;
    z-index: 12;
  }
}
.delete__icon {
  position: absolute;
  right: -15px;
  top: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f40;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgb(223, 102, 58);
  }
  i {
    color: #fff;
  }
  cursor: pointer;
}

.box-li {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  padding: 10px;
  overflow: hidden;
}
</style>
