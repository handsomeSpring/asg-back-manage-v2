<template>
    <el-scrollbar class="comp__container--absolute">
        <TextTitle titleName="我的竞猜"></TextTitle>
        <el-empty v-if="myLogs.length === 0" description="您还没有进行任何竞猜"></el-empty>
        <el-alert v-for="item in myLogs" class="guess_alert" :key="item.id" :closable="false"
            :type="computedType(item.win)">
            <template slot="title">
                <header>
                    <p class="time_text">{{ item.team.belong }}</p>
                    <p class="time_text">{{ item.team.opentime }}</p>
                </header>
                <main>
                    <div class="team">
                        <el-image :src="`${SIp}${item.team.belong}/${item.team.team1_name}.png`" style="width:70px;height:70px">
                            <div slot="error">
                                <img style="width:68px;height:68px;border:1px dashed #4090EF" src="@/assets/images/logo.png">
                            </div>
                        </el-image>
                        <p class="host game">{{ item.team.team1_name }}</p>
                        <p class="vote">{{ item.team.team1_piaoshu }}人支持</p>
                    </div>
                    <div style="font-size:2rem;font-weight: bold;color:#707e88">vs</div>
                    <div class="team">
                        <el-image :src="`${SIp}/${item.team.belong}/${item.team.team2_name}.png`" style="width:70px;height:70px">
                            <div slot="error">
                                <img style="width:68px;height:68px;border:1px dashed #4090EF" src="@/assets/images/logo.png">
                            </div>
                        </el-image>
                        <p class="custom game">{{ item.team.team2_name }}</p>
                        <p class="vote">{{ item.team.team2_piaoshu }}人支持</p>
                    </div>
                </main>
                <footer>
                    <p v-if="item.win !== null"><span class="high-light-text">{{ item.team.winteam }}</span>获胜，{{ item.win ? '预测正确' : '预测错误' }}</p>
                    <p v-else>您预测的是<span class="high-light-text">{{ item.chickteam }}</span>，等待主办方公布结果</p>
                </footer>
            </template>
        </el-alert>
    </el-scrollbar>
</template>

<script>
import { mylog } from '@/api/home';
import TextTitle from '@/components/TextTitle.vue';
export default {
    name: 'asgMyGuess',
    text: '我的竞猜',
    components: {
        TextTitle
    },
    data() {
        return {
            myLogs: []
        };
    },
    computed:{
        SIp(){
            return window.SERVE_IP + '/loge/'
        }
    },
    methods: {
        initMyLog() {
            mylog()
                .then(res => {
                    this.myLogs = res.data.data;
                }).catch(err => {
                    this.$message.error(err.message);
                })
        },
        computedType(win) {
            if (win === null) {
                return 'info'
            }
            return win ? 'success' : 'error';
        }
    },
    created() {
        this.initMyLog();
    },
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;

    .guess_alert {
        margin: 12px 0;

        header {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;

            .time_text {
                font-weight: bold;
                color: #707e88 !important;
            }
        }

        main {
            margin: 8px 0;
            display: grid;
            grid-template-columns: auto 50px auto;
            align-items: center;

            .team {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 3px;

                img {
                    width: 70px;
                    height: 70px;
                    border-radius: 5px;
                    border: 1px solid #707e88;
                }

                .vote {
                    font-weight: bold;
                    color: #707e88 !important;
                }

                .game {
                    font-size: 1.1rem;
                    font-weight: bold;
                }

                .host {
                    color: #f40;
                }

                .custom {
                    color: #4090EF
                }
            }
        }

        footer {
            width: 100%;
            background: #ffffff;
            text-align: center;
            padding: 16px 0;
        }
    }
}

.flex-container--between {
    display: flex;
    justify-content: space-between;
}

/deep/.el-alert__content {
    width: 100%;
}
.high-light-text{
    color:#4090EF;
    font-size: 1.1rem;
    font-weight: bold;
    margin-left:6px;
}
</style>