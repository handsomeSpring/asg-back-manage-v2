<template>
    <el-dialog :fullscreen="isMobile" title="人员选择" width="30%" :visible.sync="dialogVisible">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="ASG职位库" name="first">
                <el-scrollbar :style="{ height: isMobile ? '100dvh' : '50vh' }">
                    <el-input style="margin:1em 0" size="small" v-model="filterText" placeholder="请输入中文名搜索"
                        clearable></el-input>
                    <el-tree class="filter-tree" ref="tree" :data="allRoles" :props="defaultProps" accordion
                        highlight-current :filter-node-method="filterNode" @node-click="nodeClick"></el-tree>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="自定义角色" name="second">
                <div class="gap__flex">
                    <el-input size="small" v-model="customForm.id" disabled></el-input>
                    <el-input size="small" v-model="customForm.label" placeholder="请输入名称"></el-input>
                    <el-input size="small" v-model="customForm.officium" placeholder="请输入职位" disabled></el-input>
                    <el-button size="small" type="primary" @click="handleRegister">登 记</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
import { getUsersWithRole } from "@/api/schedule/index";
import { filterRole } from "@/utils/filters.js";
import { isMobile } from "@/utils";
export default {
    name: 'asg-person-choose',
    data() {
        return {
            activeTab: 'first',
            defaultProps: {
                children: "children",
                label: "label",
            },
            filterText: "",
            allRoles: [],
            dialogVisible: false,
            isMobile: false,
            customForm: {
                id: 0,
                label: "",
                officium: "none",
            }
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        openDialog(obj) {
            if(obj && obj instanceof Object){
                Object.assign(this.customForm, obj);
            }
            this.dialogVisible = true;
        },
        nodeClick(node) {
            if (node.disabled) return;
            this.$emit('finish', node);
            this.dialogVisible = false;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        async init() {
            try {
                const { data, status } = await getUsersWithRole();
                if (status !== 200) {
                    this.allRoles = [];
                    return;
                }
                const result = [];
                data.forEach((item) => {
                    const itemList = {
                        label: filterRole(item[0].officium),
                        id: item[0].officium,
                        disabled: true,
                        children: [],
                    };
                    item.forEach((child) => {
                        itemList.children.push({
                            id: child.id,
                            officium: filterRole(item[0].officium),
                            label: child.chinaname,
                        });
                    });
                    result.push(itemList);
                });
                this.allRoles = result;
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        handleRegister(){
            if(!this.customForm.label) return this.$message.error('请输入名称！');
            this.$emit('finish', this.customForm);
            this.customForm = {
                id: 0,
                label: "",
                officium: "none",
            }
            this.dialogVisible = false;
        }
    },
    created() {
        this.isMobile = isMobile();
        this.init();
    },
}
</script>
<style lang='less' scoped>
.gap__flex {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>