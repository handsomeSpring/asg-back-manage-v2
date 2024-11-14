<template>
  <div class="drag__container">
    <div class="toAssigned--left">
      <div class="operation__content">
        <p>待分配人员</p>
        <el-button size="small" type="primary" @click="addNew">新增成员</el-button>
      </div>
      <draggable class="content" v-model="waitAssign" :options="{
        group: { name: 'orgPerson', put: true, pull: true },
        sort: false,
      }">
        <li class="drag__item" v-for="item in waitAssign" :key="item.name">
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
      <div class="some__item--grid" v-for="item in layoutConfig" :key="item.code">
        {{ item.label }}
        <draggable class="content" v-model="item.data" :options="{
          group: { name: 'orgPerson', put: true, pull: true },
          sort: false,
        }">
          <li class="drag__item" v-for="item in item.data" :key="item.name">
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
      waitAssign:[],
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
    addNew() {
      this.waitAssign.push(
        {
          name: '测试',
          sex: '0',
          role: '前端',
          remark: ''
        }
      );
    },
    async initLayout() {
      try {
        const { status, data } = await getByTitle("orgConfig");
        if (status !== 200) throw new Error("服务端异常");
        this.layoutConfig = data;
        this.waitAssign = data.find(item => item.code === 'waitAssign')?.data ?? [];
        this.layoutConfig = data.filter(item => item.code !== 'waitAssign');
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

  .operation__content {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .some_org {
    padding: 12px;

    .some__item--grid {
      width:300px;
      height:300px;
      border:1px solid #bfa;
      overflow:auto
    }

  }
}

.content {
  height: 100%;
  width: 100%;
}

.drag__item {
  width: 213px;
  height: 79px;
  background: linear-gradient(180deg, #f0f3f6 0%, #ffffff 100%);
  box-shadow: 0px 2px 6px 0px rgba(220, 231, 241, 0.7);
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #ffffff;
  cursor: move;
  margin: 12px 0;

  header {
    padding: 12px;
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
