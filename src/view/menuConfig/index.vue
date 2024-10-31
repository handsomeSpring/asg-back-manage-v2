<template>
    <div class="menu__container">
        <el-card shadow="hover">
            <div class="parent-node" v-for="item in menuList" :key="item.id">
                <div class="parent-list" @click="setConfig(item)">
                    <p>{{ item.title }}</p>
                    <i class="el-icon-circle-plus" @click.stop="addNew(item)"></i>
                </div>
                <div v-if="item.children && item.children.length > 0" class="children-list">
                    <li class="child-node" :class="activeId === child.id ? 'active' : ''" v-for="child in item.children"
                        :key="child.id" @click="setConfig(child)">
                        <p>{{ child.title }}</p>
                        <div class="flex-icon">
                            <i class="el-icon-edit" @click.stop="isForbid = false"></i>
                            <i class="el-icon-circle-close" @click="handleDeleteNode(child)"></i>
                        </div>
                    </li>
                </div>
            </div>
        </el-card>
        <el-card shadow="hover" style="position: relative;">
            <div v-show="Object.keys(settingInfo).length === 0">
                <p>点击左侧菜单编辑！！！</p>
                <p>左侧菜单是可以拖拽排序的！！！</p>
            </div>
            <el-form v-show="Object.keys(settingInfo).length > 0" :model="settingInfo" label-position="top">
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
import { menuOptions } from '@/assets/json/menu';
import { mapGetters } from 'vuex';
export default {
    name: 'menuConfig',
    data() {
        return {
            menuList: menuOptions,
            controlOnStart: true,
            settingInfo: {},
            activeId: null,
            isForbid: false,
            svgIcon: []
        }
    },
    computed: {
        ...mapGetters(['menuOptions'])
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
        addNew(item) {
            this.settingInfo = {
                parentId: item.id,
                id: '2222',
                title: '新子节点',
                iconClass: 'home',
                show: true,
                component: '',
                path: item.path + '/待输入',
            }
            this.isForbid = false;
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
            const menuJSON = JSON.stringify(this.tolList);
            localStorage.setItem('asg-menuConfig', menuJSON);
            this.$notify({
                title: '成功',
                message: '配置成功，重新登录后将会生效'
            });
            this.$router.push({ path: '/index' })
        },
        setConfig(item) {
            this.settingInfo = item;
            this.activeId = item.id;
            this.isForbid = true;
        },
        clone(item) {
            return item
        },
        pullFunction() {
            return this.controlOnStart ? 'clone' : true
        },
        start({ originalEvent }) {
            this.controlOnStart = originalEvent.ctrlKey
        },
        getNewList() {
            let a = this.tolList
            console.log(a)
        }
    }
}
</script>
<style lang="less" scoped>
.menu__container {
    display: grid;
    grid-template-columns: 400px auto;
    gap: 24px;

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

            .flex-icon {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            &.active,
            &:hover {
                background: rgba(26, 107, 241, 0.08);
                color: #1B8CFD;
            }

        }
    }
}

.flex_icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
