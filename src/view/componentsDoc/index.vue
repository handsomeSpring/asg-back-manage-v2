<template>
    <div>
        <AsgTipComponent>
            <p class="tip-text">
                这是我们ASG后台管理系统公共组件文档，文档地址：<a href="https://www.yuque.com/zhuoquan-sbw40/qgk5n8/bzq3i3s9raad91t1"
                    target="blank">语雀文档</a>。
                主要记录了一些公共组件的使用方法以及传参插槽信息，前端开发过程中，尽量使用公共组件，保持样式统一。
            </p>
        </AsgTipComponent>
        <main>
            <el-menu default-active="AsgHighSearchDoc" class="el-menu-vertical-demo" active-text-color="#fff"
                text-color="#000" @select="handleSelect">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>前端公共组件列表</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for="(item, index) in menu" :index="item.type" :key="index">{{ item.label
                            }}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
            <el-card>
                <component :is="componentType"></component>
            </el-card>
        </main>
    </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import widgetOptions from './hooks/index'
export default {
    name: 'asg-components-document',
    components: {
        AsgTipComponent,
        ...widgetOptions.components
    },
    data() {
        return {
            menu: widgetOptions.widgets,
            componentType: 'AsgHighSearchDoc'
        };
    },
    methods: {
        handleSelect(index) {
            this.componentType = index
        },
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.tip-text {
    font-size: 14px;
    color: #5e6d82;
    font-weight: 600;
    line-height: 2em;
    font-size: 1em;

    a {
        text-decoration: underline;
        text-underline-offset: 0.3em;
    }
}

main {
    display: grid;
    grid-template-columns: 20% calc(80% - 1em);
    gap: 1em;
}
</style>