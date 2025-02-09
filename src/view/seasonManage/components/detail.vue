<template>
    <div>
        <h4 class="main-title">{{ type === 'add' ? '新增赛季填报' : '更新赛季填报' }}</h4>
        <TextTitle titleName="赛季状态填报"></TextTitle>
        <AsgTipComponent type="warning" style="width:85%">
            <el-steps :active="6" align-center>
                <el-step title="筹备中" description="用户不可以报名、不可以修改表单、不可以查看报名队伍"></el-step>
                <el-step title="报名中" description="用户可以报名、不可以修改表单、不可以查看报名队伍"></el-step>
                <el-step title="建联期" description="用户不可以报名、已经报名的队伍可以修改表单、不可以查看报名队伍"></el-step>
                <el-step title="公示期" description="报名、修改表单停止、用户可以查看所有报名的队伍并进行关注"></el-step>
                <el-step title="进行中" description="报名、修改表单停止、用户关注停止"></el-step>
                <el-step title="已结束" description="报名、修改表单停止、用户关注停止"></el-step>
            </el-steps>
        </AsgTipComponent>
        <TextTitle titleName="基本信息"></TextTitle>
        <el-form class="my-1" ref="seasonForm" :model="seasonForm" label-width="120px" label-position="right"
            :rules="formRules">
            <el-row type="flex">
                <el-col :span="8">
                    <el-form-item label="赛季名称" prop="name">
                        <el-input size="mini" v-model="seasonForm.name" placeholder="输入赛季名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="赛季开始时间" prop="opentime">
                        <el-date-picker v-if="type === 'add'" v-model="seasonForm.opentime" size="small" type="datetime"
                            placeholder="选择日期时间" value-format="yyyy-MM-ddThh:mm:ss.656Z" format="yyyy-MM-dd hh:mm:ss">
                        </el-date-picker>
                        <el-input v-else v-model="seasonForm.opentime" size="small"
                            placeholder="格式yyyy-MM-ddThh:mm:ss.656Z">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="赛季状态" prop="is_over">
                        <el-radio-group v-model="seasonForm.is_over" size="small">
                            <el-radio-button :label="true">已结束</el-radio-button>
                            <el-radio-button :label="false">进行中</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="赛季阶段" prop="status">
                        <div class="asgProcess-content">
                            <AsgProgress :status="seasonForm.status" @updateStatus="updateStatus"></AsgProgress>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="赛季规则">
                        <div class="mask-container" v-if="isRuleChange === '0' && this.type !== 'add'">
                            <div class="mask-inner">
                                <p>为了减少服务器性能压力，修改规则需要手动同意才能进行修改。</p>
                                <el-button plain size="small" @click="needUpdateRule">修改规则</el-button>
                            </div>
                            <div v-html="rules"></div>
                        </div>
                        <v-md-editor v-else v-model="rules" height="500px" style="width:90%"></v-md-editor>
                    </el-form-item>
                    <AsgTipComponent type="danger" style="width:85%">
                        <i class="el-icon-info"></i>赛季规则更新需要更替markdown文件，所以更新会有延迟，若发现规则没有立即更新请勿觉得是BUG，耐心等待即可。
                    </AsgTipComponent>
                </el-col>
            </el-row>
        </el-form>
        <TextTitle titleName="赛季信息配置"></TextTitle>
        <div class="my-1">
            <personTable :tableData.sync="config.personConfig"></personTable>
        </div>
        <TextTitle titleName="报名字段配置"></TextTitle>
        <AsgTipComponent type="danger" style="width:85%">
            点击想要的字段，若为<span
                style="color:#134196;margin:0 0.4em">蓝色激活</span>状态即表示是该赛季的报名必填字段。注意：像选手名称、选手id和选手参赛名称字段，必填比较合适，不然会影响后面裁判、导播判断选手名称。
        </AsgTipComponent>
        <div class="my-1 flex-content">
            <div class="item" :class="config.formConfig.includes(item.fieldCode) ? 'active' : ''"
                v-for="(item, index) in filedConfig" :key="index" @click="handleClick(item)">
                <div v-if="item.required" class="required-tag">必选</div>
                <p>{{ item.fieldName }}</p>
                <p>{{ item.fieldCode }}</p>
                <p>{{ item.type }}</p>
            </div>
        </div>
        <div class="footer-btn-list">
            <el-button size="small" icon="el-icon-arrow-left" plain @click="toList">返 回</el-button>
            <el-button v-if="type === 'add'" size="small" type="primary" @click="handleAddEvent">发布新赛季</el-button>
            <el-button v-else type="primary" size="small" @click="updateItem">更新赛季信息</el-button>
        </div>
    </div>
</template>

<script>
import {
    pushNewEvents,
    updateEvents,
} from "@/api/gameSeason/index";
import TextTitle from '@/components/TextTitle.vue';
import { deepClone } from '@/utils';
import AsgProgress from './AsgProgress.vue';
import personTable from "./personTable.vue";
import AsgTipComponent from "@/components/AsgTipComponent.vue";
export default {
    name: 'season-detail',
    components: {
        TextTitle,
        AsgProgress,
        personTable,
        AsgTipComponent
    },
    computed: {
        serveIp() {
            return window.SERVE_IP;
        },
    },
    watch: {
        'seasonForm.is_over': {
            handler(newVal) {
                this.seasonForm.status = newVal ? '5' : '4'
            }
        },
        'seasonForm.status': {
            handler(newVal) {
                this.seasonForm.is_over = newVal === '5'
            }
        },
    },
    props: {
        info: {
            type: Object,
            default: () => { }
        },
        type: {
            type: String,
            default: 'add'
        }
    },
    data() {
        return {
            isRuleChange: '0', //是否需要传入规则
            filedConfig: [
                {
                    fieldName: '选手阵营',
                    fieldCode: 'camp',
                    type: 'boolean',
                    required: true
                },
                {
                    fieldName: '游戏名称',
                    fieldCode: 'gamerName',
                    type: 'string',
                },
                {
                    fieldName: '参赛名称',
                    fieldCode: 'playerName',
                    type: 'string',
                    required: true
                },
                {
                    fieldName: '游戏id',
                    fieldCode: 'idNumber',
                    type: 'string',
                    required: true
                },
                {
                    fieldName: '身份证',
                    fieldCode: 'identifier',
                    type: 'string',
                },
                {
                    fieldName: '电话号码',
                    fieldCode: 'phoneNumber',
                    type: 'string',
                },
                {
                    fieldName: '真实姓名',
                    fieldCode: 'realName',
                    type: 'string',
                },
                {
                    fieldName: '常用角色',
                    fieldCode: 'role',
                    type: 'string',
                },
            ],
            seasonForm: {
                status: "0",
                name: "",
                is_over: false,
                opentime: new Date(),
            },
            config: {
                personConfig: [],
                formConfig: ['idNumber', 'playerName', 'camp']
            },
            rules: '',
            formRules: {
                name: [{ required: true, message: "请填写赛季名称", trigger: "blur" }],
                opentime: [
                    { required: true, message: "请填写赛季开始时间", trigger: "change" },
                ],
                status: [
                    { required: true, message: "请填写赛季阶段", trigger: "change" },
                ],
                is_over: [
                    { required: true, message: "请选择赛季状态", trigger: "change" },
                ]
            },
        };
    },
    methods: {
        needUpdateRule() {
            this.isRuleChange = '1';
        },
        updateStatus(status) {
            console.log(status, 'status===');
            this.seasonForm.status = status.toString();
        },
        handleClick(item) {
            if (item.required) return;
            const index = this.config.formConfig.findIndex(el => el === item.fieldCode);
            if (index === -1) {
                this.config.formConfig.push(item.fieldCode);
            } else {
                this.config.formConfig.splice(index, 1);
            }
        },
        async updateItem() {
            const loading = this.$loading({
                lock: true,
                text: "数据更新中......",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.8)",
            });
            try {
                const req = {
                    ...this.seasonForm,
                    rule_markdown: this.rules,
                    config: JSON.stringify(this.config),
                    isRuleChange:this.isRuleChange
                };
                const { status } = await updateEvents(req);
                if (status !== 200) throw new Error("服务端异常，请联系网站管理员！");
                this.dialogVisible = false;
                this.$message.success("更新成功！");
                this.toList();
            } catch (error) {
                this.$message.error(error.message);
            } finally {
                loading.close();
            }
        },
        handleAddEvent() {
            if (!this.rules) {
                return this.$message.warning("请先设置赛季规则");
            }
            this.$refs.seasonForm.validate(async (valid) => {
                if (valid) {
                    const loading = this.$loading({
                        lock: true,
                        text: "数据更新中......",
                        spinner: "el-icon-loading",
                        background: "rgba(0, 0, 0, 0.8)",
                    });
                    const reqDTO = {
                        ...this.seasonForm,
                        rule_markdown: this.rules,
                        events_rule_uri: `/doc/rule/${this.seasonForm.name}.md`,
                        config: JSON.stringify(this.config)
                    };
                    pushNewEvents(reqDTO)
                        .then(({ status }) => {
                            if (status !== 200) throw new Error("服务端异常，新增赛季失败！");
                            this.$message.success("新增赛季成功！");
                            this.toList();
                        })
                        .catch((error) => {
                            this.$message.error(error.message);
                        })
                        .finally(() => {
                            loading.close();
                        });
                }
            });
        },
        toList() {
            this.$emit('toList');
        },
        async initInfo() {
            if (this.type !== 'add') {
                const { config, ...info } = this.info;
                this.seasonForm = deepClone(info);
                const result = await fetch(`${this.serveIp}/doc/rule/${this.info.name}.md`);
                const res = await result.text();
                this.rules = res || "未设置规则";
                if (!config) return;
                const parseConfig = JSON.parse(config);
                this.config = deepClone(parseConfig);
            }

        },
    },
    created() {
        this.initInfo();
    },
}
</script>
<style lang='less' scoped>
.mask-container {
    width: 90%;
    min-height: 350px;
    position: relative;

    &:hover {
        .mask-inner {
            transition: 0.65s all;
            opacity: 1;
        }
    }

    .mask-inner {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.77);
        /* 半透明黑色背景 */
        z-index: 1000;
        /* 确保蒙层在最上层 */
        display: flex;
        align-items: center;
        padding-top: 12px;
        justify-content: flex-start;
        color:#fff;
        gap:12px;
        flex-direction: column;
    }
}

.main-title {
    text-align: center;
    font-size: 1.5em;
    font-family: 'hk';
    margin: 1em 0;
    color: #5e6d82;
    font-weight: bold;
}

.my-1 {
    margin: 1em 0;
}

.flex-content {
    display: flex;
    align-items: center;
    gap: 1em;
    width: 100%;
    flex-wrap: wrap;

    .item {
        flex-shrink: 0;
        flex-grow: 0;
        border-radius: 1em;
        box-sizing: border-box;
        border: 1px solid #ddd;
        background: #f7f7f7;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding: 1em;
        width: 300px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &.active {
            background: #ecf8ff;
            border-color: #134196
        }

        .required-tag {
            position: absolute;
            top: 10px;
            width: 100px;
            height: 20px;
            left: -30px;
            background: #fef0f0;
            color: #f56c6c;
            border: 1px solid #fde2e2;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            font-weight: bold;
            transform: rotate(-45deg);
        }
    }
}

.asgProcess-content {
    width: 90%;
    margin: 3em auto;
}

.footer-btn-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    height: 50px;
    border-top: 1px solid #e7e7e7;
}
</style>