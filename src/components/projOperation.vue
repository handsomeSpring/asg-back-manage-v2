<template>
  <div ref="container" class="online_container">
    <div class="online_icon" @click="showPhone">
      <div class="count-wrap">{{ noCompleteNumber }}</div>
      任务卡
    </div>
    <div class="online_windows">
      <div class="task_picture">
        <div>
          <h3>当前有<span class="count-info">{{ noCompleteNumber }}</span>个未完成任务</h3>
          <p class="info">任务卡任务完成情况</p>
        </div>
        <el-button icon="el-icon-refresh-right" size="small" type="primary" @click="initAssign">刷新</el-button>
      </div>
      <el-scrollbar class="list">
        <ul v-if="list.length > 0">
          <li class="box__li" v-for="(item, index) in list" :key="index">
            <header>
              <span :class="`level-${item.priority}`">{{
                item.priority | filterPriority
              }}</span>
              <el-tooltip class="item" effect="dark" :content="item.taskName" placement="top">
                <p class="task__title">
                  {{ item.taskName }}

                </p>
              </el-tooltip>
              <el-button v-if="['0', '3'].includes(item.status)" icon="el-icon-circle-check" size="small" plain
                @click="taskComplete(item.id)">完成</el-button>
              <el-button v-else icon="el-icon-view" size="small" plain @click="viewTask(item)">查看</el-button>
            </header>
            <main>
              <p>{{ item.taskDescription }}</p>
              <div class="footer__container">
                <p class="money__icon">
                  {{ item.money }}<span class="chies__icon">积分</span>
                </p>
                <p class="status__icon" :style="{ color: textColor(item.status) }">
                  {{ item.status | filterComplete }}
                </p>
              </div>
            </main>
          </li>
        </ul>
        <el-empty v-else description="暂时没有被分配的任务"></el-empty>
      </el-scrollbar>
      <footer @click="toShopping">
        前往购物中心
        <svg-icon iconClass="router" width="16px" height="16px" color="#000"></svg-icon>
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
      if (number > 9) {
        return number + '+';
      } else {
        return number;
      }
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
  border-radius: 20px;
  height: fit-content;
  cursor: pointer;
  padding: 5px 0 15px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  line-height: 26px;
  width: 30px;
  color: #000000;
  word-break: break-all;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px 0px rgba(146, 146, 146, 0.25);


  .count-wrap {
    width: 23px;
    height: 23px;
    border-radius: 20px;
    background: #4090ef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    font-family: 'hk';
    color: #fff;
  }
}

.online_windows {
  position: relative;
  width: 420px;
  height: 500px;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px 0px rgba(146, 146, 146, 0.25);
  transform: translateY(-20vh);
  padding: 10px;
  border-radius: 6px;

  .task_picture {
    margin-bottom: 12px;
    width: calc(100% - 24px);
    height: 20%;
    background: linear-gradient(84deg, #F7F9FC 0%, #E0EDFF 100%);
    display: flex;
    align-items: center;
    padding: 12px;
    justify-content: space-between;
    gap: 24px;

    h3 {
      font-family: 'hk';
      font-weight: 500;
      font-size: 20px;
      color: #000000;

      .count-info {
        margin: 0 6px;
        color: #f40;
      }
    }

    .info {
      font-weight: 400;
      font-size: 14px;
      color: #82868C;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

  }

  footer {
    cursor: pointer;
    margin-top: 12px;

    &:hover {
      color: #4090ef;
    }
  }
}

.list {
  height: 60%;
  padding-bottom: 12px;
  border-bottom: 1px dashed #fff;

  .box__li {
    width: 100%;
    padding: 17px 12px;
    border-bottom: 1px dashed #E2E3E5;
    background: #fff;
    box-sizing: border-box;

    &:hover {
      background: linear-gradient(270deg, #F8FAFD 0%, #EFF2FD 100%);
    }

    header {
      padding: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #E2E3E5;

      .task__title {
        width: 70%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 1rem;
        font-weight: 500;
        font-size: 14px;
      }
    }

    main {
      padding: 18px 6px;

      p {
        font-weight: 400;
        font-size: 14px;
        color: #82868C;
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
