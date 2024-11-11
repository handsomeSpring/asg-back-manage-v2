<template>
  <div>
    <el-row class="main-row-content">
      <el-col :span="!isStartForm ? 20 : 24">
        <div class="form_content--main">
          <TextTitle title-name="业务信息"></TextTitle>
          <el-form
            ref="startForm"
            class="asg-form-main"
            :model="form"
            label-position="right"
            label-width="150px"
            :rules="startFormRules"
          >
            <div class="grid--three">
              <el-form-item label="项目名称" prop="projName">
                <el-input
                  size="small"
                  v-model="form.projName"
                  :disabled="disabledStartForm"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目编号" prop="projNo">
                <el-input
                  size="small"
                  v-model="form.projNo"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="发起人" prop="startPerson">
                <el-input
                  disabled
                  size="small"
                  v-model="form.startPerson"
                ></el-input>
              </el-form-item>
            </div>
            <div class="grid--three">
              <el-form-item label="业务类型" prop="bizType">
                <el-select
                  style="width: 100%"
                  size="small"
                  v-model="form.bizType"
                  :disabled="disabledStartForm"
                >
                  <el-option
                    v-for="(item, index) in bizTypeOptions"
                    :key="index"
                    :value="item.bizType"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发起日期" prop="startTime">
                <el-input
                  size="small"
                  v-model="form.startTime"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="是否需要使用预算" prop="budgetUse">
                <el-radio-group
                  v-model="form.budgetUse"
                  :disabled="disabledStartForm"
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item
              v-if="form.budgetUse === '1'"
              label="使用的预算"
              prop="budgetName"
            >
              <div class="use--content">
                <el-input v-model="form.budgetName" readOnly>
                  <el-button
                    slot="append"
                    icon="el-icon-edit"
                    @click="checkBudget"
                  ></el-button>
                </el-input>
                <p class="conver_money">{{ form.budgetMoney | moneyFormat }}</p>
                <p class="conver_money">
                  {{ form.budgetMoney | convertMoney }}
                </p>
              </div>
            </el-form-item>
            <el-form-item label="申请原因" prop="reason">
              <el-input
                maxlength="100"
                :disabled="disabledStartForm"
                show-word-limit
                style="width: 80%"
                type="textarea"
                :rows="4"
                size="small"
                v-model="form.reason"
              ></el-input>
            </el-form-item>
            <el-form-item label="申请描述" prop="description">
              <el-input
                maxlength="100"
                :disabled="disabledStartForm"
                show-word-limit
                style="width: 80%"
                type="textarea"
                :rows="4"
                size="small"
                v-model="form.description"
              ></el-input>
            </el-form-item>
          </el-form>
          <template v-if="supplementaryInfo.length > 0">
            <TextTitle title-name="历史意见"></TextTitle>
            <div class="p-r-20">
              <asgTableCard
                v-for="(item, index) in supplementaryInfo"
                :key="index"
              >
                <template #header>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      height: 100%;
                      padding: 0 12px;
                    "
                  >
                    <el-tag size="small" type="danger">{{
                      item.authPerson
                    }}</el-tag>
                    <p>{{ item.time }}</p>
                  </div>
                </template>
                <template #content>
                  <div style="padding: 8px">
                    <p>审批意见：{{ item.opinion }}</p>
                    <p>补充意见：{{ item.otherOpinion }}</p>
                    <p>修正意见：{{ item.reviseOpinion }}</p>
                  </div>
                </template>
              </asgTableCard>
            </div>
          </template>
          <template v-if="disabledStartForm">
            <TextTitle title-name="审批意见"></TextTitle>
            <el-form
              ref="authForm"
              class="asg-form-main"
              :model="nowSupplementaryInfo"
              label-position="right"
              label-width="150px"
            >
              <el-form-item label="主要审批意见">
                <el-input
                  style="width: 80%"
                  v-model="nowSupplementaryInfo.opinion"
                ></el-input>
              </el-form-item>
              <el-form-item label="修订意见" v-if="form.status === '2'">
                <el-input
                  maxlength="100"
                  show-word-limit
                  style="width: 80%"
                  type="textarea"
                  :rows="4"
                  size="small"
                  v-model="nowSupplementaryInfo.reviseOpinion"
                ></el-input>
              </el-form-item>
              <el-form-item label="补充意见">
                <el-input
                  maxlength="100"
                  show-word-limit
                  style="width: 80%"
                  type="textarea"
                  :rows="4"
                  size="small"
                  v-model="nowSupplementaryInfo.otherOpinion"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </el-col>
      <el-col :span="4">
        <HistoryRecord></HistoryRecord>
      </el-col>
    </el-row>
    <button-fix>
      <el-button
        v-if="form.bizType"
        size="small"
        type="primary"
        @click="handleValidForm"
      >
        <template v-if="nextNodeInfo.chinaname">
          <i class="el-icon-s-custom i-r-6"></i>送{{
            nextNodeInfo.chinaname
          }}审批
        </template>
        <template v-else>
          <i class="el-icon-circle-check i-r-6"></i>办结
        </template>
      </el-button>
      <el-button
        class="return-button"
        v-if="canReturn"
        size="small"
        @click="handleReturn"
      >
        <i class="el-icon-circle-close i-r-6"></i>退回
      </el-button>
      <el-button
        icon="el-icon-arrow-left"
        size="small"
        plain
        @click="returnBack"
        >返回</el-button
      >
    </button-fix>
    <BudgetCheck
      :dialog-visible.sync="dialogVisible"
      @finish="handleFinish"
      :checkBudetId="form.budgetId"
    ></BudgetCheck>
  </div>
</template>

<script>
import TextTitle from "@/components/TextTitle.vue";
import HistoryRecord from "./HistoryRecord.vue";
import BudgetCheck from "./BudgetCheck.vue";
import { mapGetters } from "vuex";
import { getTodayString, parseTime } from "@/utils/filters";
import { uuid } from "@/utils";
import asgTableCard from "@/components/asg-table-card.vue";
import { deepClone } from "@/utils";
export default {
  name: "bizType-detail",
  components: {
    TextTitle,
    HistoryRecord,
    BudgetCheck,
    asgTableCard,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default: () => {},
    },
    bizTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      canReturn: false,
      form: {
        projName: "",
        projNo: "",
        startPerson: "",
        startPersonId: "",
        startTime: "",
        bizType: "",
        budgetUse: "0",
        budgetName: null,
        budgetId: null,
        budgetMoney: 0,
        reason: "",
        description: "",
        status: "0",
      },
      process: [],

      dialogVisible: false,
      supplementaryInfo: [],
      nowSupplementaryInfo: {
        userId: "",
        authPerson: "",
        opinion: "",
        otherOpinion: "",
        reviseOpinion: "",
        time: null,
      },
      nextNodeInfo: {}, //下一个节点
      laseNodeInfo: {}, //上一个节点
      startFormRules: {
        projName: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur",
          },
        ],
        projNo: [
          {
            required: true,
            message: "请输入项目编号",
            trigger: "change",
          },
        ],
        startPerson: [
          {
            required: true,
            message: "请输入发起人姓名",
            trigger: "blur",
          },
        ],
        bizType: [
          {
            required: true,
            message: "请选择业务名称",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请填写发起日期",
            trigger: "blur",
          },
        ],
        budgetUse: [
          {
            required: true,
            message: "请选择是否使用预算",
            trigger: "change",
          },
        ],
        budgetName: [
          {
            required: true,
            message: "请选择预算",
            trigger: "change",
          },
        ],
        reason: [
          {
            required: true,
            message: "请填写业务申请原因",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请填写业务场景描述",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isStartForm() {
      return this.type === "add";
    },
    //禁用发起表单
    disabledStartForm() {
      return this.type !== "add" && this.form.status !== "0";
    },
  },
  watch: {
    "form.bizType": {
      handler(newVal) {
        if (!newVal) return;
        this.computedProcess(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    // 退回
    handleReturn() {
      let req = {};
      const arr = deepClone(this.supplementaryInfo);
      const nowSupplementaryInfo = {
        ...this.nowSupplementaryInfo,
        time: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
      };
      arr.push(nowSupplementaryInfo);
      req = {
        ...this.form,
        nowAuthPerson: this.laseNodeInfo.chinaname ?? this.form.startPerson,
        nowAuthPersonId: this.laseNodeInfo.id ?? this.form.startPersonId,
        supplementaryInfo: JSON.stringify(arr),
        status: this.laseNodeInfo.chinaname ? "2" : "0", //上一个节点不存在，则退回到发起人，存在则变为退回状态
      };
      console.log(req, "req");
    },
    handleValidForm() {
      const formType = this.form.status === "0" ? "startForm" : "authForm";
      this.$refs[formType]?.validate((valid) => {
        if (valid) {
          this.handleAccept();
        } else {
          this.$message.error("请完整填写表单内容！");
        }
      });
    },
    // 送审/办结
    handleAccept() {
      let req = {};
      if (this.type === "add") {
        req = {
          ...this.form,
          id: uuid(),
          nowAuthPerson: this.nextNodeInfo.chinaname,
          nowAuthPersonId: this.nextNodeInfo.id,
          supplementaryInfo: JSON.stringify(this.supplementaryInfo),
          status: "1",
        };
      } else {
        const arr = deepClone(this.supplementaryInfo);
        const nowSupplementaryInfo = {
          ...this.nowSupplementaryInfo,
          time: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
        };
        arr.push(nowSupplementaryInfo);
        req = {
          ...this.form,
          nowAuthPerson: this.nextNodeInfo.chinaname ?? "archive",
          nowAuthPersonId: this.nextNodeInfo.id ?? 0,
          supplementaryInfo: JSON.stringify(arr),
          status: this.nextNodeInfo.chinaname ? "1" : "3", //下一个节点有的话则退回到1，没有的话则办结
        };
      }
      console.log(req, "发起的req");
    },
    checkBudget() {
      if (this.disabledStartForm) return;
      this.dialogVisible = true;
    },
    init() {
      if (this.type === "add") {
        this.form.startPerson = this.userInfo.chinaname;
        this.form.startPersonId = this.userInfo.id;
        this.form.startTime = getTodayString();
      } else {
        const { supplementaryInfo, ...form } = this.info;
        this.form = form;
        this.supplementaryInfo = JSON.parse(supplementaryInfo);
        this.nowSupplementaryInfo.authPerson = this.userInfo.chinaname;
        this.nowSupplementaryInfo.userId = this.userInfo.id;
      }
    },
    handleFinish(value) {
      this.form.budgetName = value.budgetName;
      this.form.budgetId = value.budgetId;
      this.form.budgetMoney = value.money;
    },
    computedProcess(bizType) {
      this.process =
        this.bizTypeOptions.find((item) => item.bizType === bizType)?.process ??
        [];
      if (this.type === "add" || this.form.status === "0") {
        this.nextNodeInfo = this.process[0] ?? {};
        this.form.projNo = bizType + uuid().slice(0, 8);
      } else {
        const processIndex = this.process.findIndex(
          (item) => (item.id = this.userInfo.id)
        );
        // 判断上一个节点
        if (processIndex >= 1) {
          this.laseNodeInfo = this.process[processIndex - 1] ?? {};
        } else {
          this.laseNodeInfo = {};
        }
        // 判断下一个节点
        if (processIndex !== -1) {
          this.canReturn = this.process[processIndex]?.isAllowReturn === "1";
          this.nextNodeInfo = this.process[processIndex + 1] ?? {};
        } else {
          this.nextNodeInfo = this.process[0] ?? {};
        }
      }
    },
    returnBack() {
      this.$emit("returnBack");
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.main-row-content {
  min-height: 80vh;
  padding-bottom: 80px;

  .form_content--main {
    min-height: 80vh;
    border-right: 1px solid #e7e7e7;

    .asg-form-main {
      margin-top: 12px;

      .grid--three {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(3, 1fr);
        padding-right: 24px;
        gap: 12px;
      }

      .use--content {
        display: grid;
        grid-template-columns: 600px 100px 100px;
        align-items: center;
        gap: 12px;

        .conver_money {
          font-size: 14px;
          font-weight: bold;
          color: #4090ef;
        }
      }
    }
  }
}

.p-r-20 {
  padding-right: 24px;
}
.i-r-6 {
  margin-right: 6px;
}
</style>
