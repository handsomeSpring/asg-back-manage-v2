<template>
    <el-card shadow="always" style="width:70vw">
        <el-form ref="form" :model="form" label-position="right" label-width="180px" :rules="rules">
            <el-form-item label="qq群" prop="group">
                <el-select v-model="form.group">
                    <el-option v-for="item in qqOptions" :label="item.label" :key="item.value"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="QQ(请输入正确的QQ号)" prop="qq">
                <el-input v-model="form.qq"></el-input>
            </el-form-item>
            <el-form-item label="消息" prop="message">
                <el-input type="textarea" v-model="form.message" :rows="5" maxlength="120" show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleSendMessage" type="primary" :loading="loading">发送消息</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { getByTitle } from '@/api/config';
import { sendAdminMsg } from '@/api/admin/index.js';
export default {
    name: 'qqSend',
    data() {
        return {
            qqOptions: [],
            form: {
                group: '',
                qq: '',
                message: ''
            },
            rules: {
                group: [{ required: true, message: '请选择群', trigger: 'change' }],
                qq:[{ required: true, message: '请输入qq号', trigger: 'change' }],
                message: [{ required: true, message: '请输入消息', trigger: 'blur' }],
            },
        }
    },
    methods: {
        handleSendMessage() {
            try {
                this.loading = true;
                this.$refs.form.validate(async valid => {
                    if (valid) {
                       const { status } = await sendAdminMsg(this.form.group, this.form.qq,this.form.message);
                       if(status !== 200) throw new Error('服务端异常，发送失败！');
                       this.$message.success('发送成功！');
                    }
                })
            } catch (error) {
               if(error instanceof Error){
                return this.$message.error(error.message);
               }
               this.$message.error('请完整填写表单！');
            } finally {
                this.loading = false;
            }
        },
},
    created() {
        getByTitle('qqGroup').then(res => {
            this.qqOptions = res.data;
        })
    },
}
</script>
<style lang='less' scoped></style>