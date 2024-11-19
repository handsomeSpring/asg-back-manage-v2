<template>
    <tableList :tableData="tableData"></tableList>
</template>

<script>
import tableList from './tableList.vue';
export default {
    name: 'AsgVerifyPage',
    components: {
        tableList
    },
    data() {
        return {
            tableData: [
                {
                    flowName: '解说审核',
                    hasWf: '1',
                    personList: 'ASG用户、管理员',
                    process: [
                        {
                            nodeName: '发起申请',
                            nodeType: '1'
                        },
                        {
                            nodeName: '柴瞳审批',
                            nodeType: '2',
                            path:'/authorization/exchange',
                        },
                        {
                            nodeName: '公布审批结论',
                            nodeType: '5'
                        }
                    ],
                    authPerson:'解说管理员'
                },
                {
                    flowName: '任务审批',
                    hasWf: '1',
                    personList: 'ASG用户、超级管理员',
                    process: [
                        {
                            nodeName: '超管下发任务',
                            nodeType: '3',
                            path:'/publish/taskGiving'
                        },
                        {
                            nodeName: '用户完成任务',
                            nodeType: '1'
                        },
                        {
                            nodeName: '超管审批',
                            nodeType: '2',
                            path:'/authorization/task'
                        },
                        {
                            nodeName: '审批至通过',
                            nodeType: '4'
                        },
                        {
                            nodeName: '增加积分',
                            nodeType: '5'
                        }
                    ],
                    authPerson:'超级管理员'
                },
                {
                    flowName: '商品核销',
                    hasWf: '1',
                    personList: '所有用户',
                    process: [
                        {
                            nodeName: '用户购买商品',
                            nodeType: '1',
                        },
                        {
                            nodeName: '管理员核销',
                            nodeType: '2',
                            path:'/authorization/storeVerify'
                        },
                        {
                            nodeName: '增加积分',
                            nodeType: '5'
                        }
                    ],
                    authPerson:'任何管理员'
                },
                {
                    flowName: '预算录入',
                    hasWf: '1',
                    personList: '所有管理员',
                    process: [
                        {
                            nodeName: '获取预算',
                            nodeType: '2',
                        },
                        {
                            nodeName: '预算录入',
                            nodeType: '3',
                            path:'/authorization/budget'
                        },
                        {
                            nodeName: '使用预算',
                            nodeType: '3'
                        },
                        {
                            nodeName: '预算备案',
                            nodeType: '5'
                        }
                    ],
                    authPerson:'任何管理员'
                },
                {
                    flowName: '业务流程审核',
                    hasWf: '1',
                    personList: '所有管理员',
                    process: [
                        {
                            nodeName: '配置审批流程',
                            nodeType: '3', 
                            path:'/system/ruleConfig', 
                        },
                        {
                            nodeName: '关联/直接发起业务流程',
                            nodeType: '2',
                            path:'/publish/refereeemploy'
                        },
                        {
                            nodeName: '流程审批',
                            nodeType: '4',
                            path:'/publish/refereeemploy'
                        },
                        {
                            nodeName: '归档',
                            nodeType: '5'
                        }
                    ],
                    authPerson:'任何管理员'
                }
            ]
        };
    },
    created(){
        Object.freeze(this.tableData)
    }
}
</script>