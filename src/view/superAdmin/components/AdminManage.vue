<template>
    <el-scrollbar style="height: 70vh;">
        <table class="admin__table" style="margin-bottom: 20px;">
            <thead>
                <th width="15%">头像</th>
                <th width="70%">基本信息</th>
                <th width="15%">职位</th>
            </thead>
        </table>
        <table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)" class="admin__table">
            <template v-for="(item, index) in tableData">
                <tr :key="index + Math.random()">
                    <td colspan="3">
                        <div class="title__info">
                            <p>{{ item.chinaname || '无名氏' }}</p>
                            <p class="cancel__tbn" @click="handleCancelAdmin(item)">
                                取消管理员</p>
                        </div>
                    </td>
                </tr>
                <tr :key="index + Math.random()">
                    <td class="one__td" width="15%">
                        <div
                            style="width: calc(100% - 14px);padding:7px;display: flex;justify-content: center;align-items: center;">
                            <img v-if="!item.base64" src="@/assets/logo.png">
                            <img v-else :src="item.base64">
                        </div>
                    </td>
                    <td class="two__td" width="70%">
                        <div class="main__table">
                            <el-row>
                                <el-col :span="8">
                                    <p>用户名：{{ item.name }}</p>
                                </el-col>
                                <el-col :span="8">
                                    <p>邮箱地址：{{ item.email || '-' }}</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <p>用户id：{{ item.id }}</p>
                                </el-col>
                            </el-row>
                        </div>
                    </td>
                    <td align="center" width="15%">
                        <span style="color:#4090EF">{{ item.officium | filterRole }}</span>
                    </td>
                </tr>
            </template>
        </table>
    </el-scrollbar>
</template>

<script>
import { rolealluser, removeAdmin } from '@/api/admin/index.js';
export default {
    name: 'AdminManage',
    data() {
        return {
            tableData: [],
            loading: false
        };
    },
    methods: {
        async initPerson(refresh = false) {
            try {
                if (!refresh) {
                    this.loading = true;
                }
                const { data, status } = await rolealluser('admin');
                if (status !== 200) throw new Error('获取列表失败！');
                this.tableData = data?.data ?? [];
                refresh && this.$message.success('操作成功！');
            } catch (error) {
                this.$message.error(error instanceof Error ? error.message : '未知错误');
            } finally {
                this.$nextTick(() => {
                    this.loading = false;
                })
            }
        },
        async handleCancelAdmin(item) {
            try {
                const flag = await this.$confirm(`您确定取消${item.chinaname}的管理员吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (flag === 'confirm') {
                    this.loading = true;
                    const { status } = await removeAdmin(item.id);
                    if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
                    this.initPerson(true);
                }
            } catch (error) {
                if (typeof error === 'string' && error === 'cancel') return;
                this.$message.error(error instanceof Error ? error.message : '未知错误');
            }
        }
    },
    created() {
        this.initPerson();
    },
}
</script>
<style lang='less' scoped>
.admin__table {
    width: 100%;
    border: 1px solid #d2d2d2;
    border-collapse: collapse;

    th {
        padding: 10px;
        background-color: #e6e6e6;
    }
}

tr {
    border: 1px solid #e6e6e6;
}

.title__info {
    padding: 10px;
    font-weight: bold;
    color: #4090EF;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .cancel__tbn {
        color: #f40;
        cursor: pointer;

        &:hover {
            color: rgb(241, 129, 88)
        }
    }
}

.one__td,
.two__td {
    border-right: 2px solid #d7d7d7;
}

.one__td div img {
    width: 80%;
    object-fit:contain;
}

.main__table {
    padding: 12px;
}
</style>