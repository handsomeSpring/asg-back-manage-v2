<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card>
            <mobileTable :table-data="tableData" :table-props="tableProps" :loading="loading">
                <template #sex="{ row }">
                   <span>{{ row.sex === '1' ? '男' : '女' }}</span>
                </template>
            </mobileTable>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
           <code>
        &lt;template>
              &lt;mobileTable :tableData="tableData" :table-props="tableProps" :loading="loading">
                  &lt;template #sex="{ row }">
                  &lt;span> &#123; &#123; row.sex === '1' ? '男' : '女' &#125; &#125; &lt;/span>
                  &lt;/template>
               &lt;/mobileTable>
        &lt;/template>

        &lt;script lang="javascript">
              export default{
                  date(){
                    return {
                        tableData:[
                          {
                            name:'小明',
                            sex:'1',
                            hobby:'打飞机'
                          },
                          {
                            name:'小张',
                            sex:'2',
                            hobby:'第五人格'
                          },
                          {
                            name:'小牛',
                            sex:'2',
                            hobby:'王者荣耀'
                          },
                          {
                            name:'小飞',
                            sex:'1',
                            hobby:'英雄联盟'
                          }
                        ],
                        tableProps:[
                          {
                            type:'index',
                            label:'序号'
                          },
                          {
                            type:'prop',
                            label:'名称',
                            prop:'name'
                          },
                          {
                            type:'slot',
                            prop:'sex',
                            label:'性别'
                          },
                          {
                            type:'prop',
                            prop:'hobby',
                            label:'兴趣爱好'
                          }
                        ],
                        loading:false
                    }
                  },
              }
        &lt;/script>
           </code>
        </pre>
        <TextTitle title-name="tableProps注意事项">
        </TextTitle>
        <AsgTipComponent type="warning">
            <p class="tip-text">
                tableProps的type——slot表示该列项是插槽；prop表示该列项是取属性值；index表示该列项是自增序号。slot插槽会抛出一行数据（row）和数据序号（index）
            </p>
        </AsgTipComponent>
        <propTable :table-data="propTable"></propTable>
    </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import TextTitle from '@/components/TextTitle.vue';
import mobileTable from '@/components/mobile/mobileTable.vue';
import propTable from '../components/propTable.vue';
export default {
  name:'AsgMobileTableDoc',
  text:'AsgMobileTable 移动端表格',
  components:{
    mobileTable,
    TextTitle,
    propTable,
    AsgTipComponent
  },
    data() {
      return {
        loading:false,
        tableData:[
            {
                name:'小明',
                sex:'1',
                hobby:'打飞机'
            },
            {
                name:'小张',
                sex:'2',
                hobby:'第五人格'
            },
            {
                name:'小牛',
                sex:'2',
                hobby:'王者荣耀'
            },
            {
                name:'小飞',
                sex:'1',
                hobby:'英雄联盟'
            }
        ],
        tableProps:[
            {
                type:'index',
                label:'序号'
            },
            {
                type:'prop',
                label:'名称',
                prop:'name'
            },
            {
                type:'slot',
                prop:'sex',
                label:'性别'
            },
            {
                type:'prop',
                prop:'hobby',
                label:'兴趣爱好'
            }
        ],
        propTable:[
            {
              name:'tableData',
              type:'Array',
              doc:'列表数据'
            },
            {
              name:'tableProps',
              type:'Array',
              doc:'表头主体信息'
            },
            {
               name:'loading',
               type:'Boolean(默认false)',
               doc:'加载动画显示隐藏'
            }
        ]
      };
    },
}
</script>
<style lang='less' scoped>
.tip-text {
    font-size: 14px;
    color: #5e6d82;
    font-weight: 600;
    line-height: 1.2em;
    font-size: 1em;
    text-indent: 2em;
}
</style>