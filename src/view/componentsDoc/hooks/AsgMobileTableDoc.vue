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
import propTable from '@/view/componentsDoc/components/propTable.vue';
export default {
  name: 'AsgMobileTableDoc',
  text: 'AsgMobileTable 移动端表格',
  components: {
    mobileTable,
    TextTitle,
    propTable,
    AsgTipComponent
  },
  data() {
    return {
      loading: false,
      tableData: [
        {
          name: '小明',
          sex: '1',
          hobby: '打飞机'
        },
        {
          name: '小张',
          sex: '2',
          hobby: '第五人格'
        },
        {
          name: '小牛',
          sex: '2',
          hobby: '王者荣耀'
        },
        {
          name: '小飞',
          sex: '1',
          hobby: '英雄联盟'
        }
      ],
      tableProps: [
        {
          type: 'index',
          label: '序号'
        },
        {
          type: 'prop',
          label: '名称',
          prop: 'name'
        },
        {
          type: 'slot',
          prop: 'sex',
          label: '性别'
        },
        {
          type: 'prop',
          prop: 'hobby',
          label: '兴趣爱好'
        }
      ],
      propTable: [
        {
          name: 'tableData',
          type: 'Array',
          doc: '列表数据'
        },
        {
          name: 'tableProps',
          type: 'Array',
          doc: '表头主体信息'
        },
        {
          name: 'loading',
          type: 'Boolean(默认false)',
          doc: '加载动画显示隐藏'
        },
        {
          name: 'skeLoading',
          type: 'Boolean(默认false)',
          doc: '骨架屏加载特效'
        },
        {
          name: 'hasLeaveBlank',
          type: 'Boolean(默认为true)',
          doc: '底部是否需要留白，正常情况下，如果有fix定位到底部，需要留白。'
        },
        {
          name: 'noDateText',
          type: 'String(默认为暂无数据)',
          doc: '表格无数据时候展示的文字'
        },
        {
          name: 'isAutoHeight',
          type: 'Boolean(默认为false)',
          doc: '是否根据内容撑开高度，默认是有固定的高度。如果设置为true，表格的高度会根据内容撑开。'
        },
        {
          name: 'tableWidth',
          type: 'String(默认是：94%)',
          doc: '表格宽度，默认是94%。如果设置为100%，表格会撑满整个屏幕。'
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