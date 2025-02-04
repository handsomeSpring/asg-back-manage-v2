<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <AsgCheckBox :value.sync="readOnly" active-text="查看" inactive-text="编辑">
            </AsgCheckBox>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
    <pre v-highlight>
    <code>
        &lt;template>
               &lt;AsgCheckBox :value.sync="readOnly" active-text="查看" inactive-text="编辑">
               &lt;/AsgCheckBox>
        &lt;/template>

        &lt;script lang="javascript">
              export default{
                  date(){
                    return {
                        readOnly:false
                    }
                  },
              }
        &lt;/script>
    </code>
    </pre>
    <propTable :table-data="propTable"></propTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgCheckBox from '@/components/AsgCheckBox.vue';
import propTable from '../components/propTable.vue';
export default {
  name:'AsgCheckBoxDoc',
  components:{
    AsgCheckBox,
    propTable,
    TextTitle
  },
  text:'AsgCheckBox 开关选择器',
    data() {
      return {
        readOnly:false,
        propTable:[
            {
                name:'readOnly',
                type:'String(必传，且需要.sync绑定)',
                doc:'切换状态，激活或者不激活'
            },
            {
                name:'active-text',
                type:'String(默认值：查看)',
                doc:'切换状态，激活或者不激活'
            },
            {
                name:'inactive-text',
                type:'String(默认值：编辑)',
                doc:'禁用状态和激活状态文字' 
            }
        ]
      };
    },
  methods: {

  },
  created() {

  },
}
</script>
<style lang='less' scoped>
</style>