<template>
    <table>
        <template v-for="(item,index) in tableData">
            <thead :key="index">
                <th colspan="3">
                    <div class="flex__table__header">
                        <p>流程名称：{{ item.flowName }}</p>
                        <p>是否有审批过程：
                            <span :style="{color:item.hasWf ? '#20da7d' : '#f40'}">{{ item.hasWf === '1' ? '是' : '否' }}</span>
                        </p>
                    </div>
                </th>
            </thead>
            <tbody :key="index">
                <tr>
                    <td class="has__border" width="20%">
                        <p class="custom__label" style="--text:'人员类型'"></p>
                        <p class="normal__gray">{{ item.personList }}</p>
                    </td>
                    <td class="has__border" width="70%">
                        <template v-for="(el, i) in item.process">
                        <div class="tag__common" :style="{'border-left-color':!!el.path ? '#fb0' : '#4090EF'}" :key="i" @click="routerTo(el.path)">
                            <span class="span__title">
                                {{ el.nodeName }}
                                <i v-if="el.nodeType === '1'" style="color:#97979F" class="el-icon-user-solid"></i>
                                <i v-if="el.nodeType === '2'" style="color:#4090EF" class="el-icon-s-custom"></i>
                                <i v-if="el.nodeType === '3'" style="color:#fb0" class="el-icon-caret-right"></i>
                                <i v-if="el.nodeType === '4'" style="color:#20da7d" class="el-icon-refresh"></i>
                                <i v-if="el.nodeType === '5'" style="color:#f40" class="el-icon-folder-checked"></i>
                            </span>
                        </div>
                        <i v-if="i !== item.process.length - 1" class="el-icon-d-arrow-right margin--list" :key="i"></i>
                    </template>
                    </td>
                    <td style="text-align: center;" width="10%">
                        <el-button type="text">{{ item.authPerson }}</el-button>
                    </td>
                </tr>
            </tbody>
        </template>
    </table>
</template>

<script>
export default {
    name: 'tableList',
    props: {
        tableData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {

        };
    },
    methods: {
        routerTo(path){
            if(!path) return;
            this.$router.push({path});
        }
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
table {
    width: 100%;
    border: 1px solid #e7e7e7;
    border-collapse: collapse;
    font-size: 0.9rem;
}

th {
    border: 1px solid #e7e7e7;
    line-height: 20px;
    padding: 10px;
    text-align: left;
    background: rgb(249, 250, 252);
    color: #303030;
    font-weight: normal;
}

td {
    padding: 10px;
}

.flex__table__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.has__border {
    border-right: 2px solid #e7e7e7;
}

.custom__label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
    font-weight: 600;
    &::before {
        content: '';
        background: #4090EF;
        height: 0.85rem;
        width: 3px;
        margin-right: 6px;
    }

    &::after {
        content: var(--text);
        font-size: 0.85rem;
    }
}

.normal__gray {
    color: #747474;
    font-size: 0.85rem;
}

.tag__common {
    min-width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    padding: 0 10px;
    border: 1px solid #f2f2f2;
    border-left: 3px solid #59f;
    display: inline-block;

    .span__title {
        color: #59f;
        cursor: pointer;
        font-weight: bold;
        margin-right: 6px;

        i {
            margin-left: 12px;
            transform: scale(1.2);
        }
    }
}
.margin--list{
    margin:0 10px;
    color:#303030;
}
</style>