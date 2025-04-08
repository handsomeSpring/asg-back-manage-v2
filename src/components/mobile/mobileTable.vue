<template>
    <div class="mobile-table-list" :style="{
        height: isAutoHeight ? 'auto' : 'calc(100dvh - 32px - 50px - 24px - 60px)',
        width: tableWidth
    }" v-loading="loading">
        <el-skeleton :rows="6" animated :loading="skeLoading" />
        <template v-if="!skeLoading">
            <div class="no-empty" v-if="tableData.length === 0">{{ noDateText }}</div>
            <template v-else>
                <el-descriptions :label-style="label_style" class="margin-top" :column="1" size="small" border
                    v-for="(row, i) in tableData" :key="i">
                    <el-descriptions-item v-for="(prop, index) in tableProps" :key="index">
                        <template slot="label">
                            <p>{{ prop.label }}</p>
                        </template>
                        <p v-if="prop.type === 'index'">{{ i + 1 }}</p>
                        <slot v-else-if="prop.type === 'slot'" :name="prop.prop" :row="row" :index="i"></slot>
                        <p v-else>{{ row[prop.prop] || '/' }}</p>
                    </el-descriptions-item>
                </el-descriptions>
            </template>
        </template>
        <!-- 留白 -->
        <div v-show="hasLeaveBlank" class="op-cut"></div>
    </div>
</template>

<script>
import { isMobile } from '@/utils';

export default {
    name: 'mobileTable',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        tableProps: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 是否骨架屏加载
        skeLoading: {
            type: Boolean,
            default: false
        },
        // 是否需要留白
        hasLeaveBlank: {
            type: Boolean,
            default: true
        },
        // 无数据时候的展示
        noDateText: {
            type: String,
            default: '暂无数据'
        },
        // 是否根据内容撑开高度
        isAutoHeight:{
            type:Boolean,
            default:false
        },
        // 表格宽度
        tableWidth:{
            type:String,
            default:'94%'
        }
    },
    data() {
        return {
            isMobile: false,
            label_style: {
                'text-align': 'left',//文本居中
                'width': '30%',
                'word-break': 'keep-all'
            },
        };
    },
    created() {
        this.isMobile = isMobile();
    },
}
</script>
<style lang='less' scoped>
.mobile-table-list {
    margin: 0 auto;
    .op-cut {
        height: 60px;
    }

    .no-empty {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.9em;
        color: #979797;
    }

    .margin-top {
        margin: 1em 0;
    }
}
</style>