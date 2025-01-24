<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div>
    <AsgHighSearch showOperation>
      <template #top>
        <el-select v-model="belong" placeholder="请选择赛程" size="small" @change="handleChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name">
            <span>{{ item.name }}</span>
            <i v-if="item.is_over" style="color: red; margin-left: 20px" class="el-icon-warning"></i>
            <i v-else style="color: green; margin-left: 20px" class="el-icon-success"></i>
          </el-option>
        </el-select>
      </template>
      <template #search>
        <el-input v-model="listQuery.teamName1" size="small" clearable placeholder="输入主场战队名检索"></el-input>
        <el-input v-model="listQuery.teamName2" size="small" clearable placeholder="输入客场战队名检索"></el-input>
      </template>
      <template #btnList>
        <el-button size="small" type="primary" @click="handlePageOneSearch">查询</el-button>
        <el-button plain size="small" @click="handleResetSearch">重置</el-button>
      </template>
      <template #operation>
        <exportDia :belong="belong"></exportDia>
        <el-button style="margin: 0 12px" size="mini" type="primary" @click="toDetail('add')">新增赛程<i
            class="el-icon-plus"></i></el-button>
        <div class="import_btn" @click="handleInput">
          批量导入
          <svg-icon style="margin-left: 3px" iconClass="import" width="14px" height="14px" color="#fff"></svg-icon>
        </div>
        <input type="file" id="ipt" style="display: none" @change="handleFileChange" />
      </template>
    </AsgHighSearch>
    <!-- 数据主体 -->
    <div class="asg-table-main" v-loading="loading">
      <template v-if="scheduleData.length > 0">
        <asgTableCard v-for="(item, index) in scheduleData" :key="index">
          <template v-slot:header>
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 100%;
              ">
              <div style="display: flex">
                <el-tag size="small" type="primary" style="margin: 0 12px">{{
                  item.tag || "未设置赛标"
                }}</el-tag>
                <el-tag size="small" type="danger" style="margin: 0 12px">{{
                  item.belong
                }}</el-tag>
                <p class="fontWeight">
                  {{ item.team1_name }}
                  <span style="color: rgb(71, 95, 184)">vs</span>
                  {{ item.team2_name }}
                </p>
              </div>
              <div>
                <el-button style="margin: 0 12px" type="text" size="small"
                  @click="toDetail('edit', item)">管理赛程</el-button>
                <el-button style="margin: 0 12px; color: #f40" type="text" size="small"
                  @click="delGame(item)">删除赛程</el-button>
              </div>
            </div>
          </template>
          <template v-slot:content>
            <div class="content-grid-wrap">
              <el-descriptions>
                <el-descriptions-item label="主场战队" :span="1">
                  {{ item.team1_name }}
                  <span class="like__icon"> {{ item.team1_piaoshu }}人支持 </span>
                </el-descriptions-item>
                <el-descriptions-item label="客场战队" :span="1">
                  {{ item.team2_name }}
                  <span class="like__icon"> {{ item.team2_piaoshu }}人支持 </span>
                </el-descriptions-item>
                <el-descriptions-item label="裁判" :span="1">{{
                  item.judge || "无裁判"
                }}</el-descriptions-item>
                <el-descriptions-item label="比赛时间">{{
                  new Date(item.opentime) | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                }}</el-descriptions-item>
                <el-descriptions-item label="解说">
                  {{ handleCommentary(item.commentary)
                  }}<span style="color: #4090ef">(最大数量：{{ item.com_limit }})</span>
                </el-descriptions-item>
                <el-descriptions-item label="导播">{{
                  item.referee || '无导播'
                }}</el-descriptions-item>
                <el-descriptions-item label="回放链接"><el-link v-if="item.bilibiliuri !== 'lose' && item.bilibiliuri"
                    :href="item.bilibiliuri" target="_blank" type="success">点击前往</el-link>
                  <el-link v-else-if="item.bilibiliuri === 'lose'" type="info">回放丢失</el-link>
                  <el-link v-else type="danger">回放尚未上传</el-link></el-descriptions-item>
                <el-descriptions-item label="是否允许选班">
                  <span>{{ item.isAllowChoose === 1  ? '允许' : '不允许'}}</span>
                </el-descriptions-item>
                <el-descriptions-item label="人员构成">
                  <p>{{ item.personTypeName }}</p>
                </el-descriptions-item>
              </el-descriptions>
              <div class="winner-wrap">
                <el-popover popper-class="asg-popper" placement="bottom" width="200" trigger="click">
                  <li class="list-asg-content">获胜战队：
                    <span class="winteam-text" :class="item.winteam ? 'confirm' : 'unconfirm'">{{ item.winteam || '赛程进行中' }}</span>
                  </li>
                  <li class="list-asg-content">赛后结果：
                    <span class="view-pointer" v-if="!item.winteam" @click="fillGameResult(item)">待登记</span>
                    <span class="view-pointer" v-else @click="viewGameResult(item)">查看赛果</span>
                  </li>
                  <div slot="reference" class="box-content" :class="item.winteam ? 'success-do' : 'wait-do'">
                    <i style="font-size: 1.5em;" :class="item.winteam ? 'el-icon-s-claim' : 'el-icon-edit-outline'"></i>
                    <p>{{ item.winteam ? '已登记' : '待登记' }}</p>
                  </div>
                </el-popover>
              </div>
            </div>
          </template>
        </asgTableCard>
      </template>
      <el-empty v-else description="暂无赛程数据"></el-empty>
    </div>
    <el-pagination style="float: right; margin-top: 12px" @current-change="handlePageChange($event, 'page')"
      @size-change="handlePageChange($event, 'limit')" :current-page.sync="listQuery.page" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 弹出框 -->
    <dialog-choose :eventName="belong" :showChoose.sync="showChoose" @refresh="initSchedule"
      :tagOptions="tagOptions"></dialog-choose>
    <GameResult :dialogVisible.sync="gameResultDialog" :gameResult="gameResult" @updateLoad="initSchedule"></GameResult>
    <!-- <MatchDialog :dialogVisible.sync="matchDialogVisible" :rowItem="rowItem" :groupOptions="groupOptions"></MatchDialog> -->
    <viewResultDialog :dialogVisible.sync="viewGameResultDialog" :gameResult="gameResult"></viewResultDialog>
  </div>
</template>

<script>
import { delSchedule, importExcel } from "@/api/schedule/index";
import { getAllEvents } from "@/api/gameSeason/index";
import exportDia from "./exportDia.vue";
import DialogChoose from "./DialogChoose.vue";
import asgTableCard from "@/components/asg-table-card.vue";
import GameResult from "./GameResult.vue";
import viewResultDialog from "./viewResultDialog.vue";
import { getUserRoles, getAllScheduleV2 } from "@/api/schedule/index";
import * as XLSX from "xlsx";
import AsgHighSearch from "@/components/AsgHighSearch.vue";
export default {
  name: "ScheduleTable",
  props: {
    tagOptions: {
      type: Array,
      default: () => [],
    },
    personGroup: {
      type: Array,
      default: () => []
    },
    groupOptions: {
      type: Array,
      default: () => []
    }
  },
  components: {
    GameResult,
    exportDia,
    DialogChoose,
    asgTableCard,
    viewResultDialog,
    AsgHighSearch,
  },
  data() {
    return {
      scheduleData: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10,
        teamName1: "",
        teamName2: "",
      },
      total: null,
      commentaryOptions: [], //解说选项
      teamList: [], //战队选项
      winteam: "",
      belong: "",
      options: [],//赛季列表
      showChoose: false, //选择参赛队伍弹出框
      // gameResult部分
      gameResult: {},
      gameResultDialog: false,
      // 通知弹窗
      viewGameResultDialog: false,
    };
  },
  methods: {
    fillGameResult(item) {
      this.gameResult = item;
      this.gameResultDialog = true;
    },
    viewGameResult(item) {
      this.gameResult = item;
      this.viewGameResultDialog = true;
    },
    handleComNumberChange(value) {
      const length = this.diaData.comList.filter((item) =>
        Boolean(item)
      ).length;
      if (length < value) {
        this.diaData.comList.push({ id: 0, chinaname: "待定" });
      }
    },
    toDetail(type, item = {}) {
      this.$emit("toDetail", type, item);
    },
    handlePageOneSearch() {
      this.listQuery = {
        ...this.listQuery,
        page: 1,
        limit: 10,
      };
      this.initSchedule();
    },
    handleResetSearch() {
      this.belong = "";
      this.listQuery = {
        teamName1: "",
        teamName2: "",
        page: 1,
        limit: 10,
      };
      this.initSchedule();
    },
    //获取赛程
    async initSchedule() {
      try {
        this.loading = true;
        window.sessionStorage.setItem('asg-season-belong', this.belong)
        const req = {
          belong: this.belong,
          ...this.listQuery,
        };
        const { data, status } = await getAllScheduleV2(req);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
        this.scheduleData = (data?.data?.rows ?? []).map((item) => {
          return {
            ...item,
            personTypeName:
              this.personGroup.find((el) => el.value === item.person_type)
                ?.label ?? "未定义",
          };
        });
        this.total = data?.data?.total ?? 0;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    // 获取赛季
    async initSeason() {
      try {
        this.loading = true;
        const { data, status, message } = await getAllEvents();
        if (status !== 200) throw new Error(message);
        this.options = data;
        if (window.sessionStorage.getItem('asg-season-belong', this.belong)) {
          this.belong = window.sessionStorage.getItem('asg-season-belong', this.belong)
        } else {
          const filterData =
            data.filter((item) => !item.is_over).length === 0
              ? data.at(-1)
              : data.filter((item) => !item.is_over).at(-1);
          this.belong = filterData.name;
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    handleSelect() {
      if (this.belong === "all" || !this.belong) {
        this.$message.error("请选择抽取的赛季");
      } else {
        this.showChoose = true;
      }
    },
    initGetCommentary() {
      let params = {
        opname: "Commentator",
      };
      getUserRoles(params)
        .then((res) => {
          this.commentaryOptions = [];
          this.commentaryOptions.push({ chinaname: "待定", id: 0 });
          this.commentaryOptions = this.commentaryOptions.concat(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delGame(row) {
      this.$confirm("是否删除该赛程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delSchedule(row.id)
          .then(() => {
            this.$message.success("删除成功！");
            this.initSchedule();
          })
          .catch((err) => {
            this.$message.error(err);
          });
      });
    },
    handlePageChange(value, prop) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: value,
      };
      this.initSchedule();
    },
    handleChange() {
      this.listQuery.page = 1;
      this.initSchedule();
    },
    handleFileChange(e) {
      let file = e.target.files[0]; // 文件信息
      // 错误情况判断
      if (!file) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader(); // 读取文件

      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result; // 获取结果
          // 获取所有表的信息
          const workbook = XLSX.read(data, {
            type: "binary", // 以字符编码的方式解析
            cellDates: true, // 将excel中日期类型数据，转化为标准日期格式，而不是默认的数字格式
          });
          // 获取第一张表的表名
          const exlname = workbook.SheetNames[0];
          // 转换成json数据
          const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
          console.log("🐕 ~ exl:", exl);
          if (!exl.every((v) => v.opentime)) {
            this.$message.error("请检查开始时间是否填写！");
            return;
          }
          if (!exl.every((v) => v.referee)) {
            this.$message.error("请检查导播或者裁判是否填写！");
            return;
          }
          // 打印 ws 就可以看到读取出的表格数据
          const exportData = this.setExcelData(exl);
          console.log("🐕 ~ 解说数据格式", exportData);
          if (!exportData.every((data) => data.belong)) {
            this.$message.error("请检查每个赛季是否都填写了！");
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: "正在导入数据中......",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.8)",
          });
          importExcel(exportData)
            .then(() => {
              this.clearInput();
              this.$message.success("导入成功！");
              this.initSchedule(this.currentPage, this.pageSize, this.belong);
              loading.close();
            })
            .catch((err) => {
              this.clearInput();
              this.$message.error(err);
              loading.close();
            });
          // 数据处理
        } catch (e) {
          this.clearInput();
          loading.close();
          this.$message.error("导入失败，请检查模板是否填写正确！");
          return false;
        }
      };
      fileReader.readAsBinaryString(file);
    },
    handleInput() {
      const input = document.getElementById("ipt");
      input.click();
    },
    clearInput() {
      const input = document.getElementById("ipt");
      input.value = "";
    },
    setExcelData(arr) {
      let newArr = arr.slice(2);
      newArr.forEach((item) => {
        if (item.commentary) {
          let containerArr = [];
          if (typeof item.commentary !== "string") {
            item.commentary = item.commentary.toString();
          }
          const commentarys = item.commentary.split(",");
          for (let i = 0; i < commentarys.length; i++) {
            const findCom = this.commentaryOptions.find(
              (coms) => coms.chinaname === commentarys[i]
            );
            if (findCom) {
              containerArr.push(findCom);
            }
          }
          let mapData = containerArr.map((v) => ({
            id: v.id,
            chinaname: v.chinaname,
          }));
          item.commentary = JSON.stringify(mapData);
        }
      });
      return newArr;
    },

    // 处理
    handleCommentary(commentary) {
      if (commentary === "[]") {
        return "无解说报名";
      }
      return JSON.parse(commentary)
        .map((item) => item.chinaname)
        .join(",");
    },
    // 回放丢失
    setLose() {
      this.diaData.bilibiliuri = "lose";
    },
  },
  computed: {
    hasCom() {
      return this.diaData.personType.includes("commentary");
    },
  },
  async created() {
    await this.initSeason();
    this.initSchedule();
    this.initGetCommentary();
  },
};
</script>

<style scoped lang="less">
.winner {
  color: #cccc00;
}

.list-asg-content {
  margin:0.8em 0;
  display: flex;
  align-items: center;
  color:#fff;
  .winteam-text{
    font-size: 0.9em;
    &.confirm{
      color: #cccc00;
    }
    &.unconfirm{
      color:#c0c0c0;
    }
  }
  .view-pointer{
    font-size: 0.9em;
    color:#95bdee;
    cursor:pointer;
    text-decoration: underline;
    text-decoration-color: #7eb1ef;
    text-underline-offset: 0.4em;
  }
}

.fontWeight {
  font-weight: bold;
  font-size: 16px;
  margin: 0 12px;
}

.import_btn {
  display: flex;
  justify-content: center;
  margin: 0 12px;
  align-items: center;
  font-size: 13px;
  padding: 5px 12px;
  cursor: pointer;
  border-radius: 3px;
  color: #fff;
  background-color: #85ce61;

  &:hover {
    background-color: #9ce279;
  }
}

/deep/.el-descriptions__body {
  padding: 5px 24px;
}

.like__icon {
  font-size: 12px;
  font-weight: 500;
  margin-left: 12px;
  color: rgb(237, 81, 14);
}

/deep/.el-form-item__content .el-input-group {
  vertical-align: middle;
}

.content-grid-wrap {
  display: grid;
  grid-template-columns: 80% 20%;

  .winner-wrap {
    width: 100%;
    border-left: 1px solid #4090EF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;

    .box-content {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      border-radius: 10px;
      color:#fff;
      gap: 0.5em;
      font-size: 0.8em;
      padding: 1em;
      &.wait-do{
        background: #0c80e5;
      }
      &.success-do{
        background: #0bc473;
      }
    }
  }
}
</style>
