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
                        <i class="el-icon-view" @click="setConfig(item, true)"></i>
                        <i class="el-icon-edit" @click="setConfig(item, false)"></i>
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
                            <i class="el-icon-circle-close" @click="handleDeleteNode(child)"></i>
                        </div>
                    </li>
                </div>
            </div>
        </el-card>
        <el-card shadow="hover" style="position: relative;">
            <div v-show="initFlag">
                <li><i class="el-icon-view"></i>查看菜单</li>
                <li><i class="el-icon-edit"></i>编辑菜单</li>
                <li><i class="el-icon-circle-close">删除菜单</i></li>
                <li><i class="el-icon-circle-plus"></i>添加菜单</li>
            </div>
            <el-form v-show="!initFlag" :model="settingInfo" label-position="top">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="父节点id">
                            <el-input size="small" v-model="settingInfo.parentId" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="菜单Id">
                            <el-input size="small" v-model="settingInfo.id" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="菜单名称">
                            <el-input size="small" v-model="settingInfo.title" :disabled="isForbid"
                                clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="菜单图标">
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
                    <el-col :span="10">
                        <el-form-item label="网页路径">
                            <el-input size="small" v-model="settingInfo.path" :disabled="isForbid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="前端组件路径">
                            <el-input size="small" v-model="settingInfo.component" :disabled="isForbid"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="权限配置">
                            <el-select size="small" multiple v-model="settingInfo.auth" placeholder="请选择">
                                <el-option v-for="item in permissionList" :key="item.value" :value="item.value"
                                    :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="是否启用">
                            <el-switch :disabled="isForbid" v-model="settingInfo.show" active-text="开启"
                                inactive-text="隐藏">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button v-show="!isForbid" style="position: absolute;right:15px;bottom:15px;" type="primary"
                @click="handleSaveMenu">保存</el-button>
        </el-card>
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
            initFlag:true
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
        addNewParent(){
            this.settingInfo = {
                parentId: '-1',
                id: uuid(),
                title: '新父节点',
                iconClass: 'home',
                show: true,
                component: '',
                path: '/待输入',
            }
            this.isForbid = false;
            this.initFlag = false;
        },
        addNew(item) {
            this.settingInfo = {
                parentId: item.id,
                id: uuid(),
                title: '新子节点',
                iconClass: 'home',
                show: true,
                component: '',
                path: item.path + '/待输入',
            }
            this.isForbid = false;
            this.initFlag = false;
        },
        handleDeleteNode(item) {
            this.$confirm(`确定删除菜单:${item.title}吗`, "确认", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.$message.warning('删除失败，后端未对接！');
            })
        },
        handleSaveMenu() {
            this.$notify({
                title: '失败',
                message: '等待后端提供接口'
            });
        },
        setConfig(item, dis) {
            this.settingInfo = item;
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
    header{
        margin:12px 0;
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
</style>
