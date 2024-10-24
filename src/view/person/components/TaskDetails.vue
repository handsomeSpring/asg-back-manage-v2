<template>
    <table>
        <thead>
            <th width="20%">任务标题</th>
            <th width="60%">任务描述</th>
            <th width="10%">任务积分</th>
            <th width="10%">完成状态</th>
        </thead>
        <tbody>
            <template v-if="taskList.length > 0">
                <tr v-for="(item, index) in taskList" :key="index">
                    <td width="200">
                        <el-tooltip class="item" effect="dark" :content="item.taskName" placement="top-start">
                            <p class="ellipse">{{ item.taskName }}</p>
                        </el-tooltip>
                    </td>
                    <td width="auto">
                       <p class="multi__line" @click="upfoldItem">
                        {{ item.taskDescription }}
                       </p> 
                    </td>
                    <td align="center" width="100">{{ item.money }}</td>
                    <td align="center" width="100">
                        <el-tag size="small" :type="computedType(item.status)">
                            {{ item.status | filterStatus}}
                        </el-tag>
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr align="center">
                    <td width="20%" class="no__task" colspan="4">暂无任务</td>
                </tr>
            </template>

        </tbody>
    </table>
</template>

<script>
import { getTask } from "@/api/admin/index.js";
export default {
    name: 'TaskDetails',
    props: {
        user: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            taskList: []
        };
    },
    filters:{
        filterStatus(val){
            if(val === '0'){
                return '进行中'
            }else if(val === '1'){
                return '待审核'
            }else if(val === '2'){
                return '已完成'
            }else if(val === '3'){
                return '未通过'
            }
        }
    },
    watch:{
        'user.id':{
            handler(newVal){
                this.initTask(newVal)
            }
        }
    },
    created(){
        this.initTask(this.user.id);
    },
    methods: {
        computedType(status){
            if(status === '0'){
                return 'info'
            }else if(status === '1'){
                return 'warning'
            }else if(status === '2'){
                return 'success'
            }else if(status === '3'){
                return 'danger'
            }
        },
        async initTask(id) {
            try {
                const { data, status, message } = await getTask(id);
                if (status !== 200) throw new Error(message);
                this.taskList = data;
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        upfoldItem($event){
          const dom = $event.target;
          console.log(dom,'dom');
          if(dom.classList.contains('multi__line')){
            dom.classList.remove('multi__line');
          }else{
            dom.classList.add('multi__line');
          }
        }
    }
}
</script>
<style lang='less' scoped>
@borderColor: #e9e9e8;
@bgColor: #f2f6fd;

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

            td {
                padding: 6px;
                border: 1px solid @borderColor;
                cursor: pointer;
                .ellipse {
                    width: inherit;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .multi__line{
                    display: -webkit-box;
                    overflow:hidden;
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
    }
}
</style>