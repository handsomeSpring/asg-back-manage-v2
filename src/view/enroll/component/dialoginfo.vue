<template>
    <el-dialog :visible="visible" title="战队成员详情" width="60%" @close="handleClose">
        <el-table :data="tableList" border>
            <el-table-column label="序号" width="60px" type="index" align="center"></el-table-column>
            <el-table-column label="选手姓名" prop="name" align="center"></el-table-column>
            <el-table-column label="常用角色" prop="commonRoles" align="center"></el-table-column>
            <el-table-column label="历史段位" prop="rank" align="center"></el-table-column>
            <el-table-column label="阵营" prop="rank" align="center">
                <template #default="{row}">
                    <el-tag size="small" :type="row.isSur ? 'primary' : 'danger'">{{ row.isSur ? '求生者' : '监管者' }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
    name: 'dialog-info',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        tableList: {
            type: Array,
            default: () => []
        }
    },
    methods: {

    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val);
            }
        }
    },
    methods:{
        handleClose(){
            this.visible = false;
        }
    }
}
</script>
<style lang='less' scoped></style>