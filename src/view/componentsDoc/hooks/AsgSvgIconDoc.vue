<template>
    <div>
        <TextTitle class="custom-my-1" title-name="基本样式展示"></TextTitle>
        <el-card style="min-height:300px">
            <div class="icon-container">
                <li v-for="(item,index) in svgIcon" :key="index">
                    <svg-icon :iconClass="item.value" width="20px" height="20px"></svg-icon>
                    <p>{{ item.label }}</p>
                </li>
            </div>
        </el-card>
        <TextTitle class="custom-my-1" title-name="代码展示"></TextTitle>
    <pre v-highlight>
    <code>
        &lt;template>
               &lt;svg-icon iconClass="notice" width="20px" height="20px" color="#666">
               &lt;/svg-icon>
        &lt;/template>
    </code>
    </pre>
    <AsgTipComponent type="warning">
        <p>从<a href="https://www.iconfont.cn/" target="_blank">阿里巴巴图标库</a>下载svg图标到src\assets\icons目录下，记得要去除svg代码里的fill值，使用color属性才会生效。</p>
    </AsgTipComponent>
    <propTable :table-data="propTable"></propTable>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import propTable from '../components/propTable.vue';
export default {
    name: 'AsgSvgIconDoc',
    text: 'AsgSvgIcon 图标组件',
    components: {
        TextTitle,
        AsgTipComponent,
        propTable
    },
    data() {
        return {
            svgIcon:[],
            propTable:[
                {
                    name:'iconClass',
                    type:'String',
                    doc:'图标类名'
                },
                {
                    name:'height',
                    type:'String',
                    doc:'图标高度，需要带px'
                },
                {
                    name:'width',
                    type:'String',
                    doc:'图标宽度，需要带px'
                },
                {
                    name:'color',
                    type:'String',
                    doc:'图标颜色，十六进制值，例如#666'
                }
            ]
        };
    },
    methods: {

    },
    created() {
        this.svgIcon = [];
        const files = require.context("@/assets/icons", false, /\.svg$/).keys();
        files.forEach(item => {
            const className = item.replace('./', '').replace('.svg', '');
            this.svgIcon.push({
                value: className,
                label: className
            })
        })
    },
}
</script>
<style lang='less' scoped>
.icon-container {
    overflow: hidden;
    list-style: none;
    padding: 0 !important;
    border: 1px solid #eaeefb;
    border-radius: 4px;

    li {
        float: left;
        width: 16.66%;
        text-align: center;
        height: 120px;
        color: #666;
        font-size: 13px;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: -1px;
        margin-bottom: -1px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:1em;
        justify-content: center;
        cursor: pointer;
        svg{
            fill:#666;
        }
        &:hover{
            color: rgb(92, 182, 255);
            svg{
                fill: rgb(92, 182, 255);
            }
        }
    }
}
</style>