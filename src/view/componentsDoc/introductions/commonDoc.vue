<template>
    <div>
        <el-divider content-position="left">token令牌</el-divider>
        <el-card>
            <AsgTipComponent>
                <div class="tip-flex">
                    <p>这个功能是用于获取token。token是一个账号的身份令牌，请勿随便传播，一旦退出登录，该令牌便会消失。</p>
                    <el-button type="primary" size="small" @click="getToken">获取token</el-button>
                </div>
            </AsgTipComponent>
            <div class="token-content">
                <p>您的token是:Bearer {{ token }}</p>
            </div>
        </el-card>
        <el-divider content-position="left">全局参数配置</el-divider>
        <el-card>
            <AsgTipComponent type="danger">
                <p>全局参数是一些JSON配置，用于辅助网站建设数据。所以修改全局参数需要得到开发者的同意，如果随便修改将导致全局参数回显失败，最终无法显示页面。全局参数的配置规则如下：</p>
            </AsgTipComponent>
            <pre v-highlight>
              <code>
                //全局参数一般都是一些数组对象JSON格式
                //例：下面就是一个JSON
                [
                  {
                    "label":"浊泉",
                    "sex":"1",
                    "value":"frontEnd"
                  },
                  {
                    "label":"星宇",
                    "sex":"1",
                    "value":"product"
                  }
                ]
                //通常来说，Key:Value，Key都不要动它，value可以动就是label之类的中文名。
                //注意：最后一个}是没有,的，每个key和value用双引号。
              </code>
            </pre>
        </el-card>
        <el-divider content-position="left">菜单配置</el-divider>
        <el-card>
            <AsgTipComponent>
                <p class="part-line">
                    前端需要新建页面的时候，需要去菜单配置新增新的菜单，这个一般在产品的要求下新建。有一个前端路径入参填的是项目文件夹里vue组件的文件路径，可以参考其他菜单配置。
                    兼容移动端部分需要改成双端配置才能在移动端显示。在菜单权限中配置该菜单的权限，然后在用户配置中配置用户的权限，如果用户的权限和菜单的权限对应，该用户即可拥有该
                    菜单。
                </p>
            </AsgTipComponent>
        </el-card>
        <el-divider content-position="left">审批规则配置</el-divider>
        <el-card>
            <AsgTipComponent>
                <p class="part-line">
                    审批规则配置，配置的是业务审核的流程，基本上分为赛事组、解说、导播、菜单四大流程。通过审批规则流程配置，用户可以
                    在业务审批的时候知道下一个节点是谁审批。
                </p>
            </AsgTipComponent>
        </el-card>
    </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
import { getToken } from '@/utils/auth';
export default {
    name: 'commonDoc',
    text: '后台管理人员须知',
    components: {
        AsgTipComponent
    },
    data() {
        return {
            token: '',
        };
    },
    methods: {
        getToken() {
            this.token = getToken()
        },
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.tip-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.token-content {
    width: 100%;

    p {
        white-space: wrap;
        word-wrap: break-word
    }
}
.part-line{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    text-indent: 2em;
    font-weight: 600;
}
</style>