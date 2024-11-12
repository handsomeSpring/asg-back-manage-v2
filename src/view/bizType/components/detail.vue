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
                  :disabled="type !== 'add'"
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
                  <div class="asg-table-header">
                    <div class="node_name_tag">
                      <i
                        :class="
                          item.choose !== '0'
                            ? 'el-icon-s-custom'
                            : 'el-icon-user-solid'
                        "
                        style="margin-right: 4px"
                      ></i
                      >{{ item.authPerson }}
                    </div>
                    <p class="time">{{ item.time }}</p>
                  </div>
                </template>
                <template #content>
                  <div class="asg-table-content">
                    <div class="asg-opinion-group">
                      <template v-if="item.choose !== '0'">
                        <p>审批意见：{{ item.opinion }}</p>
                        <p v-if="item.otherOpinion">
                          补充意见：{{ item.otherOpinion }}
                        </p>
                        <p v-if="item.reviseOpinion">
                          修正意见：{{ item.reviseOpinion }}
                        </p>
                      </template>
                      <p v-else>发起人</p>
                    </div>
                    <div class="asg-opinion-right">
                      <template v-if="item.choose !== '0'">
                        <div
                          class="tag"
                          :class="item.choose === '1' ? 'success' : 'danger'"
                        >
                          {{
                            item.choose === "1" ? "审核已通过" : "申请被退回"
                          }}
                        </div>
                      </template>
                      <div v-else class="tag again">再次申请</div>
                    </div>
                  </div>
                </template>
              </asgTableCard>
            </div>
          </template>
          <template v-if="disabledStartForm && type !== 'check'">
            <TextTitle title-name="审批意见"></TextTitle>
            <el-form
              ref="authForm"
              class="asg-form-main"
              :model="nowSupplementaryInfo"
              :rules="authRules"
              label-position="right"
              label-width="150px"
            >
              <el-form-item label="主要审批意见" prop="opinion">
                <el-input
                  style="width: 80%"
                  v-model="nowSupplementaryInfo.opinion"
                  maxlength="25"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item
                label="修订意见"
                v-if="form.status === '2'"
                prop="reviseOpinion"
              >
                <el-input
                  maxlength="50"
                  show-word-limit
                  style="width: 80%"
                  type="textarea"
                  :rows="4"
                  size="small"
                  v-model="nowSupplementaryInfo.reviseOpinion"
                ></el-input>
              </el-form-item>
              <el-form-item label="补充意见" prop="otherOpinion">
                <el-input
                  maxlength="50"
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
        <HistoryRecord
          :info="info"
          :type="type"
          :bizTypeArr="bizTypeOptions"
        ></HistoryRecord>
      </el-col>
    </el-row>
    <button-fix>
      <template v-if="type !== 'check'">
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
      </template>
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
    >
    </BudgetCheck>
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
import { postAudit } from "@/api/admin/index.js";
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
        choose: "1", // choose : '1' 是同意  // choose '2' 退回不同意
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
      authRules: {
        opinion: [
          {
            required: true,
            message: "请输入主要审核意见",
            trigger: "blur",
          },
        ],
        reviseOpinion: [
          {
            required: true,
            message: "请输入修订意见",
            trigger: "blur",
          },
        ],
        otherOpinion: [
          {
            required: true,
            message: "请输入补充意见",
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
    async handleReturn() {
      let req = {};
      const arr = deepClone(this.supplementaryInfo);
      const nowSupplementaryInfo = {
        ...this.nowSupplementaryInfo,
        choose: "2",
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
      try {
        const { data, status } = await postAudit(req);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员！");
        if (data.code && data.code !== 200)
          throw new Error(data.message ?? "未知错误");
        this.$message.success("操作成功！");
        this.$emit("toList");
      } catch (error) {
        this.$message.error(error.message);
      }
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
    async handleAccept() {
      let req = {};
      if (this.type === "add") {
        req = {
          ...this.form,
          id: uuid(),
          nowAuthPerson: this.nextNodeInfo.chinaname,
          nowAuthPersonId: this.nextNodeInfo.id,
          supplementaryInfo: JSON.stringify(this.supplementaryInfo),
          budgetId: this.form.budgetId ?? 0,
          budgetName: this.form.budgetName ?? "",
          status: "1",
        };
      } else {
        const arr = deepClone(this.supplementaryInfo);
        const nowSupplementaryInfo = {
          ...this.nowSupplementaryInfo,
          choose: this.form.status === "0" ? "0" : "1",
          time: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
        };
        arr.push(nowSupplementaryInfo);
        req = {
          ...this.form,
          nowAuthPerson: this.nextNodeInfo.chinaname ?? "archive",
          nowAuthPersonId: this.nextNodeInfo.id ?? 0,
          supplementaryInfo: JSON.stringify(arr),
          budgetId: this.form.budgetId ?? 0,
          budgetName: this.form.budgetName ?? "",
          status: this.nextNodeInfo.chinaname ? "1" : "3", //下一个节点有的话则退回到1，没有的话则办结
        };
      }
      try {
        const { data, status } = await postAudit(req);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员！");
        if (data.code && data.code !== 200)
          throw new Error(data.message ?? "未知错误");
        this.$message.success("操作成功！");
        this.$emit("toList");
      } catch (error) {
        this.$message.error(error.message);
      }
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
        console.log(this.process, "this.process");
        const processIndex = this.process.findIndex(
          (item) => item.id === this.userInfo.id
        );
        console.log(processIndex, "processIndex");
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

.asg-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 12px;

  .node_name_tag {
    background: linear-gradient(141deg, #44a3fd 0%, #0c80e5 100%);
    border-radius: 4px;
    padding: 2px 8px;
    color: #fff;
    font-size: 14px;
  }

  .time {
    font-weight: 500;
    font-size: 13px;
    color: #0c80e5;
    line-height: 16px;
  }
}

.asg-table-content {
  display: grid;
  grid-template-columns: auto 120px;
  align-items: center;
  padding: 8px;

  .asg-opinion-group {
    border-right: 1px solid #e7e7e7;
    font-size: 13px;
    font-weight: 500;
  }

  .asg-opinion-right {
    display: flex;
    align-items: center;
    justify-content: center;

    .tag {
      padding: 4px 8px;
      border-radius: 4px;
      color: #fff;
      width: fit-content;
      font-size: 14px;

      &.success {
        background: linear-gradient(141deg, #3cda7a 0%, #32b16c 100%);
      }

      &.danger {
        background: linear-gradient(
          141deg,
          rgba(239, 146, 142, 0.96) 0%,
          #ee281f 100%
        );
      }
      &.again {
        background: linear-gradient(
          141deg,
          rgba(235, 97, 0, 0.5) 0%,
          #e8b048 100%
        );
      }
    }
  }
}
</style>
