<template>
    <div>
        <div class="title">预算录入详解</div>
        <el-alert type="warning" size="small" show-icon :closable="false">
            <template #title>
                <p style="font-size: 1rem;margin:12px 0">温馨提示</p>
            </template>
            <p style="font-size: 0.9rem;">该功能主要用于赛季之间预算支出和收入的记录，由获得激励金的人录入，请确保录入预算的真实性。</p>
        </el-alert>
        <div class="title">预算信息</div>
        <el-form ref="elForm" :model="form" label-position="right" label-width="120px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="预算年度" prop="budgetYear">
                        <el-input disabled v-model="form.budgetYear" size="small" type="year"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="编辑人" prop="updatePerson">
                        <el-input v-model="form.updatePerson" size="small" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预算类型" prop="budgetTypeId">
                        <el-select size="small" v-model="form.budgetTypeId" placeholder="请选择预算类型"
                            @change="changeBudgetType($event, 'budgetType')">
                            <el-option v-for="item in budgetTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="预算名称" prop="budgetName">
                        <el-input v-model="form.budgetName" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预算来源赛季" prop="sourceEventId">
                        <el-select size="small" v-model="form.sourceEventId" clearable
                         :disabled="!!seasonId"
                            @change="changeSelect($event, 'sourceEventName')">
                            <el-option label="请选择赛季" value=""></el-option>
                            <el-option v-for="item in eventOptions" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预算使用赛季" prop="usedEventId">
                        <el-select size="small" v-model="form.usedEventId"
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
                        <money-input v-model="form.budgetMoney" size="small"></money-input>
                        <p class="money-text">{{ form.budgetMoney | toChies }}<span style="margin-left:6px">元整</span>
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="预算使用细节" prop="budgetUsed">
                        <el-input type="textarea" v-model="form.budgetUsed" size="small" :rows="3" maxlength="80"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <footer>
            <el-button icon="el-icon-arrow-left" @click="toList">返回</el-button>
            <el-button type="primary" icon="el-icon-document-add" @click="handleSave">保存预算</el-button>
        </footer>
    </div>
</template>

<script>
import { getByTitle } from '@/api/config';
import { saveBudget } from "@/api/budget";
import { mapGetters } from 'vuex';
export default {
    name: 'budget-detail',
    props: {
        eventOptions: {
            type: Array,
            default: () => []
        },
        seasonId:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            form: {
                budgetYear: '',
                budgetMoney: 0,
                budgetType: '',
                budgetName: '',
                sourceEventId: '',
                sourceEventName: '',
                usedEventName: '',
                usedEventId: '',
                updatePerson: '',
                budgetUsed: '',
                budgetTypeId: ''
            },
            budgetTypeOptions: [],
            rules: {
                budgetYear: [
                    { required: true, message: '请选择预算年份', trigger: 'blur' },
                ],
                updatePerson: [
                    { required: true, message: '请输入编辑人', trigger: 'blur' }
                ],
                budgetTypeId: [
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
        }
    },
    methods: {
        changeSelect(value, prop) {
            this.form[prop] = this.eventOptions.find(item => item.value === value)?.label ?? '未知赛季名';
        },
        changeBudgetType(value, prop) {
            this.form[prop] = this.budgetTypeOptions.find(item => item.value === value)?.label ?? '未知类型';
        },
        toList(){
            this.$emit('toList');
        },
        handleSave() {
            try {
              this.$refs['elForm'].validate(async valid => {
                if(!valid) throw new TypeError('请完整填写表单内容');
                const { budgetTypeId, ...requestData } = this.form;
                const { data, status } = await saveBudget(requestData);
                if(status !== 200) throw new Error('服务端异常，保存失败');
                if(data.code === 401) throw new Error('操作失败，您没有操作权限。');
                this.$message.success('操作成功');
                this.$emit('toList');
              })
            } catch (error) {
                this.$message.error(error.message);
            }
        }
    },
    computed:{
        ...mapGetters(['userInfo'])
    },
    created() {
        this.$set(this.form, 'updatePerson', this.userInfo.chinaname || sessionStorage.getItem('chinaname'));
        this.$set(this.form, 'budgetYear', new Date().getFullYear().toString());
        this.$set(this.form,'sourceEventId',this.seasonId);
        getByTitle('budgetTypeOptions').then(res => {
            this.budgetTypeOptions = res.data;
        })
    },
}
</script>
<style lang='less' scoped>
.title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 24px 0;
    font-weight: bold;

    &::before {
        content: '';
        height: 1.2rem;
        width: 5px;
        background: #4090EF;
        margin-right: 12px;
    }
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

footer {
    position: fixed;
    display: flex;
    align-items: center;
    right: 12px;
    gap: 12px;
    bottom: 0;
    margin: 12px 0;
}

.money-text {
    color: #4090EF;
    font-weight: 600;
}
</style>