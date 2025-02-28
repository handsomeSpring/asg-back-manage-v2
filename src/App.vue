<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))));
      sessionStorage.removeItem("store");
      this.$store.commit("SET_ROUTERSTATE", false);
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage// 兼容ios
    window.addEventListener("pagehide", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
      sessionStorage.setItem('beforeupload-path',this.$route.path)
      this.$store.commit("SET_ROUTERSTATE", false);
    });
  }
};
</script>

<style lang="less">
.el-scrollbar__wrap {
  overflow-x: hidden !important;
  margin-bottom: -5px !important;
}

* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none !important;
}

body {
  overflow: hidden;
  padding-right:0 !important;
}

a {
  text-decoration: none;
}

.clearfix::before,
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
</style>
