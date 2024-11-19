<template>
    <el-scrollbar class="comp__container--absolute">
        <div class="container--flex">
            <div class="intro__header">
                <div>
                    <span class="title">ASG赛事办赛全流程</span><span class="tag">执行中</span><span class="timer"><i
                            class="el-icon-time"></i>{{ new Date() |
                                parseTime("{y}-{m}-{d}") }}</span>
                </div>
                <el-button type="text" @click="handleToIntro">查看细节</el-button>
            </div>
            <div class="participle__circle">
                <div class="dashed__line">
                </div>
                <p>讨论/跟踪</p>
                <div class="solid__line">
                </div>
                <p>执行</p>
                <i class="el-icon-check"></i>
                <p>一步完成</p>
                <div class="inner__icon"></div>
                <p>审核节点</p>
                <i class="el-icon-refresh"></i>
                <p>流程循环执行</p>
                <div class="boder__primary"></div>
                <p>正常执行</p>
                <div class="boder__auth"></div>
                <p>需要审核</p>
                <div class="boder__tracing"></div>
                <p>需要人员跟踪</p>
            </div>
            <div class="steps__container">
                <template v-for="(item, index) in nodeList">
                    <div class="start__node" :key="`${index}-node`">
                        <p class="node_title">{{ item.nodeName }}</p>
                        <el-tooltip class="item" effect="dark" :content="item.description" placement="top">
                            <div>
                                <div id="node" v-if="item.type === 'direct'" class="step__icon">
                                    <i id="node" class="el-icon-check"></i>
                                </div>
                                <div id="node" v-else-if="item.type === 'auth'" class="step__icon">
                                    <div id="node" class="inner__icon"></div>
                                </div>
                                <div id="node" v-else-if="item.type === 'circle'" class="step__icon">
                                    <i id="node" class="el-icon-refresh"></i>
                                </div>
                                <div id="node" v-else class="end__icon">
                                </div>
                            </div>
                        </el-tooltip>
                        <p class="person_title">{{ item.handlePerson }}</p>
                    </div>
                    <div v-if="item.lineType === 'dashed'" class="line--dashed" :key="`${index}-line-dashed`"
                        :class="item.needAuth === '1' ? 'tracing' : ''"></div>
                    <div v-else class="line--direction" :key="`${index}-line-direct`"
                        :class="item.needAuth === '1' ? 'auth' : ''"></div>
                </template>
                <div class="start__node">
                    <p class="node_title">赛季结束</p>
                    <div class="end__icon">
                    </div>
                    <p class="person_title">主办方</p>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import { getByTitle } from '@/api/config';
export default {
    name: 'asgFlowIntro',
    text:'办赛流程图',
    data() {
        return {
            nodeList: [],
            hasClickNode: false,
            propertyPos: {
                left: 0,
                top: 0,
            },
            content: ''
        };
    },
    async created() {
        const { data } = await getByTitle('nodeList');
        this.nodeList = data;

    },
    methods: {
        handleToIntro() {
            this.$router.push({
                path: '/system/introduction',
                query:{
                    tab:'second'
                }
            })
        },
    }
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    height: 100%;
}
.container--flex {
    width: calc(100% - 34px);
    background: #FFF;
    border-radius: 6px;
    padding: 12px 17px;
    margin-bottom: 24px;

    .intro__header {
        border-bottom: 1px solid #E5E5EF;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 15px;

        .title {
            font-size: 16px;
            font-weight: 600;
        }

        .tag {
            padding: 4px 7px;
            color: #D96B04;
            background: #FFE4C8;
            border-radius: 4px;
            margin: 0 24px 0 32px;
            font-size: 14px;
        }

        .timer {
            color: #0C80E5;
        }
    }

    .participle__circle {
        background: #ebf0f1;
        border-radius: 6px;
        width: fit-content;
        padding: 11px 26px;
        display: flex;
        align-items: center;
        gap: 0 12px;

        .dashed__line {
            height: 0;
            width: 20px;
            border: 2px dashed #4090EF;
        }

        .solid__line {
            height: 0;
            width: 20px;
            border: 2px solid #4090EF;
        }

        .inner__icon {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #fff;
        }

        i {
            color: #4090EF;
            font-weight: bold;
            font-size: 16px;
        }

        .boder__primary {
            width: 10px;
            height: 10px;
            background: #4090EF;
            border-radius: 50%;
        }

        .boder__auth {
            width: 10px;
            height: 10px;
            background: orange;
            border-radius: 50%;
        }

        .boder__tracing {
            width: 10px;
            height: 10px;
            background: #f40;
            border-radius: 50%;
        }
    }

    .steps__container {
        margin: 24px 0;
        padding: 12px;
        display: flex;
        align-items: center;
        width: 100%;
        overflow-x: auto;

        .node_title {
            font-size: 18px;
            color: #303030;
            font-weight: bold;
        }

        .person_title {
            color: #7B7B7B;
            font-size: 14px;
        }

        .start__node {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 24px 0;
            position: relative;

            .step__icon {
                width: 30px;
                height: 30px;
                background: #0C80E5;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;

                i {
                    width: 16px;
                    height: 16px;
                }

                .inner__icon {
                    width: 18px;
                    height: 18px;
                    background: #fff;
                    border-radius: 50%;
                }
            }

            .end__icon {
                width: 30px;
                height: 30px;
                background: rgb(199, 199, 199);
                border-radius: 50%;
                color: white;
            }
        }

        .line--direction {
            height: 0;
            width: 100px;
            border: 2px solid #4090EF;
            transform: translateY(4px);
            flex-shrink: 0;

            &.auth {
                border-color: orange;
            }
        }

        .line--dashed {
            height: 0;
            width: 100px;
            border: 2px dashed #4090EF;
            transform: translateY(4px);
            flex-shrink: 0;

            &.tracing {
                border-color: #f40
            }
        }
    }
}
</style>