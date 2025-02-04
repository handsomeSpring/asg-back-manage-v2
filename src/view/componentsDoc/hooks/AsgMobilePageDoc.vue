<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card>
            第{{listQuery.page}}页内容
            <mobilePage :page="listQuery.page" :total="total" :limit="listQuery.limit"  @current-change="handleChange($event, 'page')">
            </mobilePage>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
        <pre v-highlight>
           <code>
        &lt;template>
                  第&#123; &#123; listQuery.page &#125; &#125;页内容
                  &lt;mobilePage 
                       :page="listQuery.page"
                       :total="total"
                       :limit="listQuery.limit"
                       @current-change="handleChange($event, 'page')">
                  &lt;/mobilePage>
        &lt;/template>

        &lt;script lang="javascript">
              export default{
                  date(){
                    return {
                      listQuery:{
                        page:1,
                        limit:10
                      },
                      total:50,
                    }
                  },
                  methods:{
                    handleChange(value,prop){
                      this.listQuery = {
                        ...this.listQuery,
                        [prop]:value
                      }
                    }
                  }
              }
        &lt;/script>
           </code>
        </pre>
        <propTable :table-data="tableData"></propTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import mobilePage from '@/components/mobile/mobilePage.vue';
import propTable from '../components/propTable.vue';
export default {
  name:'AsgMobilePageDoc',
  text:'AsgMobilePage 移动端分页',
  components:{
    TextTitle,
    mobilePage,
    propTable
  },
  data(){
    return {
        listQuery:{
            page:1,
            limit:10
        },
        total:50,
        tableData:[
          {
            name:'page',
            type:'Number(必传，用sync绑定)',
            doc:'类似于el-pagination的page'
          },
          {
            name:'limit',
            type:'Number(必传，用sync绑定)',
            doc:'类似于el-pagination的page-size'
          },
          {
            name:'total',
            type:'Number(必传)',
            doc:'类似于el-pagination的total'
          },
          {
            name:'current-change',
            type:'事件Event（emit）',
            doc:'类似于el-pagination的current-change'
          }
        ]
    }
  },
  methods:{
    handleChange(value,prop){
       this.listQuery = {
        ...this.listQuery,
        [prop]:value
       }
    }
  }
  
}
</script>
<style lang='less' scoped>
</style>