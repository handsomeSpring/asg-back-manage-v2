<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card>
            <AsgMoneyInput v-model="value" :decimal="0" symbol="$" clearable>
                <template #prefix>
                    前面
                </template>
                <template #append>
                    元
                </template>
            </AsgMoneyInput>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
           <code>
        &lt;template>
            &lt;AsgMoneyInput v-model="value" :decimal="0" symbol="$" clearable>
                &lt;template #prefix>
                    前面
                &lt;/template>
                &lt;template #append>
                    元
                &lt;/template>
            &lt;/AsgMoneyInput>
        &lt;/template>

        &lt;script lang="javascript">
              export default{
                  date(){
                    return {
                        value:10
                    }
                  }
                }
        &lt;/script>
           </code>
        </pre>
        <propTable :table-data="propTable"></propTable>
        <slotTable :table-data="slotTable"></slotTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgMoneyInput from '@/components/AsgMoneyInput.vue';
import propTable from '../components/propTable.vue';
import slotTable from '../components/slotTable.vue';
export default {
    name: 'AsgMoneyInputDoc',
    text: 'AsgMoneyInput 金额输入框',
    components:{
        TextTitle,
        propTable,
        slotTable,
        AsgMoneyInput
    },
    data() {
        return {
            value:10,
            propTable:[
                {
                    name:'maxlength',
                    doc:'可输入最大长度',
                    type:'Number'
                },
                {
                    name:'minlength',
                    doc:'可输入最小长度',
                    type:'Number'
                },
                {
                    name:'suffixIcon',
                    doc:'输入框后标ICON',
                    type:'String'
                },
                {
                    name:'prefixIcon',
                    doc:'输入框前标ICON',
                    type:'String'
                },
                {
                    name:'clearable',
                    doc:'是否可清除',
                    type:'Boolean'
                },
                {
                    name:'symbol',
                    doc:'货币符号（默认值：￥）',
                    type:'String'
                },
                {
                    name:'decimal',
                    doc:'精确度，默认为2，最多到2.',
                    type:'0 | 1 | 2'
                },
                {
                    name:'readOnly',
                    doc:'是否是只读状态（默认为：false）',
                    type:'Boolean'
                }
            ],
            slotTable:[
                {
                    name:'prefix',
                    doc:'前图标插槽'
                },
                {
                    name:'suffix',
                    doc:'后图标插槽'
                },
                {
                    name:'append',
                    doc:'后元素插槽'
                }
            ]
        };
    },
}
</script>