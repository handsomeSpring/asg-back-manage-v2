<template>
    <el-dialog title="发送赛程通知" width="32%" :visible="visible" @close="closeDialog" @open="handleOpen"
        :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-position="right" label-width="120px" :rules="rules">
            <el-form-item label="QQ群" prop="group">
                <el-select size="small" v-model="form.group" @change="handleChange">
                    <el-option v-for="(item, index) in groupOptions" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息" prop="message">
                <el-input type="textarea" v-model="form.message" :rows="5" maxlength="120" show-word-limit></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button type="primary" :loading="loading" @click="handleSubmit">发 布</el-button>
            <el-button plain @click="closeDialog">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { sendAdminMsg } from '@/api/admin/index.js';
export default {
    name: 'MatchDialog',
    data() {
        return {
            form: {
                group: '',
                qq: '',
                message: ''
            },
            rules: {
                group: [{ required: true, message: '请选择群', trigger: 'change' }],
                message: [{ required: true, message: '请输入消息', trigger: 'blur' }],
            },
            loading: false
        };
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        rowItem: {
            type: Object,
            default: () => { }
        },
        groupOptions: {
            type: Array,
            default: () => []
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
    methods: {
        handleSubmit() {
            this.$refs.form.validate(async valie => {
                if (valie) {
                    this.loading = true;
                    const { status } = await sendAdminMsg(this.form.group, this.form.qq, this.form.message);
                    if (status !== 200) return this.$message.error('服务端异常，发送失败！');
                    this.loading = false;
                    this.$message.success('发送成功');
                    this.closeDialog();
                } else {
                    this.$message.error('请完整填写表单！');
                }
            })
        },
        handleOpen() {
            try {
                const { commentary, belong, tag, team1_name, team2_name, opentime, referee, winteam, judge } = this.rowItem;
                const commentarys = JSON.parse(commentary);
                const comList = commentarys.map(item => item.chinaname).join(',') ?? '待定';
                let message = '';
                if (!winteam) {
                    message = `<ASG赛程通知>各位侦探：${belong}-${tag}:${team1_name} vs ${team2_name}的比赛将于${opentime}开赛，解说：${comList}、导播:${referee}、裁判${judge},敬请期待！`;
                } else {
                    message = `<ASG赛程通知>各位侦探：${belong}-${tag}:${team1_name} vs ${team2_name}的比赛获胜战队是${winteam},恭喜${winteam}战队获得了该场比赛的胜利！`;
                }
                this.$set(this.form, 'message', message);
            } catch (error) {
                this.$set(this.form, 'message', '未知错误，无法生成模板！');
            }
            console.log('rowIte', this.rowItem);
        },
        handleChange() {
            this.form.qq = this.groupOptions.find(item => item.value === this.form.group)?.qq ?? '';
        },
        closeDialog() {
            this.form = {
                group: '',
                qq: '',
                message: ''
            },
                this.$refs.form.resetFields();
            this.visible = false;
        }
    },
    created() {

    },
}
</script>
<style lang='less' scoped></style>