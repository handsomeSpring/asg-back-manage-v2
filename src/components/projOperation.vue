<template>
  <div ref="container" class="online_container">
    <div class="online_icon" @click="showPhone">
      <el-badge :value="noCompleteNumber" class="item">
        <svg-icon
          iconClass="project-collection"
          width="22px"
          height="22px"
          color="#e7e7e7"
        ></svg-icon>
      </el-badge>
      任务卡
    </div>
    <div class="online_windows">
      <h3 class="h3__flex">
        <p><i class="el-icon-s-claim"></i>我的任务清单</p>
        <el-button
          icon="el-icon-refresh-right"
          size="small"
          type="primary"
          @click="initAssign"
          >刷新</el-button
        >
      </h3>
      <el-scrollbar class="list">
        <ul v-if="list.length > 0">
          <li class="box__li" v-for="(item, index) in list" :key="index">
            <header>
              <p class="task__title">
                {{ item.taskName }}
                <span :class="`level-${item.priority}`">{{
                  item.priority | filterPriority
                }}</span>
              </p>
              <el-button
                v-if="['0', '3'].includes(item.status)"
                icon="el-icon-circle-check"
                size="small"
                type="primary"
                @click="taskComplete(item.id)"
                >完成</el-button
              >
              <el-button
                v-else
                icon="el-icon-view"
                size="small"
                type="primary"
                @click="viewTask(item)"
                >查看</el-button
              >
            </header>
            <main>
              <p>{{ item.taskDescription }}</p>
              <div class="footer__container">
                <p class="money__icon">
                  {{ item.money }}<span class="chies__icon">积分</span>
                </p>
                <p
                  class="status__icon"
                  :style="{ color: textColor(item.status) }"
                >
                  {{ item.status | filterComplete }}
                </p>
              </div>
            </main>
          </li>
        </ul>
        <el-empty v-else description="暂时没有被分配的任务"></el-empty>
      </el-scrollbar>
      <h3><i class="el-icon-shopping-cart-1"></i>购物信息</h3>
      <p>
        我的积分：<span style="color: rgb(255, 133, 46); font-weight: bold">{{
          money || 0
        }}</span>
      </p>
      <footer @click="toShopping">
        前往购物中心
        <svg-icon
          iconClass="router"
          width="16px"
          height="16px"
          color="#000"
        ></svg-icon>
      </footer>
    </div>
    <taskHistory ref="taskHistory" :row="row"></taskHistory>
  </div>
</template>

<script>
import taskHistory from "@/view/taskManager/components/taskHistory.vue";
import { getTask, taskFinish } from "@/api/admin/index.js";
import { mapGetters } from "vuex";
export default {
  name: "projOperation",
  components: {
    taskHistory,
  },
  data() {
    return {
      toggle: true,
      list: [],
      row: {},
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    money() {
      return this.userInfo.money || sessionStorage.getItem("money") || 0;
    },
    noCompleteNumber() {
      let number = 0;
      this.list.forEach((item) => {
        if (item.status === "0") {
          number++;
        }
      });
      return number;
    },
  },
  filters: {
    filterComplete(val) {
      const map = {
        0: "进行中",
        1: "待审核",
        2: "审核通过",
        3: "审核不通过",
      };
      return map[val];
    },
    filterPriority(val) {
      const mapList = {
        0: "不急",
        1: "轻微",
        2: "一般",
        3: "紧需",
        4: "致命",
      };
      return mapList[val];
    },
  },
  created() {
    this.initAssign();
  },
  watch: {
    $route: {
      handler() {
        if (this.$refs.container) {
          this.$refs.container.style.right = "-440px";
          this.toggle = true;
        }
      },
    },
  },
  methods: {
    textColor(val) {
      if (val === "0") {
        return "#979797";
      } else if (val === "1") {
        return "#ebb563";
      } else if (val === "2") {
        return "#67C23A";
      } else if (val === "3") {
        return "#f40";
      } else {
        return "#303030";
      }
    },
    showPhone() {
      this.$refs.container.style.right = this.toggle ? 0 : "-440px";
      this.toggle = !this.toggle;
    },
    initAssign() {
      const id = Number(window.sessionStorage.getItem("id"));
      if (Number.isNaN(id)) throw new Error("id不合法");
      getTask(id)
        .then((res) => {
          this.list = res.data;
          const number = this.list.filter(item => item.status === '0').length ?? 0;
          this.$store.commit("SET_WAITDO_NUMBER", number);
        })
        .catch((err) => {
          this.$message.error(err instanceof Error ? err.message : err);
        });
    },
    async taskComplete(id) {
      try {
        const { status, message } = await taskFinish(id);
        if (status !== 200) throw new Error(message);
        this.initAssign();
        this.$message.success("操作成功");
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    viewTask(item) {
      this.row = item;
      this.$refs.taskHistory.openDialog();
    },
    toShopping() {
      this.$router.push({ path: "/shopping" });
    },
  },
};
</script>

<style scoped lang="less">
.online_container {
  display: flex;
  position: absolute;
  right: -440px;
  top: 40vh;
  transition: all 0.5s;
  z-index: 998;
}

.online_icon {
  width: 46px;
  background: rgba(235, 235, 235, 0.8);
  border-radius: 10px 0 0 10px;
  height: 120px;
  cursor: pointer;
  padding: 10px 0 20px 0;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  line-height: 26px;
  width: 30px;
  color: #000000;
  word-break: break-all;

  svg {
    font-size: 28px;
    margin-bottom: 10px;
  }
}

.online_windows {
  position: relative;
  width: 420px;
  height: 500px;
  transform: translateY(-20vh);
  background: #f2f2f2;
  border: 1px solid #e7e7e7;
  background-color: rgba(225, 225, 225, 0.8);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;

  .h3__flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  footer {
    cursor: pointer;
    margin-top: 12px;
    &:hover {
      color: #4090ef;
    }
  }
}

h3 {
  margin-bottom: 24px;
}

.list {
  height: 60%;
  padding-bottom: 12px;
  border-bottom: 1px dashed #fff;

  .box__li {
    width: 100%;
    padding: 5px 5%;
    border: 1px solid #e7e7e7;
    background: #fff;
    box-sizing: border-box;
    margin: 12px 0;
    border-radius: 7px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &:hover {
      background: #e9f1fb;
    }

    header {
      padding: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e7e7e7;

      .task__title {
        width: 70%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: rgb(81, 85, 207);
        font-weight: bold;
        font-size: 1rem;
      }
    }

    main {
      padding: 18px 6px;

      p {
        font-size: 0.7rem;
        color: #6a6a6a;
      }

      .footer__container {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .money__icon {
          width: 50%;
          color: goldenrod;
          text-overflow: ellipsis;
          font-size: 0.9rem;
          font-weight: bold;

          .chies__icon {
            font-size: 0.6rem;
            margin-left: 2px;
          }
        }

        .status__icon {
          font-size: 0.9rem;
          font-weight: 600;

          &.waitDo {
            color: #f40;
          }

          &.waitAuth {
            color: rgb(255, 132, 0);
          }
        }
      }
    }
  }
}

.success {
  color: rgb(66, 203, 56);
}

.error {
  color: rgb(223, 70, 59);
}

/deep/.el-badge__content.is-fixed {
  z-index: 999;
}
.level-0 {
  color: #cddc39;
  font-size: 12px;
}
.level-1 {
  color: #8bc34a;
  font-size: 12px;
}
.level-2 {
  color: #fdd835;
  font-size: 12px;
}
.level-3 {
  color: #ff8f00;
  font-size: 12px;
}
.level-4 {
  color: #c62828;
  font-size: 12px;
}
</style>
