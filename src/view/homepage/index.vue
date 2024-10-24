<template>
  <el-container>
    <el-aside width="auto">
      <common-aside />
    </el-aside>
    <el-container>
      <el-header><common-header /></el-header>
      <headerTabs ref="headerTabs" v-show="$route.fullPath !== '/index'"></headerTabs>
      <el-scrollbar :style="{ height: $route.fullPath === '/index' ? 'auto' : actuallHeight }">
        <el-main :style="{ 'min-height': minHeight }">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
        <CommonFooter></CommonFooter>
      </el-scrollbar>
    </el-container>

    <projOperation v-show="$route.path !== '/index'"></projOperation>
  </el-container>
</template>

<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonFooter from "@/components/CommonFooter.vue";
import projOperation from "@/components/projOperation.vue";
import headerTabs from '@/components/headerTabs.vue';

export default {
  name: "HomePage",
  components: { CommonAside, CommonHeader, projOperation, headerTabs, CommonFooter },
  data() {
    return {
      isCollapse: false,
      actuallHeight: '80vh',
      minHeight: ''
    };
  },
  mounted() {
    if (this.actuallHeight !== '80vh') return;
    this.$nextTick(() => {
      const tabHeight = this.$refs.headerTabs.$refs.containerGrid.clientHeight;
      this.actuallHeight = `calc(100vh - 60px - ${tabHeight}px)`;
      this.minHeight = `calc(100vh - 60px - 70px - ${tabHeight}px)`
    })
  },
  watch: {
    '$route.fullPath': {
      handler(val) {
        if (val === '/index' || this.actuallHeight !== '80vh') return;
        this.$nextTick(() => {
          const tabHeight = this.$refs.headerTabs.$refs.containerGrid.clientHeight;
          this.actuallHeight = `calc(100vh - 60px - ${tabHeight}px)`;
          this.minHeight = `calc(100vh - 60px - 70px - ${tabHeight}px)`
        })
      }
    },
  },
};
</script>

<style scoped lang="less">
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
