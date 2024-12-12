<template>
  <div>
    <el-container class="layout">
      <el-aside width="auto">
        <common-aside />
      </el-aside>
      <el-container>
        <el-header><common-header /></el-header>
        <headerTabs ref="headerTabs" v-show="$route.fullPath !== '/index'"></headerTabs>
        <el-scrollbar ref="queRef" :style="{ height: actuallHeight }">
          <el-main style="height: 100%">
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>
            <CommonFooter></CommonFooter>
          </el-main>
        </el-scrollbar>
      </el-container>
      <projOperation v-show="$route.path !== '/index'"></projOperation>
    </el-container>
    <el-container class="mobile-layout">
      <el-header>
        <router-link class="back" to="/mobileGuide">
          <i class="el-icon-arrow-left"></i>返回首页
        </router-link>
        <div class="title">ASG后台管理系统</div>
      </el-header>
      <el-scrollbar ref="queRef" style="height: calc(100dvh - 60px)">
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonFooter from "@/components/CommonFooter.vue";
import projOperation from "@/components/projOperation.vue";
import headerTabs from "@/components/headerTabs.vue";

export default {
  name: "HomePage",
  components: {
    CommonAside,
    CommonHeader,
    projOperation,
    headerTabs,
    CommonFooter,
  },
  data() {
    return {
      isCollapse: false,
      actuallHeight: "calc(100vh - 100px)",
    };
  },
  mounted() {
    this.$nextTick(() => {
      const tabHeight =
        this.$route.fullPath === "/index"
          ? 0
          : this.$refs.headerTabs.$refs.containerGrid.clientHeight;
      this.actuallHeight = `calc(100vh - 60px - ${tabHeight}px)`;
    });
  },
  watch: {
    "$route.fullPath": {
      handler(newValue) {
        this.$nextTick(() => {
          const tabHeight =
            newValue === "/index"
              ? 0
              : this.$refs.headerTabs.$refs.containerGrid.clientHeight;
          this.actuallHeight = `calc(100vh - 60px - ${tabHeight}px)`;
          const scrollbarEl = this.$refs.queRef.wrap;
          scrollbarEl.scrollTo({
            top: 0,
            behavior: "instant",
          });
        });
      },
    },
  },
};
</script>

<style scoped lang="less">
@import url('../../assets/mobileStyles/homePage/index.less');

.el-header {
  padding: 0;
}

.el-aside::-webkit-scrollbar {
  display: none;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.el-main {
  overflow-x: hidden;
}

.mobile-layout {
  display: none;
}
</style>
