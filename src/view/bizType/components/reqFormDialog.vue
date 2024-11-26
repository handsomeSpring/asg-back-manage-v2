<template>
    <div>
        <el-dialog v-if="isDialog" append-to-body title="申请表单" :visible.sync="dialogVisible" width="50%"
            @close="handleClose">
            <el-descriptions class="margin-top" :column="3" size="small" border>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="startPerson" width="18px" height="18px"></svg-icon>
                            <p>申请人</p>
                        </div>
                    </template>
                    {{ form.chinaname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="qq" width="18px" height="18px"></svg-icon>
                            <p>联系方式</p>
                        </div>
                    </template>
                    {{ form.contact_number }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="clock" width="18px" height="18px"></svg-icon>
                            <p>申请时间</p>
                        </div>
                    </template>
                    {{ form.create_time }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="gameAccount" width="18px" height="18px"></svg-icon>
                            <p>游戏账号</p>
                        </div>
                    </template>
                    {{ form.game_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="rank" width="18px" height="18px"></svg-icon>
                            <p>历史段位</p>
                        </div>
                    </template>
                    {{ computedRanks(form.history_rank) }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="sex" width="18px" height="18px"></svg-icon>
                            <p>性别</p>
                        </div>
                    </template>
                    {{ form.sex === 1 ? '男' : '女' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="reqRole" width="18px" height="18px"></svg-icon>
                            <p>申请职位</p>
                        </div>
                    </template>
                    {{ computedRole(form.req_role) }}
                </el-descriptions-item>
                <el-descriptions-item :span="2">
                    <template slot="label">
                        <div class="des_label">
                            <svg-icon iconClass="introductionSelf" width="18px" height="18px"></svg-icon>
                            <p>自我介绍</p>
                        </div>
                    </template>
                    {{ form.introduction }}
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
        <el-descriptions v-else class="margin-top" :column="3" size="small" border>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="startPerson" width="18px" height="18px"></svg-icon>
                        <p>申请人</p>
                    </div>
                </template>
                {{ form.chinaname }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="qq" width="18px" height="18px"></svg-icon>
                        <p>联系方式</p>
                    </div>
                </template>
                {{ form.contact_number }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="clock" width="18px" height="18px"></svg-icon>
                        <p>申请时间</p>
                    </div>
                </template>
                {{ form.create_time }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="gameAccount" width="18px" height="18px"></svg-icon>
                        <p>游戏账号</p>
                    </div>
                </template>
                {{ form.game_id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="rank" width="18px" height="18px"></svg-icon>
                        <p>历史段位</p>
                    </div>
                </template>
                {{ computedRanks(form.history_rank) }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="sex" width="18px" height="18px"></svg-icon>
                        <p>性别</p>
                    </div>
                </template>
                {{ form.sex === 1 ? '男' : '女' }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="reqRole" width="18px" height="18px"></svg-icon>
                        <p>申请职位</p>
                    </div>
                </template>
                {{ computedRole(form.req_role) }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
                <template slot="label">
                    <div class="des_label">
                        <svg-icon iconClass="introductionSelf" width="18px" height="18px"></svg-icon>
                        <p>自我介绍</p>
                    </div>
                </template>
                {{ form.introduction }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
import { getByTitle } from '@/api/config';

export default {
    name: 'reqFormDialog',
    props: {
        form: {
            type: Object,
            default: () => { }
        },
        isDialog:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            dialogVisible: false,
            roleOptions: [],
            rankOptions: []
        };
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false
        },
        computedRanks(rank) {
            return this.rankOptions.find(item => item.value == rank)?.label ?? '未知段位';
        },
        computedRole(role) {
            return this.roleOptions.find(item => item.value == role)?.label ?? '未知职位';
        }
    },
    created() {
        getByTitle('roleList').then(res => {
            this.roleOptions = res.data;
        });
        getByTitle('historyRank').then(res => {
            this.rankOptions = res.data;
        })
    },
}
</script>
<style lang='less' scoped>
.des_label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;

    p {
        font-size: 14px;
        font-weight: 500;
        font-family: 'hk';
    }
}
</style>