<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <AsgTable :data="tableData" border stripe @operation="handleAdd">
                <template #mark>
                    <span class="mark">一共有{{ tableData.length }}人</span>
                </template>
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="name" label="名称" width="240px" align="center">
                </el-table-column>
                <el-table-column label="性别" align="center" width="180px">
                    <template #default="{row}">
                        <el-tag :type="row.sex === '1' ? 'warning' : 'danger'">{{ row.sex === '1' ? '男' : '女' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="hobby" label="兴趣爱好" align="center">
                </el-table-column>
            </AsgTable>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
    <code>
        &lt;template>
            &lt;AsgTable 
              :data="tableData" border stripe 
              @operation="handleAdd">
                    &lt;template #mark>
                       &lt;span class="mark">一共有&#123; &#123; tableData.length &#125; &#125;人&lt;/span>
                    &lt;/template>
                &lt;el-table-column type="index" label="序号" width="80px" align="center">
                &lt;/el-table-column>
                &lt;el-table-column prop="name" label="名称" width="240px" align="center">
                &lt;/el-table-column>
                &lt;el-table-column label="性别" align="center" width="180px">
                    &lt;template #default="{row}">
                      &lt;el-tag :type="row.sex === '1' ? 'warning' : 'danger'">
                        &#123; &#123;  row.sex === '1' ? '男' : '女' &#125; &#125;
                      &lt;/el-tag>
                    &lt;/template>
                &lt;/el-table-column>
                &lt;el-table-column prop="hobby" label="兴趣爱好" align="center">
                &lt;/el-table-column>
            &lt;/AsgTable>
        &lt;/template>

        &lt;script lang="javascript">
              export default{
                  date(){
                    return {
                        tableData:[
                          {
                           name:'浊泉',
                           hobby:'第五人格',
                           sex:'1'
                          },
                          {
                           name:'星宇',
                           hobby:'永劫无间',
                           sex:'1'
                          },
                          {
                           name:'落梨',
                           hobby:'蛋仔派对',
                           sex:'2'
                          }
                        ],
                    }
                  },
                  methods:{
                    handleAdd() {
                      if(this.tableData.length >= 4)
                      return this.$message.error('人员已满！');
                      this.tableData.push({
                         name: '小帅',
                         hobby: '英雄联盟',
                         sex: '1'
                          })
                      }
                  }
              }
        &lt;/script>

        &lt;style lang='less' scoped>
           .mark{
              color:#4090EF;
           }
        &lt;/style>
    </code>
    </pre>
    <AsgTipComponent type="warning">
        <p>其实这个组件跟el-table没有太大区别，是基于el-table的二次封装，只增添了一个插槽和两个属性。</p>
    </AsgTipComponent>
    <propTable :table-data="propTable"></propTable>
    <slotTable :table-data="slotTable"></slotTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgTable from '@/components/AsgTable.vue';
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import propTable from '../components/propTable.vue';
import slotTable from '../components/slotTable.vue';
export default {
    name: 'AsgTableDoc',
    text: 'AsgTable 二次封装表格',
    components:{
        AsgTable,
        TextTitle,
        AsgTipComponent,
        propTable,
        slotTable
    },
    data() {
        return {
            tableData:[
                {
                    name:'浊泉',
                    hobby:'第五人格',
                    sex:'1'
                },
                {
                    name:'星宇',
                    hobby:'永劫无间',
                    sex:'1'
                },
                {
                    name:'落梨',
                    hobby:'蛋仔派对',
                    sex:'2'
                }
            ],
            propTable:[
                {
                    name:'btnName',
                    type:'String(默认值:新增)',
                    doc:'右侧按钮的中文名'
                },
                {
                    name:'markVisible',
                    type:'Boolean(默认值:true)',
                    doc:'左侧插槽区域是否可见'
                },
                {
                    name:'operation',
                    type:'Event(emit事件)',
                    doc:'右侧按钮点击抛出的事件'
                }
            ],
            slotTable:[
                {
                    name:'mark',
                    doc:'顶部左侧插槽'
                }
            ]
        };
    },
    methods: {
        handleAdd() {
            if(this.tableData.length >= 4) return this.$message.error('人员已满！');
            this.tableData.push({
                name: '小帅',
                hobby: '英雄联盟',
                sex: '1'
            })
        }
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.mark{
    color:#4090EF;
}
</style>