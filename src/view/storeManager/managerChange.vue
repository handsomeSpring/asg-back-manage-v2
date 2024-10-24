<template>
    <div>
        <header>
            <p>商品是否核销</p>
            <el-select size="small" v-model="showVerification">
                <el-option label="全部" :value="true"></el-option>
                <el-option label="待核销" :value="false"></el-option>
            </el-select>
            <p>购买者</p>
            <el-select size="small" v-model="searchId">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, index) in comList" :key="index" :value="item.id"
                    :label="item.chinaname"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="initChangeList">查询</el-button>
        </header>
        <el-scrollbar :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle="" :noresize="false"
            tag="section" style="height: calc(80vh - 46px); margin-bottom: 10px">
            <el-table v-loading="loading" style="width:100%" :data="tableData" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
                <el-table-column label="序号" type="index" width="80px"></el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column align="center">
                    <template #header>
                        购买者信息<span style="color:#f40"><i class="el-icon-warning-outline"></i>点击详情显示用户信息</span>
                    </template>
                    <template #default="{ row }">
                        <el-popover placement="top" width="150" trigger="click" @show="checkUserName(row)">
                            <div v-loading="popLoading" style="width:200px">
                                <li class="user-info">
                                    <el-tag size="small" type="primary">姓名</el-tag>{{ userInfo.chinaname }}
                                </li>
                                <li class="user-info">
                                    <el-tag size="small" type="primary">用户</el-tag>{{ userInfo.userName }}
                                </li>
                                <li class="user-info">
                                    <el-tag size="small" type="primary">积分</el-tag>{{ userInfo.integral || 0 }}
                                </li>
                            </div>
                            <span class="info" slot="reference">购买者详情信息</span>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="是否核销" align="center">
                    <template #default="{ row }">
                        <div style="display: flex;align-items: center;justify-content: center;">
                            <p class="my-task-success margin-icon" v-if="row.isVerification">
                                <i class="el-icon-success"></i>已核销
                            </p>
                            <p class="my-task-auth margin-icon" v-else>
                                <i class="el-icon-warning"></i>待核销
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button v-if="!row.isVerification" type="text" @click="verify(row)">核销</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <el-pagination style="float:right" @size-change="handleChange($event, 'pagesize')"
            @current-change="handleChange($event, 'pageindex')" :current-page="listQuery.pageindex"
            :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import { getStoreInfo, verification } from "@/api/storeManager/index";
import { getUserName } from "@/api/admin/index.js";
import { getUserRoles } from "@/api/schedule/index";
export default {
    name: "managerChange",
    data() {
        return {
            listQuery: {
                pageindex: 1,
                pagesize: 10
            },
            showVerification: true,
            searchId: '',
            tableData: [],
            loading: false,
            popLoading: false,
            total: 0,
            userInfo: {},
            comList: []
        };
    },
    created() {
        this.initChangeList();
    },
    methods: {
        handleChange(value, prop) {
            this.listQuery = {
                ...this.listQuery,
                [prop]: value
            }
        },
        async initChangeList() {
            this.loading = true;
            try {
                const roleResult = await getUserRoles({ opname: "Commentator" });
                this.comList = roleResult.data;
                const postParams = {
                    ...this.listQuery,
                    pageindex: this.listQuery.pageindex - 1,
                    showVerification: this.showVerification,
                    ...(this.searchId ? { search_id: this.searchId } : {})
                }
                const { data } = await getStoreInfo(postParams);
                if (Array.isArray(data) && data.length === 0) {
                    this.tableData = data;
                    return;
                }
                this.tableData = data.msg;
                this.total = data.cout;
            } catch (error) {
                if (error.response.data.code === 400) {
                    return this.$message.error(error.response.data.message);
                }
                this.$message.error('服务端异常');
                // console.log(error);
            } finally {
                this.loading = false;
            }
        },
        async verify(row) {
            try {
                const result = await this.$confirm('您确定核销该商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (result === 'confirm') {
                    const { status, message } = await verification(row.id);
                    if (status !== 200) throw new Error(message);
                    this.$message.success('核销成功！');
                    this.initChangeList();
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 查看用户
        async checkUserName(item) {
            try {
                this.popLoading = true;
                const { data } = await getUserName(item.buyerid);
                this.userInfo = data;
            } catch (error) {
                this.$message.error('服务端异常');
            } finally {
                this.popLoading = false;
            }
        }
    },
}
</script>
<style lang='less' scoped>
header {
    margin: 12px 0;
    display: flex;
    align-items: center;
    gap: 24px;
}

.info {
    font-size: 0.9em;
    font-weight: 600;
    color: #615ef5;
    text-decoration: underline;
    cursor: pointer;
}

.user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 12px 0;
    gap: 20px;
    width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>