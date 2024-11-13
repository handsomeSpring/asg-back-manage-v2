<template>
    <div class="container">
        <div class="header__container">
            <el-button icon="el-icon-arrow-left" size="small" @click="back">返回</el-button>
            <el-button  size="small" @click="addItem">新增组件</el-button>
            <el-button size="small" icon="el-icon-folder-checked" type="primary" @click="handleSave">保存</el-button>
            <p class="header__title--blue">第五人格ASG赛事自定义工作台</p>
        </div>
        <div class="body__container">
            <div class="aside__container" data-drop="move">
                <TextTitle style="width:100%" titleName='组件列表'></TextTitle>
                <p class="warning-text"><i class="el-icon-warning"></i>若遇到无法拖拽的问题，请使用最新版本Chrome浏览器!</p>
                <li v-for="(item, index) in tagList" class="tag" data-effect="copy" draggable="true"
                    :data-type="item.type" :key="index">{{ item.label }}</li>
            </div>
            <el-scrollbar style="height: 80vh;width:100%;overflow-x: hidden">
                <HomeDesign ref="homeDesign"></HomeDesign>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import HomeDesign from './components/HomeDesign.vue';
import TextTitle from '@/components/TextTitle.vue';
import widgetOptions from './hooks/index.js';
export default {
    name: 'customWorker',
    components: {
        HomeDesign,
        TextTitle
    },
    data() {
        return {
            sourceNode: null,
            tagList: widgetOptions.widgets,
        };
    },
    mounted() {
        const container = document.querySelector('.container');
        container.ondragstart = e => {
            e.dataTransfer.effectAllowed = e.target.dataset.effect;
            this.sourceNode = e.target;
        }
        container.ondragover = e => {
            e.preventDefault();
        }
        container.ondragenter = e => {
            this.clearDropStyle();
            const dropNode = this.getDropNode(e.target);
            if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
                console.log(dropNode, 'dropNode');
                dropNode.classList.add('drop-over');
            }
        }
        container.ondrop = e => {
            this.clearDropStyle();
            const dropNode = this.getDropNode(e.target);
            if (dropNode && dropNode.dataset.drop === e.dataTransfer.effectAllowed) {
                if (dropNode.dataset.drop === 'copy') {
                    const cloned = this.sourceNode.cloneNode(true);
                    cloned.dataset.effect = 'move';
                    console.log(cloned.dataset.type,dropNode.dataset.index, '======');
                    this.$refs.homeDesign.setComponent(+dropNode.dataset.index, cloned.dataset.type);
                }
            }
            // else{
            //     this.sourceNode.remove()
            // }
        }
    },
    methods: {
        addItem(){
            this.$refs.homeDesign.addLayout();
        },
        handleSave() {
            const customWorker = this.$refs?.homeDesign?.layout ?? '[]';
            const stringParse = JSON.stringify(customWorker);
            window.localStorage.setItem('asg-layout', stringParse);
            this.$message.success('保存成功');
            this.$router.push({path:'/guide'})
        },
        back() {
            this.$router.push({path:'/guide'})
        },
        getDropNode(node) {
            while (node) {
                if (node?.dataset?.drop) {
                    return node;
                }
                node = node.parentNode;
            }
        },
        clearDropStyle() {
            document.querySelectorAll('.drop-over').forEach((node) => {
                node.classList.remove('drop-over');
            })
        }
    }
}
</script>
<style lang='less' scoped>
.header__container {
    background-color: #e7e7e7;
    width: calc(100% - 24px);
    height: 50px;
    margin: 12px 0;
    display: grid;
    align-items: center;
    grid-template-columns: 100px 100px 100px auto;
    padding: 0 12px;

    .header__title--blue {
        text-align: right;
        color: #4090EF;
        font-weight: bold;
        font-size: 1.1rem;
        margin-right: 24px;
    }
}

.body__container {
    display: grid;
    grid-template-columns: 17vw auto;
    gap: 24px 14px;
    align-items: start;
    overflow-y: scroll;
    .aside__container {
        display: flex;
        background-color: #ffffff;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 24px;
        gap: 24px;
        margin-left: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        .warning-text {
            color: rgb(255, 128, 0);
            font-size: 0.8rem;
            font-weight: bold;
        }

        li {
            background-color: #ecf5ff;
            display: inline-block;
            height: 32px;
            padding: 0 10px;
            line-height: 30px;
            font-size: 12px;
            color: #409eff;
            border: 1px solid #d9ecff;
            border-radius: 4px;
            box-sizing: border-box;
            white-space: nowrap;
            cursor: pointer;
        }
    }
}
</style>