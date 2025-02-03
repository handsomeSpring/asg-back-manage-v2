<template>
    <div>
        <TextTitle class="custom-my-1" title-name="前端项目介绍"></TextTitle>
        <el-table :data="tableData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="项目名称" prop="name" align="center"></el-table-column>
            <el-table-column label="兼容设备" prop="adp" align="center"></el-table-column>
            <el-table-column label="技术栈" prop="methods" align="center"></el-table-column>
            <el-table-column label="项目地址" prop="href" align="center">
                <template #default="{ row }">
                    <el-link type="primary" :href="row.href" target="_blank">{{ row.href }}</el-link>
                </template>
            </el-table-column>
        </el-table>
        <TextTitle class="custom-my-1" title-name="github项目地址"></TextTitle>
        <el-link type="primary" href="https://github.com/handsomeSpring/asg-back-manage-v2"
            target="_blank">第五人格ASG赛事后台管理系统地址</el-link>
        <br />
        <el-link type="primary" href="https://github.com/handsomeSpring/commentary_v2"
            target="_blank">第五人格ASG赛事解说选班系统地址</el-link>
        <TextTitle class="custom-my-1" title-name="目前针对解说端和后台开放环境配置流程"></TextTitle>
        <el-table :data="environmentData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="项目名称" prop="name" align="center"></el-table-column>
            <el-table-column label="node版本" prop="node" align="center"></el-table-column>
        </el-table>
        <TextTitle class="custom-my-1" title-name="流程配置"></TextTitle>
        <el-steps direction="vertical">
            <el-step title="下载nvm和git" description="首先下载nvm，并配置环境变量。" status="process"></el-step>
            <el-step title="下载使用nvm下载node版本" description="nvm install 14.21.3并nvm use 14" status="process"></el-step>
            <el-step title="使用git clone项目" description="克隆前需要获得项目权限" status="process"></el-step>
            <el-step title="下载依赖" description="在vscode终端使用npm install下载依赖，然后跑项目。" status="process"></el-step>
        </el-steps>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
export default {
    name: 'baseIntroDoc',
    text: '前端项目介绍',
    components: {
        TextTitle
    },
    data() {
        return {
            tableData: [
                {
                    name: '第五人格ASG赛事官网',
                    adp: 'PC端/移动端',
                    methods: 'nuxt3、vue3、naive-ui、unocss',
                    href: 'https://idvasg.cn'
                },
                {
                    name: '第五人格ASG赛事后台管理系统',
                    adp: 'PC端（兼容部分功能移动端）',
                    methods: 'vue2、element-ui、less',
                    href: 'https://admin.idvasg.cn'
                },
                {
                    name: '第五人格ASG赛事解说选班系统',
                    adp: '移动端',
                    methods: 'vue3、naive-ui、scss',
                    href: 'https://commentary.idvasg.cn'
                }
            ],
            environmentData: [
                {
                    name: '第五人格ASG赛事后台管理系统',
                    node: 'v14.21.3',
                },
                {
                    name: '第五人格ASG赛事解说选班系统',
                    node: 'v16.14.2'
                }
            ]
        };
    }
}
</script>