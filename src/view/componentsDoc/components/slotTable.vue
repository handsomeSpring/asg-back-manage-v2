<template>
    <div>
        <TextTitle class="custom-my-1" title-name="slot- Slots"></TextTitle>
        <div class="header-content">
            <div>插槽名称</div>
            <div>说明</div>
        </div>
        <div class="body-content" v-for="(item,index) in tableData" :key="index">
            <div>{{ item.name }}</div>
            <div>{{ item.doc }}</div>
        </div>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
export default {
  name:'propTable',
  components:{
    TextTitle
  },
  props:{
    tableData:{
        type:Array,
        default:()=>[]
    }
  }
}
</script>
<style lang='less' scoped>
.body-content,.header-content{
    display: grid;
    grid-template-columns: 30% 70%;
    border-bottom: 1px solid #dcdfe6;
    padding:1em 2em;
    color: #909399;
}
.body-content{
    color: #606266 !important;
}
</style>