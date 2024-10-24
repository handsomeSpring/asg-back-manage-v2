<template>
    <div>
        <header>
            <div class="search__container">
                <p class="label">任务委托人</p>
                <el-input size="small" v-model="listQuery.chinaname" placeholder="请输入中文名" clearable></el-input>
                <p style="margin-left: 12px;" class="label">完成情况</p>
                <el-select size="small" v-model="listQuery.status" placeholder="请选择是否完成" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="进行中" value="0"></el-option>
                    <el-option label="待审核" value="1"></el-option>
                    <el-option label="已通过" value="2"></el-option>
                    <el-option label="已驳回" value="3"></el-option>
                </el-select>
            </div>
            <div>
                <el-button size="small" type="primary" @click="initTask('check')">查询</el-button>
                <el-button size="small" @click="initTask('reset')">重置</el-button>
            </div>
        </header>
        <main>
            <el-scrollbar style="height: 65vh;">
                <table v-loading="loading" element-loading-text="系统加载中，请稍等" element-loading-spinner="el-icon-loading">
                    <thead>
                        <th width="10%">任务标题</th>
                        <th width="50%">任务描述</th>
                        <th width="13%">任务执行者</th>
                        <th width="10%">任务状态</th>
                        <th width="17%">操作</th>
                    </thead>
                    <tbody>
                        <template v-if="tableData.length > 0">
                            <tr v-for="(item, index) in tableData" :key="index">
                                <td width="150">
                                    <el-tooltip class="item" effect="dark" :content="item.taskName"
                                        placement="top-start">
                                        <p class="ellipse">{{ item.taskName }}</p>
                                    </el-tooltip>
                                </td>
                                <td width="auto">
                                    <p class="multi__line">
                                        {{ item.taskDescription }}
                                    </p>
                                </td>
                                <td align="center" width="120">{{ item.chinaname }}</td>
                                <td align="center" width="120">
                                    <p class="my-task-info margin-icon" v-if="item.status === '0'">
                                        <i class="el-icon-time"></i>进行中
                                    </p>
                                    <p class="my-task-auth margin-icon" v-else-if="item.status === '1'">
                                        <i class="el-icon-warning"></i>待审核
                                    </p>
                                    <p class="my-task-success margin-icon" v-else-if="item.status === '2'">
                                        <i class="el-icon-success"></i>已完成
                                    </p>
                                    <p class="my-task-error margin-icon" v-else-if="item.status === '3'">
                                        <i class="el-icon-error"></i>已驳回
                                    </p>
                                </td>
                                <td align="center" width="150">
                                    <template v-if="['0','3'].includes(item.status)">
                                        <el-button type="text" @click="handleNotice(item)">通知
                                        </el-button>
                                    </template>
                                    <template v-if="item.status === '1'">
                                        <el-button type="text" @click="handleTaskDone('通过', item, '2')">通过</el-button>
                                        <el-button style="color:#f40" type="text"
                                            @click="handleTaskDone('驳回', item, '3')">驳回</el-button>
                                    </template>
                                    <el-button type="text" @click="viewTask(item)">查看</el-button>
                                    <el-button v-if="!['1', '2'].includes(item.status)" style="color:#f40" type="text"
                                        @click="deleteTaskItem(item.id, item.createUserId)">删除</el-button>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr align="center">
                                <td width="20%" class="no__task" colspan="5">暂无任务</td>
                            </tr>
                        </template>

                    </tbody>
                </table>
            </el-scrollbar>
            <el-pagination @size-change="handleChange($event, 'limit')" @current-change="handleChange($event, 'page')"
                :current-page="pageQuery.page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageQuery.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </main>
        <!-- 查看弹窗 -->
        <taskHistory ref="taskHistory" :row="row"></taskHistory>
    </div>
</template>

<script>
import { findTasks, deleteTask, taskDone, remindTasks  } from "@/api/admin/index.js";
import taskHistory from "./components/taskHistory.vue";
import { mapGetters } from "vuex";
import { getByTitle } from "@/api/config";
export default {
    name: 'taskManager',
    components: {
        taskHistory
    },
    data() {
        return {
            listQuery: {
                chinaname: '',
                status: ''
            },
            tableData: [],
            loading: false,
            pageQuery: {
                page: 1,
                limit: 10
            },
            total: null,
            row: {},
            qqMap: []
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        userName() {
            return this.userInfo.chinaname || sessionStorage.getItem('chinaname') || '未知超管';
        },
        userId() {
            return this.userInfo?.id || sessionStorage.getItem('id');
        }
    },
    created() {
        getByTitle('qqMap').then(res => {
            this.qqMap = res.data;
        })
        this.initTask();
    },
    methods: {
        async handleNotice(item) {
            // const qqNum = this.qqMap.find(el => el.userId === item.userId)?.qq;
            // if (!qqNum) return this.$message.error('该用户的qq没有绑定到全局参数<qqMap里>，请检查！');
            const loading = this.$loading({
                lock: true,
                text: "正在刷新数据中......",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.8)",
            });
            try {
                // const message = `<ASG机器人通知>尊敬的${item.chinaname}，请检查您的任务:"${item.taskName}" 是否完成，若完成，请上后台点击完成！`
                const { status } = await remindTasks(item.id);
                if (status !== 200) throw new Error('服务端异常！');
                this.$message.success('发送成功！');
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                loading.close();
            }

        },
        viewTask(item) {
            this.row = item;
            this.$refs.taskHistory.openDialog();
        },
        handleChange(value, prop) {
            this.pageQuery = {
                ...this.pageQuery,
                [prop]: value
            }
            this.initTask();
        },
        async deleteTaskItem(id, createUserId) {
            try {
                if (Number(this.userId) !== Number(createUserId)) {
                    return this.$message.error('您不能删除其他超管创建的任务');
                }
                const userChoose = await this.$confirm(`您是否确定删除该任务？, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (userChoose === 'confirm') {
                    await deleteTask(id);
                    this.$message.success('删除成功！');
                    this.initTask();
                }
            } catch (error) {
                if (typeof error === 'string' && error === 'cancel') return;
            }
        },
        async handleTaskDone(text, item, status) {
            try {
                const userChoose = await this.$confirm(`您是否确定${text}该任务？, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (userChoose === 'confirm') {
                    const requestData = {
                        taskid: item.id,
                        status,
                        approvalPerson: this.userName
                    }
                    await taskDone(requestData);
                    this.initTask();
                    this.$message.success('操作成功！');
                }
            } catch (error) {
                if (typeof error === 'string' && error === 'cancel') return;
                console.log(error,'error');
            }
        },
        async initTask(type) {
            try {
                if (!!type && type === 'reset') {
                    this.listQuery = {
                        chinaname: '',
                        status: ''
                    };
                }
                if (!!type && type === 'check') {
                    this.pageQuery = {
                        page: 1,
                        limit: 10
                    };
                }
                this.loading = true;
                const requestBody = {
                    ...this.listQuery,
                    ...this.pageQuery
                }
                const { data, status, message } = await findTasks(requestBody);
                if (status !== 200) throw new Error(message);
                if (data.code === 401) throw new Error(data.message);
                this.tableData = data.rows;
                this.total = data.total;
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                this.loading = false;
            }
        },
    }
}
</script>
<style lang='less' scoped>
@borderColor: #e9e9e8;
@bgColor: #f2f6fd;
@hoverBgColor: #e7f0ff;
@ContainerBgColor: #f2f2f2;

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;

    padding: 12px 16px;
    border-radius: 3px;

    .search__container {
        display: grid;
        grid-template-columns: 100px auto 100px auto;
        align-items: center;

        .label {
            font-size: 0.9rem;
            font-weight: bold;
            color: #303030;
        }
    }
}

main {
    padding: 16px;
    border-radius: 5px;
    margin-top: 16px;

    table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid @borderColor;

        thead {
            background: @bgColor;
            height: 50px;

            th {
                border: 1px solid @borderColor;
            }
        }

        tbody {
            tr {
                height: 50px;
                background-color: #fff;

                &:hover {
                    background: @bgColor;
                }

                td {
                    padding: 6px 12px;
                    border: 1px solid @borderColor;
                    cursor: pointer;

                    .ellipse {
                        width: inherit;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }

                    .multi__line {
                        display: -webkit-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }

        .no__task {
            font-size: 0.8rem;
            color: #717171;
            background: #fff;

            &:hover {
                background: @hoverBgColor;
            }
        }
    }
}
</style>