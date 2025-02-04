<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <AsgPriorityComp :priority.sync="priority"></AsgPriorityComp>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
            <code>
                &lt;template>
                   &lt;AsgPriorityComp :priority.sync="priority">
                   &lt;/AsgPriorityComp>
                &lt;/template>

                &lt;script lang="javascript">
                    export default{
                       date(){
                          return {
                            priority:'2'
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
import AsgPriorityComp from '@/components/AsgPriorityComp.vue';
import propTable from '../components/propTable.vue';
export default {
  name:'AsgPriorityCompDoc',
  text:'AsgPriorityComp 优先级',
  components:{
    AsgPriorityComp,
    propTable
  },
    data() {
      return {
        priority:'2',
        propTable:[{
            name:'priority',
            type:'String(0 | 1 | 2 | 3 | 4)',
            doc:'优先级状态'
        }]
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