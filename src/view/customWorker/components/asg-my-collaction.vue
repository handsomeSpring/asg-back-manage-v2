<template>
    <el-scrollbar class="comp__container--absolute">
        <el-button v-show="design" type="primary" size="small" @click="settingDialog = true">配置（设计可见）</el-button>
        <el-tabs v-model="activeName">
            <el-tab-pane label="我的任务" name="first">
                <ul v-if="list.length > 0">
                    <li class="taskList" v-for="(task, index) in list" :key="index" @click="openDialog(task)">
                        <p class="task__title">{{ task.taskName }}</p>
                        <p class="my-task-info margin-icon" v-if="task.status === '0'">
                            <i class="el-icon-time"></i>进行中
                        </p>
                        <p class="my-task-auth margin-icon" v-else-if="task.status === '1'">
                            <i class="el-icon-warning"></i>待审核
                        </p>
                        <p class="my-task-success margin-icon" v-else-if="task.status === '2'">
                            <i class="el-icon-success"></i>已完成
                        </p>
                        <p class="my-task-error margin-icon" v-else-if="task.status === '3'">
                            <i class="el-icon-error"></i>已驳回
                        </p>
                    </li>
                </ul>
                <el-empty v-else description="暂无任务"></el-empty>
            </el-tab-pane>
            <el-tab-pane label="待审列表(超管)" name="second">
                <ul v-if="waitAuthList.length > 0">
                    <li class="authList" v-for="(task, index) in waitAuthList" :key="index" @click="routerToAuth">
                        <p class="person__title">
                            <i class="el-icon-user-solid"></i>
                            {{ task.chinaname }}
                        </p>
                        <p class="task__title">{{ task.taskName }}</p>
                        <p class="my-task-info margin-icon" v-if="task.status === '0'">
                            <i class="el-icon-time"></i>进行中
                        </p>
                        <p class="my-task-auth margin-icon" v-else-if="task.status === '1'">
                            <i class="el-icon-warning"></i>待审核
                        </p>
                        <p class="my-task-success margin-icon" v-else-if="task.status === '2'">
                            <i class="el-icon-success"></i>已完成
                        </p>
                        <p class="my-task-error margin-icon" v-else-if="task.status === '3'">
                            <i class="el-icon-error"></i>已驳回
                        </p>
                    </li>
                </ul>
                <el-empty v-else description="没有要审核的任务"></el-empty>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="dialogVisible" title="我的任务" width="60%" :append-to-body="true"
            :close-on-click-modal="false" center>
            <div class="grid__body">
                <div>
                    <p style="font-weight: bold;">{{ taskInfo.taskName }}</p>
                    <el-divider></el-divider>
                    <p>任务描述：{{ taskInfo.taskDescription }}</p>
                </div>
                <taskHistory :row="row" :isDialog="false"></taskHistory>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="['0', '3'].includes(taskInfo.status)" size="small" icon="el-icon-s-custom"
                    type="primary" @click="authTask">送管理员审批</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="settingDialog" title="配置" width="40%" :append-to-body="true"
            :close-on-click-modal="false" center>
            <label>优先展示栏目</label>
            <el-radio-group v-model="settingConfig.labelIndex">
                <el-radio label="first">我的任务</el-radio>
                <el-radio label="second">任务待审</el-radio>
            </el-radio-group>
            <span slot="footer">
                <el-button plain size="small" @click="handleSave">保存</el-button>
            </span>
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import { getTask, findTasks, taskFinish } from "@/api/admin/index.js";
import taskHistory from "@/view/taskManager/components/taskHistory.vue";
import { mapGetters } from "vuex";
export default {
    name: 'asgMyCollaction',
    text:'任务待办',
    components: {
        taskHistory
    },
    props: {
        design: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            count: 0,
            activeName: 'first',
            taskInfo: {},
            dialogVisible: false,
            list: [],
            waitAuthList: [],
            row: {},
            settingDialog: false,
            settingConfig: {
                labelIndex: 'first'
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    methods: {
        handleSave() {
            const settingJson = JSON.stringify(this.settingConfig);
            localStorage.setItem('workplat-setting', settingJson);
            this.activeName = this.settingConfig.labelIndex;
            this.settingDialog = false;
            this.$message.success('保存成功！');
        },
        initAssign() {
            const id = this.userInfo.id || Number(window.sessionStorage.getItem('id'))
            if (Number.isNaN(id)) throw new Error('id不合法');
            getTask(id)
                .then((res) => {
                    if (typeof res.data === 'string') throw new Error(res.data);
                    this.list = res.data;
                })
                .catch((err) => {
                    this.$message.error(err instanceof Error ? err.message : err);
                });
        },
        async initWaitDo() {
            try {
                const requestParams = {
                    chinaname: '',
                    status: ''
                };
                const { data, status, message } = await findTasks(requestParams);
                if (status !== 200) throw new Error(message);
                if (data.code === 401) return;
                this.waitAuthList = data.rows;
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        routerToAuth() {
            this.$router.push({ path: '/index/task' });
        },
        openDialog(task) {
            this.row = task;
            this.taskInfo = task;
            this.dialogVisible = true;
        },
        async authTask() {
            try {
                const { status, message } = await taskFinish(this.taskInfo.id);
                if (status !== 200) throw new Error(message);
                this.initAssign();
                this.initWaitDo();
                this.dialogVisible = false;
                this.$message.success('操作成功');
            } catch (error) {
                this.$message.error(error.message);
            }
        }
    },
    created() {
        const settingConfig = localStorage.getItem('workplat-setting');
        if(settingConfig){
            const settings = JSON.parse(settingConfig)
            this.settingConfig.labelIndex = settings.labelIndex;
            this.activeName = this.settingConfig?.labelIndex ?? 'first';
        };

        this.initAssign();
        this.initWaitDo();
    },
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;

    .taskList {
        width: calc(100% - 12px);
        display: flex;
        justify-content: center;
        align-items: center;
        justify-content: space-between;
        margin: 6px;
        cursor: pointer;

        &:hover {
            color: #4090EF;
        }

        .person__title {
            width: 15%;
        }

        .task__title {
            width: 55%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .red-title {
            color: #f40;
            font-weight: 600;
        }

        .orange-title {
            color: #ebb563;
            font-weight: 600;
        }
    }

    .authList {
        display: grid;
        grid-template-columns: 20% auto 100px;
        gap: 0 12px;
        align-items: center;
        margin: 6px;
        cursor: pointer;

        &:hover {
            color: #4090EF;
        }

        .person__title {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .task__title {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
}

.grid__body {
    display: grid;
    grid-template-columns: auto 300px;
    gap: 24px;
}
</style>