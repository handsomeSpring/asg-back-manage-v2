<template>
  <div class="drag__container">
    <div class="toAssigned--left">
      <draggable
        class="content"
        v-model="layoutConfig.waitAssign"
        :options="{
          group: { name: 'orgPerson', put: true, pull: true },
          sort: false,
        }"
      >
        <li
          class="drag__item"
          v-for="item in layoutConfig.waitAssign"
          :key="item.name"
        >
          <header>
            <p>{{ item.name }}</p>
          </header>
          <main>
            <div class="body">
              <p class="sex">{{ item.sex === "1" ? "男" : "女" }}</p>
              <div class="role">{{ item.role }}</div>
            </div>
          </main>
        </li>
      </draggable>
    </div>
    <div class="some_org">
      <draggable
        class="content"
        v-model="layoutConfig.adminAssign"
        :options="{
          group: { name: 'orgPerson', put: true, pull: true },
          sort: false,
        }"
      >
      <li
          class="drag__item"
          v-for="item in layoutConfig.adminAssign"
          :key="item.name"
        >
          <header>
            <p>{{ item.name }}</p>
          </header>
          <main>
            <div class="body">
              <p class="sex">{{ item.sex === "1" ? "男" : "女" }}</p>
              <div class="role">{{ item.role }}</div>
            </div>
          </main>
        </li>
      </draggable>
    </div>
  </div>
</template>

<script>
import { getByTitle } from "@/api/config";
import draggable from "vuedraggable";
export default {
  name: "orgManage",
  components: {
    draggable,
  },
  data() {
    return {
      layoutConfig: {},
      groupOptions: {
        name: "orgPerson",
        pull: true,
        put: true,
      },
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "sortlist",
        ghostClass: "ghost-style",
      },
    };
  },
  created() {
    this.initLayout();
  },
  methods: {
    async initLayout() {
      try {
        const { status, data } = await getByTitle("orgConfig");
        if (status !== 200) throw new Error("服务端异常");
        this.layoutConfig = data;
      } catch (error) {
        this.$message.error("orgConfig未找到:" + error.message);
      }
    },
  },
};
</script>

<style scoped lang="less">
.drag__container {
  display: grid;
  grid-template-columns: 300px auto;
  min-height: 70vh;
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  .toAssigned--left {
    padding: 12px;
    border-right: 1px solid #e7e7e7;
  }
  .some_org {
    padding: 12px;
    .org-grid-item {
      width: 200px;
      height: 200px;
      border-radius: 1px solid #bfa;
    }
  }
}
.content {
  height: 100px;
  width: 100px;
}
.drag__item {
  width: 213px;
  height: 79px;
  background: linear-gradient(180deg, #f0f3f6 0%, #ffffff 100%);
  box-shadow: 0px 2px 6px 0px rgba(220, 231, 241, 0.7);
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #ffffff;
  cursor: move;
  header {
    padding:12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    P {
      font-weight: 500;
      font-size: 13px;
      color: #000000;
      line-height: 15px;
    }
  }
  main {
    padding: 0 12px;
    .body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      padding: 4px 6px;
      .sex {
        font-weight: 400;
        font-size: 12px;
        color: #8c8c8c;
        line-height: 14px;
      }
      .role {
        width: 66px;
        height: 18px;
        background: #ebf3fe;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
