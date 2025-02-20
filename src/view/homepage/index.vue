<template>
  <div class="all-main-content">
    <el-container v-if="!isMobile" class="layout">
      <el-aside width="auto" class="asg-common-aside">
        <common-aside />
      </el-aside>
      <el-container>
        <el-header><common-header /></el-header>
        <headerTabs ref="headerTabs" v-show="$route.fullPath !== '/index'"></headerTabs>
        <el-scrollbar class="backtop-scroll" ref="queRef" :style="{ height: actuallHeight }">
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
    <MobileLayout v-else></MobileLayout>
  </div>
</template>

<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonFooter from "@/components/CommonFooter.vue";
import projOperation from "@/components/projOperation.vue";
import headerTabs from "@/components/headerTabs.vue";
import { isMobile } from "@/utils";
import MobileLayout from "./mobileGuide/MobileLayout.vue";

export default {
  name: "HomePage",
  components: {
    CommonAside,
    CommonHeader,
    projOperation,
    headerTabs,
    CommonFooter,
    MobileLayout
  },
  data() {
    return {
      isCollapse: false,
      actuallHeight: "calc(100vh - 100px)",
      isMobile: false,
    };
  },
  created() {
    this.isMobile = isMobile();
  },
  mounted() {
    this.$nextTick(() => {
      const tabHeight =
        this.$route.fullPath === "/index"
          ? 0
          : (this.$refs.headerTabs?.$refs?.containerGrid?.clientHeight ?? 0);
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
              : (this.$refs.headerTabs?.$refs?.containerGrid?.clientHeight ?? 0);
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
.all-main-content{
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}
.asg-common-aside {
  background-color: var(--aside-background-color);
}

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
</style>
