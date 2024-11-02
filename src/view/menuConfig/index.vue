<template>
    <div class="menu__container">
        <el-card shadow="hover">
            <header>
                <el-button type="primary" size="small" @click="addNewParent">新增父级菜单</el-button>
            </header>
            <div class="parent-node" v-for="item in menuList" :key="item.id">
                <div class="parent-list">
                    <p>
                        <i v-if="item.children.length !== 0"
                            :class="item.isFold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="margin-right: 6px;"
                            @click="item.isFold = !item.isFold"></i>{{ item.title }}
                    </p>
                    <div class="flex-icon">
                        <i class="el-icon-view" @click="setParentConfig(item, true)"></i>
                        <i v-if="item.allowOperate === '1'" class="el-icon-edit"
                            @click="setParentConfig(item, false)"></i>
                        <i class="el-icon-circle-plus" @click.stop="addNew(item)"></i>
                    </div>

                </div>
                <div v-if="item.children && item.children.length > 0" class="children-list"
                    :class="item.isFold ? 'fold' : 'unFold'">
                    <li class="child-node" :class="activeId === child.id ? 'active' : ''" v-for="child in item.children"
                        :key="child.id">
                        <p>{{ child.title }}</p>
                        <div class="flex-icon">
                            <i class="el-icon-view" @click="setConfig(child, true)"></i>
                            <i class="el-icon-edit" @click="setConfig(child, false)"></i>
                        </div>
                    </li>
                </div>
            </div>
        </el-card>
        <div>
            <el-alert class="my__alert" type="warning" :closable="false">
                <template #title>
                    <div class="flex--operation">
                        <li><i class="el-icon-view"></i>查看菜单</li>
                        <li><i class="el-icon-edit"></i>编辑菜单</li>
                        <li><i class="el-icon-circle-plus"></i>添加菜单</li>
                    </div>
                </template>
                <p>1、请勿随便修改菜单的前端配置。</p>
                <p>2、菜单图标需要导入到前端项目，在阿里图标库查询，并发给任何一个前端导入到项目中即可选择，请勿选择有颜色的ICON。</p>
                <p>3、工作台和可视化大屏是固定菜单，不可编辑。</p>
            </el-alert>
            <el-card shadow="hover" style="position: relative;">
                <div v-show="initFlag">
                    <el-empty description="请选择一个菜单进行操作"></el-empty>
                </div>
                <el-form ref="form" v-show="!initFlag" :model="settingInfo" label-position="top" :rules="rules">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="父级菜单主键Id" prop="parentId">
                                <el-input size="small" v-model="settingInfo.parentId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="菜单主键Id" prop="id">
                                <el-input size="small" v-model="settingInfo.id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="菜单名称" prop="title">
                                <el-input size="small" v-model="settingInfo.title" :disabled="isForbid"
                                    clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="菜单图标（勿用彩色图标）">
                                <div class="flex_icon">
                                    <el-select size="small" v-model="settingInfo.iconClass" placeholder="请选择">
                                        <el-option v-for="item in svgIcon" :key="item.value" :value="item.value">
                                            <div class="flex_icon">
                                                <span>{{ item.label }}</span>
                                                <svg-icon :iconClass="item.value" width="16px" height="16px"
                                                    color="#4090EF"></svg-icon>
                                            </div>
                                        </el-option>
                                    </el-select>
                                    <svg-icon :iconClass="settingInfo.iconClass" width="40px" height="40px"
                                        color="#4090EF"></svg-icon>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="菜单路径" prop="path">
                                <el-input size="small" v-model="settingInfo.path" :disabled="isForbid"
                                    placeholder="请输入路径">
                                    <template slot="prepend">{{ pathPrepend }}</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="前端组件路径" prop="component">
                                <el-input size="small" v-model="settingInfo.component" :disabled="isForbid"
                                    placeholder="前端组件文件路径">
                                    <template slot="prepend">
                                        {{ settingInfo.component === 'router-view' ? '<' : '@/view/' }} </template>
                                            <template slot="append">
                                                {{ settingInfo.component === 'router-view' ? '>' : '.vue' }}
                                            </template>
                                </el-input>
                                <el-button plain @click="setRouterView" size="small">设置为无跳转</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="权限配置（不配置默认所有人可访问）">
                                <el-select style="width:100%" size="small" multiple v-model="settingInfo.auth" :disabled="isForbid"
                                    placeholder="请选择">
                                    <el-option v-for="item in permissionList" :key="item.value" :value="item.value"
                                        :label="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="是否启用（关闭则所有人无法访问）">
                                <el-switch :disabled="isForbid" v-model="settingInfo.show" active-value="1"
                                    inactive-value="0" active-text="开启" inactive-text="隐藏">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="保存后是否允许操作（慎重选择）">
                                <el-switch :disabled="isForbid" v-model="settingInfo.allowOperate" active-value="1"
                                    inactive-value="0" active-text="允许" inactive-text="禁止">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2" v-show="!isForbid">
                            <el-form-item label="操作">
                                <el-button type="primary" size="small" @click="handleSaveMenu">新增/更新菜单</el-button>
                                <el-button v-if="type === 'edit'" type="danger" size="small" plain
                                    @click="handleDeleteNode">删除菜单</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </el-card>
        </div>
    </div>
</template>

<script>
import { getByTitle } from '@/api/config';
import { menuOptions } from '@/assets/json/menu';
import { mapGetters } from 'vuex';
import { uuid } from '@/utils';
export default {
    name: 'menuConfig',
    data() {
        return {
            menuList: [],
            settingInfo: {},
            activeId: null,
            isForbid: false,
            svgIcon: [],
            permissionList: [],
            initFlag: true,
            pathPrepend: '',
            type: 'new',
            rules: {
                parentId: [
                    { required: true, message: '请检查id是否生成', blur: 'change' }
                ],
                id: [
                    { required: true, message: '请检查id是否生成', blur: 'change' }
                ],
                title: [
                    { required: true, message: '请填写菜单名称', blur: 'blur' }
                ],
                path: [
                    { required: true, message: '请填写菜单路径', blur: 'blur' }
                ],
                component: [
                    { required: true, message: '请填写前端组件路径', blur: 'blur' }
                ]
            },
        }
    },
    computed: {
        ...mapGetters(['menuOptions'])
    },
    created() {
        this.menuList = menuOptions.map(item => {
            return {
                ...item,
                auth: item.auth.split(','),
                isFold: true,
                children: item.children.map(child => {
                    return {
                        ...child,
                        auth: child.auth.split(',')
                    }
                })
            }
        });
        getByTitle('menuPermission').then(res => {
            this.permissionList = res.data;
        })
    },
    mounted() {
        //参数：1.路径；2.是否遍历子目录；3.正则表达式
        const files = require.context("@/assets/icons", false, /\.svg$/).keys();
        files.forEach(item => {
            const className = item.replace('./', '').replace('.svg', '');
            this.svgIcon.push({
                value: className,
                label: className
            })
        })

    },
    methods: {
        setRouterView() {
            this.settingInfo.component = 'router-view'
        },
        addNewParent() {
            this.type = 'new';
            this.pathPrepend = '/';
            this.settingInfo = {
                parentId: '-1',
                id: uuid(),
                title: '新父节点',
                iconClass: 'default',
                show: '1',
                component: '',
                path: '',
                allowOperate: '1'
            }
            this.isForbid = false;
            this.initFlag = false;
            this.$refs.form.resetFields();
        },
        addNew(item) {
            this.type = 'new';
            this.pathPrepend = `${item.path}/`;
            this.settingInfo = {
                parentId: item.id,
                id: uuid(),
                title: '新子节点',
                iconClass: 'default',
                show: '1',
                allowOperate: '1',
                component: '',
                path: '',
            }
            this.isForbid = false;
            this.initFlag = false;
            this.$refs.form.resetFields();
        },
        handleDeleteNode(item) {
            if (this.settingInfo.children && this.settingInfo.children.length > 0) {
                return this.$message.warning('该菜单下面存在子级菜单，无法删除！');
            }
            this.$confirm(`您确定删除菜单<${this.settingInfo.title}>吗`, "确认", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.$message.warning('删除失败，后端未对接！');
            })
        },
        handleSaveMenu() {
            const requestBody = {
                ...this.settingInfo,
                path: this.pathPrepend + this.settingInfo.path,
                auth: Array.isArray(this.settingInfo.auth) ? this.settingInfo.auth.join(',') : ''
            }
            console.log(requestBody, 'requestBody');
            this.$notify({
                title: '失败',
                message: '等待后端提供接口'
            });
        },
        setParentConfig(item, dis) {
            this.type = 'edit';
            this.pathPrepend = '/'
            this.settingInfo = {
                ...item,
                path: item.path.replace('/', '')
            };
            this.activeId = item.id;
            this.isForbid = dis;
            this.initFlag = false;
        },
        setConfig(item, dis) {
            this.type = 'edit';
            const pathArr = item.path.split('/');
            this.pathPrepend = `/${pathArr[1]}/`
            this.settingInfo = {
                ...item,
                path: pathArr.at(-1),
            };
            this.activeId = item.id;
            this.isForbid = dis;
            this.initFlag = false;
        }
    }
}
</script>
<style lang="less" scoped>
.menu__container {
    display: grid;
    grid-template-columns: 400px auto;
    gap: 24px;

    header {
        margin: 12px 0;
    }

    .el-card {
        height: 70vh;
        overflow-y: scroll;
    }
}

.parent-node {
    .parent-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 6px;
        background: linear-gradient(90deg, #77A2F3 0%, #1891FD 47%, #145BCF 100%);
        color: #fff;
        margin: 3px 0;
        cursor: pointer;
    }

    .children-list {
        transition: 0.5s;
        overflow: hidden;

        .child-node {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            background: #f5f5f5;
            padding: 3px;

            p {
                margin-left: 12px;
            }

            &.active,
            &:hover {
                background: rgba(26, 107, 241, 0.08);
                color: #1B8CFD;
            }

        }

        &.unFold {
            height: 0;
            transform: scaleY(0)
        }

        &.fold {
            transform: scaleY(1)
        }
    }
}

.flex-icon {
    display: flex;
    align-items: center;
    gap: 6px;
}

.flex_icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

::-webkit-scrollbar {
    display: none !important;
}

.my__alert {
    margin-bottom: 12px;
    padding: 12px;

    p {
        font-size: 16px !important;
    }
}

.flex--operation {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px !important;
}
</style>
