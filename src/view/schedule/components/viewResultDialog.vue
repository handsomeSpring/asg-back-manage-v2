<template>
    <el-dialog title="查看赛果" width="50%" :visible="visible" @close="closeDialog" @open="handleOpen">
        <div class="dialog__body--header">
            <p>本场比赛获胜队伍是<span class="fontWeight">{{ this.gameResult.winteam }}</span></p>
        </div>
        <div class="dialog__body--score">
            <template v-if="!gameScoreInfo">
               <el-empty description="该场比赛没有登记赛果"></el-empty>
            </template>
            <template v-else>
                {{ gameScoreInfo }}
                <!-- 有雨需要完成的渲染 gameScoreInfo 数组，side 表示选边情况，side 为 '1' 表示屠先,其余字段你了解一下,使用v-for循环渲染 -->
            </template>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'viewResultDialog',
    data() {
        return {
            gameScoreInfo: null
        };
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        gameResult: {
            type: Object,
            default: (() => { })
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible;
            },
            set(val) {
                this.$emit('update:dialogVisible', val);
            }
        },
    },
    methods: {
        handleOpen() {
            this.gameScoreInfo = !!this.gameResult.final_score ? JSON.parse(this.gameResult?.final_score ?? '[]') : void 0;
            console.log(this.gameScoreInfo,'this.gameScoreInfo');
        },
        closeDialog() {
            this.visible = false;
        }
    },
}
</script>
<style lang='less' scoped>
.dialog__body--header {
    margin: 12px 0;
    padding-bottom:12px;
    border-bottom: 1px solid #e7e7e7;
    .fontWeight {
        color: #4090EF;
        font-weight: bold;
        font-size: 1.5rem;
        margin-left: 16px;
    }
}
</style>