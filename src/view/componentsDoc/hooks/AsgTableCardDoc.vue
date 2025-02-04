<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <asgTableCard>
                <template #header>
                    <div style="display:flex;align-items: center;height:100%;margin-left:1em">
                        头部内容插槽
                    </div>
                </template>
                <template #content>
                    <div style="padding:1em">
                        内容主体插槽
                    </div>
                </template>
            </asgTableCard>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
    <pre v-highlight>
    <code>
        &lt;template>
               &lt;asgTableCard>
                   &lt;template #header>
                     &lt;div style="display:flex;align-items: center;height:100%;margin-left:1em">
                        头部内容插槽
                     &lt;/div>
                   &lt;/template>
                   &lt;template #content>
                     &lt;div style="padding:1em">
                        内容主体插槽
                     &lt;/div>
               &lt;/asgTableCard>
            &lt;/template>
    </code>
    </pre>
        <slotTable :table-data="slotData"></slotTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import asgTableCard from '@/components/AsgTableCard.vue';
import slotTable from '../components/slotTable.vue';
export default {
    name: 'AsgTableCardDoc',
    text: 'AsgTableCard 蓝色表格',
    components: {
        asgTableCard,
        TextTitle,
        slotTable
    },
    data() {
        return {
            slotData: [
                {
                    name: 'header',
                    doc: '表头插槽'
                },
                {
                    name: 'content',
                    doc: '表体插槽'
                }
            ],
        };
    },
}
</script>