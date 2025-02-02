<template>
  <div>
    <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
    <el-card style="min-height:300px">
      <p class="title">第一种：无数据样式</p>
      <AsgHighTable v-loading="loading" element-loading-text="系统加载中，请稍等" element-loading-spinner="el-icon-loading"
        :data="tableData1" :column="tableProps">
        <template #LOGO="{ data }">
          <img class="img-wrap" :src="data.logo">
        </template>
        <template #registerTime="{ data }">
          <p class="orgName">
            {{ new Date(data.time) | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
          </p>
        </template>
        <template #teamMates="{ data }">
          <el-col v-for="(item, index) in data.role" :key="index" :span="6"><span style="margin: 5px">{{ item.role_name
              }}</span>
            <el-tag size="mini" :type="item.role_lin === '求生者' ? 'primary' : 'danger'">{{ item.role_lin }}</el-tag>
          </el-col>
        </template>
      </AsgHighTable>
      <p class="title">第二种：有数据样式</p>
      <AsgHighTable v-loading="loading" element-loading-text="系统加载中，请稍等" element-loading-spinner="el-icon-loading"
        :data="tableData2" :column="tableProps">
        <template #projectHeader="{ data }">
          //顶部内容插槽{{ data.date }}
        </template>
        <template #LOGO="{ data }">
          {{ data.logo }}
        </template>
        <template #registerTime="{ data }">
          <p class="orgName">
            {{ data.date }}
          </p>
        </template>
        <template #teamMates="{ data }">
          {{ data.teamMates }}
        </template>
      </AsgHighTable>
    </el-card>
    <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
    <pre v-highlight>
  <code>
    &lt;AsgHighTable 
        v-loading="loading"
        element-loading-text="系统加载中，请稍等" 
        element-loading-spinner="el-icon-loading"
        :data="tableData2"
        :column="tableProps">
        &lt;template #projectHeader="{ data }">
            //顶部内容插槽&#123; &#123; data.date &#125; &#125;
        &lt;/template>
        &lt;template #LOGO="{ data }">
            &#123; &#123; data.logo &#125; &#125;
        &lt;/template>
        &lt;template #registerTime="{ data }">
            &lt;p class="orgName">
              &#123; &#123; data.date &#125; &#125;
            &lt;/p>
        &lt;/template>
        &lt;template #teamMates="{ data }">
            &#123; &#123; data.teamMates &#125; &#125;
        &lt;/template>
      &lt;/AsgHighTable>
    &lt;/template>

    &lt;script>
       export default{
          date(){
            return {
              loading:false,
              tableData1: [],
              tableData2:[
                {
                 date:'2025-02-02',
                 teamMates:'浊泉，落雪',
                 logo:'ASG'
                },
                {
                 date:'2025-02-03',
                 teamMates:'星宇，落梨',
                 logo:'ASG2'
                }
              ],
              tableProps: [
               {
                  type: "index",
                  label: "序号",
                  style: {
                    textAlign: "center",
                    minWidth: "80px",
                  },
               },
               {
                  type: "LOGO",
                  label: "战队LOGO",
                  prop: "LOGO",
                  slot: true,
                  style: {
                   textAlign: "center",
                   minWidth: "60px",
                  },
               },
               {
                  type: "registerTime",
                  label: "报名时间",
                  prop: "registerTime",
                  slot: true,
                  style: {
                    textAlign: "center",
                    width: "250px",
                  },
               },
               {
                  type: "teamMates",
                  label: "战队成员",
                  prop: "teamMates",
                  slot: true,
                  style: {
                    textAlign: "left",
                    minWidth: "400px",
                  },
               },
              ],
            }
          }
       }
    &lt;/script>
  </code>
</pre>
    <propTable :table-data="propData"></propTable>
    <AsgTipComponent type="primary">
      <p>该表格的column属性是构建该表格结构的关键，column是一个数组对象，每个对象里存在以下属性：
        <span class="span-title">type</span> 、<span class="span-title">label</span>、<span class="span-title">prop</span> 、<span class="span-title">slot</span>、<span class="span-title">style</span>。
        以下是属性介绍。
      </p>
    </AsgTipComponent>
    <propTable textTitleName="column每个对象里的属性" :table-data="columnTable"></propTable>
    <slotTable :table-data="slotTable"></slotTable>
  </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgHighTable from '@/components/AsgHighTable.vue';
import propTable from '../components/propTable.vue';
import slotTable from '../components/slotTable.vue';
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
  name: 'AsgHighTableDoc',
  text: '高表头表格',
  components: {
    TextTitle,
    AsgHighTable,
    propTable,
    slotTable,
    AsgTipComponent,
  },
  data() {
    return {
      slotTable:[
        {
          name:'projectHeader',
          doc:'每一张表格顶部区域'
        }
      ],
      propData:[
        {
          name:'tableData',
          type:'Array数组对象',
          doc:'表格数据，可以参考el-table的tableData'
        },
        {
          name:'column',
          type:'Array数组对象',
          doc:'表格的字段配置，表头信息，具体配置规则如下'
        }
      ],
      columnTable:[
        {
          name:'type',
          type:'index | string',
          doc:'若是index，则表示该列是序号，若是其他字符串，则表示该列是具名插槽。'
        },
        {
          name:'label',
          type:'string',
          doc:'该列的中文表头名。'
        },
        {
          name:'prop',
          type:'属性值',
          doc:'该列所取tableData里的属性值，类似于el-table-column的prop,同时也是具名插槽名。'
        },
        {
          name:'slot',
          type:'Boolean,默认为false',
          doc:'若设置为true，该列则为插槽列，同时prop和type变为具名插槽名。'
        },
        {
          name:'style',
          type:'Object',
          doc:'对象里可传入一些属性，类似于vue的动态样式，比如textAlign（文字是否居中）；minWidth（列宽度）等。'
        }
      ],
      loading:false,
      tableData1: [],
      tableData2:[
        {
          date:'2025-02-02',
          teamMates:'浊泉，落雪',
          logo:'ASG'
        },
        {
          date:'2025-02-03',
          teamMates:'星宇，落梨',
          logo:'ASG2'
        }
      ],
      tableProps: [
        {
          type: "index",
          label: "序号",
          style: {
            textAlign: "center",
            minWidth: "80px",
          },
        },
        {
          type: "LOGO",
          label: "战队LOGO",
          prop: "LOGO",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "60px",
          },
        },
        {
          type: "registerTime",
          label: "报名时间",
          prop: "registerTime",
          slot: true,
          style: {
            textAlign: "center",
            width: "250px",
          },
        },
        {
          type: "teamMates",
          label: "战队成员",
          prop: "teamMates",
          slot: true,
          style: {
            textAlign: "left",
            minWidth: "400px",
          },
        },
      ],
    };
  }
}
</script>
<style lang='less' scoped>
.title{
  font-size: 1em;
  font-weight: bold;
  margin:0.8em 0;
  font-family: 'hk';
}
.span-title{
  font-family: 'hk';
  font-size: 1em;
  font-weight: bold;
}
</style>