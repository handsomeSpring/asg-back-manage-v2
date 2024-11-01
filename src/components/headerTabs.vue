<template>
    <div class="container-grid" ref="containerGrid">
        <div class="tomoroate">
            <i class="el-icon-s-unfold harIcon" :class="{ 'is-active': isActive }" @click="handleMenu"></i>
        </div>
        <el-tabs v-model="activeMenu" type="card" @tab-click="handleJump">
            <el-tab-pane v-for="(item, index) in headerTabs" :key="index" :name="item.value" style="position: relative">
                <template slot="label">
                    <div class="label__container">
                        <i v-show="item.value === '/guide'" class="el-icon-s-home" style="margin-right: 6px;"></i>
                        <span style="padding-right: 15px">
                            {{ item.label }}
                        </span>
                        <div class="label__container" @click="removeTag(index)">
                            <svg-icon v-show="item.value !== '/guide'" style="margin-right: 5px"
                                iconClass="close" width="16px" height="16px" color="#e7e7e7">
                            </svg-icon>
                        </div>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'HeaderTabs',
    data() {
        return {
            headerTabs: [
                {
                    label: '工作台',
                    value: '/guide'
                }
            ],
            activeMenu: '/guide',
            isActive:false,
        };
    },
    watch: {
        $route: {
            handler(newVal) {
                this.handleTabsAdd(newVal);
            }
        }
    },
    methods: {
        handleMenu() {
            this.$store.commit("collapseMenu");
            this.isActive = !this.isActive;
        },
        handleJump(tab) {
            if(tab.name === this.$route.fullPath) return;
            this.$router.push({ path: tab.name });
        },
        removeTag(index) {
            this.headerTabs.splice(index, 1);
            if (this.headerTabs.length === 0) {
                this.$router.push({ path: '/index' })
            } else {
                const lastRoute = this.headerTabs.at(-1);
                this.$router.push({ path: lastRoute.value })
            }
        },
        handleTabsAdd(route) {
            if (route.fullPath === '/index') return;
            const valueArr = this.headerTabs.map(item => item.value);
            if (!valueArr.includes(route.fullPath)) {
                this.headerTabs.push({
                    label: route.name,
                    value: route.fullPath
                })
            }
            this.activeMenu = route.fullPath;
        }
    }
}
</script>
<style lang='less' scoped>
.container-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 50px calc(100% - 50px);
    align-items: center;
    background-color: #fff;
    .tomoroate {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #e7e7e7;
        border-right:2px solid #e7e7e7 ;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;


        &:hover {
            color: #4090EF;
        }

        .harIcon {
            transform: rotate(180deg);
            transition: 0.38s;

            &.is-active {
                transform: rotate(0deg);
            }
        }
    }
}



.el-tabs {
    background-color: #ffffff;

    /deep/ .el-tabs__header {
        margin: 0;
    }
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    background-color: #ebf5ff;
    border-bottom: 1px solid #e4e7ed;
}

.label__container {
    display: flex;
    align-items: center;
}
</style>