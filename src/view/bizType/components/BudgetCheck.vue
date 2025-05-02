<template>
    <el-dialog append-to-body :fullscreen="isMobile" :visible="visible" title="选择预算" width="60%" @close="closeDialog"
        @open="handleOpen">
        <header>
            <el-select size="small" v-model="event" @change="initBudget">
                <el-option v-for="item in events" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </header>
        <el-table :data="budgetList" border v-if="!isMobile">
            <el-table-column label="操作" prop="budget_name" width="100px" align="center">
                <template #default="{ row, $index }">
                    <el-checkbox v-model="row.isCheck" :disabled="row.use_status === '1'"
                        @input="handleCheck($event, row, $index)"></el-checkbox>
                    {{ row.use_status === '1' ? '已使用' : '未使用' }}
                </template>
            </el-table-column>
            <el-table-column label="预算名称" prop="budget_name" align="center"></el-table-column>
            <el-table-column label="预算类型" prop="budget_type" align="center"></el-table-column>
            <el-table-column label="使用情况">
                <template #default="{ row }">
                    <span class="budget_all">总预算：￥{{ row.budget_money }}</span> / <span>{{ row.budget_used }}</span>
                </template>
            </el-table-column>
        </el-table>
        <MobileTable :table-data="budgetList" :table-props="tableProps" :skeLoading="loading" isAutoHeight>
            <template #operation="{ row, index }">
                <el-checkbox v-model="row.isCheck" :disabled="row.use_status === '1'"
                    @input="handleCheck($event, row, index)"></el-checkbox>
                {{ row.use_status === '1' ? '已使用' : '未使用' }}
            </template>
            <template #intro="{ row }">
                <span class="budget_all">总预算：￥{{ row.budget_money }}</span> / <span>{{ row.budget_used }}</span>
            </template>
        </MobileTable>
        <span slot="footer">
            <div class="footer_btn">
                <section class="ipt_list">
                    <label>使用金额：</label>
                    <asg-money-input v-model="useMoney" size="small"></asg-money-input>
                </section>
                <section class="btn_list">
                    <el-button size="small" type="primary" @click="confirm">确 认</el-button>
                    <el-button size="small" plain @click="closeDialog">取 消</el-button>
                </section>
            </div>
        </span>
    </el-dialog>
</template>

<script>
import { getAllEvents } from "@/api/gameSeason/index";
import { getBudget } from '@/api/budget/index.js';
import AsgMoneyInput from "@/components/AsgMoneyInput.vue";
import MobileTable from "@/components/mobile/mobileTable.vue";
import { isMobile } from "@/utils";

export default {
    name: 'budgetCheck',
    components: {
        AsgMoneyInput,
        MobileTable
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        checkBudetId: {
            type: Number,
            default: 0
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val);
            }
        }
    },
    data() {
        return {
            events: [],
            event: '',
            budgetList: [],
            checkInfo: {},
            budgetId: null,
            isMobile: false,
            useMoney: 0,
            loading: false,
            tableProps: [
                {
                    type: "slot",
                    label: "操作",
                    prop: "operation",
                    slot:true,
                    style: {
                        textAlign: "center",
                        minWidth: "80px",
                    },
                },
                {
                    type: "prop",
                    label: "预算名称",
                    prop: "budget_name",
                    style: {
                        textAlign: "center",
                        minWidth: "120px",
                    },
                },
                {
                    type: "prop",
                    label: "预算类型",
                    prop: "budget_type",
                    style: {
                        textAlign: "center",
                        minWidth: "120px",
                    },
                },
                {
                    type: "slot",
                    label: "使用情况",
                    prop: "intro",
                    slot: true,
                    style: {
                        textAlign: "center",
                        minWidth: "120px",
                    },
                }
            ]
        };
    },
    methods: {
        handleOpen() {
            this.budgetId = this.checkBudetId;
        },
        handleCheck(value, row, index) {
            if (value) {
                this.budgetList.forEach(item => {
                    item.isCheck = false;
                })
                this.budgetList[index].isCheck = true;
                this.checkInfo = {
                    money: row.budget_money,
                    budgetName: row.budget_name,
                    budgetId: row.id
                }
                this.budgetId = row.id;
            } else {
                this.checkInfo = {};
                this.budgetId = 0;
            }
        },
        closeDialog() {
            this.visible = false;
        },
        async initEvents() {
            try {
                this.loading = true;
                const { data, status } = await getAllEvents();
                if (status !== 200) throw new Error('服务端异常，获取赛季失败！');
                this.events = data;
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                this.loading = false;
            }
        },
        async initBudget() {
            try {
                const { data, status } = await getBudget(this.event);
                if (status !== 200) throw new Error('服务端异常，请联系网站管理员！');
                this.budgetList = (data?.data ?? []).map(item => {
                    return {
                        ...item,
                        isCheck: item.id === this.budgetId
                    }
                })
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        confirm() {
            console.log(this.checkInfo, 'this.checkInfo');
            if (!this.checkInfo.budgetId) return this.$message.error('请选择一条预算！');
            if (!this.useMoney) return this.$message.error('请输入使用金额');
            this.$emit('finish', {
                ...this.checkInfo,
                money: this.useMoney
            });
            this.visible = false;
        }
    },
    created() {
        this.isMobile = isMobile();
        this.initEvents();
    },
}
</script>
<style lang='less' scoped>
header {
    margin: 12px 0;
}

.budget_all {
    color: #f40;
}

.footer_btn {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .ipt_list {
        display: grid;
        grid-template-columns: 6em auto;
        align-items: center;
        gap: 0.5em;
    }
}

@media (max-width: 1024px) {
    .footer_btn {
        flex-direction: column;
        gap: 2em;
    }
}
</style>