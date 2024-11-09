<template>
    <div>
        <AsgHighSearch showOperation>
            <template #top>
                <el-button type="primary" size="small" @click="handleToDetail('add')">发起业务审核</el-button>
            </template>
            <template #search>
                <el-input v-model="listQuery.projName" size="small" placeholder="输入项目名称检索"></el-input>
                <el-input v-model="listQuery.projNo" size="small" placeholder="输入项目编号检索"></el-input>
                <el-input v-model="listQuery.startPerson" size="small" placeholder="输入发起人检索"></el-input>
            </template>
            <template #btnList>
                <el-button size="small" type="primary">查询</el-button>
                <el-button plain size="small">重置</el-button>
            </template>
            <template #operation>
                <p>预览预算</p>
            </template>
        </AsgHighSearch>
        <el-table :data="tableData" border>
            <el-table-column label="序号" type="index" align="center" width="60px"></el-table-column>
            <el-table-column label="项目名称" prop="projName" align="center" min-width="120px"></el-table-column>
            <el-table-column label="项目编号" prop="projNo" align="center"></el-table-column>
            <el-table-column label="是否使用预算" align="center">
                <template #default="{ row }">
                    {{ row.budgetUse === '1' ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column label="预算名称" align="center">
                <template #default="{ row }">
                    {{ row.budgetName ? row.budgetName : '/' }}
                </template>
            </el-table-column>
            <el-table-column label="预算金额" align="center">
                <template #default="{ row }">
                    {{ row.budgetMoney ? row.budgetMoney : '/' }}
                </template>
            </el-table-column>
            <el-table-column prop="startPerson" label="发起人" align="center">
            </el-table-column>
            <el-table-column label="当前节点" prop="nowAuthPerson" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="text" @click="handleToDetail('auth', row)">审核</el-button>
                    <el-button type="text">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import AsgHighSearch from '@/components/AsgHighSearch.vue';
export default {
    name: 'bizType-list',
    components: {
        AsgHighSearch
    },
    data() {
        return {
            listQuery: {},
            tableData: [
                {
                    projName: '支出第六届众创赛付出人员',
                    projNo: 'admin20241109',
                    budgetUse: '1',
                    budgetName: '第六届ASG众创赛预算',
                    bizType: 'anchorAuth',
                    budgetId: 142,
                    startTime: '2024-11-09',
                    budgetMoney: 100,
                    startPerson: '落梨',
                    startPersonId:427,
                    nowAuthPerson: '浊泉',
                    description: '测试',
                    reason: '我太想进步了',
                    supplementaryInfo: '[{"userId":412,"authPerson":"星宇","opinion":"不同意","time":"2024-11-09 22:00:00"},{"userId":429,"authPerson":"浊泉","opinion":"不同意","time":"2024-11-09 22:00:00","reviseOpinion":"这个人不行","otherOpinion":"测试"}]',
                    status: '1', // '0'发起 '1' 是进行中 , '2' 退回，'3'是接档
                },
                {
                    projName: '秋梨膏解说申请',
                    projNo: 'commen20241109',
                    budgetMoney:231,
                    budgetUse: '1',
                    budgetName: '第六届ASG众创赛预算',
                    bizType: 'anchorAuth',
                    startTime: '2024-11-09',
                    budgetId: 142,
                    startPersonId:427,
                    startPerson: '柴瞳',
                    nowAuthPerson: '星宇',
                    nowAuthPersonId:428,
                    description: '测试',
                    reason: '我太想进步了',
                    supplementaryInfo: '[{"userId":429,"opinion":"不同意","time":"2024-11-09 22:00:00","authPerson":"浊泉"}]',
                    status: '1',
                },
                {
                    projName: '秋梨膏解说申请',
                    projNo: 'commen20241109',
                    budgetMoney:231,
                    budgetUse: '1',
                    budgetName: '偿还第四届ASG高校预算',
                    bizType: 'anchorAuth',
                    startTime: '2024-11-09',
                    budgetId: 251,
                    budgetMoney: 0,
                    startPersonId:429,
                    startPerson: '浊泉',
                    nowAuthPerson: '浊泉',
                    nowAuthPersonId:429,
                    description: '测试',
                    reason: '我太想进步了',
                    supplementaryInfo: '[{"userId":429,"opinion":"不同意","time":"2024-11-09 22:00:00","authPerson":"浊泉"}]',
                    status: '0',
                },
                {
                    projName: '退回到浊泉手上例子',
                    projNo: 'commen20241109',
                    budgetMoney:231,
                    budgetUse: '1',
                    budgetName: '第六届ASG众创赛预算',
                    bizType: 'anchorAuth',
                    startTime: '2024-11-09',
                    budgetId: 142,
                    startPersonId:229,
                    startPerson: '晓月',
                    nowAuthPerson: '浊泉',
                    nowAuthPersonId:429,
                    description: '测试123123',
                    reason: '测试121',
                    supplementaryInfo: '[{"userId":429,"opinion":"同意","time":"2024-11-09 22:00:00","authPerson":"浊泉"},{"userId":429,"opinion":"不同意","time":"2024-11-09 22:00:00","authPerson":"柴瞳"}]',
                    status: '2',
                },
                {
                    projName: '念夏发起的裁判申请',
                    projNo: 'commen20241109',
                    budgetUse: '0',
                    budgetName: '',
                    bizType: 'judgeAuth',
                    startTime: '2024-11-09',
                    budgetId: 142,
                    budgetMoney: 0,
                    startPersonId:229,
                    startPerson: '念夏',
                    nowAuthPerson: '浊泉',
                    nowAuthPersonId:429,
                    description: '测试',
                    reason: '我太想进步了',
                    supplementaryInfo: '[]',
                    status: '1',
                },
            ]
        };
    },
    methods: {
        handleToDetail(type, row = {}) {
            this.$emit('toDeTail', type, row);
        },
    },
}
</script>
<style lang='less' scoped></style>