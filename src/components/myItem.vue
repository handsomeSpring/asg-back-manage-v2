<template>
    <div>
    <template v-for="item in data">
        <el-submenu v-if="item.children && item.children.length >0" :index="item.id">
            <template slot="title">
                <i v-if="item.fileInfo" class="el-icon-location"></i>
                <span>{{ item.name }}</span>
            </template>
            <myItem :data="item.children"></myItem>
        </el-submenu>
        <el-menu-item v-else :index="item.id">
            <template slot="title">
                <span>{{ item.name }}</span>
            </template>
        </el-menu-item>
    </template>
</div>
</template>

<script>
export default {
    name: "myItem",
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    methods: {

    },
    created() {

    },
}
</script>
<style lang='less' scoped></style>