<template>
    <el-dialog append-to-body :visible="visible" title="选择预算" width="60%" @close="closeDialog" @open="handleOpen">
        <header>
            <el-select size="small" v-model="event" @change="initBudget">
                <el-option v-for="item in events" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </header>
        <el-table :data="budgetList" border>
            <el-table-column label="操作" prop="budget_name" width="100px" align="center">
                <template #default="{ row,$index }">
                    <el-checkbox v-model="row.isCheck" :disabled="row.use_status === '1'" @input="handleCheck($event, row, $index)"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="预算名称" prop="budget_name" align="center"></el-table-column>
            <el-table-column label="预算类型" prop="budget_type" align="center"></el-table-column>
            <el-table-column label="使用情况">
                <template #default="{row}">
                    {{ row.use_status === '1' ? '已使用' : '未使用' }}
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer">
            <el-button size="small" type="primary" @click="confrim">确 认</el-button>
            <el-button size="small" plain @click="closeDialog">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getAllEvents } from "@/api/gameSeason/index";
import { getBudget } from '@/api/budget/index.js';

export default {
    name: 'budgetCheck',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        checkBudetId:{
            type:Number,
            default:0
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
            budgetId:null
        };
    },
    methods: {
        handleOpen(){
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
            }else{
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
        confrim() {
            this.$emit('finish',this.checkInfo);
            this.visible = false;
        }
    },
    created() {
        this.initEvents();
    },
}
</script>
<style lang='less' scoped>
header {
    margin: 12px 0;
}
</style>