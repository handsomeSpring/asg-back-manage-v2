<!-- 导播选班列表 -->
<template>
  <div>
    <div class="header__content">
      <el-select size="small" v-model="belong" placeholder="请选择赛季名称" @change="getList(true)">
        <el-option v-for="(item, index) in eventList" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button size="small" type="primary" @click="handleSave">确定选班</el-button>
    </div>
    <div class="main__container" v-loading="loading">
      <template v-if="tableData.length > 0">
        <asgTableCard v-for="(item, index) in tableData" :key="index">
          <template v-slot:header>
            <div class="table-header">
              <el-checkbox v-if="new Date() < new Date(item.opentime)" v-model="item.isCheck"
                @input="handleCheck($event, item)"
                :disabled="item.referee_Id === userInfo.id || !!item.referee_Id"></el-checkbox>
              <p>{{ item.team1_name }} vs {{ item.team2_name }}<span style="color:#f40;margin-left: 1em;"
                  v-if="new Date() > new Date(item.opentime)">(赛程已结束)</span></p>
            </div>
          </template>
          <template v-slot:content>
            <div class="table-content">
              <div class="left-content">
                <p class="text">比赛时间：
                  <span style="color: #4090ef">{{ item.opentime }}</span>
                </p>
                <p class="text">
                  解说：<span style="color: #4090ef">{{
                    item.commentary || "无解说报名"
                    }}</span>
                </p>
                <p class="text">
                  裁判：<span style="color: #4090ef">{{
                    item.judge || "无裁判报名"
                    }}</span>
                </p>
                <p class="text">
                  赛程类别：
                  <span style="color: #4090ef">{{ item.tag || "未定义" }}</span>
                </p>
                <p class="text">
                  导播：<span class="referee-comp" :class="item.referee ? 'success' : 'primary'">{{
                    item.referee || "虚位以待"
                    }}</span>
                </p>
              </div>
              <div class="right-content">
                <p v-if="!item.referee_Id && !item.referee" style="color:#0c80e5">虚位以待</p>
                <p v-else style="color:#32B16C ">
                  已有导播
                  <span v-if="item.referee_Id === userInfo.id">（您的班次）</span>
                </p>
                <el-button size="mini" v-if="
                  item.referee_Id === userInfo.id &&
                  new Date() < new Date(item.opentime)
                " type="danger" @click="handleCancel(item)">取消选班</el-button>
              </div>
            </div>
          </template>
        </asgTableCard>
      </template>
      <el-empty v-else description="暂无赛程"></el-empty>
    </div>
    <div class="noMore">
      <el-button v-if="hasMore" :loading="loading" size="small" type="primary" @click="getList(false)">加载更多</el-button>
      <p v-else>没有更多了~</p>
    </div>
    <cancelDialog :scheduleItem="scheduleItem" :dialogVisible.sync="dialogVisible" @finish="getList(true)">
    </cancelDialog>
  </div>
</template>

<script>
import { getAllEvents } from "@/api/gameSeason/index";
import { getScheduleFrontNew } from "@/api/schedule/index.js";
import { mapGetters } from "vuex";
import { anchorChoose } from "@/api/schedule/referee.js";
import cancelDialog from "./components/cancelDialog.vue";
import asgTableCard from "@/components/asg-table-card.vue";
export default {
  name: "refereeChoose",
  components: {
    cancelDialog,
    asgTableCard
  },
  data() {
    return {
      tableData: [],
      eventList: [],
      loading: false,
      belong: "",
      fullScreenLoading: null,
      listQuery: {
        page: 1,
        page_long: 3,
      },
      hasMore: true,
      checkSet: null,
      dialogVisible: false,
      scheduleItem: {},
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.checkSet = new Set();
    this.initEvent();
  },
  methods: {
    handleCancel(item) {
      this.scheduleItem = item;
      this.dialogVisible = true;
    },
    handleCheck($event, item) {
      if ($event) {
        this.checkSet.add(item.id);
      } else {
        this.checkSet.delete(item.id);
      }
    },
    async getList(reset = false) {
      try {
        this.loading = true;
        this.listQuery.page = Math.floor(this.tableData.length / 3) + 1;
        if (reset) {
          this.listQuery.page = 1;
          this.listQuery.page_long = 3;
          this.hasMore = true;
          this.tableData = [];
        }
        const req = {
          ...this.listQuery,
          belong: this.belong,
        };
        const { data, status } = await getScheduleFrontNew(req);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
        this.tableData = [
          ...this.tableData,
          ...data.map((item) => {
            return {
              ...item,
              isCheck: item.referee_Id === this.userInfo.id,
              commentary: !!item.commentary
                ? JSON.parse(item.commentary)
                  .map((role) => role.chinaname)
                  .join(",")
                : "暂无解说报名",
            };
          }),
        ];
        if (data.length < 3) {
          this.hasMore = false;
        }
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
        this.fullScreenLoading.close();
      }
    },
    async initEvent() {
      this.fullScreenLoading = this.$loading({
        lock: true,
        text: "努力获取数据中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        const { data, status } = await getAllEvents();
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
        this.eventList = (data ?? []).map((item) => {
          return {
            value: item.name,
            label: item.name,
          };
        });
        this.belong = (data ?? []).filter((item) => !item.is_over).at(-1).name;
        this.getList();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async handleSave() {
      if (this.checkSet.size === 0) return this.$message.error("至少选择一个场次");
      const loading = this.$loading({
        lock: true,
        text: "正在选班中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        const allId = [];
        this.checkSet.forEach((item) => {
          allId.push(item);
        });
        const allIds = allId.join(",");
        const { status, data } = await anchorChoose(allIds);
        if (status !== 200) throw new Error("服务端异常");
        if (data && data.code !== 200) throw new Error(data.message);
        this.$message.success("选班成功！");
        this.getList(true);
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        loading.close();
      }
    },
  },
};
</script>

<style scoped lang="less">
@import url('../../assets/mobileStyles/refereeChoose/index.less');

.header__content {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main__container {
  min-height: 70vh;
  .table-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    height: 100%;
    padding-left: 0.5em;
    font-family: 'hk';
  }

  .table-content {
    display: grid;
    width: calc(100% - 1em);
    grid-template-columns: 80% 20%;
    padding: 1em 0.5em;

    .left-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1em;

      .text {
        font-size: 0.9em;
        font-weight: 500;
        font-family: 'hk';
      }
    }

    .right-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      gap: 0.3em;
      width: 100%;
      border-left: 1px solid #6aaadb;

      p {
        font-size: 'hk';
        font-weight: 500;
        font-size: 0.9em;
      }
    }

  }
}


.noMore {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;

  p {
    color: #aaaaaa;
    font-size: 14px;
  }
}

::-webkit-scrollbar {
  display: none !important;
}

.referee-comp {
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 13px;
  color: #fff;

  &.primary {
    background: linear-gradient(141deg, #44a3fd 0%, #0c80e5 100%);
  }

  &.success {
    background: linear-gradient(141deg, #3CDA7A 0%, #32B16C 100%);
  }
}
</style>
