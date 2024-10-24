<template>
    <div class="header__top">
        <el-button icon="el-icon-plus" size="small" type="primary"
            @click="openDialog">冠军录入</el-button>
        <el-dialog :visible.sync="dialogVisible" title="冠军录入" width="70%" :close-on-click-modal="false"
            @close="clear">
            <div class="champion__content">
                <el-scrollbar class="team__search">
                    <div class="search__info">
                        <el-input size="small" v-model="teamName" placeholder="请输入战队名字" clearable></el-input>
                        <el-button size="small" type="primary" @click="searchTeam">搜索</el-button>
                    </div>
                    <table>
                        <thead>
                            <th width="10%"></th>
                            <th width="10%">编号</th>
                            <th width="20%">战队名</th>
                            <th width="60%">常用角色</th>
                        </thead>
                        <tbody>
                            <template v-if="teamList.length > 0">
                                <tr v-for="(team, index) in teamList" :key="index">
                                    <td width="10%" align="center">
                                        <el-checkbox v-model="team.isCheck"
                                            @change="handleChange($event, index)"></el-checkbox>
                                    </td>
                                    <td width="10%">{{ team.formId }}</td>
                                    <td width="20%">{{ team.teamName }}</td>
                                    <td width="60%">{{ team.players }}</td>
                                </tr>
                            </template>
                            <tr v-else>
                                <td class="no__task {" colspan="4">
                                    未搜索到队伍
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-scrollbar>
                <div class="fill__form">
                    <div class="header__form">
                        <p class="my-task-auth margin-icon" v-if="!checkTeam.teamName">
                            <i class="el-icon-warning"></i>暂未选择
                        </p>
                        <p class="my-task-success margin-icon" v-else>
                            <i class="el-icon-success"></i>{{ checkTeam.teamName }}
                        </p>
                        <p class="my-task-info margin-icon">
                            <i class="el-icon-collection-tag"></i>{{ checkTeam.formId || '暂未选择队伍' }}
                        </p>
                    </div>
                    <el-form ref="form" :model="form" label-position="top" :rules="rules">
                        <el-form-item label="冠军赛季" prop="eventname">
                            <el-select size="small" v-model="form.eventname"
                                style="margin-bottom: 10px; margin-right: 30px" placeholder="请选择赛季">
                                <el-option v-for="item in eventOptions" :key="item.name" :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="冠军简介" prop="msg">
                            <el-input :rows="4" v-model="form.msg" type="textarea" maxlength="200" show-word-limit
                                placeholder="请输入冠军简介"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="save__footer">
                        <el-button @click="dialogVisible = false" size="small">关 闭</el-button>
                        <el-button type="primary" @click="saveChampion" size="small" :loading="loading">录 入</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    searchId,
    saveCham,
} from "@/api/cham/index.js";

export default {
    name: 'ChamplionPublish',
    props:{
        eventOptions:{
            type:Array,
            default:()=>[]
        }
    },
    data() {
        return {
            dialogVisible: false,
            teamName: '',
            form: {
                msg: '',
                eventname: ''
            },
            loading:false,
            teamList: [],
            rules: {
                msg: [
                    { required: true, message: "冠军简介不能为空", trigger: "change" },
                ],
                eventname: [
                    { required: true, message: "赛季不能为空", trigger: "change" },
                ],
            },
        };
    },
    methods: {
        clear(){
            this.dialogVisible = false;
            this.teamList = [];
            this.form = {
                msg: '',
                eventname: ''
            }
            this.teamName = '';
            this.$refs.form.resetFields();
        },
        openDialog() {
            this.dialogVisible = true;
        },
        handleChange(value, index) {
            this.teamList.forEach((item, i) => {
                if (i === index) {
                    item.isCheck = value;
                } else {
                    item.isCheck = false;
                }
            })
        },
        async searchTeam() {
            try {
                if (!this.teamName) throw new Error("请输入战队名称！");
                const { data } = await searchId(this.teamName);
                this.teamList = data.map(item => {
                    return {
                        teamName: item.name,
                        formId: item.id,
                        players: item.role.map(role => role.role_name).join('、'),
                        isCheck: false
                    }
                })
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        async saveChampion() {
            try {
                this.loading = true;
                if (Object.keys(this.checkTeam).length === 0) throw new Error('请选择战队');
                this.$refs.form.validate(async valid => {
                    if (!valid) throw new Error('请完整填写表单内容');
                    const postDTO = {
                        formId: this.checkTeam.formId,
                        ...this.form
                    };
                    const {  data, status } = await saveCham(postDTO);
                    if(status !== 200) throw new Error('服务端异常，请联系网站管理员');
                    if(data.code && data.code !== 200) throw new Error(data.message);
                    this.$message.success('新增成功！');
                    this.$emit('refreshList');
                    this.dialogVisible = false;
                })
            } catch (error) {
                this.$message.error(error.message);
            } finally{
                this.loading = false;
            }
        }
    },
    created() {
       this.form.eventname = this.eventOptions.at(-1)?.name ?? '';
    },
    computed: {
        checkTeam() {
            return this.teamList.find(item => Boolean(item.isCheck)) ?? {};
        }
    }
}
</script>
<style lang='less' scoped>
@borderColor: #e9e9e8;
@bgColor: #f2f6fd;

.champion__content {
    display: grid;
    grid-template-columns: 40% calc(60% - 24px);
    align-items: flex-start;
    gap: 24px;

    .team__search {
        width: 100%;
        height: 50vh;

        .search__info {
            width: 100%;
            display: grid;
            grid-template-columns: 80% calc(18% - 12px);
            gap: 12px;
            align-items: center;
        }
    }

    .fill__form {
        .header__form {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
    }
}

table {
    width: 98%;
    border-collapse: collapse;
    border: 1px solid @borderColor;
    margin-top: 12px;

    thead {
        background: @bgColor;
        height: 50px;

        th {
            border: 1px solid @borderColor;
        }
    }

    tbody {
        tr {
            height: 50px;

            td {
                padding: 6px;
                border: 1px solid @borderColor;
                cursor: pointer;

                .ellipse {
                    width: inherit;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .multi__line {
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }

    .no__task {
        font-size: 0.8rem;
        color: #717171;
        text-align: center
    }
}
.save__footer{
    text-align: center;
}
.header__top{
    margin:12px 0;
}
</style>