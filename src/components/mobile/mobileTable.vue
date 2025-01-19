<template>
    <div class="mobile-table-list" v-loading="loading">
        <div class="no-empty" v-if="tableData.length === 0">暂无数据</div>
        <template v-else>
            <el-descriptions :label-style="label_style" class="margin-top" :column="1" size="small" border
                v-for="(row, i) in tableData" :key="i">
                <el-descriptions-item v-for="(prop, index) in tableProps" :key="index">
                    <template slot="label">
                        <p>{{ prop.label }}</p>
                    </template>
                    <p v-if="prop.type === 'index'">{{ i + 1 }}</p>
                    <slot v-else-if="prop.type === 'slot'" :name="prop.prop" :row="row" :index="index"></slot>
                    <p v-else>{{ row[prop.prop] || '/' }}</p>
                </el-descriptions-item>
            </el-descriptions>
        </template>
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
    },
    data() {
        return {
            isMobile: false,
            label_style: {
                'text-align': 'left',//文本居中
                'width': '50%',
                'word-break': 'keep-all'
            },
        };
    },
    methods: {

    },
    created() {
        this.isMobile = isMobile();
    },
}
</script>
<style lang='less' scoped>
.mobile-table-list {
    width: 95%;
    margin: 1em auto;
    min-height: 70dvh;

    .no-empty {
        width: 100%;
        height: 70vh;
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