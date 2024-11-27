<template>
  <div>
    <el-row class="main-row-content" :style="{
      'min-height': isDialog ? 'auto' : '80vh'
    }">
      <el-col :span="20">
        <div class="form_content--main">
          <TextTitle title-name="业务信息"></TextTitle>
          <el-form ref="startForm" class="asg-form-main" :model="form" label-position="right" label-width="150px"
            :rules="startFormRules">
            <div class="grid--three">
              <el-form-item label="项目名称" prop="projName">
                <el-input size="small" v-model="form.projName" :disabled="disabledStartForm"></el-input>
              </el-form-item>
              <el-form-item label="项目编号" prop="projNo">
                <el-input size="small" v-model="form.projNo" disabled></el-input>
              </el-form-item>
              <el-form-item label="发起人" prop="startPerson">
                <el-input disabled size="small" v-model="form.startPerson"></el-input>
              </el-form-item>
            </div>
            <div class="grid--three">
              <el-form-item label="业务类型" prop="bizType">
                <el-select style="width: 100%" size="small" v-model="form.bizType"
                  :disabled="type !== 'add' || needToRelative === '1'">
                  <el-option v-for="(item, index) in bizTypeOptions" :key="index" :value="item.bizType"
                    :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发起日期" prop="startTime">
                <el-input size="small" v-model="form.startTime" disabled></el-input>
              </el-form-item>
              <el-form-item label="是否需要使用预算" prop="budgetUse">
                <el-radio-group v-model="form.budgetUse" :disabled="disabledStartForm">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item v-if="form.budgetUse === '1'" label="使用的预算" prop="budgetName">
              <el-row v-if="disabledStartForm">
                <el-col :span="12">
                  <p>
                    {{ form.budgetName }}
                    <span class="conver_money" style="margin-left: 8px">{{
                      form.budgetMoney | moneyFormat
                    }}</span>
                    <span class="conver_money" style="margin-left: 8px">{{
                      form.budgetMoney | convertMoney
                    }}</span>
                  </p>
                </el-col>
              </el-row>
              <el-row v-else>
                <el-col :span="12">
                  <el-input size="small" v-model="form.budgetName" readOnly>
                    <el-button slot="append" icon="el-icon-edit" @click="checkBudget"></el-button>
                  </el-input>
                </el-col>
                <el-col :span="2" :offset="2">
                  <p class="conver_money">
                    {{ form.budgetMoney | moneyFormat }}
                  </p>
                </el-col>
                <el-col :span="2" :offset="2">
                  <p class="conver_money">
                    {{ form.budgetMoney | convertMoney }}
                  </p>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="关联业务申请" prop="relativeId">
              <el-row>
                <el-col :span="12">
                  <el-input v-show="needToRelative === '1'" placeholder="请选择关联的业务场景" v-model="relativeComplete"
                    size="small" class="input-with-select" readOnly>
                    <el-button slot="append"
                      :icon="(disabledStartForm || this.reqId) ? 'el-icon-view' : 'el-icon-search'"
                      @click="openRelativeBase"></el-button>
                  </el-input>
                  <p v-show="needToRelative === '0'" class="no-relative-text">选择不关联业务申请发起，自行发起业务申请</p>
                </el-col>
                <el-col :span="10" :offset="2">
                  <el-switch v-model="needToRelative" active-text="关联" inactive-text="不关联" active-value="1"
                    inactive-value="0" :disabled="disabledStartForm || isDialog" @change="handleRelaSwitchChange">
                  </el-switch>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="申请原因" prop="reason">
              <el-input maxlength="100" :disabled="disabledStartForm" show-word-limit style="width: 80%" type="textarea"
                :rows="4" size="small" v-model="form.reason"></el-input>
            </el-form-item>
            <el-form-item label="申请描述" prop="description">
              <el-input maxlength="100" :disabled="disabledStartForm" show-word-limit style="width: 80%" type="textarea"
                :rows="4" size="small" v-model="form.description"></el-input>
            </el-form-item>
          </el-form>
          <template v-if="supplementaryInfo.length > 0">
            <TextTitle title-name="历史意见"></TextTitle>
            <div class="p-r-20">
              <asgTableCard v-for="(item, index) in supplementaryInfo" :key="index">
                <template #header>
                  <div class="asg-table-header">
                    <div class="node_name_tag">
                      <i :class="item.choose !== '0'
                        ? 'el-icon-s-custom'
                        : 'el-icon-user-solid'
                        " style="margin-right: 4px"></i>{{ item.authPerson }}
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
                        <div class="tag" :class="item.choose === '1' ? 'success' : 'danger'">
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
            <el-form ref="authForm" class="asg-form-main" :model="nowSupplementaryInfo" :rules="authRules"
              label-position="right" label-width="150px">
              <el-form-item label="主要审批意见" prop="opinion">
                <el-input style="width: 80%" v-model="nowSupplementaryInfo.opinion" maxlength="25"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="修订意见" v-if="form.status === '2'" prop="reviseOpinion">
                <el-input maxlength="50" show-word-limit style="width: 80%" type="textarea" :rows="4" size="small"
                  v-model="nowSupplementaryInfo.reviseOpinion"></el-input>
              </el-form-item>
              <el-form-item label="补充意见" prop="otherOpinion">
                <el-input maxlength="50" show-word-limit style="width: 80%" type="textarea" :rows="4" size="small"
                  v-model="nowSupplementaryInfo.otherOpinion"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </el-col>
      <el-col :span="4">
        <HistoryRecord v-if="!isStartForm" :info="info" :type="type" :bizTypeArr="bizTypeOptions"></HistoryRecord>
        <helpAssignInfo v-else :bizTypeOptions="bizTypeOptions"></helpAssignInfo>
      </el-col>
    </el-row>
    <button-fix v-if="!isDialog">
      <template v-if="type !== 'check' && form.status !== '4'">
        <el-button v-if="form.bizType" size="small" type="primary" @click="handleValidForm">
          <template v-if="nextNodeInfo.chinaname">
            <i class="el-icon-s-custom i-r-6"></i>送{{
              nextNodeInfo.chinaname
            }}审批
          </template>
          <template v-else>
            <i class="el-icon-circle-check i-r-6"></i>办结
          </template>
        </el-button>
        <el-button class="return-button" v-if="canReturn" size="small" @click="handleValidReturn">
          <div class="button__text-flex">
            <svg-icon iconClass="auditReturn" width="13px" height="13px"></svg-icon>退回
          </div>
        </el-button>
        <el-button v-if="form.status === '0' && !['add', 'check'].includes(type)" class="return-button" size="small"
          @click="handleWitdraw">
          <i class="el-icon-circle-close i-r-6"></i>终止申请
        </el-button>
      </template>
      <el-button icon="el-icon-arrow-left" size="small" plain @click="returnBack">返回</el-button>
    </button-fix>
    <div class="dialog_btn_list" v-else>
      <el-button v-if="form.bizType" size="small" type="primary" @click="handleValidForm">
        <template v-if="nextNodeInfo.chinaname">
          <i class="el-icon-s-custom i-r-6"></i>送{{
            nextNodeInfo.chinaname
          }}审批
        </template>
        <template v-else>
          <i class="el-icon-circle-check i-r-6"></i>办结
        </template>
      </el-button>
      <el-button icon="el-icon-circle-close" size="small" plain @click="returnBack">关闭弹窗</el-button>
    </div>
    <BudgetCheck :dialog-visible.sync="dialogVisible" @finish="handleFinish" :checkBudetId="form.budgetId">
    </BudgetCheck>
    <auditRequestBase ref="auditRequestBase" :checkId="form.relativeId" :bizTypeOptions="bizTypeOptions"
      @finishChoose="handleBizTypeChoose"></auditRequestBase>
    <reqFormDialog ref="reqForm" :form="reqForm"></reqFormDialog>
    <el-dialog title="最终决策" :visible.sync="finalResultDialogVisible" width="30%" :close-on-click-modal="false">
      <div class="tip_type">
        <p>根据规则配置，您拥有对该申请业务流程的最终决策权。关于``<span class="weight-light">{{ relativeComplete }}</span>``的申请单，请选择您的决策。</p>
      </div>
      <span slot="footer" class="dialog_btn_list">
        <el-button size="small" type="success" @click="handleSet('2')"><i style="margin-right: 6px"
            class="el-icon-circle-check"></i>同意纳入</el-button>
        <el-button size="small" type="danger" @click="handleSet('3')"><i style="margin-right: 6px"
            class="el-icon-circle-close"></i>驳回申请</el-button>
        <el-button size="small" plain @click="finalResultDialogVisible = false">再考虑下</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TextTitle from "@/components/TextTitle.vue";
import HistoryRecord from "./HistoryRecord.vue";
import BudgetCheck from "./BudgetCheck.vue";
import helpAssignInfo from "./helpAssignInfo.vue";
import auditRequestBase from "./auditRequestBase.vue";
import { mapGetters } from "vuex";
import { getTodayString, parseTime } from "@/utils/filters";
import { uuid } from "@/utils";
import asgTableCard from "@/components/asg-table-card.vue";
import reqFormDialog from "./reqFormDialog.vue";
import { deepClone } from "@/utils";
import { postAudit, statusChange4, findFormById } from "@/api/admin/index.js";
import { approvalCommentary } from "@/api/admin/index.js";
import { setRole } from "@/api/home";
export default {
  name: "bizType-detail",
  components: {
    TextTitle,
    HistoryRecord,
    BudgetCheck,
    asgTableCard,
    helpAssignInfo,
    auditRequestBase,
    reqFormDialog
  },
  props: {
    reqId: {
      type: Number,
      default: null
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default: () => { },
    },
    bizTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const validateRelaId = (rule, value, callback) => {
      if (!value && this.needToRelative === "1") {
        callback(new Error("请选择关联业务类型"));
      } else {
        callback();
      }
    };
    return {
      canReturn: false,
      canFinishResult: false, //是否拥有最终决定权
      finalResultDialogVisible: false, //最终决定权弹窗
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
        relativeId: null, //关联业务申请id
        nodeIndex: -1, //审核节点下标
        flowConfig: '', //流程配置json
      },
      reqForm: {}, //关联申请表单
      relativeComplete: "", //关联业务场景的项目信息
      needToRelative: "0", //是否关联业务申请
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
        relativeId: [
          {
            validator: validateRelaId,
            trigger: "change",
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
    handleBizTypeChoose(obj) {
      const label =
        this.bizTypeOptions.find((item) => item.bizType === obj.biz_type)
          ?.label ?? "未知业务类型";
      this.relativeComplete = `${obj.chinaname}的${label}申请`;
      this.form.relativeId = obj.id;
      this.form.bizType = obj.biz_type;
    },
    // 关联弹窗
    openRelativeBase() {
      if (this.disabledStartForm || this.reqId) {
        this.$refs?.reqForm?.openDialog();
      } else {
        this.$refs?.auditRequestBase?.openDialog();
      }
    },
    // 是否关联切换
    handleRelaSwitchChange(value) {
      //变成不关联的时候清空数据
      if (value === "0") {
        this.form.relativeId = null;
        this.relativeComplete = "";
      }
    },
    // 处理终止
    handleWitdraw() {
      this.$confirm("您确定终止这条业务申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data, status } = await statusChange4(this.form.id);
          if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
          if (data && data.code !== 200)
            throw new Error(data.message ?? "未知错误");
          this.$message.success("终止成功！");
          this.$emit("toList");
        })
        .catch((error) => {
          if (typeof error === "string") return;
          this.$message.error(error.message);
        });
    },
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
        nodeIndex: this.form.nodeIndex - 1
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
    // 退回校验
    handleValidReturn() {
      this.$refs.authForm?.validate((valid) => {
        if (valid) {
          this.handleReturn();
        } else {
          this.$message.error("请完整填写表单内容！");
        }
      });
    },
    handleValidForm() {
      const formType = this.form.status === "0" ? "startForm" : "authForm";
      this.$refs[formType]?.validate((valid) => {
        if (valid) {
          if (this.canFinishResult && this.form.relativeId) {
            this.finalResultDialogVisible = true;
          } else {
            this.handleAccept();
          }
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
          nowAuthPerson: this.nextNodeInfo.chinaname ?? "archive",
          nowAuthPersonId: this.nextNodeInfo.id ?? 0,
          supplementaryInfo: JSON.stringify(this.supplementaryInfo),
          budgetId: this.form.budgetId ?? 0,
          budgetName: this.form.budgetName ?? "",
          status: "1",
          nodeIndex: this.form.nodeIndex + 1
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
          nodeIndex: this.form.nodeIndex + 1
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
    async init() {
      if (this.type === "add") {
        this.form.startPerson = this.userInfo.chinaname;
        this.form.startPersonId = this.userInfo.id;
        this.form.startTime = getTodayString();
        if (this.isDialog) {
          this.needToRelative = '1';
          if (this.reqId) {
            this.form.relativeId = this.reqId;
            await this.getReqFormData();
          }
        }
      } else {
        const { supplementaryInfo, ...form } = this.info;
        this.needToRelative = !this.info.relativeId ? '0' : '1';
        this.form = form;
        if (this.info.relativeId) {
          await this.getReqFormData();
        }
        this.supplementaryInfo = JSON.parse(supplementaryInfo);
        this.nowSupplementaryInfo.authPerson = this.userInfo.chinaname;
        this.nowSupplementaryInfo.userId = this.userInfo.id;
      }
    },
    // 获取申请表单数据
    async getReqFormData() {
      try {
        const { data, status } = await findFormById(this.form.relativeId);
        if (status !== 200) throw new Error('服务端异常');
        if (data && data.code !== 200) throw new Error(data.message ?? '未知错误！');
        if (data.data) {
          this.reqForm = data.data ?? {};
          const label =
            this.bizTypeOptions.find((item) => item.bizType === data.data.biz_type)
              ?.label ?? "未知业务类型";
          this.relativeComplete = `${data?.data?.chinaname || '未知人员'}的${label}申请`;
          this.form.bizType = data.data.biz_type;
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    handleFinish(value) {
      this.form.budgetName = value.budgetName;
      this.form.budgetId = value.budgetId;
      this.form.budgetMoney = value.money;
    },
    computedProcess(bizType) {
      if (this.type === "add" || this.form.status === "0") {
        this.process =
          this.bizTypeOptions.find((item) => item.bizType === bizType)?.process ??
          [];
        this.nextNodeInfo = this.process[0] ?? {};
        this.form.projNo = bizType + uuid().slice(0, 8);
        this.form.flowConfig = JSON.stringify(this.process);
      } else {
        this.process = JSON.parse(this.info.flowConfig);
        //判断是否能够最终决定权
        this.canFinishResult = this.process.length - 1 === this.info.nodeIndex && this.process[this.info.nodeIndex]?.isCanDivide === '1';
        // 判断上一个节点
        if (this.info.nodeIndex > 0) {
          this.laseNodeInfo = this.process[this.info.nodeIndex - 1] ?? {};
        } else {
          this.laseNodeInfo = {};
        }
        // 判断下一个节点
        if (this.info.nodeIndex !== null || this.info.nodeIndex !== undefined) {
          this.canReturn = this.process[this.info.nodeIndex]?.isAllowReturn === "1";
          this.nextNodeInfo = this.process[this.info.nodeIndex + 1] ?? {};
        }
      }
    },
    returnBack() {
      if (this.isDialog) {
        this.$confirm("表单填写中，一旦关闭数据无法恢复，请确认是否离开关闭", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$emit("returnBack");
        })
      } else {
        this.$emit("returnBack");
      }
    },
    // 最终决策权力
    async handleSet(type) {
      const loading = this.$loading({
        lock: true,
        text: "正在上传数据中，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        this.finalResultDialogVisible = false;
        const params = {
          id: this.info.relativeId,
          approvalPerson: this.userInfo.chinaname,
          status: type
        };
        const { data } = await approvalCommentary(params);
        if (data.code !== 200) throw new Error(data.message);
        if (type === '2') {
          await setRole(this.reqForm.user_id, this.reqForm.req_role);
        }
        await this.handleAccept();
      } catch (error) {
        this.$message.error(error.message);
      } finally{
        loading.close();
      }
    }
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.main-row-content {
  padding-bottom: 80px;

  .form_content--main {
    min-height: 100%;
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

      .conver_money {
        font-size: 14px;
        font-weight: bold;
        color: #4090ef;
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
        background: linear-gradient(141deg,
            rgba(239, 146, 142, 0.96) 0%,
            #ee281f 100%);
      }

      &.again {
        background: linear-gradient(141deg,
            rgba(235, 97, 0, 0.5) 0%,
            #e8b048 100%);
      }
    }
  }
}

.button__text-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.no-relative-text {
  color: #979797;
  font-weight: 600;
  font-size: 14px;
}

.dialog_btn_list {
  text-align: center;
}

.tip_type {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;

  p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;

    .weight-light {
      color: #4090EF;
      font-weight: 500;
      font-family: 'hk';
    }
  }
}
</style>
