<template>
    <div class="mobile-page--wrap" :style="{
        position:isFixBottom ? 'fixed' : 'static'
    }">
        <div class="page-container-mobile">
            <el-button size="small" type="primary" :disabled="page === 1" @click="goLast">
                <i class="el-icon-arrow-left"></i>上一页
            </el-button>
            <p class="center-page-container">
                <span class="active-page">{{ page }}</span><span class="speration">/</span><span>{{ totalPageNum }}</span>
            </p>
            <el-button size="small" type="primary" :disabled="disabledNext" @click="goNext">
                下一页<i class="el-icon-arrow-right"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mobilePage',
    props: {
        page: {
            type: Number,
            required: true
        },
        limit: {
            type: Number,
            required: true
        },
        total: {
            type: Number | null,
            required: true
        },
        // 是否固定在底部
        isFixBottom:{
            type:Boolean,
            default:true
        }
    },
    computed: {
        disabledNext() {
            return this.page * this.limit >= this.total;
        },
        totalPageNum(){
            if(!this.limit) return this.total || 0;
            return Math.ceil(this.total / this.limit);
        }
    },
    methods: {
        goLast() {
            const total = this.page - 1;
            this.$emit('current-change', total);
        },
        goNext() {
            const total = this.page + 1;
            this.$emit('current-change', total);
        }
    },
}
</script>
<style lang='less' scoped>
.mobile-page--wrap {
    height:50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom:0;
    background: rgba(255, 255, 255, .7);
    backdrop-filter: blur(4px);
    border-top:1px solid #E7E7E7;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    left:0;
    .page-container-mobile {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2em;
        margin:0 1em;
        align-items: center;

        .center-page-container {
            text-align: center;
            & > span{
                color:#666;
            }
            .active-page{
                font-weight: bold;
                color: var(--theme-color);
            }
            .speration{
                margin:0 0.2em;
            }
        }
    }
}
</style>