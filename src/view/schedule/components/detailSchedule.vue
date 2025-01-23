<template>
  <div class="detail-schedule-content">
    <AsgTipComponent style="width:85%">
      <p class="asg-tip-content">
        <i
          class="el-icon-warning"></i>以下内容是赛程的所有信息，如果需要新增字段，请联系开发人员。注意：自定义赛程人员选班模式下，解说无法选班；当前时间若超出比赛开始时间也无法选班；如果想邀请外援嘉宾来充当裁判或者导播，请选择自定义人员；如果想邀请嘉宾来参与解说，请在备注栏备注。
      </p>
    </AsgTipComponent>
    <TextTitle title-name="基本信息"></TextTitle>
    <el-form class="my-1" ref="form" :model="form" label-position="right" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属赛季" prop="belong">
            <el-select style="width: 80%" size="small" v-model="form.belong" placeholder="请选择所属赛季">
              <el-option v-for="item in eventOptions" :key="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="赛程分类" prop="tag">
            <el-select style="width: 80%" size="small" v-model="form.tag" placeholder="请输入赛程标签">
              <el-option v-for="(item, index) in tagOptions" :key="index" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="主场战队" prop="team1_name">
            <el-autocomplete style="width: 80%" v-model="form.team1_name" size="small" :fetch-suggestions="searchTeam"
              placeholder="请选择/输入主场战队" :disabled="!form.belong" @select="handleChooseAuto"></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客场战队" prop="team2_name">
            <el-autocomplete style="width: 80%" v-model="form.team2_name" size="small" :fetch-suggestions="searchTeam"
              placeholder="请选择/输入客场战队" :disabled="!form.belong" @select="handleChooseAuto"></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="比赛时间" prop="opentime">
            <el-date-picker style="width: 80%" v-model="form.opentime" size="small" type="datetime" placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选班模式" prop="isAllowChoose">
            <el-radio-group v-model="form.isAllowChoose" size="small">
              <el-radio-button :label="1">允许解说选班</el-radio-button>
              <el-radio-button :label="0">自定义赛程人员</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人员构成" prop="personType">
            <el-radio-group v-model="form.personType">
              <el-radio v-for="(item, index) in personGroups" :label="item.value" :key="index">{{ item.label
                }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大解说数量" prop="comLimit">
            <el-input-number size="small" v-model="form.comLimit" :min="1" :max="3" label="解说数量"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="requiredJudge">
          <el-form-item label="裁判" prop="judge">
            <el-input style="width: 80%" v-model="form.judge" readonly size="small"
              @focus="handlePersonChoose('judge')">
              <template #append>
                <p style="cursor: pointer" @click="handlePersonChoose('judge')">
                  <i class="el-icon-plus"></i>
                </p>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="requiredReferee">
          <el-form-item label="导播" prop="referee">
            <el-input style="width: 80%" v-model="form.referee" readonly size="small"
              @focus="handlePersonChoose('referee')">
              <template #append>
                <p style="cursor: pointer" @click="handlePersonChoose('referee')">
                  <i class="el-icon-plus"></i>
                </p>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="B站回放地址">
            <el-input style="width: 80%" size="small" v-model="form.bilibiliuri" placeholder="如果录像丢失，请输入lose" clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="赛程相关备注">
            <el-input style="width:80%" size="small" type="textarea" v-model="form.remarks" :rows="5" maxlength="150"
              show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 解说 -->
    <TextTitle v-show="requireComs" title-name="解说信息"></TextTitle>
    <div class="com_table--warp" v-show="requireComs">
      <header>
        <p>目前已添加:<span class="light-text">{{ comTableList.length }}</span>个解说</p>
        <el-button type="primary" size="small" @click="openPerson(-1)"
          :disabled="form.comLimit === comTableList.length">新增解说</el-button>
      </header>
      <el-table :data="comTableList" border :key="JSON.stringify(comTableList)"
        :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="解说序号" prop="id" align="center"></el-table-column>
        <el-table-column label="解说名称" prop="chinaname" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ $index }">
            <el-button type="text" @click="openPerson($index)">更新</el-button>
            <el-button type="text" @click="deletePerson($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn-list">
      <el-button plain icon="el-icon-arrow-left" @click="onSuccess">返回</el-button>
      <el-button v-if="formType === 'add'" icon="el-icon-folder-checked" type="primary" :loading="btnloading"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        @click.native="submit">
        发 布
      </el-button>
      <el-button v-else type="primary" icon="el-icon-folder-checked" :loading="btnloading"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        @click.native="updateForm">更 新</el-button>
    </div>
    <AsgPersonChoose ref="asgPersonChoose" @finish="handleChoosePerson"></AsgPersonChoose>
    <personChooseDialog :dialogVisible.sync="choosePersonDialog" @finish="getPerson"
      :checkId="form[`${this.tagKey}_Id`]">
    </personChooseDialog>
  </div>
</template>

<script>
import { pushSchedule, updateSchedule } from "@/api/schedule/index.js";
import personChooseDialog from "./personChooseDialog.vue";
import { getPlayerDetails } from "@/api/gameSeason/index";
import AsgPersonChoose from "@/components/AsgPersonChoose.vue";
import TextTitle from "@/components/TextTitle.vue";
import AsgTipComponent from "@/components/AsgTipComponent.vue";
export default {
  name: "detailSchedule",
  components: {
    personChooseDialog,
    TextTitle,
    AsgPersonChoose,
    AsgTipComponent
  },
  props: {
    formType: {
      type: String,
      default: 'add'
    },
    formRow: {
      type: Object,
      default: () => { },
    },
    eventOptions: {
      type: Array,
      default: () => [],
    },
    tagOptions: {
      type: Array,
      default: () => [],
    },
    personGroups: {
      type: Array,
      default: () => [],
    }
  },
  computed: {
    requiredJudge() {
      return this.form.personType.includes("judge");
    },
    requiredReferee() {
      return this.form.personType.includes("referee");
    },
    requireComs() {
      return this.form.personType.includes("commentary");
    },
  },
  data() {
    return {
      updateFormId: null,
      form: {
        belong: "",
        tag: "",
        opentime: "",
        team1_name: "",
        team2_name: "",
        referee: "",
        judge: "",
        judge_Id: "",
        referee_Id: "",
        comLimit: 2,
        isAllowChoose: 1,
        personType: "",
        remarks: '',
        bilibiliuri: '',
      },
      comIndex: -1,
      comTableList: [],
      btnloading: false,
      rules: {
        belong: [{ required: true, message: "请选择赛季", trigger: "change" }],
        tag: [{ required: true, message: "请选择赛程标签", trigger: "change" }],
        personType: [
          { required: true, message: "请选择人员构成", trigger: "change" },
        ],
        isAllowChoose: [
          { required: true, message: "请选择是否允许解说选班", trigger: "change" },
        ],
        opentime: [
          { required: true, message: "请选择比赛开始时间", trigger: "change" },
        ],
        team1_name: [
          { required: true, message: "请输入主场战队", trigger: "change" },
        ],
        team2_name: [
          { required: true, message: "请输入客场战队", trigger: "change" },
        ],
        referee: [{ required: false, message: "请选择", trigger: "change" }],
        judge: [
          { required: false, message: "请输入裁判名称", trigger: "change" },
        ],
        comLimit: [{ required: true, message: "请选择", trigger: "change" }]
      },
      choosePersonDialog: false,
      tagKey: "referee",
    };
  },
  methods: {
    // 打开人员选择
    openPerson(index) {
      this.comIndex = index;
      this.$refs.asgPersonChoose?.openDialog();
    },
    deletePerson(index) {
      this.comTableList.splice(index, 1);
    },
    handleChoosePerson(node) {
      if (this.comIndex === -1) {
        this.comTableList.push({
          id: node.id,
          chinaname: node.label
        })
      } else {
        this.$set(this.comTableList, this.comIndex, {
          id: node.id,
          chinaname: node.label
        })
      }
    },
    handleChooseAuto(row) {
      console.log(row, "row===");
    },
    // 查询战队
    async searchTeam(queryString, cb) {
      let result = [];
      if (this.form.belong) {
        const { data, status } = await getPlayerDetails(this.form.belong);
        if (status !== 200) result = [];
        result = data.map((item) => {
          return {
            id: item.id,
            value: item.team_name,
          };
        });
        result = queryString
          ? result.filter(this.createFilter(queryString))
          : result;
        cb(result);
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handlePersonChoose(key) {
      this.tagKey = key;
      this.choosePersonDialog = true;
    },
    getPerson(userObj) {
      this.form[this.tagKey] = userObj.chinaname;
      this.form[`${this.tagKey}_Id`] = userObj.id;
    },
    async submit() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) return;
        if (this.requireComs && this.comTableList.length > this.form.comLimit) {
          throw new Error('登记解说数量超过最大解说数量！');
        }
        this.btnloading = true;
        const requestParams = {
          ...this.form,
          commentary: JSON.stringify(this.comTableList),
        };
        const { data, status } = await pushSchedule(requestParams);
        if (status !== 200) throw new Error(data.message);
        if (data && data.code && data.code !== 200)
          throw new Error(data.message ?? "未知错误，请联系网站管理员！");
        this.$message.success("操作成功!");
        this.onSuccess();
      } catch (error) {
        if (error instanceof Object && !error.message) {
          return this.$message.error("请完整填写表单");
        }
        if (error?.response?.data?.code === 400) {
          return this.$message.error("操作失败，无权访问");
        }
        this.$message.error("操作失败，后端服务器异常");
      } finally {
        this.btnloading = false;
      }
    },
    async updateForm() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) return;
        if (this.requireComs && this.comTableList.length > this.form.comLimit) {
          throw new Error('登记解说数量超过最大解说数量！');
        }
        this.btnloading = true;
        const info = {
          ...this.form,
          commentary: JSON.stringify(this.comTableList),
        };
        const { data, status } = await updateSchedule(this.updateFormId, info);
        if (status !== 200) throw new Error("服务端异常");
        if (data && data.code && data.code !== 200)
          throw new Error(data.message ?? "未知错误");
        this.$message.success("更新成功！");
        this.dialogFormVisible = false;
        this.onSuccess();
      } catch (error) {
        if (error instanceof Object && !error.message) {
          return this.$message.error("请完整填写表单");
        }
        if (error.message) {
          return this.$message.error(error.message);
        }
        this.$message.error("操作失败，后端服务器异常");
      }
    },
    onSuccess() {
      this.$refs.form?.resetFields();
      this.$emit("onSuccess");
    },
  },
  created() {
    console.log(this.formRow, 'this.formRow');
    if (this.formType !== 'add') {
      const { com_limit, final_score, winteam, logs, person_type, commentary, id, ...form } = this.formRow;
      Object.assign(this.form, form)
      this.updateFormId = id;
      this.comTableList = commentary ? JSON.parse(commentary) : [];
      this.form.comLimit = com_limit;
      this.form.personType = person_type;
    }
  },
};
</script>
<style lang="less" scoped>
.detail-schedule-content {
  padding: 2em;
  min-height: 100vh;

  .asg-tip-content {
    font-size: 14px;
    color: #5e6d82;
    font-weight: 600;
    line-height: 2em;
    font-size:1em;

    i {
      text-indent: 2em;
      margin-right: 1em;
      color: #f40;
    }
  }

  .my-1 {
    margin: 1em 0;
  }

  .com_table--warp {
    width: 95%;
    margin: 1em auto;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1em 0;

      .light-text {
        color: #4090EF;
        font-size: 1.1em;
        font-weight: bold;
        margin: 0 0.5em;
      }
    }

  }

  .btn-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
    margin: 1em;
    padding: 1em;
    border-top: 1px solid #e7e7e7;
  }
}
</style>
