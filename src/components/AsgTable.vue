<template>
    <div>
        <div class="table-top-content">
            <slot name="mark" v-if="markVisible">
                左侧默认内容区域，不传默认显示这段文本
            </slot>
            <el-button type="primary" size="small" @click="handleAddBtn">{{ btnName }}</el-button>
        </div>
        <el-table ref="elTableRef" v-bind="$attrs" :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <template v-for="( _, name) in $slots" #[name]="scopedData">
                <slot :name="name" v-bind="scopedData"></slot>
            </template>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'AsgTable',
    props:{
        btnName:{
            type:String,
            default:'新 增'
        },
        markVisible:{
            type:Boolean,
            default:true
        }
    },
    methods:{
        handleAddBtn(){
            this.$emit('operation');
        }
    }
}
</script>
<style lang='less' scoped>
.table-top-content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin:1em 0;
}
</style>