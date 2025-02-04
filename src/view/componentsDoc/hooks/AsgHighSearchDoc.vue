<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <AsgHighSearch showOperation>
                <template #top>
                    top插槽区域
                </template>
                <template #search>
                    search组件插槽区域
                </template>
                <template #btnList>
                    btnList插槽区域
                </template>
                <template #operation>
                    operation插槽区域
                </template>
            </AsgHighSearch>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
           <code>
            &lt;template>
               &lt;AsgHighSearch showOperation>
                   &lt;template #top>
                       top插槽区域
                   &lt;/template>
                   &lt;template #search>
                       search组件插槽区域
                   &lt;/template>
                   &lt;template #btnList>
                       btnList插槽区域
                   &lt;/template>
                   &lt;template #operation>
                       operation插槽区域
                   &lt;/template>
               &lt;/AsgHighSearch>
            &lt;/template>
           </code>
        </pre>
        <propTable :table-data="propData"></propTable>
        <slotTable :table-data="slotData"></slotTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgHighSearch from '@/components/AsgHighSearch.vue';
import propTable from '../components/propTable.vue';
import slotTable from '../components/slotTable.vue';
export default {
    name: 'AsgHighSearchDoc',
    text: 'AsgHighSearch 高级搜索',
    components: {
        AsgHighSearch,
        TextTitle,
        propTable,
        slotTable
    },
    data() {
        return {
            propData: [
                {
                    name: 'showOperation',
                    type: 'Boolean(默认为false)',
                    doc: '是否展示操作区域'
                }
            ],
            slotData: [
                {
                    name: 'top',
                    doc: '顶部内容插槽'
                },
                {
                    name: 'search',
                    doc: '搜索区域插槽'
                },
                {
                    name: 'btnList',
                    doc: '右侧查询部分插槽'
                },
                {
                    name: 'operation',
                    doc: '底部插槽'
                },
            ]
        };
    },
}
</script>