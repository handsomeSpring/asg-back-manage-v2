<!-- eslint-disable vue/no-use-v-if-with-v-for  background-color="#0089f3" -->
<template>
  <div>
    <el-menu :collapse="isCollapse" :default-active="$route.path" class="el-menu-vertical-demo"
      text-color="#e3f2fd" active-text-color="#f7e157" router :unique-opened="true">
      <div class="aside__header">
        <img src="@/assets/images/logo_black.png">
        <p v-show="!isCollapse">最强民间赛事</p>
      </div>
      <template v-for="(menu, index) in menuOptions" >
        <el-menu-item v-if="menu.children.length === 0" :index="menu.path" :key="`no-Child-${index}`">
            <svg-icon style="margin-right: 5px" :iconClass="menu.iconClass" width="20px" height="20px"></svg-icon>
            <span slot="title">{{ menu.title }}</span>
        </el-menu-item>
        <el-submenu v-else :index="menu.path" :key="`has-Child-${index}`">
          <template slot="title">
            <svg-icon style="margin-right: 5px" :iconClass="menu.iconClass" width="20px" height="20px"></svg-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(child, childI) in menu.children" :index="child.path" :key="childI" v-if="child.show">
              <svg-icon style="margin-right: 5px" :iconClass="child.iconClass" width="16px" height="16px"></svg-icon>
              {{ child.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "CommonAside",
  computed: {
    ...mapGetters(['isCollapse','menuOptions']),
  },
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: 100vh;
  border-right: none;
  background-color: var(--aside-background-color);
  .el-menu-item-group{
    background-color: var(--aside-background-color);
  }
  .el-menu-item:focus, .el-menu-item:hover{
    background-color: rgb(0,110,194)
  }
  h4 {
    color: #fff;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 12px);
    padding: 0 6px;
  }
}
/deep/.el-submenu__title:hover{
  background-color: rgb(0,110,194) !important;
}
/deep/.el-submenu__title i {
  color: #f9f9f9;
}

.aside__header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #E3E7EB;
  margin: 6px 12px;

  p {
    color: #fff;
    margin-left: 24px;
    font-family: 'hk';
  }

  img {
    width: 25px;
    height: 25px;
    border-radius: 4px;
  }
}
</style>
