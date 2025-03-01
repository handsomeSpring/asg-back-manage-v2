<template>
    <div class="mobile-task-container">
        <full-screen-loading v-if="loading"></full-screen-loading>
        <template v-else>
            <el-empty style="height:100%" v-if="list.length === 0" description="暂无任务"></el-empty>
            <template v-else>
                <div class="my-alert" v-for="item in list" :closable="false" :key="item.id">
                    <div class="tag--absolute">
                        <p :class="`level-${item.priority}`">{{ item.priority | filterPriority }}</p>
                    </div>
                    <div class="card-header">
                        <i class="el-icon-s-order"></i>{{ item.taskName }}
                    </div>
                    <p class="task-detail">
                        <span class="tag" :class="computedType(item.status)">[{{ item.status | filterComplete }}]</span>{{ item.taskDescription }}
                    </p>
                    <div class="taskInfo">
                        <button class="my-button" v-if="['0', '3'].includes(item.status)"
                            @click="handleFinish(item.id)">
                            完成任务
                        </button>
                    </div>
                </div>
            </template>
        </template>
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
                '0': 'process',
                '1': 'waitAuth',
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
                this.$toast.success("操作成功");
            } catch (error) {
                this.$toast.error(error.message);
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
                this.$toast.error(error instanceof Error ? error.message : error);
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
.mobile-task-container {
    height: calc(100% - 1em - 60px);
    padding: 1em;
    background: #F5F6F7;
    overflow: auto;
    .my-alert {
        position: relative;
        border-radius: 16pt;
        margin-bottom: 1em;
        padding: 1em;
        overflow: hidden;
        background: #fff;

        .tag--absolute {
            position: absolute;
            background: linear-gradient(173deg, #b3d4ff, #fff0 93%);
            top: 0;
            right: 0;
            top: 10px;
            right: -23px;
            width: 89px;
            text-align: center;
            transform: rotate(45deg);
            padding: 0.2rem 0;
            font-size: 1rem;
            font-weight: bold;
        }

        .card-header {
            height: 32px;
            display: flex;
            align-items: center;
            color: #2b8248;
            width: 100%;
            gap: 0.2em;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .task-detail {
            color: #333;
            font-size: 0.85rem;
            text-indent: 2em;
            padding: 0.7em 0;
            border-bottom: 1px solid #999;
            border-top: 1px solid #999;

            .tag {
                color: #8fc1ff;
                font-size: 0.85rem;
                font-weight: bold;
                margin-right: 0.2em;
                &.process{
                    color:#4090EF;
                }
                &.waitAuth{
                     color:#DD7D17;
                }
                &.success{
                    color:#105126;
                }
                &.error{
                    color:#EF2D2D;
                }
            }
        }

        .taskInfo {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding-top: 1em;

            .my-button {
                padding: 8px 32px;
                border-radius: 16pt;
                font-size: 1rem;
                background: #AED2E8;
                cursor: pointer;
                border: none;
                width: 60%;
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