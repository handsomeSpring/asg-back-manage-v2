<template>
    <div>
        <div class="header__search">
            <el-select size="small" v-model="selectSeason.value" @change="handleChangeSelect">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in eventOptions" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-coin" size="small"
                @click="handleGoDetail('', $event)">预算录入</el-button>
        </div>
        <div class="line__divider"></div>
        <main v-loading="loading">
            <div class="header__bar">
                <li>序号</li>
                <li>赛季</li>
                <li>预算使用情况</li>
                <li>预算占比</li>
                <li>操作</li>
            </div>
            <div v-for="(item, index) in filterEvents" class="main__body" :key="index">
                <li>{{ index + 1 }}</li>
                <li>{{ item.sourceEventName }}</li>
                <li class="money">
                    <p>￥{{ item.budgetTotalMoney }}</p>
                </li>
                <li>
                    <el-progress :color="customColors" style="width:80%" :percentage="item.percent"></el-progress>
                </li>
                <li>
                    <el-button type="text" style="margin:0 24px"
                        @click="handleSupplier(item.sourceEventId, $event)">预算补录</el-button>
                    <el-button type="text" style="margin:0 24px"
                        @click="handleGoDetail(item.sourceEventId, $event)">新增预算</el-button>
                </li>
            </div>
        </main>
    </div>
</template>

<script>
import { countBudgetTotal } from "@/api/budget/index.js";
export default {
    name: 'budget-list',
    props: {
        eventOptions: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            selectSeason: {
                value: '',
                label: '全部',
            },
            eventBudget: [],
            customColors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 }
            ],
            loading:false,
        };
    },
    computed: {
        filterEvents() {
            if (!this.selectSeason.value) {
                return this.eventBudget;
            } else {
                return this.eventBudget.filter(item => item.sourceEventId === this.selectSeason.value);
            }
        }
    },
    methods: {
        async getTotalUse() {
            try {
                this.loading = true;
                const { data, status } = await countBudgetTotal();
                if (status !== 200) throw new Error('服务端异常');
                if (data.code == 401) throw new Error('您没有权限，无法获取列表');
                const totalMoney = data.data.reduce((pre, next) => pre + next.budgetTotalMoney,0);
                this.eventBudget = data.data.map(item => {
                    return {
                        ...item,
                        percent: Math.trunc((item.budgetTotalMoney / totalMoney) * 100)
                    }
                });
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                this.loading = false;
            }

        },
        handleChangeSelect($event) {
            this.selectSeason.label = this.eventOptions.find(item => item.value === $event)?.label ?? '暂无选择';
        },
        handleGoDetail(event) {
            const seasonId = event ?? '';
            this.$emit('toDetail', seasonId);
        },
        handleSupplier(event) {
            this.$emit('toSupplier', event);
        }
    },
    created() {
        this.getTotalUse();
    },
}
</script>
<style lang='less' scoped>
.header__search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
}

.line__divider {
    height: 12px;
    width: 100%;
    background: #e7e7e7;
}

main {
    padding: 12px 0;
}

.header__bar {
    display: grid;
    grid-template-columns: 10% 20% 20% 35% 15%;
    width: 100%;
    padding: 12px 0;
    background: #f2f6fd;
    border-radius: 4px;
    margin: 12px 0;

    li {
        text-align: center;
        font-weight: bold;
        width: 100%;
    }
}

.main__body {
    display: grid;
    grid-template-columns: 10% 20% 20% 35% 15%;
    border: 1px solid #e7e7e7;
    margin: 12px 0;

    &:hover {
        background: #f2f6fd;
    }

    li {
        box-sizing: border-box;
        border-right: 1px solid #c8c8c8;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 0;

        &:last-child {
            border-right: none;
        }

        &.money {
            font-weight: bold;
            font-size: 1.2rem;
            color: #4090EF;
        }
    }


}
</style>