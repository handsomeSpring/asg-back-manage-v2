<template>
    <div>
        <header>
            <h1>{{ seasonInfo.seasonName }}-预算补录</h1>
            <el-button size="small" @click="toList" icon="el-icon-arrow-left">返回</el-button>
        </header>
        <el-empty v-if="info.length === 0" description="该赛季暂无预算信息"></el-empty>
        <template v-else>
            <el-card class="card__box" v-for="(item, index) in info" :key="index" shadow="hover">
                <div class="tag__index" :style="{
                    background:item.status === '1' ? '#EBF6F4' : '#FFF0EB',
                    color:item.status === '1' ? '#21A97A' : '#FF6B3B'
                    }">
                    <div class="path__half">
                        {{ index + 1 }}
                    </div>
                </div>
                <div class="card__content">
                    <el-form :ref="`vFormRef_${index}`" :model="item" label-position="right" label-width="120px"
                        :rules="rules">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预算年度" prop="budgetYear">
                                    <el-input disabled v-model="item.budgetYear" size="small" type="year"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="前编辑人" prop="updatePerson">
                                    <el-input v-model="item.updatePerson" size="small" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="预算类型" prop="budgetType">
                                    <el-input size="small" v-model="item.budgetType"
                                        disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预算名称" prop="budgetName">
                                    <el-input :disabled="item.status === '1'" v-model="item.budgetName" size="small"
                                        clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="预算来源赛季" prop="sourceEventId">
                                    <el-select size="small" v-model="item.sourceEventId" clearable disabled
                                        @change="changeSelect($event, 'sourceEventName')">
                                        <el-option label="请选择赛季" value=""></el-option>
                                        <el-option v-for="item in eventOptions" :key="item.value" :label="item.label"
                                            :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="预算使用赛季" prop="usedEventId">
                                    <el-select :disabled="item.status === '1'" size="small" v-model="item.usedEventId"
                                        @change="changeSelect($event, 'usedEventName')">
                                        <el-option label="请选择赛季" value=""></el-option>
                                        <el-option v-for="item in eventOptions" :key="item.value" :label="item.label"
                                            :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预算金额" prop="budgetMoney">
                                    <money-input v-if="item.status === '0'" v-model="item.budgetMoney"
                                        size="small"></money-input>
                                    <p v-else class="money-text">{{ item.budgetMoney | toChies }}<span
                                            style="margin-left:6px">元整</span>
                                    </p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="预算使用细节" prop="budgetUsed">
                                    <el-input :disabled="item.status === '1'" type="textarea" v-model="item.budgetUsed"
                                        size="small" :rows="3" maxlength="80" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div>
                        <el-steps direction="vertical">
                            <el-step title="上一个编辑人" :status="item.status === '0' ? 'process' : 'finish'">
                                <template #description>
                                    <p class="mg-12"><i class="el-icon-s-custom"></i>{{ item.updatePerson }}</p>
                                    <p class="mg-12"><i class="el-icon-time"></i>{{ item.updateTime }}</p>
                                    <el-button-group v-if="item.status === '0'">
                                        <el-button size="small" type="primary"
                                            @click="handleSupplier(item, index)">预算补录</el-button>
                                        <el-button size="small" type="primary"
                                            @click="useBudget(item.id)">使用预算</el-button>
                                        <el-button size="small" type="danger"
                                            @click="deleteBudget(item.id)">删除预算</el-button>
                                    </el-button-group>

                                </template>
                            </el-step>
                            <el-step title="预算使用情况" :status="item.status === '0' ? 'wait' : 'finish'">
                                <template #description>
                                    <div v-if="item.status === '0'">
                                        <p class="my-task-auth margin-icon mg-12">
                                            <i class="el-icon-warning"></i>预算待使用
                                        </p>
                                    </div>
                                    <div v-else>
                                        <p class="my-task-success margin-icon mg-12">
                                            <i class="el-icon-success"></i>预算已使用
                                        </p>
                                        <p class="mg-12"><i class="el-icon-s-custom"></i>{{ item.usePerson }}</p>
                                        <p class="mg-12"><i class="el-icon-time"></i>{{ item.changeTime }}</p>
                                    </div>
                                </template>
                            </el-step>
                        </el-steps>
                    </div>
                </div>
            </el-card>
        </template>
    </div>
</template>

<script>
import { getBudget, updateBudget, changeBudgetStatus,delBudget } from "@/api/budget";
import { mapGetters } from "vuex";
export default {
    name: 'detail-supplier',
    props: {
        eventId: {
            type: Number,
            required: true
        },
        eventOptions: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            info: [],
            seasonInfo: {
                seasonName: '',
                seasonId: ''
            },
            rules: {
                budgetYear: [
                    { required: true, message: '请选择预算年份', trigger: 'blur' },
                ],
                updatePerson: [
                    { required: true, message: '请输入编辑人', trigger: 'blur' }
                ],
                budgetType: [
                    { required: true, message: '请选择预算类型', trigger: 'change' }
                ],
                budgetName: [
                    { required: true, message: '请输入预算名称', trigger: 'blur' }
                ],
                sourceEventId: [
                    { required: true, message: '请选择预算来源赛季', trigger: 'change' }
                ],
                usedEventId: [
                    { required: true, message: '请选择预算使用赛季', trigger: 'change' }
                ],
                budgetMoney: [
                    { required: true, message: '请输入预算金额', trigger: 'blur' }
                ],
                budgetUsed: [
                    { required: true, message: '请填写预算使用情况', trigger: 'blur' }
                ],
            }
        };
    },
    computed:{
        ...mapGetters(['userInfo'])
    },
    methods: {
        toList() {
            this.$emit('toList');
        },
        async deleteBudget(id){
            try {
                const confirm = await this.$confirm("您确定要删除该笔预算吗？一旦删除，该预算将永远无法恢复。", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                });
                if (confirm !== 'confirm') return;
                const { status, data } = await delBudget(id);
                if(status !== 200) throw new Error('服务端异常，请联系网站管理员');
                if (data && data.code === 401) throw new Error('您没有权限无法操作');
                this.$message.success('删除成功！');
                this.getBudgetInfo();
            } catch (error) {
                if (error === 'cancel') return;
                this.$message.error(error.message);
            }
        },
        async useBudget(id) {
            try {
                const confirm = await this.$confirm("您确定要使用预算吗？一旦使用，该预算信息无法被更改。", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                });
                if (confirm !== 'confirm') return;
                const requestBody = {
                    budgetId: id,
                    usePerson: this.userInfo.chinaname || sessionStorage.getItem('chinaname'),
                    usePersonId: this.userInfo.id || sessionStorage.getItem('id')
                }
                const { data, status } = await changeBudgetStatus(requestBody);
                if (status !== 200) throw new Error('服务端异常');
                if (data.code === 401) throw new Error('您没有权限无法操作');
                this.getBudgetInfo();
            } catch (error) {
                if (error === 'cancel') return;
                this.$message.error(error.message);
            }
        },
        async handleSupplier(item, index) {
            try {
                this.$refs[`vFormRef_${index}`][0].validate(async valid => {
                    if (!valid) throw new TypeError('请完整填写表单');
                    const { status, changeTime, updateTime, usePerson, updatePerson, id, ...row } = item;
                    const requestData = {
                        ...row,
                        updatePerson: this.userInfo.chinaname || sessionStorage.getItem('chinaname')
                    }
                    const { data, status: httpStatus } = await updateBudget(requestData, id);
                    if (httpStatus !== 200) throw new Error('服务端异常，保存失败');
                    if (data.code === 401) throw new Error('操作失败，您没有操作权限。');
                    this.$message.success('操作成功');
                    this.getBudgetInfo();
                })
            } catch (error) {
                this.$message.error(error.message);
            }

        },
        async getBudgetInfo() {
            try {
                if (!this.eventId) throw new Error('缺少赛季Id');
                const { data, status } = await getBudget(this.eventId);
                if (status !== 200) throw new Error('获取失败，请联系网站管理员');
                if (data.code === 401) throw new Error('获取失败，您没有权限');
                this.info = [];
                data.data.forEach(item => {
                    this.info.push({
                        budgetMoney: item.budget_money,
                        budgetName: item.budget_name,
                        budgetType: item.budget_type,
                        budgetUsed: item.budget_used,
                        budgetYear: item.budget_year,
                        changeTime: item.change_time,
                        usePerson: item.use_person,
                        id: item.id,
                        sourceEventId: item.source_event_id,
                        sourceEventName: item.source_event_name,
                        updatePerson: item.update_person,
                        updateTime: item.update_time,
                        status: item.use_status,
                        usedEventId: item.used_event_id,
                        usedEventName: item.used_event_name,
                    })
                })
            } catch (error) {
                this.$message.error(error.message);
            }
        }
    },
    created() {
        this.seasonInfo.seasonId = this.eventId;
        this.seasonInfo.seasonName = this.eventOptions.find(item => item.value === this.eventId)?.label ?? '未知赛季'
        this.getBudgetInfo();
    },
}
</script>
<style lang='less' scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 2px solid #e7e7e7;
}

.card__content {
    display: grid;
    width: 100%;
    grid-template-columns: auto 300px;
    gap: 24px;
}

.el-form-item {
    margin-right: 12px !important;
}

.el-form-item__label {
    position: absolute;
}

.el-form-item__content {
    width: 90%;
    padding-left: 80px;
}

.el-date-editor,
.el-select,
.el-input_inner {
    width: 100%;
}

.money-text {
    color: #4090EF;
    font-weight: 600;
}

.el-card {
    margin: 24px 0;
}

.mg-12 {
    margin: 6px 0;
}

.card__box {
    position: relative;

    .tag__index {
        position: absolute;
        height: 50px;
        width: 50px;
        top: 0;
        left: 0;
        background: #9CC9E5;
        -webkit-clip-path: polygon(0 0, 0% 100%, 100% 0);
        clip-path: polygon(0 0, 0% 100%, 100% 0);
        .path__half{
            width: 60%;
            height: 60%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
    }
}
</style>