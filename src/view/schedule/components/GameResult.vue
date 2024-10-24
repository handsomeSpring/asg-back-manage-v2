<template>
    <el-dialog title="赛果登记" width="50%" :visible="visible" @close="closeDialog" @open="handleOpen" :close-on-click-modal="false">
        <div class="result__content">
            <div class="bili">
                <div></div>
                <div class="tl-display-flex">
                    <el-tag type="danger">{{ leftTeam }}</el-tag>
                </div>
                <div class="tl-display-flex">
                    <el-tag type="primary">{{ rightTeam }}</el-tag>
                </div>
                <div></div>
                <p>操作</p>
            </div>
            <li v-for="(item, index) in gameInfo" :key="index">
                <el-divider content-position="left">BO{{ index + 1 }}</el-divider>
                <div class="bili">
                    <p :class="item.side === '1' ? 'survor' : 'hunter'">{{ item.side === '1' ? '求' : '屠' }}</p>
                    <div class="tl-display-flex">
                        <el-input-number size="small" style="width:120px" v-model="item.topHalfLeft" controls-position="right"
                            :min="0" :max="5"></el-input-number>
                    </div>
                    <div class="tl-display-flex">
                        <el-input-number size="small" style="width:120px" v-model="item.topHalfRight" controls-position="right"
                            :min="0" :max="5"></el-input-number>
                    </div>

                    <p :class="item.side === '1' ? 'hunter' : 'survor'">{{ item.side === '1' ? '屠' : '求' }}</p>
                    <div class="tl-display-flex">
                        <el-switch v-model="item.side" active-value="1" inactive-value='2' active-text="人先"
                            inactive-text="屠先">
                        </el-switch>
                    </div>
                </div>
                <div class="bili">
                    <p :class="item.side === '1' ? 'hunter' : 'survor'">{{ item.side === '1' ? '屠' : '求' }}</p>
                    <div class="tl-display-flex">
                        <el-input-number size="small" style="width:120px" v-model="item.bottomHalfLeft" controls-position="right"
                            :min="0" :max="5"></el-input-number>
                    </div>
                    <div class="tl-display-flex">
                        <el-input-number size="small" style="width:120px" v-model="item.bottomHalfRight" controls-position="right"
                            :min="0" :max="5"></el-input-number>
                    </div>

                    <p :class="item.side === '1' ? 'survor' : 'hunter'">{{ item.side === '1' ? '求' : '屠' }}</p>
                    <div class="tl-display-flex">
                        <el-button-group size="small">
                            <el-button size="small" :disabled="gameInfo.length > 5" type="primary" icon="el-icon-plus" @click="handleAdd"></el-button>
                            <el-button size="small" type="primary" :disabled="gameInfo.length === 1" icon="el-icon-close"
                                @click="handleMinus(index)"></el-button>
                        </el-button-group>
                    </div>
                </div>
            </li>
        </div>
        <el-divider>选择获胜队伍</el-divider>
        <el-row>
            <el-select size="small" v-model="winteam" clearable>
                <el-option v-for="item in chooseTeam" :key="item.id" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" size="small" @click="setWinner">设置获胜队伍</el-button>
            <el-button style="margin-left: 20px" type="primary" size="small" @click="handleSaveResult">保存赛果</el-button>
        </el-row>
    </el-dialog>
</template>

<script>
import { setWinGame } from "@/api/schedule/index";
export default {
    name: 'ASGGameResult',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        gameResult: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val);
            }
        }
    },
    data() {
        return {
            leftTeam: '',
            rightTeam: '',
            gameInfo: [
                {
                    side: '1',
                    topHalfLeft: 0,
                    topHalfRight: 0,
                    bottomHalfLeft: 0,
                    bottomHalfRight: 0,
                }
            ],
            chooseTeam: [], //选择冠军队伍
            winteam: ""
        };
    },
    methods: {
        handleSaveResult(){
            this.$message.warning('待后端开发...');
        },
        handleMinus(index) {
            this.gameInfo.splice(index, 1);
        },
        handleAdd() {
            this.gameInfo.push({
                side: '1',
                topHalfLeft: 0,
                topHalfRight: 0,
                bottomHalfLeft: 0,
                bottomHalfRight: 0,
            })
        },
        async setWinner() {
            if (!this.winteam) {
                return this.$message.warning('请选择获胜队伍！');
            }
            const loading = this.$loading({
                lock: true,
                text: "设置获胜者中......",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            try {
                const { status } = await setWinGame(this.gameResult.id, this.winteam);
                if (status !== 200) throw new Error('服务端异常，设置失败!');
                this.winteam = '';
                this.visible = false;
                this.$emit('updateLoad');
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                loading.close();
            }
        },
        closeDialog() {
            this.chooseTeam = [];
            this.winteam = '';
            this.visible = false;
        },
        handleOpen() {
            console.log(this.gameResult, 'gameResult');
            const { winteam, team1_name, team2_name } = this.gameResult;
            this.leftTeam = team1_name;
            this.rightTeam = team2_name;
            this.chooseTeam = [];
            this.winteam = winteam || "";
            this.chooseTeam.push({ label: '待赛果确认', value: '', id: '0' })
            this.chooseTeam.push({ label: team1_name, value: team1_name, id: "1" });
            this.chooseTeam.push({ label: team2_name, value: team2_name, id: "2" });
        }
    },
}
</script>
<style lang='less' scoped>
.result__content {
    width: 100%;

    .bili {
        display: grid;
        grid-template-columns: 40px 150px 150px 40px auto;
        align-items: center;
        gap: 20px;
        margin: 12px 0;

        p {
            text-align: center;
        }
    }

    .tl-display-flex {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.survor{
    color:#4090EF;
}
.hunter{
    color:#f40
}
</style>