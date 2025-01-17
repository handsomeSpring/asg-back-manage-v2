<template>
    <div>
        <TextTitle :titleName="type === 'add' ? '新增赛季填报' : '更新赛季填报'"></TextTitle>
        <el-alert class="my-1" type="warning" title="赛季阶段填报提示" :closable="false">
            <el-steps :active="6" align-center>
                <el-step title="筹备中" description="用户不可以报名、不可以修改表单、不可以查看报名队伍"></el-step>
                <el-step title="报名中" description="用户可以报名、不可以修改表单、不可以查看报名队伍"></el-step>
                <el-step title="建联期" description="用户不可以报名、已经报名的队伍可以修改表单、不可以查看报名队伍"></el-step>
                <el-step title="公示期" description="报名、修改表单停止、用户可以查看所有报名的队伍并进行关注"></el-step>
                <el-step title="进行中" description="报名、修改表单停止、用户关注停止"></el-step>
                <el-step title="已结束" description="报名、修改表单停止、用户关注停止"></el-step>
            </el-steps>
        </el-alert>
        <TextTitle titleName="基本信息"></TextTitle>
        <el-form class="my-1" ref="seasonForm" :model="seasonForm" label-width="120px" label-position="right" :rules="formRules">
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
                        <el-radio-group v-model="seasonForm.status" size="small">
                            <el-radio label="0">筹备中</el-radio>
                            <el-radio label="1">报名中</el-radio>
                            <el-radio label="2">建联期</el-radio>
                            <el-radio label="3">公示中</el-radio>
                            <el-radio label="4">进行中</el-radio>
                            <el-radio label="5">赛季结束</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="赛季规则">
                        <v-md-editor v-model="rules" height="400px"></v-md-editor>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <TextTitle titleName="赛季阶段状态"></TextTitle>
        <div class="asgProcess-content">
            <AsgProgress :status="seasonForm.status"></AsgProgress>
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
export default {
    name: 'season-detail',
    components: {
        TextTitle,
        AsgProgress
    },
    computed: {
        serveIp() {
            return window.SERVE_IP;
        },
    },
    watch: {
        'seasonForm.is_over': {
            handler(newVal) {
                if (newVal) {
                    this.seasonForm.status = '5'
                } else {
                    this.seasonForm.status = '4'
                }
            }
        },
        'seasonForm.status': {
            handler(newVal) {
                if (newVal === '5') {
                    this.seasonForm.is_over = true
                }
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
            seasonForm: {
                status: "0",
                name: "",
                is_over: false,
                opentime: new Date(),
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
                this.seasonForm = deepClone(this.info);
                const result = await fetch(`${this.serveIp}/doc/rule/${this.info.name}.md`);
                const res = await result.text();
                this.rules = res || "未设置规则";
            }

        },
    },
    created() {
        this.initInfo();
    },
}
</script>
<style lang='less' scoped>
.my-1 {
    margin: 1em 0;
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