<template>
    <div class="mobile-table-list">
        <el-descriptions class="margin-top" :column="1" size="small" border v-for="(row, i) in tableData" :key="i">
            <el-descriptions-item v-for="(prop, index) in tableProps" :key="index">
                <template slot="label">
                    <p>{{ prop.label }}</p>
                </template>
                <p v-if="prop.type === 'index'">{{ i }}</p>
                <slot v-else-if="prop.type === 'slot'" :name="prop.prop" :row="row"></slot>
                <p v-else>{{ row[prop.prop] || '/' }}</p>
            </el-descriptions-item>
        </el-descriptions>
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
        }
    },
    data() {
        return {
            isMobile: false
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
    .margin-top{
        margin:1em 0;
    }
}
</style>