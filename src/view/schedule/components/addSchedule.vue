<template>
  <div>
    <el-dialog
      :visible="operationVisible"
      title="添加赛程"
      width="60%"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        label-position="right"
        label-width="120px"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属赛季" prop="belong">
              <el-select
                style="width: 80%"
                size="small"
                v-model="form.belong"
                placeholder="请选择所属赛季"
              >
                <el-option
                  v-for="item in eventOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赛程分类" prop="tag">
              <el-select
                style="width: 80%"
                size="small"
                v-model="form.tag"
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主场战队名" prop="team1_name">
              <el-autocomplete
                style="width: 80%"
                v-model="form.team1_name"
                size="small"
                :fetch-suggestions="searchTeam"
                placeholder="请选择/输入主场战队"
                :disabled="!form.belong"
                @select="handleChooseAuto"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客场战队名" prop="team2_name">
              <el-autocomplete
                style="width: 80%"
                v-model="form.team2_name"
                size="small"
                :fetch-suggestions="searchTeam"
                placeholder="请选择/输入客场战队"
                :disabled="!form.belong"
                @select="handleChooseAuto"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="比赛开始时间" prop="opentime">
              <el-date-picker
                style="width: 80%"
                v-model="form.opentime"
                size="small"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="requiredReferee">
            <el-form-item label="导播" prop="referee">
              <el-input
                style="width: 80%"
                v-model="form.referee"
                readonly
                size="small"
              >
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
          <el-col :span="24">
            <el-form-item label="人员构成模式" prop="personType">
              <el-radio-group v-model="form.personType">
                <el-radio
                  v-for="(item, index) in personGroup"
                  :label="item.value"
                  :key="index"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="requiredJudge">
            <el-form-item label="裁判" prop="judge">
              <el-input
                style="width: 80%"
                v-model="form.judge"
                readonly
                size="small"
              >
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
          <el-col :span="12" v-if="requireComs">
            <el-form-item label="解说数量" prop="comLimit">
              <el-input-number
                size="small"
                v-model="form.comLimit"
                @change="handleComNumberChange"
                :min="1"
                :max="3"
                label="解说数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="requireComs">
          <el-col
            :span="8"
            v-for="(com, index) in commentary_value"
            :key="index"
          >
            <el-form-item :label="`解说${index + 1}`">
              <el-select
                style="width: 80%"
                size="small"
                filterable
                clearable
                value-key="id"
                v-model="commentary_value[index]"
                placeholder="请选择解说1"
              >
                <el-option
                  v-for="item in commentary"
                  :key="item.chinaname"
                  :label="item.chinaname"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <footer>
          <el-button
            type="primary"
            size="small"
            :loading="btnloading"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            @click.native="submit"
          >
            发布
          </el-button>
          <el-button size="small" @click="closeDialog"> 关闭 </el-button>
        </footer>
      </el-form>
    </el-dialog>
    <personChooseDialog
      :dialogVisible.sync="choosePersonDialog"
      @finish="getPerson"
    ></personChooseDialog>
  </div>
</template>

<script>
import { pushSchedule } from "@/api/schedule/index.js";
import { getByTitle } from "@/api/config";
import personChooseDialog from "./personChooseDialog.vue";
import { getPlayerDetails } from "@/api/gameSeason/index";

export default {
  name: "addSchedule",
  components: {
    personChooseDialog,
  },
  props: {
    operationVisible: {
      type: Boolean,
      default: false,
    },
    eventOptions: {
      type: Array,
      default: () => [],
    },
    instructor: {
      type: Array,
      default: () => [],
    },
    commentary: {
      type: Array,
      default: () => [],
    },
    tagOptions: {
      type: Array,
      default: () => [],
    },
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
      form: {
        belong: "",
        tag: "",
        opentime: "",
        team1_name: "",
        team2_name: "",
        referee: "",
        judge: "",
        judgeId: "",
        refereeId: "",
        comLimit: 2,
        personType: "",
      },
      commentary_value: [
        { id: 0, chinaname: "待定" },
        { id: 0, chinanme: "待定" },
      ],
      btnloading: false,
      rules: {
        belong: [{ required: true, message: "请选择赛季", trigger: "change" }],
        tag: [{ required: true, message: "请选择赛程标签", trigger: "change" }],
        personType: [
          { required: true, message: "请选择人员构成", trigger: "change" },
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
        comLimit: [{ required: true, message: "请选择", trigger: "change" }],
        judge: [
          { required: false, message: "请输入裁判名称", trigger: "change" },
        ],
      },
      personGroup: [],
      choosePersonDialog: false,
      tagKey: "referee",
    };
  },
  methods: {
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
    handleComNumberChange(number) {
      this.commentary_value = [];
      for (let i = 0; i < number; i++) {
        this.commentary_value.push({ id: 0, chinaname: "待定" });
      }
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$emit("update:operationVisible", false);
    },
    async submit() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) return;
        const comMap = this.commentary_value.map((com) => ({
          id: com.id,
          chinaname: com.chinaname,
        }));
        const filterArr = comMap.filter((f) => f.id !== 0);
        let commentary = JSON.stringify(filterArr);
        this.btnloading = true;
        const requestParams = {
          ...this.form,
          commentary,
        };
        const { data, status } = await pushSchedule(requestParams);
        if (status !== 200) throw new Error(data.message);
        if (data && data.code && data.code !== 200)
          throw new Error(data.message ?? "未知错误，请联系网站管理员！");
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
    onSuccess() {
      let successBelong = this.form.belong;
      (this.form = {
        belong: "",
        tag: "",
        opentime: "",
        team1_name: "",
        team2_name: "",
        referee: "待定",
        comLimit: 2,
        judge: "",
        personType: "",
      }),
        (this.commentary_value = [
          { id: 0, chinaname: "待定" },
          { id: 0, chinanme: "待定" },
        ]),
        this.$message.success("操作成功!");
      console.log(successBelong, "successBelong");
      this.$emit("onSuccess", successBelong);
    },
  },
  created() {
    getByTitle("gameComposition").then((res) => {
      this.personGroup = res.data;
    });
  },
};
</script>
<style lang="less" scoped>
footer {
  text-align: center;
  margin-top: 12px;
}
</style>
