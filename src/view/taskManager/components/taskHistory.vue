<template>
    <div>
      <el-dialog :fullscreen="isMobile" v-if="isDialog" :visible.sync="dialogVisible" title="查看任务流程" width="40%" append-to-body>
        <el-steps direction="vertical">
            <el-step title="新建任务" icon="el-icon-s-order" status="process">
                <template #description>
                    <el-card class="box-card">
                        <h4>{{ row.taskName }}</h4>
                        <el-divider></el-divider>
                        <p>{{ row.taskDescription }}</p>
                        <footer>
                            <p><i class="el-icon-s-custom"></i>{{ row.createPerson }}</p>
                            <p><i class="el-icon-time"></i>{{ row.createTime }}</p>
                        </footer>
                    </el-card>
                </template>
            </el-step>
            <el-step title="执行情况" :status="computedComplete">
                <template #description>
                    <el-card class="box-card">
                        <footer>
                            <p><i class="el-icon-user-solid"></i>{{ row.chinaname }}</p>
                            <p>
                                <i :class="['1','2'].includes(row.status) ? 'el-icon-finished' : 'el-icon-time'"></i>
                                {{ row.status | filterCompleteText }}
                            </p>
                        </footer>
                    </el-card>
                </template>
            </el-step>
            <el-step title="审批结论" :status="computedStatus">
                <template #description>
                    <el-card class="box-card">
                        <p style="font-size: 16px;" :style="{color:computedColor(row.status)}">{{ row.status | filterStatus }}</p>
                        <footer>
                            <p v-if="['2','3'].includes(row.status)"><i class="el-icon-s-custom"></i>{{ row.approvalPerson }}</p>
                            <p v-else-if="row.status === '0'">待<i class="el-icon-user-solid"></i>{{ row.chinaname }}完成</p>
                            <p v-else><i class="el-icon-user-solid"></i>{{ row.chinaname }}完成</p>
                            <p v-show="row.status !== '0'"><i class="el-icon-time"></i>{{ row.lastOperateTime }}</p>
                        </footer>
                    </el-card>
                </template>
            </el-step>
        </el-steps>
      </el-dialog>
      <div v-else>
        <el-steps direction="vertical">
            <el-step title="新建任务" icon="el-icon-s-order" status="process">
                <template #description>
                    <el-card class="box-card">
                        <p style="font-size: 13px;color:#979797">超级管理建立任务</p>
                        <footer style="font-size: 13px;">
                            <p><i class="el-icon-s-custom"></i>{{ row.createPerson }}</p>
                            <p><i class="el-icon-time"></i>{{ row.createTime }}</p>
                        </footer>
                    </el-card>
                </template>
            </el-step>
            <el-step title="执行情况" :status="computedComplete">
                <template #description>
                    <el-card class="box-card">
                        <footer style="font-size: 13px;">
                            <p><i class="el-icon-user-solid"></i>{{ row.chinaname }}</p>
                            <p>
                                <i :class="['1','2'].includes(row.status) ? 'el-icon-finished' : 'el-icon-time'">
                                </i>{{ row.status | filterCompleteText }}</p>
                        </footer>
                    </el-card>
                </template>
            </el-step>
            <el-step title="任务执行进度" :status="computedStatus">
                <template #description>
                    <el-card class="box-card">
                        <p style="font-size: 13px;" :style="{color:computedColor(row.status)}">{{ row.status | filterStatus }}</p>
                        <footer style="font-size: 13px;">
                            <p v-if="['2','3'].includes(row.status)"><i class="el-icon-s-custom"></i>{{ row.approvalPerson }}</p>
                            <p v-else-if="row.status === '0'">待<i class="el-icon-user-solid"></i>{{ row.chinaname }}完成</p>
                            <p v-else><i class="el-icon-user-solid"></i>{{ row.chinaname }}完成</p>
                            <p v-show="row.status !== '0'"><i class="el-icon-time"></i>{{ row.lastOperateTime }}</p>
                        </footer>
                    </el-card>
                </template>
            </el-step>
        </el-steps>
      </div>
    </div>
</template>

<script>
export default {
    name: 'taskHistory',
    data() {
        return {
            dialogVisible: false
        };
    },
    props: {
        row: {
            type: Object,
            default: () => { }
        },
        isDialog:{
            type:Boolean,
            default:true
        },
        isMobile:{
            type:Boolean,
            default:false,
        }
    },
    filters:{
        filterStatus(val){
            const mapStatus = {
                '0':'进行中',
                '1':'待超级管理员审核',
                '2':'审核通过',
                '3':'审核不通过-驳回'
            }
            return mapStatus[val];
        },
        filterCompleteText(val){
            const mapStatus = {
                '0':'进行中',
                '1':'任务完成',
                '2':'任务完成',
                '3':'待重新完成'
            }
            return mapStatus[val]
        }
    },
    computed: {
        computedStatus() {
            const statusMap = {
                '0': 'wait',
                '1': 'process',
                '2': 'success',
                '3': 'error'
            }
            return statusMap[this.row.status];
        },
        computedComplete(){
           const completeMap = {
                '0':'process',
                '1':'success',
                '2':'success',
                '3':'process'
           }
           return completeMap[this.row.status]
        },
    },
    methods: {
        computedColor(status){
             const colorMap = {
                '0':'#979797',
                '1':'#ebb563',
                '2':'#67C23A',
                '3':'#f40'
             };
             return colorMap[status];
        },
        openDialog() {
            this.dialogVisible = true;
        }
    },
}
</script>
<style lang='less' scoped>
.box-card {
    width:100%;
    margin:12px 0;
    footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 12px 0;
        color: #4090EF;
        cursor: pointer;
        font-size: 16px;
    }
}
/deep/.el-step__description{
    padding-right:0 !important;
}
</style>