<template>
    <div class="menu__container">
        <el-card shadow="hover">
            <ul class="parent__container" v-for="item in tolList" :key="item.id">
                <div class="parent__title">
                    <svg-icon style="margin-right: 5px" :iconClass="item.iconClass" width="16px" height="16px"
                        color="#4090EF"></svg-icon>
                    {{ item.title }}
                </div>
                <draggable v-if="item.children && item.children.length > 0" class="dragArea list-group"
                    :list="item.children" :clone="clone" group="people">
                    <li class="in_place"></li>
                    <li :class="element.id === activeId ? 'active' : ''" class="children__menu"
                        v-for="element in item.children" :key="element.id" @click="setConfig(element)">
                        <svg-icon style="margin-right: 5px" :iconClass="element.iconClass" width="12px" height="12px"
                            color="#4090EF"></svg-icon>
                        {{ element.title }}
                    </li>
                </draggable>
            </ul>
        </el-card>
        <el-card shadow="hover" style="position: relative;">
            <div v-show="!activeId">
                <p>点击左侧菜单编辑！！！</p>
                <p>左侧菜单是可以拖拽排序的！！！</p>
            </div>
            <el-form v-show="activeId" :model="settingInfo" label-position="top">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="菜单名称">
                            <el-input size="small" v-model="settingInfo.title" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="菜单图标">
                            <svg-icon :iconClass="settingInfo.iconClass" width="40px" height="40px"
                                color="#4090EF"></svg-icon>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="网页路径">
                            <el-input size="small" v-model="settingInfo.path" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="前端组件路径">
                            <el-input size="small" v-model="settingInfo.component" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="菜单Id">
                            <el-input size="small" v-model="settingInfo.id" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-form-item label="是否启用">
                            <el-switch :disabled="settingInfo.id === 25" v-model="settingInfo.show" active-text="开启"
                                inactive-text="隐藏">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button style="position: absolute;right:15px;bottom:15px;" type="primary"
                @click="handleSaveMenu">保存</el-button>
        </el-card>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { deepClone } from '@/utils';
import { mapGetters } from 'vuex';
export default {
    name: 'menuConfig',
    components: {
        draggable
    },
    data() {
        return {
            tolList: [],
            controlOnStart: true,
            settingInfo: {},
            activeId: null
        }
    },
    computed: {
        ...mapGetters(['menuOptions'])
    },
    created() {
        const menu = localStorage.getItem('asg-menuConfig');
        const menuOption = menu ? JSON.parse(menu) : this.menuOptions;
        console.log(menuOption);
        this.tolList = deepClone(menuOption);
    },
    methods: {
        handleSaveMenu() {
            const menuJSON = JSON.stringify(this.tolList);
            localStorage.setItem('asg-menuConfig', menuJSON);
            this.$notify({
                title: '成功',
                message: '配置成功，重新登录后将会生效'
            });
            this.$router.push({ path: '/index/information' })
        },
        setConfig(item) {
            this.settingInfo = item;
            this.activeId = item.id;
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

    .parent__title {
        font-weight: bold;
        font-size: 1.2rem;
    }

    .children__menu {
        margin-left: 1rem;
        cursor: pointer;
        position: relative;
        margin:3px 0;
        &:hover {
            color: #4090EF;
        }

        &.active::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            -webkit-clip-path: polygon(40% 0%, 32% 45%, 100% 45%, 100% 53%, 32% 54%, 40% 100%, 0% 50%);
            clip-path: polygon(40% 0%, 32% 45%, 100% 45%, 100% 53%, 32% 54%, 40% 100%, 0% 50%);
            background: #4090EF;
            right: 0;
            bottom:0;
        }
    }
}

.in_place {
    height: 8px;
}
</style>
