<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div>
    <div class="wrap-flex">
      <div class="flex__content--between">
        <el-select
          v-model="belong"
          placeholder="请选择赛程"
          size="small"
          @change="handleChange"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            <span>{{ item.name }}</span>
            <i
              v-if="item.is_over"
              style="color: red; margin-left: 20px"
              class="el-icon-warning"
            ></i>
            <i
              v-else
              style="color: green; margin-left: 20px"
              class="el-icon-success"
            ></i>
          </el-option>
        </el-select>
        <div class="operation" @click="foldOperation">
          <p>更多操作</p>
          <i
            ref="foldIcon"
            :style="{ transform: foldIcon ? 'rotate(90deg)' : 'rotate(0deg)' }"
            class="el-icon-arrow-right foldIcon"
          ></i>
        </div>
      </div>
      <transition name="mybox">
        <div v-show="foldIcon" class="operation_list">
        <div class="grid__container">
          <el-input
            v-model="listQuery.teamName1"
            size="small"
            clearable
            placeholder="输入主场战队名检索"
          ></el-input>
          <el-input
            v-model="listQuery.teamName2"
            size="small"
            clearable
            placeholder="输入客场战队名检索"
          ></el-input>

          <div class="button--right">
            <el-button size="small" type="primary" @click="initSchedule"
              >查询</el-button
            >
            <el-button plain size="small" @click="handleResetSearch"
              >重置</el-button
            >
          </div>
        </div>
        <el-divider>操作</el-divider>
        <div class="operation__button">
          <exportDia :belong="belong"></exportDia>
          <el-button
            style="margin: 0 12px"
            size="mini"
            type="primary"
            @click="openDialog"
            >新增赛程<i class="el-icon-plus"></i
          ></el-button>
          <div class="import_btn" @click="handleInput">
            批量导入
            <svg-icon
              style="margin-left: 3px"
              iconClass="import"
              width="14px"
              height="14px"
              color="#fff"
            ></svg-icon>
          </div>
          <input
            type="file"
            id="ipt"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        </div>
      </transition>
    </div>
    <!-- 数据主体 -->
    <el-scrollbar
      :native="false"
      wrapStyle=""
      wrapClass=""
      viewClass=""
      viewStyle=""
      :noresize="false"
      tag="section"
      v-loading="loading"
      element-loading-text="正在加载中......"
      style="height: calc(65vh - 50px); margin-bottom: 15px"
    >
      <template v-if="scheduleData.length > 0">
        <asgTableCard v-for="(item, index) in scheduleData" :key="index">
          <template v-slot:header>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 100%;
              "
            >
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
                <el-button
                  style="margin: 0 12px"
                  type="text"
                  size="small"
                  @click="noticeGame(item)"
                >
                  {{ item.winteam ? "赛果通知" : "赛程通知" }}
                </el-button>
                <el-button
                  v-if="!item.winteam"
                  style="margin: 0 12px"
                  type="text"
                  size="small"
                  @click="fillGameResult(item)"
                  >赛果登记</el-button
                >
                <el-button
                  v-else
                  style="margin: 0 12px"
                  type="text"
                  size="small"
                  @click="viewGameResult(item)"
                  >查看赛果</el-button
                >
                <el-button
                  style="margin: 0 12px"
                  type="text"
                  size="small"
                  @click="updateGame(item)"
                  >编辑赛程</el-button
                >
                <el-button
                  style="margin: 0 12px; color: #f40"
                  type="text"
                  size="small"
                  @click="delGame(item)"
                  >删除赛程</el-button
                >
              </div>
            </div>
          </template>
          <template v-slot:content>
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
                }}<span style="color: #4090ef"
                  >(最大数量：{{ item.com_limit }})</span
                >
              </el-descriptions-item>
              <el-descriptions-item label="导播">{{
                item.referee
              }}</el-descriptions-item>
              <el-descriptions-item label="回放链接"
                ><el-link
                  v-if="item.bilibiliuri !== 'lose' && item.bilibiliuri"
                  :href="item.bilibiliuri"
                  target="_blank"
                  type="success"
                  >点击前往</el-link
                >
                <el-link v-else-if="item.bilibiliuri === 'lose'" type="info"
                  >回放丢失</el-link
                >
                <el-link v-else type="danger"
                  >回放尚未上传</el-link
                ></el-descriptions-item
              >
              <el-descriptions-item label="获胜队伍"
                ><span v-if="item.winteam === null">比赛进行中</span>
                <span class="winner" v-else
                  ><i class="el-icon-trophy"></i>{{ item.winteam }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item label="人员构成">
                <p>{{ item.personTypeName }}</p>
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </asgTableCard>
      </template>
      <el-empty v-else description="暂无赛程数据"></el-empty>
    </el-scrollbar>
    <el-pagination
      style="float: right; margin-top: 12px"
      @current-change="handlePageChange($event, 'page')"
      @size-change="handlePageChange($event, 'limit')"
      :current-page.sync="listQuery.page"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 表单 -->
    <el-dialog
      title="赛程信息"
      width="60%"
      top="5vh"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="diaData" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员构成">
              <el-radio-group v-model="diaData.personType">
                <el-radio
                  v-for="(item, index) in personGroup"
                  :label="item.value"
                  :key="index"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="赛程分类">
              <el-input
                size="small"
                v-model="diaData.belong"
                disabled
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="主场战队">
              <!-- <el-select size="small" filterable clearable value-key="id" v-model="diaData.team1_name"
                  placeholder="请选择战队1">
                  <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.name">
                  </el-option>
                </el-select> -->
              <el-input
                v-model="diaData.team1_name"
                size="small"
                placeholder="请选择战队1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="客场战队">
              <!-- <el-select size="small" filterable clearable value-key="id" v-model="diaData.team2_name"
                  placeholder="请选择战队2">
                  <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.name">
                  </el-option>
                </el-select> -->
              <el-input
                v-model="diaData.team2_name"
                size="small"
                placeholder="请选择战队2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="导播"
              v-show="diaData.personType.includes('referee')"
            >
              <!-- <el-select size="small" filterable clearable value-key="chinaname" v-model="diaData.referee"
                  placeholder="请选择导播">
                  <el-option v-for="item in instructorOptions" :key="item.chinaname" :label="item.chinaname"
                    :value="item.chinaname">
                  </el-option>
                </el-select> -->
              <el-input v-model="diaData.referee" readonly size="small">
                <template #append>
                  <p
                    style="cursor: pointer"
                    @click="handlePersonChoose('referee')"
                  >
                    <i class="el-icon-plus"></i>
                  </p>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-show="diaData.personType.includes('judge')">
            <el-form-item label="裁判">
              <el-input v-model="diaData.judge" readonly size="small">
                <template #append>
                  <p
                    style="cursor: pointer"
                    @click="handlePersonChoose('judge')"
                  >
                    <i class="el-icon-plus"></i>
                  </p>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-show="hasCom">
            <el-form-item label="解说数量" prop="comLimit">
              <el-input-number
                size="small"
                v-model="diaData.comLimit"
                :min="1"
                :max="3"
                @change="handleComNumberChange($event)"
                label="解说数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="hasCom">
          <el-col
            :span="7"
            v-for="(com, comIndex) in diaData.comLimit"
            :key="comIndex"
          >
            <el-form-item :label="`解说${comIndex + 1}`">
              <el-select
                size="small"
                filterable
                clearable
                value-key="id"
                v-model="diaData.comList[comIndex]"
                placeholder="请选择解说1"
              >
                <el-option
                  v-for="item in commentaryOptions"
                  :key="item.chinaname"
                  :label="item.chinaname"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="赛季标识">
              <el-select
                filterable
                size="small"
                style="margin-bottom: 10px"
                v-model="diaData.tag"
                placeholder="请输入赛程标签"
              >
                <el-option
                  v-for="(item, index) in tagOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="开始时间">
              <el-date-picker
                style="width: 100%"
                v-model="diaData.opentime"
                size="small"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="B站回放地址">
              <el-input
                size="small"
                v-model="diaData.bilibiliuri"
                autocomplete="off"
              >
                <template slot="append">
                  <span style="cursor: pointer" @click="setLose"
                    >设置为回放丢失</span
                  >
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="备注">
              <el-input
                size="small"
                type="textarea"
                v-model="diaData.remarks"
                :rows="3"
                maxlength="150"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="updateSchedule"
          >更 新</el-button
        >
      </div>
    </el-dialog>
    <!-- 弹出框 -->
    <dialog-choose
      :eventName="belong"
      :showChoose.sync="showChoose"
      @refresh="initSchedule"
      :tagOptions="tagOptions"
    ></dialog-choose>
    <GameResult
      :dialogVisible.sync="gameResultDialog"
      :gameResult="gameResult"
      @updateLoad="initSchedule"
    ></GameResult>
    <MatchDialog
      :dialogVisible.sync="matchDialogVisible"
      :rowItem="rowItem"
      :groupOptions="groupOptions"
    ></MatchDialog>
    <viewResultDialog
      :dialogVisible.sync="viewGameResultDialog"
      :gameResult="gameResult"
    ></viewResultDialog>
    <personChooseDialog
      :dialogVisible.sync="choosePersonDialog"
      @finish="handleChoose"
      :checkId="checkId"
    ></personChooseDialog>
  </div>
</template>

<script>
import {
  delSchedule,
  getSchedule,
  updateSchedule,
  importExcel,
} from "@/api/schedule/index";
import { getAllEvents } from "@/api/gameSeason/index";
import exportDia from "./exportDia.vue";
import DialogChoose from "./DialogChoose.vue";
import asgTableCard from "@/components/asg-table-card.vue";
import GameResult from "./GameResult.vue";
import MatchDialog from "./MatchDialog.vue";
import viewResultDialog from "./viewResultDialog.vue";
import { getUserRoles, getAllScheduleV2 } from "@/api/schedule/index";
import { getEnrollList } from "@/api/enroll/index.js";
import * as XLSX from "xlsx";
import { getByTitle } from "@/api/config";
import personChooseDialog from "./personChooseDialog.vue";
export default {
  name: "ScheduleTable",
  props: {
    tagOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    GameResult,
    exportDia,
    DialogChoose,
    asgTableCard,
    MatchDialog,
    viewResultDialog,
    personChooseDialog,
  },
  data() {
    return {
      scheduleData: [],
      loading: false,
      foldIcon: false,
      dialogFormVisible: false,
      formLabelWidth: "200",
      diaData: {
        comList: [],
        comLimit: 0,
        refereeId: "",
        referee: "",
        judge: "",
        judgeId: "",
        personType: "",
        remarks: "",
      },
      listQuery: {
        page: 1,
        limit: 10,
        teamName1: "",
        teamName2: "",
      },
      commentaryOptions: [], //解说选项
      teamList: [], //战队选项
      winteam: "",
      belong: "",
      options: [],
      personGroup: [],
      showChoose: false, //选择参赛队伍弹出框
      // gameResult部分
      gameResult: {},
      gameResultDialog: false,
      // 通知弹窗
      matchDialogVisible: false,
      viewGameResultDialog: false,
      choosePersonDialog: false,
      rowItem: {},
      groupOptions: [],
      // 人员选择器
      diaDataKey: null,
      checkId: -1,
    };
  },
  methods: {
    noticeGame(item) {
      this.rowItem = item;
      this.matchDialogVisible = true;
    },
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
    openDialog() {
      this.$emit("operation");
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
        const req = {
          belong: this.belong,
          ...this.listQuery,
        };
        const { data, status } = await getAllScheduleV2(req);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
        this.scheduleData = data.data.map((item) => {
          return {
            ...item,
            personTypeName:
              this.personGroup.find((el) => el.value === item.person_type)
                ?.label ?? "未定义",
          };
        });
        this.total = data.total;
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
        const filterData =
          data.filter((item) => !item.is_over).length === 0
            ? data.at(-1)
            : data.filter((item) => !item.is_over).at(-1);
        this.belong = filterData.name;
        const result = await getByTitle("gameComposition");
        this.personGroup = result.data;
        const group = await getByTitle("qqGroup");
        this.groupOptions = group.data;
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    handleChoose(userObj) {
      this.diaData[this.diaDataKey] = userObj.chinaname ?? "";
      this.diaData[`${this.diaDataKey}_Id`] = userObj.id ?? "";
    },
    handlePersonChoose(key) {
      this.diaDataKey = key;
      this.checkId = this.diaData[`${key}_Id`] ?? -1;
      this.choosePersonDialog = true;
    },
    handleSelect() {
      if (this.belong === "all" || !this.belong) {
        this.$message.error("请选择抽取的赛季");
      } else {
        this.showChoose = true;
      }
    },
    handleReset() {
      this.$set(this.diaData, "opentime", "1970-01-01T00:00:00.656Z");
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
    updateGame(row) {
      console.log(row, "row");
      this.dialogFormVisible = true;
      const arr = JSON.parse(row.commentary);
      this.diaData = {
        ...row,
        comLimit: row.com_limit,
        personType: row.person_type ?? "referee,commentary",
      };
      let comList = [];
      for (let i = 0; i < this.diaData.comLimit; i++) {
        if (!arr[i]) {
          comList.push({ id: 0, chinaname: "待定" });
        } else {
          comList.push(arr[i]);
        }
      }
      this.$set(this.diaData, "comList", comList);
    },
    async updateSchedule() {
      try {
        const commentary = this.diaData.comList.map((item) => ({
          id: item.id,
          chinaname: item.chinaname,
        }));
        const filterArr = commentary.filter((v) => v.id && v.id !== 0);
        const info = {
          team1_name: this.diaData.team1_name,
          team2_name: this.diaData.team2_name,
          belong: this.diaData.belong,
          opentime: this.diaData.opentime,
          commentary: JSON.stringify(filterArr),
          bilibiliuri: this.diaData.bilibiliuri,
          referee: this.diaData.referee,
          tag: this.diaData.tag,
          comLimit: this.diaData.comLimit,
          judge: this.diaData.judge,
          judge_Id: this.diaData.judge_Id,
          referee_Id: this.diaData.referee_Id,
          remarks: this.diaData.remarks,
          personType: this.diaData.personType,
        };
        const { data, status } = await updateSchedule(this.diaData.id, info);
        if (status !== 200) throw new Error("服务端异常");
        if (data && data.code && data.code !== 200)
          throw new Error(data.message ?? "未知错误");
        this.$message.success("更新成功！");
        this.dialogFormVisible = false;
        this.initSchedule();
      } catch (error) {
        console.log(error, "error===");
        if (error?.response?.data?.code === 400) {
          return this.$message.error("操作失败，无权访问");
        }
        this.$message.error("操作失败，后端服务器异常");
      }
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
    async initEnrollList() {
      try {
        const { data } = await getEnrollList(1, 128, "time", this.belong);
        this.teamList = data;
      } catch (error) {
        console.log(error);
      }
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

    // 折叠
    foldOperation() {
      this.foldIcon = !this.foldIcon;
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
  watch: {
    belong: {
      handler() {
        this.initEnrollList();
      },
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

.el-col {
  margin: 0 10px;
}

.wrap-flex {
  .flex__content--between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .operation {
      display: flex;
      align-items: center;
      font-weight: 500;
      border: 1px solid #e7e7e7;
      cursor: pointer;
      font-size: 13px;
      padding: 6px 10px;
      border-radius: 4px;
      gap: 4px;
      &:hover {
        color: #4090ef;
        border-color: #4090EF;
      }
    }
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

.operation_list {
  transition: 0.4s;
  padding: 24px;
  overflow: hidden;
  overflow: visible;
  border: 1px solid #d2d2d2;
  border-top: 2px solid #f5f5f5;
  box-shadow: 1px 5px 5px #eee;
  box-sizing: border-box;
  .operation__button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;
  }
  .grid__container {
    display: grid;
    grid-template-columns: 20% 20% auto;
    gap: 12px;
    .button--right {
      text-align: right;
    }
  }
}

.foldIcon {
  display: block;
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
/deep/.el-form-item__content .el-input-group{
  vertical-align: middle;
}
</style>
