<template>
    <div>
        <el-divider content-position="left">基本概念</el-divider>
        <AsgTipComponent type="warning">
            <p>封装公共组件或者二次封装element-ui组件需要掌握的一些技巧以及规范性要求。</p>
        </AsgTipComponent>
        <el-divider content-position="left">一、创建VUE组件</el-divider>
        <AsgTipComponent type="warning">
            <p>在src/components文件夹下创建XXX.vue组件，组件命名规范需要以Asg开头，驼峰命名，例如：AsgTableCard.vue</p>
        </AsgTipComponent>
        <el-divider content-position="left">二、封装组件</el-divider>
        <pre v-highlight>
            <code>
                //为什么需要封装公共组件
                //因为一个公共组件可能会在多个地方使用，例如AsgTipComponent，
                //很多地方都会用到这个标题，如果重复书写代码会导致代码冗余。
                //封装组件主要是为了统一样式，减少工作量。
                一、常用封装手段，外部传入props
                props:{
                    name:{
                      type:String,
                      default:'名称'
                    }
                }
                二、抛出事件给外部使用，同时会透传一些参数
                methods:{
                    handleClick(row){
                        this.$emit('finish',row);
                    }
                }
                三、定制化插槽，让外部传入内容。
                &lt;template>
                   &lt;div>
                      &lt;slot name="table">&lt;/slot>
                   &lt;/div>
                &lt;/template>
            </code>
        </pre>
        <el-divider content-position="left">三、书写公共组件文档</el-divider>
        <pre v-highlight>
            <code>
                一、在src\view\componentsDoc\hooks文件夹下新建一个xxxDoc.vue的组件
                    参考文件夹下其他内容编写公共组件使用文档。

                二、需要在src\view\componentsDoc\hooks\index.js里引入你的Doc组件，
                    并且Doc组件需要添加一个text属性，该属性表示左侧菜单名。

                注意：v-highlight是封装的一个高亮代码自定义指令，可以如下使用：
                &lt;pre v-highlight>
                   &lt;code>
                     //编写你的代码，但是有些符号需要用特殊标记符替代
                     //不然会被当作模板渲染。
                   &lt;/code>
                &lt;/pre>
            </code>
        </pre>
        <el-divider content-position="left">常用符号替换</el-divider>
        <el-table :data="tableData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="符号" prop="name" align="center"></el-table-column>
            <el-table-column label="编码" prop="symbol" align="center"></el-table-column>
        </el-table>
        <el-divider content-position="left">二次封装Element-ui组件</el-divider>
        参考：src\components\AsgTable.vue
    </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
  name:'secondDevDoc',
  text:'公共组件封装规范',
  components:{
    AsgTipComponent
  },
    data() {
      return {
        tableData:[
            {
                name:'<',
                symbol:'&lt;'
            },
            {
                name:'{',
                symbol:'&#123;'
            },
            {
                name:'}',
                symbol:'&#125;'
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