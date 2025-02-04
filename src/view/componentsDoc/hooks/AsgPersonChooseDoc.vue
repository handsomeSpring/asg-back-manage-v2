<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <el-button type="primary" @click="openDialog">点击我打开人员选择器</el-button>
            <p class="custom-my-1">选择的人员是:{{ nodeConfig }}</p>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
           <code>
            &lt;template>
               &lt;el-button type="primary" @click="openDialog">点击我打开人员选择器
               &lt;/el-button>
               &lt;p class="custom-my-1">选择的人员是:&#123; &#123; nodeConfig &#125; &#125;&lt;/p>
               &lt;AsgPersonChoose ref="personChooseDialog" @finish="chooseFinish">&lt;/AsgPersonChoose>
            &lt;/template>
            
            &lt;script lang="javascript">
                export default{
                  date(){
                    return {
                        nodeConfig:{}
                    }
                  },
                  methods:{
                    openDialog() {
                        this.$refs.personChooseDialog?.openDialog();
                    },
                    chooseFinish(node) {
                        this.nodeConfig = node;
                    }
                  }
                }
            &lt;/script>
           </code>
       </pre>
        <AsgPersonChoose ref="personChooseDialog" @finish="chooseFinish"></AsgPersonChoose>
        <propTable :table-data="propData"></propTable>
    </div>
</template>

<script>
import AsgPersonChoose from '@/components/AsgPersonChoose.vue';
import TextTitle from '@/components/TextTitle.vue';
import propTable from '../components/propTable.vue';
export default {
    name: 'AsgPersonChooseDoc',
    text: 'AsgPersonChoose 人员选择器',
    components: {
        AsgPersonChoose,
        TextTitle,
        propTable
    },
    data() {
        return {
            nodeConfig: {},
            propData: [{
                name: '$ref',
                type: '打开弹窗方式',
                doc: '使用this.$refs.personChooseDialog?.openDialog()打开弹窗'
            },
            {
                name: 'finish',
                type: 'Event事件（emit）',
                doc: '返回一个node对象包含label：用户名称、id：用户id、officium：职位'
            }]
        };
    },
    methods: {
        openDialog() {
            this.$refs.personChooseDialog?.openDialog();
        },
        chooseFinish(node) {
            this.nodeConfig = node;
        }
    },
}
</script>
<style lang='less' scoped></style>