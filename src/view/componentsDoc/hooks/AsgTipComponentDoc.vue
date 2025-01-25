<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <AsgTipComponent type="primary">
                <p>插槽里面写内容即可,type="primary"</p>
            </AsgTipComponent>
            <AsgTipComponent type="warning">
                <p>插槽里面写内容即可,type="warning"</p>
            </AsgTipComponent>
            <AsgTipComponent type="danger">
                <p>插槽里面写内容即可,type="danger"</p>
            </AsgTipComponent>
            <AsgTipComponent type="success">
                <p>插槽里面写内容即可,type="success"</p>
            </AsgTipComponent>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
    <pre v-highlight>
    <code>
        &lt;template>
               &lt;AsgTipComponent type="primary">
                  插槽里面写内容即可,type="primary"
               &lt;/AsgTipComponent>
               &lt;AsgTipComponent type="warning">
                  插槽里面写内容即可,type="warning"
               &lt;/AsgTipComponent>
               &lt;AsgTipComponent type="danger">
                  插槽里面写内容即可,type="danger"
               &lt;/AsgTipComponent>
               &lt;AsgTipComponent type="success">
                  插槽里面写内容即可,type="success"
               &lt;/AsgTipComponent>
        &lt;/template>
    </code>
    </pre>
        <propTable :table-data="propData"></propTable>
        <slotTable :table-data="slotData"></slotTable>

    </div>
</template>

<script>
import propTable from '../components/propTable.vue';
import TextTitle from '@/components/TextTitle.vue';
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import slotTable from '../components/slotTable.vue';
export default {
    name: 'AsgTipComponentDoc',
    text: '顶格标题提示词',
    components: {
        AsgTipComponent,
        TextTitle,
        slotTable,
        propTable
    },
    data() {
        return {
            propData: [
                {
                    name: 'type',
                    type: 'primary | success | danger | warning',
                    doc: '警示类型颜色分类'
                },
            ],
            slotData: [
                {
                    name: '默认插槽',
                    doc: '提示词内容部分'
                },
            ],
        };
    },
}
</script>