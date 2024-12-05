<template>
    <div>
        <full-screen-loading v-show="loading"></full-screen-loading>
        <el-empty v-if="list.length === 0" description="暂无任务"></el-empty>
        <div class="content-main">
            <el-alert :type="computedType(item.status)" class="my-alert" v-for="item in list" :closable="false"
                :key="item.id" :title="item.taskName">
                <p>{{ item.taskDescription }}</p>
                <div class="taskInfo">
                    <p> <span :class="`level-${item.priority}`">{{
                        item.priority | filterPriority
                            }}</span></p>
                    <p> {{ item.status | filterComplete }}</p>
                    <el-button v-if="['0', '3'].includes(item.status)" icon="el-icon-circle-check" size="small" type="primary"
                        @click="handleFinish(item.id)">完成任务</el-button>
                </div>
            </el-alert>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getTask, taskFinish } from "@/api/admin/index.js";
export default {
    name: 'mobileTask',
    data() {
        return {
            loading: false,
            list: [],
        };
    },
    filters: {
        filterComplete(val) {
            const map = {
                0: "进行中",
                1: "待审核",
                2: "审核通过",
                3: "审核不通过",
            };
            return map[val];
        },
        filterPriority(val) {
            const mapList = {
                0: "不急",
                1: "轻微",
                2: "一般",
                3: "紧需",
                4: "致命",
            };
            return mapList[val];
        },
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    methods: {
        computedType(type) {
            const mapList = {
                '0': 'info',
                '1': 'warning',
                '2': 'success',
                '3': 'error'
            }
            return mapList[type]
        },
        async handleFinish(id) {
            try {
                const { status, message } = await taskFinish(id);
                if (status !== 200) throw new Error(message);
                this.initAssign();
                this.$message.success("操作成功");
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        async initAssign() {
            try {
                this.loading = true;
                const id = Number(this.userInfo.id);
                if (Number.isNaN(id)) throw new Error("id不合法");
                const { data, status } = await getTask(id);
                if (status !== 200) throw new Error('服务端异常！');
                this.list = data;
                const number = this.list.filter(item => item.status === '0').length ?? 0;
                this.$store.commit("SET_WAITDO_NUMBER", number);
            } catch (error) {
                this.$message.error(error instanceof Error ? error.message : error);
            } finally {
                setTimeout(() => {
                    this.loading = false;
                }, 400);
            }
        },
    },
    created() {
        this.initAssign();
    },
}
</script>
<style lang='less' scoped>
.content-main {
    width: 90%;
    margin: 1em auto;

    .my-alert {
        margin-bottom: 1em;

        .taskInfo {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            width: 100%;
            padding: 0.5em;
            margin-top: 0.5em;
            border-top: 1px solid #e7e7e7;

            p {
                display: flex;
                align-items: center;

                &:first-child {
                    justify-content: flex-start;
                }

                &:nth-child(2) {
                    justify-content: center;
                }

                &:nth-child(3) {
                    justify-content: end;
                }
            }
        }
    }
}

.level-0 {
    color: #cddc39;
    font-size: 12px;
}

.level-1 {
    color: #8bc34a;
    font-size: 12px;
}

.level-2 {
    color: #fdd835;
    font-size: 12px;
}

.level-3 {
    color: #ff8f00;
    font-size: 12px;
}

.level-4 {
    color: #c62828;
    font-size: 12px;
}

/deep/.el-alert__content {
    width: 100%;
}
</style>