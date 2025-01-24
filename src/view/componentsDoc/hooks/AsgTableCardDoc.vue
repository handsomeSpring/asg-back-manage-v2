<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <asgTableCard>
                <template #header>
                    <div >
                        头部内容插槽
                    </div>
                </template>
                <template #content>
                    <div style="padding:1em">
                        222内容主体插槽
                    </div>
                </template>
            </asgTableCard>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
    <code>
        {{ content }}
    </code>
</pre>
        <slotTable :table-data="slotData"></slotTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import asgTableCard from '@/components/asg-table-card.vue';
import slotTable from '../components/slotTable.vue';
export default {
    name: 'AsgTableCardDoc',
    text: '蓝色表格',
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
            content: "//代码示例" + "\n" +
                "<asgTableCard>" + "\n" +
                "    <template #header>" + "\n" +
                "          头部内容插槽" + "\n" +
                "    </template>" + "\n" +
                "    <template #content>" + "\n" +
                "        内容主体插槽" + "\n" +
                "    </template>" + "\n" +
                "</asgTableCard>",
        };
    },
}
</script>