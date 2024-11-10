<template>
  <div>
    <ChamplionPlubish @refreshList="initAllCham" :eventOptions="options"></ChamplionPlubish>
    <!-- 展示 -->
    <el-scrollbar :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section"
      style="height: calc(80vh - 80px)">
      <baseTable :data="cham" :column="tableProps" v-loading="loading">
        <template #projectHeader="{ data }">
          <div class="header--rela">
            <div class="header__clip">
              <div class="path__half">{{ data.eventId }}</div>
            </div>
            <span>
              <span class="fontWeight">{{ data.teamName }}</span>
            </span>
            <span>{{ data.eventName }}</span>
            <span><i class="el-icon-time"></i>{{
              new Date(data.seasonTime) | parseTime("{y}-{m}-{d}")
            }}</span>
          </div>
          <div>
            <span><i class="el-icon-edit" style="
                  color: rgb(91, 182, 242);
                  font-size: 16px;
                  cursor: pointer;
                " @click="edit(data)"></i></span>
            <i class="el-icon-delete" style="color: red; font-size: 16px; cursor: pointer"
              @click="handleDelete(data)"></i>
          </div>
        </template>
        <template #hunMember="{ data }">
          <div class="info" v-for="item in data.hunMember" :key="item.roleName">
            <p class="my-task-auth margin-icon">
              <i class="el-icon-s-custom"></i>{{ item.roleName }}
            </p>
            <p class="my-task-success margin-icon">
              <i class="el-icon-s-data"></i>{{ item.rank }}
            </p>
          </div>
        </template>
        <template #surMember="{ data }">
          <div class="info" v-for="item in data.surMember" :key="item.roleName">
            <p class="my-task-auth margin-icon">
              <i class="el-icon-s-custom"></i>{{ item.roleName }}
            </p>
            <p class="my-task-success margin-icon">
              <i class="el-icon-s-data"></i>{{ item.rank }}
            </p>
          </div>
        </template>
        <template #msg="{ data }">
          <div style="width: 100%">{{ data.message }}</div>
        </template>
        <template #tel="{ data }">
          <span>{{ data.contact }}</span>
        </template>
        <template #like="{ data }">
          <span>{{ data.vote }}</span>
        </template>
      </baseTable>
    </el-scrollbar>
    <el-dialog title="修改冠军" :close-on-click-modal="false" :visible.sync="editVisible" width="60%" @close="closeEditDialog">
      <el-form ref="updateForm" :model="editForm" label-position="right" label-width="120px" :rules="rules">
        <el-row>
          <el-col :span="6">
            <el-form-item label="战队FORMID" prop="formId">
              <el-input size="small" v-model="editForm.formId" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赛季" prop="eventname">
              <el-select size="small" v-model="editForm.eventname" disabled style="margin-bottom: 10px; margin-right: 30px"
                placeholder="请选择赛季">
                <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="战队简介" prop="msg">
          <el-input type="textarea" :rows="4" v-model="editForm.msg" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog" size="mini">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateCham('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllCham,
  deleteCham,
  updateChampion,
} from "@/api/cham/index.js";
import baseTable from "@/components/baseTable.vue";
import ChamplionPlubish from "@/view/blok/ChamplionPlubish.vue";
import { getAllEvents } from "@/api/gameSeason/index";
import { getByTitle } from "@/api/config";

export default {
  name: "ChamplionManage",
  components: {
    baseTable,
    ChamplionPlubish
  },
  data() {
    return {
      id: null,
      options: [],
      cham: [],
      tableProps: [
        {
          type: "index",
          label: "序号",
          props: "index",
          style: {
            textAlign: "center",
            minWidth: "50px",
          },
        },
        {
          type: "hunMember",
          label: "监管者",
          prop: "hunMember",
          slot: true,
          style: {
            textAlign: "left",
            width: "250px",
          },
        },
        {
          type: "surMember",
          label: "求生者",
          prop: "surMember",
          slot: true,
          style: {
            textAlign: "left",
            width: "250px",
          },
        },
        {
          type: "msg",
          label: "战队简介",
          prop: "msg",
          slot: true,
          style: {
            textAlign: "left",
            minwidth: "450px",
          },
        },
        {
          type: "tel",
          label: "联系方式",
          prop: "tel",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "60px",
          },
        },
        {
          type: "like",
          label: "获赞数",
          prop: "like",
          slot: true,
          style: {
            textAlign: "center",
            width: "60px",
          },
        },
      ],
      loading:false,
      selectData: [],
      editVisible: false,
      editForm: {},
      rules: {
        formId: [
          { required: true, message: "FORMID不能为空", trigger: "change" },
        ],
        eventname: [
          { required: true, message: "赛季不能为空", trigger: "change" },
        ],
        msg: [
          { required: true, message: "战队简介不能为空", trigger: "change" },
        ],
      },
      historyRanks: []
    };
  },
  methods: {
    initAllCham() {
      this.loading = true;
      getAllCham()
        .then(({ data }) => {
          this.cham = data.map(item => {
            return {
              message: item.msg,
              id: item.id,
              eventName: item.events.name,
              formId:item.form.id,
              eventId: item.events.id,
              seasonTime: item.events.opentime,
              vote: item.form.piaoshu,
              contact: item.form.team_tel,
              teamName: item.form.team_name,
              surMember: item.form.role.filter(role => role.role_lin === '求生者').map(el => {
                return {
                  roleName: el.role_name,
                  rank: this.historyRanks.find(rankEle => rankEle.value === (el.historical_Ranks ?? -1).toString())?.label ?? '未知段位',
                  commonRoles: el.common_Roles
                }
              }),
              hunMember: item.form.role.filter(role => role.role_lin === '监管者').map(el => {
                return {
                  roleName: el.role_name,
                  rank: this.historyRanks.find(rankEle => rankEle.value === (el.historical_Ranks ?? -1).toString())?.label ?? '未知段位',
                  commonRoles: el.common_Roles
                }
              })
            }
          });
        })
        .catch((err) => {
          this.$message.error(err.message);
        })
        .finally(()=>{
          this.loading = false;
        })
    },
    // 删除冠军
    handleDelete(data) {
      this.$confirm("此操作将删除该冠军，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteCham(data.id);
          this.$message.success("删除成功！");
          this.initAllCham();
        })
        .catch(() => { });
    },
    // 编辑
    edit(data) {
      this.editVisible = true;
      this.$set(this.editForm, "formId", data.formId);
      this.$set(this.editForm, "eventname", data.eventName);
      this.$set(this.editForm, "msg", data.message);
    },
    // 更新
    updateCham(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await updateChampion(this.editForm);
          this.editForm = {};
          this.editVisible = false;
          this.$message.success("更新成功！");
          this.initAllCham();
        } else {
          this.$message.error("请完整填写表单内容！")
        }
      });
    },
    closeEditDialog() {
      this.editVisible = false;
      this.editForm = {};
    },
  },
  created() {
    getAllEvents().then(res => {
      this.options = res.data;
    })
    getByTitle('historyRank').then(({ data }) => {
      this.historyRanks = data;
      this.initAllCham();
    })
  },
};
</script>

<style scoped lang="less">
.fontWeight {
  font-size: 18px;
  font-weight: bold;
  color:#4090EF;
  margin-right: 24px;
}

thead .el-table-column--selection .cell {
  display: none;
}

.info {
  display: flex;
  justify-content: space-between;
}

.header--rela {
  position: relative;
  padding-left: 26px;

  .header__clip {
    position: absolute;
    top: -15px;
    left: -28px;
    -webkit-clip-path: polygon(0 0, 0% 100%, 100% 0);
    clip-path: polygon(0 0, 0% 100%, 100% 0);
    height: 50px;
    width:50px;
    background-color: #c5cceb;
    .path__half {
      width: 60%;
      height: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #409eff;
    }
  }
}
</style>
