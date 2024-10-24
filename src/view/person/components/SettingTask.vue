<template>
    <div class="task__container">
        <div class="task__main--grid">
            <el-card class="custom__card--auto" shadow="none">
                <li>
                    <p id="taskName" class="item__title--pointer">任务标题</p>
                    <el-input size="small" v-model="taskObj.taskName" placeholder="请输入任务标题" clearable></el-input>
                </li>
                <li>
                    <p id="taskDescription" class="item__title--pointer">任务描述</p>
                    <el-input size="small" type="textarea" v-model="taskObj.taskDescription" :rows="5"
                        placeholder="请输入任务描述" maxlength="200" show-word-limit clearable></el-input>
                </li>
                <li>
                    <p id="money" class="item__title--pointer">任务积分(0-5)</p>
                    <el-input-number @focus="connectTarget" @blur="clearLine" v-model="taskObj.money" :min="0" :max="5"
                        size="small" :step="1" step-strictly>
                    </el-input-number>
                </li>
                <li>
                    <el-button size="small" icon="el-icon-document-checked" type="primary"
                        @click="addTask">新建任务</el-button>
                </li>
            </el-card>
            <div class="task__code--highlight">
                <p class="title" id="money-1">积分规则</p>

                <div v-for="(item, index) in moneyRules" :key="index">
                    <p class="point__title">
                        {{ index }}积分
                        <el-rate :value="index" disabled disabled-void-color="#979797"></el-rate>
                    </p>
                    <p class="content">{{ item.label }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setTask } from '@/api/admin/index.js';
import { getByTitle } from '@/api/config';
import { mapGetters } from 'vuex';
export default {
    name: 'SettingTask',
    props: {
        user: {
            type: Object,
            default: () => { }
        },
        qqMap: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            taskObj: {
                taskName: '',
                taskDescription: '',
                money: 0
            },
            jsPlumb: null,
            moneyRules: []
        };
    },
    created() {
        getByTitle('moneyRules').then(res => {
            this.moneyRules = res.data;
        })
    },
    computed: {
        ...mapGetters(['userInfo']),
        userName() {
            return this.userInfo.chinaname || sessionStorage.getItem('chinaname') || '未知超管';
        },
        userId() {
            return this.userInfo?.id || sessionStorage.getItem('id');
        }
    },
    mounted() {
        this.initJSPlumb();
    },
    beforeDestroy() {
        this.jsPlumb.deleteEveryConnection();
        this.jsPlumb.deleteEveryEndpoint();
    },
    methods: {
        async addTask() {
            this.jsPlumb.deleteEveryConnection();
            this.jsPlumb.deleteEveryEndpoint();
            const myId = this.userInfo.id || window.sessionStorage.getItem('id');
            if (myId.toString() === this.user.id.toString()) {
                return this.$message.error('您不能给自己建任务');
            }
            if (!this.taskObj.taskName || !this.taskObj.taskDescription) {
                return this.$message.error('请完整填写任务表单');
            }
            const postRequest = {
                userId: this.user.id,
                chinaname: this.user.label,
                ...this.taskObj,
                createPerson: this.userName,
                createUserid: this.userId,
                money: Number(this.taskObj.money ?? 0)
            }
            const { status, message, data } = await setTask(postRequest);
            if (status !== 200) return this.$message.error(message);
            if (data.code === 401) return this.$message.error('您不是超级管理员，没有权限新建任务，请联系网站管理员');
            if (data.status && data.status === 401) {
                this.$message.error(data.message);
                return;
            }
            this.$message.success('新建成功');
            this.taskObj = {
                taskName: '',
                taskDescription: '',
                money: 0
            }
        },
        initJSPlumb() {
            this.jsPlumb = this.$jsPlumb.getInstance({
                Container: "efContainer", //容器id
                //  Endpoint:['Image', {
                //    src: 'static/images/def_endpoint.png',
                //  }] , // 端点的形状
                Anchor: [0.5, 1, 0, 1, -10, 50],
                Anchors: ["Right", "Left"], //连线的source和target 
                EndpointStyle: { radius: 6, fill: "#498FFF" }, //端点默认样式
                PaintStyle: { stroke: "#498FFF", strokeWidth: 1 }, // 连线样式
                HoverPaintStyle: { stroke: "#818FB4" }, // 默认悬停样式
                // EndpointHoverStyle: {src: 'static/images/endpoint.png', },
                EndpointHoverStyle: { fill: "#818FB4" }, // 端点悬停样式
                ConnectionOverlays: [
                    [
                        "Arrow",
                        {
                            // 箭头
                            location: 1,
                            visible: false,
                            paintStyle: {
                                stroke: "#ccc",
                                fill: "#ccc"
                            }
                        }
                    ]
                ],
                Connector: ['Flowchart', { stub: 10, gap: 5, midpoint: 0.04, cornerRadius: 5, alwaysRespectStubs: true }], //要使用的默认连接器的类型：折线，流程等
                DrapOptions: { cursor: "crosshair", zIndex: 2000 },
                Scope: "jsPlumb_DefaultScope"
            });
        },
        clearLine() {
            this.jsPlumb.deleteEveryConnection();
            this.jsPlumb.deleteEveryEndpoint();
        },
        connectTarget($event) {
            this.jsPlumb.deleteEveryConnection();
            this.jsPlumb.deleteEveryEndpoint();
            let id = '';
            id = $event.target.parentNode.parentNode.previousElementSibling.id;
            this.jsPlumb.connect({
                source: id,
                target: id + '-1'
            });
        }
    }
}

</script>

<style lang='less' scoped>
.task__container {
    margin: 12px 0;

    .task__main--grid {
        display: grid;
        grid-template-columns: auto 300px;
        gap: 24px;

        .custom__card--auto {
            min-height: 50vh;
            background: #fffbfb;

            li {
                background: #fff;
                width: 90%;
                margin: 12px auto;
                padding: 12px;
                border-radius: 3px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                .item__title--pointer {
                    cursor: pointer;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    width: fit-content;
                    padding-right: 10px;

                    &::before {
                        content: '*';
                        color: #f40;
                        margin-right: 4px;
                    }
                }
            }
        }
    }
}

span {
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
}

.warning-text {
    color: orange;
    font-size: 0.74rem;
    font-weight: bold;
    margin-top: 5px;
    cursor: pointer;
}

.task__code--highlight {
    padding: 17px 12px;
    background: #f8f8f8;
    border-radius: 6px;

    .title {
        font-size: 16px;
        font-weight: bold;
        padding-left: 12px;
        margin-bottom: 10px;
    }

    .point__title {
        display: flex;
        align-items: center;
        font-weight: bold;
        margin: 6px 0;

        &::before {
            content: '';
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background: #4090EF;
            margin-right: 12px;
        }
    }

    .content {
        font-size: 14px;
        color: #3e3e3e;
        text-indent: 2em;
    }
}
</style>