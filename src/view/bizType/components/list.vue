<template>
    <div>
        <div class="wrap-flex">
            <div class="flex__content--between">
                <el-button type="primary" size="small">发起业务审核</el-button>
                <div class="operation" @click="foldIcon = !foldIcon;">
                    <p>更多操作</p>
                    <i ref="foldIcon" :style="{ transform: foldIcon ? 'rotate(90deg)' : 'rotate(0deg)' }"
                        class="el-icon-arrow-right foldIcon"></i>
                </div>
            </div>
            <transition name="mybox">
                <div v-show="foldIcon" class="operation_list">
                    <div class="grid__container">
                        <div>
                            <el-input v-model="listQuery.projName" size="small" clearable placeholder="请输入项目名称检索"></el-input>
                        </div>
                        <div class="button--right">
                            <el-button size="small" type="primary" @click="handlePageOneSearch">查询</el-button>
                            <el-button plain size="small" @click="handleResetSearch">重置</el-button>
                        </div>
                    </div>
                    <el-divider>操作</el-divider>
                    <div class="operation__button">
                    
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'bizType-list',
    data() {
        return {
            listQuery: {},
            foldIcon: false
        };
    },
    methods: {

    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.wrap-flex {
    .flex__content--between {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .high-light {
            color: #f40;
            font-size: 14px;
            font-weight: 500;
        }

        .operation {
            display: flex;
            align-items: center;
            font-weight: 500;
            border: 1px solid #e7e7e7;
            cursor: pointer;
            font-size: 13px;
            padding: 6px 10px;
            border-radius: 4px;
            gap: 4px;

            &:hover {
                color: #4090ef;
                border-color: #4090ef;
            }
        }
    }

    .operation_list {
        transition: 0.4s;
        padding: 24px;
        overflow: hidden;
        overflow: visible;
        border: 1px solid #d2d2d2;
        border-top: 2px solid #f5f5f5;
        box-shadow: 1px 5px 5px #eee;
        box-sizing: border-box;
        margin-bottom: 12px;

        .operation__button {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 24px;
        }

        .grid__container {
            display: grid;
            grid-template-columns: 20% auto;
            gap: 12px;

            .button--right {
                text-align: right;
            }
        }
    }
}
</style>