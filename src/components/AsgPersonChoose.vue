<template>
    <el-dialog :fullscreen="isMobile" title="人员选择" width="30%" :visible.sync="dialogVisible">
        <el-scrollbar :style="{height: isMobile ? '100dvh' : '50vh' }">
            <el-input style="margin:1em 0" size="small" v-model="filterText" placeholder="请输入中文名搜索"
                clearable></el-input>
            <el-tree class="filter-tree" ref="tree" :data="allRoles" :props="defaultProps" accordion highlight-current
                :filter-node-method="filterNode" @node-click="nodeClick"></el-tree>
        </el-scrollbar>
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
            defaultProps: {
                children: "children",
                label: "label",
            },
            filterText: "",
            allRoles: [],
            dialogVisible: false,
            isMobile:false,
        };
    },
    watch: {
        filterText(val) {
            console.log(val, '=vva');
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        openDialog() {
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
                            officium:filterRole(item[0].officium),
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
    },
    created() {
        this.isMobile = isMobile();
        this.init();
    },
}
</script>
<style lang='less' scoped></style>