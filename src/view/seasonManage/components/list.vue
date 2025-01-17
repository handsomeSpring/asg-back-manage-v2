<template>
    <div>
        <header>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="toDetail('add')">开启新赛季</el-button>
        </header>
        <div class="min-height-body" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.9)">
            <template v-if="events.length > 0">
                <asg-table-card v-for="(item, index) in events" :key="index">
                    <template #header>
                        <div class="asg-header">
                            <div class="header-left">
                                <span class="fontWeight">{{ item.name }}</span>
                            </div>
                            <div class="header-operation">
                                <el-button type="text" @click="checkRuleInfo(item)">
                                    预览规则
                                </el-button>
                                <el-button type="text" @click="toDetail('edit', item)">
                                    编辑赛季
                                </el-button>
                                <el-button style="color: #f40" type="text" @click="deleteItem(item.id)">
                                    删除赛季
                                </el-button>
                            </div>
                        </div>
                    </template>
                    <template #content>
                        <div class="table-content">
                            <!-- <AsgProgress :status="item.status"></AsgProgress> -->
                            <p class="text">赛季时间：
                                <span style="color: #4090ef">
                                    {{ new Date(item.opentime) | parseTime("{y}-{m}-{d}") }}
                                </span>
                            </p>
                            <p class="text">赛程状态：
                                <span style="color: #4090ef">
                                    {{ item.is_over ? "已结束" : "进行中" }}
                                </span>
                            </p>
                            <p class="text">赛程阶段：
                                <span style="color: #4090ef">
                                    {{ mapStatus(item.status) }}
                                </span>
                            </p>
                        </div>
                    </template>
                </asg-table-card>
            </template>
            <div class="no-message" v-else>暂无赛季</div>
        </div>
        <!-- 赛季规则 -->
        <el-dialog top="5vh" title="规则详情" append-to-body width="60%" :visible.sync="checkDialogVisible">
            <el-scrollbar style="height: 55vh">
                <v-md-preview :text="checkRules" height="400px" width="800"></v-md-preview>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
import {
    getAllEvents,
    deleteEvents
} from "@/api/gameSeason/index";
import asgTableCard from "@/components/asg-table-card.vue";
export default {
    name: 'season-list',
    components: {
        asgTableCard
    },
    computed: {
        serveIp() {
            return window.SERVE_IP;
        },
    },
    data() {
        return {
            events: [],
            loading: false,
            checkDialogVisible: false,
            text: '',
            checkRules: "",
        };
    },
    methods: {
        // 删除赛季
        deleteItem(id) {
            this.$confirm("是否删除赛季?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteEvents(id)
                        .then(() => {
                            this.$message.success("删除成功！");
                            this.initEvents();
                        })
                        .catch((err) => {
                            if (err?.response?.data) {
                                return this.$message.error(err.response.data.message);
                            }
                            this.$message.error("服务器异常，请联系管理员！");
                        });
                })
                .catch(() => { });
        },
        // 查询规则
        async checkRuleInfo(row) {
            try {
                this.checkDialogVisible = true;
                await this.getRule(row);
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        async getRule(data) {
            try {
                const result = await fetch(`${this.serveIp}/doc/rule/${data.name}.md`);
                const res = await result.text();
                this.checkRules = res || "未设置规则";
            } catch (error) {
                this.checkRules = "暂无规则";
            }
        },
        // 进入详情页面
        toDetail(type, info = {}) {
            this.$emit('toDetail', type, info);
        },
        mapStatus(status) {
            const stautsMap = {
                0: "筹备中",
                1: "报名中",
                2: "建联期",
                3: "公示中",
                4: "进行中",
                5: '已结束'
            };
            return stautsMap[status]
        },
        async initEvents() {
            try {
                this.loading = true;
                const { data, status } = await getAllEvents();
                if (status !== 200) throw new Error("服务端异常，获取赛季失败！");
                this.events = data;
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                this.loading = false;
            }
        },
    },
    created() {
        this.initEvents();
    },
}
</script>
<style lang='less' scoped>
.table-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1em;
    padding: 1em;
}

header {
    margin: 0 0 12px;
}

.asg-header {
    height: inherit;
    padding: 0 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .fontWeight {
            font-weight: 600;
            font-size: 1em;
            font-family: 'hk';
        }
    }

    // 操作按钮
    .header-operation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
    }
}

.min-height-body {
    min-height: 70vh;
    .no-message {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        width: 100%;
        color: #979797;
        border-top: 1px solid #979797;
    }
}
</style>