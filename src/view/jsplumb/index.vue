<template>
    <div>
        <el-container>
            <el-aside>
                <el-menu default-active="gx_start" class="el-menu-vertical-demo" @select="handleSelect">
                    <el-submenu v-for="item in asideList" :key="item.index" :index="item.index">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{ item.label }}</span>
                        </template>
                        <el-menu-item-group v-for="child in item.children" :key="child.index">
                            <el-menu-item :index="child.index">{{ child.label }}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <jsplumb v-if="showPlumb" :key="keyIndex" :bizType="keyIndex" :keyId="keyId"></jsplumb>
                <assignPage v-if="showTrace" :key="keyIndex" :bizType="keyIndex"></assignPage>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { getByTitle } from "@/api/config";
import jsplumb from "./components/jsplumb.vue"
import assignPage from "./components/assignPage.vue"


export default {
    name: "index",
    components: {
        jsplumb,
        assignPage
    },
    data() {
        return {
            asideList: [],
            keyIndex: "gx_start",
            mapIdType: {},
        }
    },
    created() {
        this.initAside();
    },
    computed: {
        showPlumb() {
            return Object.keys(this.mapIdType).includes(this.keyIndex);
        },
        showTrace() {
            return ["zc_trace"].includes(this.keyIndex);
        },
        keyId() {
            return this.mapIdType[this.keyIndex]
        }
    },
    methods: {
        initAside() {
            getByTitle("workFlowBar")
                .then((res) => {
                    this.asideList = res.data;
                })
                .catch(() => {
                    this.$message.error("获取云端配置失败！");
                });
            getByTitle("mapFlow")
                .then(res => {
                    this.mapIdType = res.data
                })
                .catch(() => {
                    this.$message.error("获取云端配置失败！");
                });
        },
        handleSelect(index) {
            this.keyIndex = index;
        }
    }
}
</script>

<style scoped lang="less">
/deep/.el-aside {
    height: 80vh;
    width: 220px !important;
}
</style>