<template>
    <div class="content-wrap">
        <AsgTipComponent>
            <p class="tip-text">
                这是我们ASG三端后端接口文档，文档地址：<a href="https://api.idvasg.cn/scalar/v1"
                    target="blank">后端API文档</a>。
                记录了解说端、第五人格后台管理系统、官网所有接口。
            </p>
        </AsgTipComponent>
        <iframe style="height:100%;width:100%" src="https://api.idvasg.cn/scalar/v1"></iframe>
    </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
    name: 'backendDoc',
    components: {
        AsgTipComponent
    },
}
</script>
<style lang='less' scoped>
.content-wrap {
    width: 100%;
    height: 70vh;

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
}
</style>